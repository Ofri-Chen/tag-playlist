import { User, TrackWithTags, MusicServiceName } from "../interfaces";

export interface Dal {
    getTracksByTags(user: User, type: MusicServiceName, tags: string[]): Promise<TrackWithTags[]>;
}