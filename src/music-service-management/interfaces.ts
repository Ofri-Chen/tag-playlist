import { Track, User } from "../interfaces";

export interface MusicService {
    getAllSongs(user: User): Promise<Track[]>;
    getPlaylistTracks(user: User, playlistId: string): Promise<Track[]>; 

    createPlaylistByTags(user: User, playlistName: string, tags: string[]): Promise<void>;
    updatePlaylistWithTags(user: User, playlistId: string, tags: string[]): Promise<void>;
}