import { MusicService } from "../../interfaces";
import { Track, SpotifyConfiguration, User, ICacheService } from "../../../interfaces";
import * as config from '../../../../config'
import { resolveAllStringParametersInObject } from "../../../common/utils";
import SpotifyWebApi from 'spotify-web-api-node';
import _ from 'lodash';
import { ExtendedError } from "../../../common/error";

const baseSpotifyConfig: SpotifyConfiguration = resolveAllStringParametersInObject(config.musicServices.spotify);

export class SpotifyMusicService implements MusicService {
    constructor(private cacheService: ICacheService<string, SpotifyWebApi>) {
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
            displayName: trackRes.track.name,
            artists: trackRes.track.artists.map(artist => artist.name),
            album: trackRes.track.album.name
        }))
    }

    async createPlaylistByTags(user: User, playlistName: string, tags: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async updatePlaylistWithTags(user: User, playlistId: string, tags: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private getSpotifyApi(user: User): SpotifyWebApi {
        const userCachedApi = this.cacheService.getItem(user.musicServices.spotify.clientId);
        if (userCachedApi) {
            return userCachedApi;
        }

        if (!user.musicServices.spotify) {
            throw new ExtendedError(`user doesn't have spotify configuration`, { user });
        }

        const spotifyConfig: SpotifyConfiguration = resolveAllStringParametersInObject(user.musicServices.spotify);
        const spotifyApi = this.buildSpotifyApiObj(spotifyConfig);
        this.cacheService.setItem(spotifyConfig.clientId, spotifyApi);

        return spotifyApi;
    }

    private buildSpotifyApiObj(spotifyConfig: SpotifyConfiguration): SpotifyWebApi {
        this.spotifyApi = new SpotifyWebApi({
            clientId: spotifyConfig.clientId,
            clientSecret: spotifyConfig.clientSecret,
            redirectUri: spotifyConfig.serverUri,
        });
        this.spotifyApi.setAccessToken(spotifyConfig.accessToken);

        return this.spotifyApi;
    }
}