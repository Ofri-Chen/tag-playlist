import { User, TrackWithTags, MusicServiceTypes } from "../interfaces";

export interface Dal {
    initialized: Promise<void>;

    upsertTracks(tracks: DalTrack[]): Promise<void>;
    deleteTracks(userId: string, type: MusicServiceTypes, trackIds: string[]): Promise<void>;

    getTracksByIds(userId: string, type: MusicServiceTypes, ids: string[]): Promise<DalTrack[]>;
    getTracksByTags(userId: string, type: MusicServiceTypes, tags: string[]): Promise<DalTrack[]>;
    getUserTracks(userId: string, type: MusicServiceTypes): Promise<DalTrack[]>;
}

export interface DalTrack {
    userId: string;
    trackId: string;
    type: MusicServiceTypes;
    tags: string[];

    isDeleted?: boolean;
}