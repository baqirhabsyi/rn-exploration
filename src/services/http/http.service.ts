import Logger from '../../utils/logger.util';

// Interface defining the structure for cache entries.
interface CacheEntry<T = any> {
  data: T; // The cached data.
  timestamp: number; // Timestamp when the data was cached.
}

// Default Time-To-Live for cache entries in milliseconds (5 minutes).
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Provides a service for making HTTP requests (GET, POST, PUT, DELETE).
 * Includes basic in-memory caching for GET requests with a configurable TTL.
 */
export class HttpService {
  // In-memory cache store using a Map.
  private cache = new Map<string, CacheEntry>();
  // Time-To-Live for cache entries in milliseconds.
  private ttl: number;
  // Logger instance for logging service activities.
  private logger: Logger = new Logger('HttpService');

  /**
   * Creates an instance of HttpService.
   * @param ttl Optional Time-To-Live for cache entries in milliseconds. Defaults to DEFAULT_TTL.
   */
  constructor(ttl: number = DEFAULT_TTL) {
    this.ttl = ttl;
  }

  /**
   * Checks if a cache entry is still valid based on its timestamp and the TTL.
   * @param entry The cache entry to validate.
   * @returns True if the entry exists and is within the TTL, false otherwise.
   */
  private isCacheValid(entry: CacheEntry | undefined): boolean {
    return entry ? Date.now() - entry.timestamp < this.ttl : false;
  }

  /**
   * Performs an HTTP GET request.
   * Checks the cache first. If a valid cache entry exists, returns cached data.
   * Otherwise, makes a network request, caches the response, and returns it.
   * @param url The URL to fetch data from.
   * @param options Optional request initialization options (like headers).
   * @returns A promise resolving to the fetched data of type T.
   * @throws Throws an error if the network request fails or the response status is not ok.
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const cacheKey = url; // Use the URL as the cache key for GET requests.
    const cachedEntry = this.cache.get(cacheKey);

    // Check if cache is valid.
    if (this.isCacheValid(cachedEntry)) {
      this.logger.info(`Cache hit for: ${url}`);
      return cachedEntry!.data as T;
    } else if (cachedEntry) {
      // If cache exists but is expired, log and remove it.
      this.logger.info(`Cache expired for: ${url}`);
      this.cache.delete(cacheKey);
    } else {
      this.logger.info(`Cache miss for: ${url}`);
    }

    // Cache miss or expired, perform network request.
    try {
      const response = await fetch(url, {...options, method: 'GET'});

      if (!response.ok) {
        // Throw error for non-successful responses.
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: T = await response.json();

      // Cache the newly fetched data.
      this.cache.set(cacheKey, {data, timestamp: Date.now()});
      this.logger.info(`[HttpService] Cached data for: ${url}`);

      return data;
    } catch (error) {
      this.logger.error(`[HttpService] Fetch error for ${url}:`, error);
      throw error; // Re-throw after logging.
    }
  }

  /**
   * Performs an HTTP POST request.
   * Automatically sets Content-Type to application/json and stringifies the body.
   * Does not use caching.
   * @param url The URL to send the request to.
   * @param body The request body (will be JSON.stringify'd).
   * @param options Optional request initialization options.
   * @returns A promise resolving to the response data of type T.
   */
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

  /**
   * Performs an HTTP PUT request.
   * Automatically sets Content-Type to application/json and stringifies the body.
   * Does not use caching.
   * @param url The URL to send the request to.
   * @param body The request body (will be JSON.stringify'd).
   * @param options Optional request initialization options.
   * @returns A promise resolving to the response data of type T.
   */
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

  /**
   * Performs an HTTP DELETE request.
   * Does not use caching.
   * @param url The URL to send the request to.
   * @param options Optional request initialization options.
   * @returns A promise resolving to the response data of type T.
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {...options, method: 'DELETE'});
  }

  /**
   * Generic private method to handle non-GET requests or requests bypassing the cache.
   * @param url The URL for the request.
   * @param options The request initialization options (method, headers, body, etc.).
   * @returns A promise resolving to the response data of type T.
   * @throws Throws an error if the network request fails or the response status is not ok.
   */
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Attempt to include error body in the error message for better debugging.
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

  /**
   * Clears the entire in-memory cache.
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.info('[HttpService] Cache cleared.');
  }

  /**
   * Removes a specific entry from the cache based on its URL (key).
   * @param url The URL of the cache entry to invalidate.
   */
  invalidateCacheEntry(url: string): void {
    const cacheKey = url;
    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
      this.logger.info(`Cache invalidated for: ${url}`);
    }
  }
}

// Export a singleton instance of the HttpService for convenient global use.
export const httpService = new HttpService();
