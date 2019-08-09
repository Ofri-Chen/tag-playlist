import { Track, User, MusicServiceTypes, PlaylistMetadata } from "../interfaces";

export interface MusicService {
    type: MusicServiceTypes;

    getAllSongs(user: User): Promise<Track[]>;
    getPlaylistsMetadata(user: User): Promise<PlaylistMetadata[]>;
    getPlaylistTracks(user: User, playlistId: string): Promise<Track[]>;

    createPlaylist(user: User, playlistName: string): Promise<string>;
    updatePlaylistTracks(user: User, playlistId: string, trackIds: string[]): Promise<void>;
}