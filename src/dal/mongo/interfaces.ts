import { TrackWithTags } from "../../interfaces";

export interface MongoTrack extends TrackWithTags {
    _id: string;
    userId: string;
}