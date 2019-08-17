import { Dal, DalTrack } from "../interfaces";
import { User, MusicServiceTypes, TrackWithTags, MongoConfig, ILogger } from "../../interfaces";
import { MongoClient, Db, Collection, UpdateWriteOpResult } from 'mongodb';
import * as config from '../../../config';
import { ExtendedError } from "../../common/error";
import { EmptyLogger } from "../../common/empty-logger";
import { rejects } from "assert";

export class MongoDal implements Dal {
    private _tracksCollection: Collection<DalTrack>;
    private _mongoClient: MongoClient;
    private _initializedPromise: Promise<void>;

    constructor(private _mongoConfig: MongoConfig, private _logger: ILogger = new EmptyLogger()) {
        let initializedPromiseActions;
        this._initializedPromise = new Promise<void>((resolve, reject) => {
            initializedPromiseActions = { resolve, reject };
        });
        this.connectToDb(initializedPromiseActions);
    }

    get initialized(): Promise<void> {
        return this._initializedPromise;
    }

    async upsertTracks(tracks: DalTrack[]): Promise<void> {
        const track = this.extractRelevantFields(tracks[0]);
        const filter = {
            userId: track.userId,
            trackId: track.trackId,
            type: track.type
        }
        await this._tracksCollection.updateOne(
            filter,
            { $set: { ...track } },
            { upsert: true });
    }
    deleteTracks(user: User, type: MusicServiceTypes, trackIds: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getTracksByIds(user: User, type: MusicServiceTypes, ids: string[]): Promise<DalTrack[]> {
        return this._tracksCollection.find(
            {
                userId: user.id,
                type,
                trackId: { $in: ids }
            }
        ).toArray();
    }
    getTracksByTags(user: User, type: MusicServiceTypes, tags: string[]): Promise<DalTrack[]> {
        return this._tracksCollection.find(
            {
                userId: user.id,
                type,
                tags: { $in: tags }
            }
        ).toArray();
    }
    getUserTracks(user: User, type: MusicServiceTypes): Promise<DalTrack[]> {
        return this._tracksCollection.find(
            {
                userId: user.id,
                type
            }
        ).toArray();
    }

    private connectToDb(initializePromiseActions: { resolve: any, reject: any }) {
        this._mongoClient = new MongoClient(this._mongoConfig.uri);
        this._mongoClient.connect()
            .then(() => {
                this._logger.info('connected to MongoDB');
                this._tracksCollection = this._mongoClient.db(this._mongoConfig.dbName).collection(this._mongoConfig.collection);
                initializePromiseActions.resolve();
            })
            .catch(() => {
                this._logger.error('failed connecting to MongoDB');
                initializePromiseActions.reject();
                throw new ExtendedError('failed connecting to MongoDB', { uri: this._mongoConfig.uri });
            });
        this._initializedPromise
    }

    private extractRelevantFields(track: DalTrack): DalTrack {
        return {
            userId: track.userId,
            trackId: track.trackId,
            type: track.type,
            tags: track.tags
        }
    }
}