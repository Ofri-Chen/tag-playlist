import { Dal } from "../dal/interfaces";
import { MusicService } from "../music-service-management/interfaces";
import { TrackWithTags, User, Track } from "../interfaces";
import _ from "lodash";

export class Controller {

    constructor(private musicService: MusicService, private dal: Dal) {

    }

    public async syncTracks(user: User) {
        const [musicServiceTracks, dalTracks]: [Track[], TrackWithTags[]] = await Promise.all([
            this.musicService.getAllSongs(user),
            this.dal.getUserTracks(user, this.musicService.type)
        ])

        Promise.all([
            this.addRelevantTracksToDal(user, musicServiceTracks, dalTracks),
            this.deleteRelevantTracksFromDal(user, musicServiceTracks, dalTracks)
        ])



    }

    private addRelevantTracksToDal(user: User, musicServiceTracks: Track[], dalTracks: TrackWithTags[]) {
        const tracksToAdd: Track[] = _.differenceBy(musicServiceTracks, dalTracks, 'id');
        const formattedTracksToAdd: TrackWithTags[] = tracksToAdd.map(track => ({
            ...track,
            tags: []
        }));
        return formattedTracksToAdd.length > 0
            ? this.dal.addTracks(user, this.musicService.type, formattedTracksToAdd)
            : Promise.resolve();
    }

    private deleteRelevantTracksFromDal(user: User, musicServiceTracks: Track[], dalTracks: TrackWithTags[]) {
        const trackIdsToDelete: string[] = _(dalTracks)
            .differenceBy(musicServiceTracks, 'id')
            .map('id')
            .value();

        return trackIdsToDelete.length > 0
            ? this.dal.deleteTracks(user, this.musicService.type, trackIdsToDelete)
            : Promise.resolve();
    }

    public getTracks(): TrackWithTags {
        return null;
    }

    public async addTagsToTracks(user: User, songIds: string[], tags: string[]): Promise<void> {

    }

    public async removeTagsFromTracks(user: User, songIds: string[], tags: string[]): Promise<void> {

    }

    public async createPlaylistByTags(user: User, playlistName: string, tags: string[]): Promise<string> {
        const playlistId = await this.musicService.createPlaylist(user, playlistName);
        await this.updatePlaylistByTags(user, playlistId, tags);

        return playlistId;
    }

    public async updatePlaylistByTags(user: User, playlistId: string, tags: string[]): Promise<void> {
        const tracksByTags: TrackWithTags[] = (await this.dal.getTracksByTags(user, this.musicService.type, tags));
        const playlistTracks: Track[] = (await this.musicService.getPlaylistTracks(user, playlistId));
        const trackIdsToAdd: string[] = _(tracksByTags)
            .differenceBy(playlistTracks, 'id')
            .map(track => 'id')
            .value();

        return this.musicService.updatePlaylistTracks(user, playlistId, trackIdsToAdd);
    }
}