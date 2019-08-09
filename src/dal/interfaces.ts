import { User, TrackWithTags, MusicServiceTypes } from "../interfaces";

export interface Dal {
    addTracks(user: User, type: MusicServiceTypes, tracks: TrackWithTags[]): Promise<void>;
    addTagsToTracks(user: User, type: MusicServiceTypes, trackIds: string[], tags: string[]): Promise<void>;
    deleteTracks(user: User, type: MusicServiceTypes, trackIds: string[]): Promise<void>;
    
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<TrackWithTags[]>;
    getUserTracks(user: User, type: MusicServiceTypes): Promise<TrackWithTags[]>;
}