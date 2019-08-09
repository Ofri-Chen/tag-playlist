import { User, TrackWithTags, MusicServiceTypes } from "../interfaces";

export interface Dal {
    upsertTracks(user: User, type: MusicServiceTypes, tracks: TrackWithTags[]): Promise<void>;
    deleteTracks(user: User, type: MusicServiceTypes, trackIds: string[]): Promise<void>;

    getTracksByIds(user: User, type: MusicServiceTypes, ids: string[]): Promise<TrackWithTags[]>;
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<TrackWithTags[]>;
    getUserTracks(user: User, type: MusicServiceTypes): Promise<TrackWithTags[]>;
}