import { Song } from "../interfaces";

export interface MusicService {
    getAllSongs(): Promise<Song[]>;
    getPlaylist(id: string); 

    createPlaylist(name: string, songs: Song[]): void;
    removePlaylist(name: string): void;
}