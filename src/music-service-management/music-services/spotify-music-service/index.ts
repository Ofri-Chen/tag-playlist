import { MusicService } from "../../interfaces";
import { Track, SpotifyUserConfiguration, SpotifyConfiguration, User, ICacheService, MusicServiceTypes, PlaylistMetadata } from "../../../interfaces";
import * as config from '../../../../config'
import { resolveAllStringParametersInObject } from "../../../common/utils";
import SpotifyWebApi from 'spotify-web-api-node';
import _ from 'lodash';
import { ExtendedError } from "../../../common/error";
import { runAsAsyncChunks } from '../../../../external-libs/async-chunker/index.js';

// const spotifyConfig: SpotifyConfiguration = resolveAllStringParametersInObject(config.musicServices.spotify);

export class SpotifyMusicService implements MusicService {
    public type: MusicServiceTypes = 'spotify';

    constructor(private spotifyConfig: SpotifyConfiguration, private cacheService: ICacheService<string, SpotifyWebApi>) {
    }

    public async getAllSongs(user: User): Promise<Track[]> {
        const playlists: PlaylistMetadata[] = await this.getPlaylistsMetadata(user);

        const playlistsTracks = await Promise.all(playlists.map(playlist => this.getPlaylistTracks(user, playlist.id)));
        return _(playlistsTracks)
            .flatten()
            .uniqBy('id')
            .value();
    }

    public async getPlaylistsMetadata(user: User): Promise<PlaylistMetadata[]> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);
        const playlistsResponse = await spotifyApi.getUserPlaylists();

        return playlistsResponse.body.items.map(playlist => ({
            id: playlist.id,
            displayName: playlist.name
        }));
    }

    public async getPlaylistTracks(user: User, playlistId: string): Promise<Track[]> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);
        const tracksResponse = await spotifyApi.getPlaylistTracks(playlistId);

        return tracksResponse.body.items.map(trackRes => {
            const track = trackRes.track;
            return {
                id: track.id,
                type: this.type,
                displayName: track.name,
                artists: track.artists.map(artist => artist.name),
                album: track.album.name
            }
        })
    }

    async createPlaylist(user: User, playlistName: string): Promise<string> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);
        const response = await spotifyApi.createPlaylist(user.musicServices.spotify.clientId, playlistName);

        return response.body.id;
    }

    async updatePlaylistTracks(user: User, playlistId: string, trackIds: string[]): Promise<void> {
        const spotifyApi: SpotifyWebApi = this.getSpotifyApi(user);

        return runAsAsyncChunks(trackIds,
            (trackIdsChunk: string[]) => spotifyApi.addTracksToPlaylist(playlistId, trackIdsChunk),
            this.spotifyConfig.chunkOptions);
    }

    private getSpotifyApi(user: User): SpotifyWebApi {
        const userCachedApi = this.cacheService.getItem(user.musicServices.spotify.clientId);
        if (userCachedApi) {
            return userCachedApi;
        }

        if (!user.musicServices.spotify) {
            throw new ExtendedError(`user doesn't have spotify configuration`, { user });
        }

        const spotifyUserConfig: SpotifyUserConfiguration = resolveAllStringParametersInObject(user.musicServices.spotify);
        const spotifyApi = this.buildSpotifyApiObj(spotifyUserConfig);
        this.cacheService.setItem(spotifyUserConfig.clientId, spotifyApi, this.spotifyConfig.accessTokenExpiration);

        return spotifyApi;
    }

    private buildSpotifyApiObj(spotifyUserConfig: SpotifyUserConfiguration): SpotifyWebApi {
        const spotifyApi = new SpotifyWebApi({
            clientId: spotifyUserConfig.clientId,
            clientSecret: spotifyUserConfig.clientSecret,
            redirectUri: this.spotifyConfig.serverUri,
        });
        spotifyApi.setAccessToken(spotifyUserConfig.accessToken);

        return spotifyApi;
    }
}