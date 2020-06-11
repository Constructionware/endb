import { EventEmitter } from 'events';
import { MongoClient, Collection } from 'mongodb';
import { EndbAdapter, EndbOptions, Element } from '..';

export interface EndbMongoOptions {
    uri?: string;
    collection: string;
}

export default class EndbMongo<TVal> extends EventEmitter implements EndbAdapter<TVal> {
    public namespace!: string;
    public readonly options: EndbMongoOptions;
    public db: Promise<Collection<Element<TVal>>>;
    constructor(options: Partial<EndbOptions<TVal>> = {}) {
        super();
        this.options = {
            uri: 'mongodb://127.0.0.1:27017',
            collection: 'endb',
            ...options
        };
        this.db = new Promise<Collection<Element<TVal>>(resolve => {
            MongoClient.connect(this.options.uri, (error, client) => {
                if (error !== null) return this.emit('error', error); 

                const db = client.db();
                const collection = db.collection(this.options.collection);

                db.on('error', error => this.emit('error', error));

                collection.createIndex({ key: 1 }, {
                    unique: true,
                    background: true
                });
                
                resolve(collection);
            });
        });
    }
}