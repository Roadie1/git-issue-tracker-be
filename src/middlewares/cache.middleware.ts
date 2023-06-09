import { MemoryCache } from 'memory-cache-node';

class CacheMiddleware {
    public createCache<T>(expiration: number, limit: number): MemoryCache<string, T> {
        return new MemoryCache<string, T>(expiration, limit);
    }
}
export default new CacheMiddleware;