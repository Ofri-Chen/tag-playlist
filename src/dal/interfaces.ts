import { User, TrackWithTags, MusicServiceTypes } from "../interfaces";

export interface Dal {
    initialized: Promise<void>;

    upsertTracks(tracks: DalTrack[]): Promise<void>;
    deleteTracks(user: User, type: MusicServiceTypes, trackIds: string[]): Promise<void>;

    getTracksByIds(user: User, type: MusicServiceTypes, ids: string[]): Promise<DalTrack[]>;
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<DalTrack[]>;
    getUserTracks(user: User, type: MusicServiceTypes): Promise<DalTrack[]>;
}

export interface DalTrack {
    userId: string;
    trackId: string;
    type: MusicServiceTypes;
    tags: string[];
}