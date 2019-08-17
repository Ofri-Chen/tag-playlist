import { Dal, DalTrack } from "../interfaces";
import { MusicServiceTypes, TrackWithTags, MongoConfig, ILogger } from "../../interfaces";
import { MongoClient, Collection } from 'mongodb';
import { ExtendedError } from "../../common/error";
import { EmptyLogger } from "../../common/empty-logger";

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
        const tracksToUpsert = tracks.map(track => this.extractRelevantFields(track, false));
        return this.updateTracks(tracksToUpsert, true);
    }

    async deleteTracks(userId: string, type: MusicServiceTypes, trackIds: string[]): Promise<void> {
        const tracks = await this.getTracksByIds(userId, type, trackIds);
        tracks.forEach(track => track.isDeleted = true);

        return this.updateTracks(tracks);
    }

    getTracksByIds(userId: string, type: MusicServiceTypes, ids: string[]): Promise<DalTrack[]> {
        return this._tracksCollection.find(
            {
                userId: userId,
                type,
                trackId: { $in: ids }
            }
        ).toArray();
    }
    getTracksByTags(userId: string, type: MusicServiceTypes, tags: string[]): Promise<DalTrack[]> {
        return this._tracksCollection.find(
            {
                userId: userId,
                type,
                tags: { $in: tags }
            }
        ).toArray();
    }
    getUserTracks(userId: string, type: MusicServiceTypes): Promise<DalTrack[]> {
        return this._tracksCollection.find(
            {
                userId: userId,
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
    }

    private extractRelevantFields(track: DalTrack, isDeleted?: boolean): DalTrack {
        return {
            userId: track.userId,
            trackId: track.trackId,
            type: track.type,
            tags: track.tags,
            isDeleted: isDeleted || !!track.isDeleted
        }
    }

    private async updateTracks(tracks: DalTrack[], upsert: boolean = false) {
        const operations = tracks.map(track => ({
            updateMany: {
                filter: {
                    userId: track.userId,
                    trackId: track.trackId,
                    type: track.type
                },
                update: {
                    $set: { ...track },
                },
                upsert
            }
        }))
        if (operations.length > 0) {
            await this._tracksCollection.bulkWrite(operations);
        }
    }
}