import { Dal } from "../dal/interfaces";
import { MusicService } from "../music-service-management/interfaces";
import { TrackWithTags, User } from "../interfaces";
import _ from "lodash";

export class Controller {

    constructor(private musicService: MusicService, private dal: Dal) {

    }

    public syncSongs(): void {

    }

    public getSongs(): TrackWithTags {
        return null;
    }

    public async addTagsToSongs(user: User, songIds: string[], tags: string[]): Promise<void> {

    }

    public async removeTagsFromSongs(user: User, songIds: string[], tags: string[]): Promise<void> {

    }

    public async createPlaylistByTags(user: User, playlistName: string, tags: string[]): Promise<string> {
        const playlistId = await this.musicService.createPlaylist(user, playlistName);
        await this.updatePlaylistByTags(user, playlistId, tags);

        return playlistId;
    }

    public async updatePlaylistByTags(user: User, playlistId: string, tags: string[]): Promise<void> {
        const trackIdsByTags: string[] = (await this.dal.getTracksByTags(user, this.musicService.type, tags)).map(track => track.id);
        const playlistTrackIds: string[] = (await this.musicService.getPlaylistTracks(user, playlistId)).map(track => track.id);
        const trackIdsToAdd: string[] = _.difference(trackIdsByTags, playlistTrackIds);

        return this.musicService.updatePlaylistTracks(user, playlistId, trackIdsToAdd);
    }
}