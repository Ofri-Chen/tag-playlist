import { ICacheService } from "../interfaces";

interface MapItem<T> {
    expirationTimeout: NodeJS.Timeout;
    value: T;
}

export class MapCacheService<TKey, TValue> implements ICacheService<TKey, TValue> {
    private map: Map<TKey, MapItem<TValue>> = new Map<TKey, MapItem<TValue>>();

    public setItem(key: TKey, value: TValue, expiration?: number): void {
        if (this.map.has(key)) {
            clearTimeout(this.map.get(key).expirationTimeout);
        }
        this.map.set(key, {
            expirationTimeout: expiration && setTimeout(() => {
                this.removeItem(key);
            }, expiration),
            value
        });
    }

    public removeItem(key: TKey): void {
        if(!this.map.has(key)) return;

        clearTimeout(this.map.get(key).expirationTimeout);
        this.map.delete(key);
    }

    public getItem(key: TKey): TValue {
        const mapItem: MapItem<TValue> = this.map.get(key);
        return mapItem && mapItem.value;
    }
}