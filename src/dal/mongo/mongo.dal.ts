import { Dal } from "../interfaces";
import { User, MusicServiceTypes, TrackWithTags, MongoConfig, ILogger } from "../../interfaces";
import { MongoClient, Logger } from 'mongodb';
import * as config from '../../../config';
import { ExtendedError } from "../../common/error";

export class MongoDal implements Dal {
    private _mongoClient: MongoClient;

    constructor(private _mongoConfig: MongoConfig, private _logger: ILogger) {
        this._mongoClient = new MongoClient(this._mongoConfig.uri);
        this._mongoClient.connect()
            .then(() => this._logger.info('connected to MongoDB'))
            .catch(() => {
                this._logger.error('failed connecting to MongoDB');
                throw new ExtendedError('failed connecting to MongoDB', { uri: this._mongoConfig.uri });
            });
    }

    upsertTracks(user: User, type: MusicServiceTypes, tracks: TrackWithTags[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteTracks(user: User, type: MusicServiceTypes, trackIds: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getTracksByIds(user: User, type: MusicServiceTypes, ids: string[]): Promise<TrackWithTags[]> {
        throw new Error("Method not implemented.");
    }
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<TrackWithTags[]> {
        throw new Error("Method not implemented.");
    }
    getUserTracks(user: User, type: MusicServiceTypes): Promise<TrackWithTags[]> {
        throw new Error("Method not implemented.");
    }

    const client =
}