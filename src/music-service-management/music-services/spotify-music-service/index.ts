import { MusicService } from "../../interfaces";
import { Track, SpotifyUserConfiguration, BasicSpotifyConfiguration, User, ICacheService } from "../../../interfaces";
import * as config from '../../../../config'
import { resolveAllStringParametersInObject } from "../../../common/utils";
import SpotifyWebApi from 'spotify-web-api-node';
import _ from 'lodash';
import { ExtendedError } from "../../../common/error";
import { Dal } from "../../../dal/interfaces";
import { runAsAsyncChunks } from '../../../../external-libs/async-chunker/index.js';

const baseSpotifyConfig: BasicSpotifyConfiguration = resolveAllStringParametersInObject(config.musicServices.spotify);
const type = 'spotify';

export class SpotifyMusicService implements MusicService {
    constructor(private cacheService: ICacheService<string, SpotifyWebApi>,
        private dal: Dal) {
    }

    public async getAllSongs(user: User): Promise<Track[]> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);
        const playlistsResponse = await spotifyApi.getUserPlaylists();

        const playlists = await Promise.all(playlistsResponse.body.items.map(playlistRes => this.getPlaylistTracks(user, playlistRes.id)));
        return _.flatten(playlists);
    }
    public async getPlaylistTracks(user: User, playlistId: string): Promise<Track[]> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);
        const tracksResponse = await spotifyApi.getPlaylistTracks(playlistId);

        return tracksResponse.body.items.map(trackRes => ({
            id: trackRes.track.id,
            type,
            displayName: trackRes.track.name,
            artists: trackRes.track.artists.map(artist => artist.name),
            album: trackRes.track.album.name
        }))
    }

    async createPlaylistByTags(user: User, playlistName: string, tags: string[]): Promise<string> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);
        const response = await spotifyApi.createPlaylist(user.musicServices.spotify.clientId, playlistName);
        const playlistId = response.body.id;
        await this.updatePlaylistWithTags(user, playlistId, tags);

        return playlistId;
    }
    async updatePlaylistWithTags(user: User, playlistId: string, tags: string[]): Promise<void> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);

        const trackIdsByTags: string[] = (await this.dal.getTracksByTags(user, type, tags)).map(track => track.id);
        const playlistTrackIds: string[] = (await this.getPlaylistTracks(user, playlistId)).map(track => track.id);
        const trackIdsToAdd: string[] = _.difference(trackIdsByTags, playlistTrackIds);

        return runAsAsyncChunks(trackIdsToAdd,
            (trackIdsChunk: string[]) => spotifyApi.addTracksToPlaylist(playlistId, trackIdsChunk),
            baseSpotifyConfig.chunkOptions);
    }

    private getSpotifyApi(user: User): SpotifyWebApi {
        const userCachedApi = this.cacheService.getItem(user.musicServices.spotify.clientId);
        if (userCachedApi) {
            return userCachedApi;
        }

        if (!user.musicServices.spotify) {
            throw new ExtendedError(`user doesn't have spotify configuration`, { user });
        }

        const spotifyConfig: SpotifyUserConfiguration = resolveAllStringParametersInObject(user.musicServices.spotify);
        const spotifyApi = this.buildSpotifyApiObj(spotifyConfig);
        this.cacheService.setItem(spotifyConfig.clientId, spotifyApi);

        return spotifyApi;
    }

    private buildSpotifyApiObj(spotifyConfig: SpotifyUserConfiguration): SpotifyWebApi {
        const spotifyApi = new SpotifyWebApi({
            clientId: spotifyConfig.clientId,
            clientSecret: spotifyConfig.clientSecret,
            redirectUri: spotifyConfig.serverUri,
        });
        spotifyApi.setAccessToken(spotifyConfig.accessToken);

        return spotifyApi;
    }
}