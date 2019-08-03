import { ICacheService } from "../interfaces";

export class MapCacheService<TKey, TValue> implements ICacheService<TKey, TValue> {
    private map: Map<TKey, TValue> = new Map<TKey, TValue>();

    public setItem(key: TKey, value: TValue): void {
        this.map.set(key, value);
    }
    public getItem(key: TKey): TValue {
        return this.map.get(key);
    }
}