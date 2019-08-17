import { Dal } from "../interfaces";
import { User, MusicServiceTypes, TrackWithTags, MongoConfig, ILogger } from "../../interfaces";
import { MongoClient, Db, Collection, UpdateWriteOpResult } from 'mongodb';
import * as config from '../../../config';
import { ExtendedError } from "../../common/error";
import { DalTrack } from "./interfaces";
import { EmptyLogger } from "../../common/empty-logger";

export class MongoDal implements Dal {
    private _tracksCollection: Collection<DalTrack>;
    private _mongoClient: MongoClient;

    constructor(private _mongoConfig: MongoConfig, private _logger: ILogger = new EmptyLogger()) {
        this.connectToDb();
    }

    async upsertTracks(user: User, tracks: TrackWithTags[]): Promise<void> {
        const filter = {
            userId: user.id,
            trackId: tracks[0].id,
            type: tracks[0].type
        }

        const updatedDoc: DalTrack = {
            userId: user.id,
            trackId: tracks[0].id,
            type: tracks[0].type,
            tags: tracks[0].tags
        }

        await this._tracksCollection.updateOne(filter, updatedDoc, { upsert: true });
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