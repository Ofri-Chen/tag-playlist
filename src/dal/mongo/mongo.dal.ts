import { Dal } from "../interfaces";
import { User, MusicServiceTypes, TrackWithTags, MongoConfig, ILogger } from "../../interfaces";
import { MongoClient, Db, Collection } from 'mongodb';
import * as config from '../../../config';
import { ExtendedError } from "../../common/error";
import { MongoTrack } from "./interfaces";

export class MongoDal implements Dal {
    private _tracksCollection: Collection<MongoTrack>;
    private _mongoClient: MongoClient;

    constructor(private _mongoConfig: MongoConfig, private _logger: ILogger) {
        this.connectToDb();
    }

    upsertTracks(user: User, type: MusicServiceTypes, tracks: TrackWithTags[]): Promise<void> {]
        const updates = 
        this._tracksCollection.bulkWrite()
        throw new Error("Method not implemented.");
    }
    deleteTracks(user: User, type: MusicServiceTypes, trackIds: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getTracksByIds(user: User, type: MusicServiceTypes, ids: string[]): Promise<TrackWithTags[]> {
        return this._tracksCollection.find(
            {
                userId: user.id,
                type,
                id: { $in: ids }
            }
        ).toArray();
    }
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<TrackWithTags[]> {
        return this._tracksCollection.find(
            {
                userId: user.id,
                type,
                tags: { $in: tags }
            }
        ).toArray();
    }
    getUserTracks(user: User, type: MusicServiceTypes): Promise<TrackWithTags[]> {
        return this._tracksCollection.find(
            {
                userId: user.id,
                type
            }
        ).toArray();
    }

    private connectToDb() {
        this._mongoClient = new MongoClient(this._mongoConfig.uri);
        this._mongoClient.connect()
            .then(() => {
                this._logger.info('connected to MongoDB');
                this._tracksCollection = this._mongoClient.db(this._mongoConfig.dbName).collection(this._mongoConfig.collection);
            })
            .catch(() => {
                this._logger.error('failed connecting to MongoDB');
                throw new ExtendedError('failed connecting to MongoDB', { uri: this._mongoConfig.uri });
            });
    }
}