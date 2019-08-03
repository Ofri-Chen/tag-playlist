import { Dal } from "../dal/interfaces";
import { MusicService } from "../music-service-management/interfaces";
import { TrackWithTags } from "../interfaces";

export class Controller {

    constructor(dal: Dal, musicService: MusicService) {

    }

    public syncSongs(): void {

    }

    public getSongs(): TrackWithTags {
        return null;
    }

    public addTagsToSongs(songIds: string[], tags: string[]): void {

    }

    public removeTagsFromSongs(songIds: string[], tags: string[]): void {

    }

    public createPlaylistByTags(playlistName: string, tags: string[]): void {

    }
}