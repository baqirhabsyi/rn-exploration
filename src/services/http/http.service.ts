import Logger from '@utils/logger';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export class HttpService {
  private cache = new Map<string, CacheEntry>();
  private ttl: number;
  private logger: Logger = new Logger('HttpService');

  constructor(ttl: number = DEFAULT_TTL) {
    this.ttl = ttl;
  }

  private isCacheValid(entry: CacheEntry | undefined): boolean {
    return entry ? Date.now() - entry.timestamp < this.ttl : false;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const cacheKey = url; // Simple caching based on URL only for GET
    const cachedEntry = this.cache.get(cacheKey);

    if (this.isCacheValid(cachedEntry)) {
      this.logger.info(`Cache hit for: ${url}`);
      return cachedEntry!.data as T;
    } else if (cachedEntry) {
      this.logger.info(`Cache expired for: ${url}`);
      this.cache.delete(cacheKey); // Remove expired entry
    } else {
      this.logger.info(`Cache miss for: ${url}`);
    }

    try {
      const response = await fetch(url, {...options, method: 'GET'});

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: T = await response.json();

      // Cache the new data
      this.cache.set(cacheKey, {data, timestamp: Date.now()});
      this.logger.info(`[HttpService] Cached data for: ${url}`);

      return data;
    } catch (error) {
      this.logger.error(`[HttpService] Fetch error for ${url}:`, error);
      throw error; // Re-throw the error after logging
    }
  }

  async post<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
    });
  }

  async put<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
    });
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {...options, method: 'DELETE'});
  }

  // Generic request method for non-GET requests or when cache is bypassed
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Attempt to read error body for more context if available
        let errorBody = null;
        try {
          errorBody = await response.text(); // Use text first, might not be JSON
        } catch (e) {
          // Ignore if reading body fails
        }
        throw new Error(
          `HTTP error! Status: ${response.status}. Body: ${errorBody || 'N/A'}`,
        );
      }

      // Handle cases where response might be empty (e.g., 204 No Content)
      const contentType = response.headers.get('content-type');
      if (
        response.status === 204 ||
        !contentType ||
        !contentType.includes('application/json')
      ) {
        return undefined as T; // Or handle as needed, maybe return response itself
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error(
        `[HttpService] Request error for ${options.method} ${url}:`,
        error,
      );
      throw error; // Re-throw the error after logging
    }
  }

  // Method to manually clear the cache
  clearCache(): void {
    this.cache.clear();
    this.logger.info('[HttpService] Cache cleared.');
  }

  // Method to manually invalidate a specific cache entry
  invalidateCacheEntry(url: string): void {
    const cacheKey = url;
    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
      this.logger.info(`Cache invalidated for: ${url}`);
    }
  }
}

// Export a singleton instance for easy use across the app
export const httpService = new HttpService();
