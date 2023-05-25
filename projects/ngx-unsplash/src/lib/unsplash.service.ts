import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Download } from './model/download';
import { Like } from './model/like';
import { Photo } from './model/photo';
import { SearchResult } from './model/search-result';

export interface UnsplashConfig {
  url: string;
  authorization: string;
}

export const UNSPLASH_CONFIG = new InjectionToken<
  UnsplashConfig | Observable<UnsplashConfig>
>('unsplash.config');

export type Orientation = 'landscape' | 'portrait' | 'squarish';

export type ContentFilter = 'low' | 'high';

// prettier-ignore
export type Count =
  |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;

export type Color =
  | 'black_and_white'
  | 'black'
  | 'white'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'magenta'
  | 'green'
  | 'teal'
  | 'blue';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private readonly searchUrl = 'search/photos';
  private readonly photosUrl = 'photos';
  private readonly randomUrl = 'photos/random';

  private config$: Observable<UnsplashConfig>;

  constructor(
    private http: HttpClient,
    @Inject(UNSPLASH_CONFIG)
    config: UnsplashConfig | Observable<UnsplashConfig>
  ) {
    if (config instanceof Observable) {
      this.config$ = config;
    } else {
      this.config$ = of(config);
    }
  }

  /**
   * [List photos](https://unsplash.com/documentation#list-photos).
   *
   * Get a single page from the list of all photos.
   *
   * @param options to be used when getting list of photos
   * @returns Observable containing a {@link Photo} array
   */
  list(options: {
    page?: number;
    perPage?: number;
    orderBy?: 'latest' | 'oldest' | 'popular';
  }): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        let params = new HttpParams();

        if (options.page) {
          params = params.set('page', options.page);
        }

        if (options.perPage) {
          params = params.set('per_page', options.perPage);
        }

        if (options.orderBy) {
          params = params.set('order_by', options.orderBy);
        }

        const url = new URL(
          this.photosUrl,
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        return this.http.get<Photo[]>(url, { params, headers });
      })
    );
  }

  /**
   * [Get a photo](https://unsplash.com/documentation#get-a-photo).
   *
   * Retrieve a single photo.
   *
   * @param id of the photo
   * @returns  Observable containing the {@link Photo}
   */
  get(id: string): Observable<Photo> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        const url = new URL(
          this.photosUrl + '/' + id,
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        return this.http.get<Photo>(url, { headers });
      })
    );
  }

  /**
   * [Get random photos](https://unsplash.com/documentation#get-a-random-photo).
   *
   * Retrieve random photos.
   *
   * @param options to be used when getting random photos
   * @returns Observable containing a {@link Photo} array
   */
  random(options: {
    collections?: string;
    topics?: string;
    username?: string;
    query?: string;
    orientation?: Orientation;
    contentFilter?: ContentFilter;
    count?: Count;
  }): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        let params = new HttpParams();

        if (options?.collections) {
          params = params.set('collections', options?.collections);
        }

        if (options?.topics) {
          params = params.set('topics', options?.topics);
        }

        if (options?.username) {
          params = params.set('username', options?.username);
        }

        if (options?.query) {
          params = params.set('query', options?.query);
        }

        if (options?.orientation) {
          params = params.set('orientation', options?.orientation);
        }

        if (options?.contentFilter) {
          params = params.set('content_filter', options?.contentFilter);
        }

        if (options?.count) {
          params = params.set('count', options?.count);
        }

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        const url = new URL(
          this.randomUrl,
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        return this.http.get<Photo[]>(url, { headers, params });
      })
    );
  }

  /**
   * [Search photos](https://unsplash.com/documentation#search-photos).
   *
   * Get a single page of photo results for a query.
   *
   * @param query to search for
   * @param options to be used when searching photos
   * @returns Observable containing a {@link SearchResult}
   */
  search(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: 'latest' | 'relevant';
      collections?: string;
      contentFilter?: ContentFilter;
      color?: Color;
      orientation?: Orientation;
    }
  ): Observable<SearchResult> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        let params = new HttpParams().set('query', query);

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orderBy) {
          params = params.set('order_by', options?.orderBy);
        }

        if (options?.collections) {
          params = params.set('collections', options?.collections);
        }

        if (options?.contentFilter) {
          params = params.set('content_filter', options?.contentFilter);
        }

        if (options?.color) {
          params = params.set('color', options?.color);
        }

        if (options?.orientation) {
          params = params.set('orientation', options?.orientation);
        }

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        const url = new URL(
          this.searchUrl,
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        return this.http.get<SearchResult>(url, { headers, params });
      })
    );
  }

  /**
   * [Trigger a download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download)
   * of a photo.
   *
   * @param photo to download
   * @returns Observable containing the {@link Download}
   */
  download(photo: Photo): Observable<Download> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        const photoUrl = new URL(photo.links.download_location);
        const url = new URL(
          photoUrl.pathname.substr(1) + photoUrl.search,
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        return this.http.get<Download>(url, { headers });
      })
    );
  }

  /**
   * [Like a photo](https://unsplash.com/documentation#like-a-photo).
   *
   * Like a photo on behalf of the logged-in user. This requires the write_likes scope.
   *
   * @param photo to like
   * @returns Observable containing the {@link Like}
   * @throws Error if the Unsplash configuration is undefined
   */
  like(photo: Photo): Observable<Like> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        const url = new URL(
          this.photosUrl + '/' + photo.id + '/like',
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        return this.http.post<Like>(url, {}, { headers });
      })
    );
  }

  /**
   * [Unlike a photo](https://unsplash.com/documentation#unlike-a-photo).
   * Remove a user’s like of a photo.
   *
   * @param photo to unlike
   *
   * @returns Observable containing the {@link Like}
   * @throws Error if the Unsplash configuration is undefined
   */
  unlike(photo: Photo): Observable<Like> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        let headers = new HttpHeaders().set(
          'authorization',
          config.authorization
        );

        const url = new URL(
          this.photosUrl + '/' + photo.id + '/like',
          config.url.endsWith('/') ? config.url : config.url + '/'
        ).toString();

        return this.http.delete<Like>(url, { headers });
      })
    );
  }
}
