import { TrackWithTags } from "../../interfaces";

export interface MongoTrack extends TrackWithTags {
    userId: string;
}