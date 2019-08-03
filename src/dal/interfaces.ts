import { User, TrackWithTags, MusicServiceTypes } from "../interfaces";

export interface Dal {
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<TrackWithTags[]>;
}