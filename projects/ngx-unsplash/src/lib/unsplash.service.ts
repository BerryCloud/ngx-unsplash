import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Collection } from './model/collection';
import { Download } from './model/download';
import { Photo } from './model/photo';
import { SearchResult } from './model/search-result';
import { UserStatistics } from './model/statistics';
import { Topic } from './model/topic';
import {
  UnsplashColor,
  UnsplashContentFilter,
  UnsplashFeaturedOrderBy,
  UnsplashOrderBy,
  UnsplashOrientation,
  UnsplashResolution,
  UnsplashSearchOrderBy,
} from './model/types';
import { User } from './model/user';

export interface UnsplashConfig {
  url: string;
  authorization: string;
}

export const UNSPLASH_CONFIG = new InjectionToken<
  UnsplashConfig | Observable<UnsplashConfig>
>('unsplash.config');

// prettier-ignore
export type Count =
  |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private readonly searchUrl = 'search/photos';
  private readonly photosUrl = 'photos';
  private readonly randomUrl = 'photos/random';
  private readonly collectionsUrl = 'collections';
  private readonly topicsUrl = 'topics';
  private readonly usersUrl = 'users';

  private config$: Observable<UnsplashConfig>;

  constructor(
    private http: HttpClient,
    @Inject(UNSPLASH_CONFIG)
    config: UnsplashConfig | Observable<UnsplashConfig>
  ) {
    const config$ = config instanceof Observable ? config : of(config);

    this.config$ = config$.pipe(
      tap((config) => {
        if (!config) {
          throw new Error('Unsplash configuration undefined');
        }

        if (!config.url) {
          throw new Error('Unsplash configuration url undefined');
        }

        if (!config.authorization) {
          throw new Error('Unsplash configuration authorization undefined');
        }
      })
    );
  }

  /**
   * [List photos](https://unsplash.com/documentation#list-photos).
   *
   * Get a single page from the list of all photos.
   *
   * @param options to be used when getting list of photos
   *
   * @returns Observable containing a {@link Photo} array
   */
  photos(options?: {
    page?: number;
    perPage?: number;
    orderBy?: UnsplashOrderBy;
  }): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options.page.toString());
        }

        if (options?.perPage) {
          params = params.set('per_page', options.perPage.toString());
        }

        if (options?.orderBy) {
          params = params.set('order_by', options.orderBy);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(this.photosUrl, config);

        return this.http.get<Photo[]>(url, { params, headers });
      })
    );
  }

  /**
   * [List photos](https://unsplash.com/documentation#list-photos).
   *
   * Get a single page from the list of all photos.
   *
   * @param options to be used when getting list of photos
   *
   * @returns Observable containing a {@link Photo} array
   *
   * @deprecated Use {@link photos} instead
   */
  list(options?: {
    page?: number;
    perPage?: number;
    orderBy?: UnsplashOrderBy;
  }): Observable<Photo[]> {
    return this.photos(options);
  }

  /**
   * [Get a photo](https://unsplash.com/documentation#get-a-photo).
   *
   * Retrieve a single photo.
   *
   * @param id of the photo
   *
   * @returns  Observable containing the {@link Photo}
   */
  photo(id: string): Observable<Photo> {
    return this.config$.pipe(
      mergeMap((config) => {
        const headers = this.unsplashHeaders(config);
        const url = this.unsplashUrl(`${this.photosUrl}/${id}`, config);

        return this.http.get<Photo>(url, { headers });
      })
    );
  }

  /**
   * [Get a photo](https://unsplash.com/documentation#get-a-photo).
   *
   * Retrieve a single photo.
   *
   * @param id of the photo
   *
   * @returns  Observable containing the {@link Photo}
   *
   * @deprecated Use {@link photo} instead
   */
  get(id: string): Observable<Photo> {
    return this.photo(id);
  }

  /**
   * [Get random photos](https://unsplash.com/documentation#get-a-random-photo).
   *
   * Retrieve random photos.
   *
   * @param options to be used when getting random photos
   *
   * @returns Observable containing a {@link Photo} array
   */
  randomPhoto(options?: {
    collections?: string;
    topics?: string;
    username?: string;
    query?: string;
    orientation?: UnsplashOrientation;
    contentFilter?: UnsplashContentFilter;
    count?: Count;
  }): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
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

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(this.randomUrl, config);

        return this.http.get<Photo[]>(url, { params, headers });
      })
    );
  }

  /**
   * [Get random photos](https://unsplash.com/documentation#get-a-random-photo).
   *
   * Retrieve random photos.
   *
   * @param options to be used when getting random photos
   *
   * @returns Observable containing a {@link Photo} array
   *
   * @deprecated Use {@link randomPhoto} instead
   */
  random(options?: {
    collections?: string;
    topics?: string;
    username?: string;
    query?: string;
    orientation?: UnsplashOrientation;
    contentFilter?: UnsplashContentFilter;
    count?: Count;
  }): Observable<Photo[]> {
    return this.randomPhoto(options);
  }

  /**
   * [Search photos](https://unsplash.com/documentation#search-photos).
   *
   * Get a single page of photo results for a query.
   *
   * @param query to search for
   * @param options to be used when searching photos
   *
   * @returns Observable containing a {@link SearchResult}
   */
  searchPhotos(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: UnsplashSearchOrderBy;
      collections?: string;
      contentFilter?: UnsplashContentFilter;
      color?: UnsplashColor;
      orientation?: UnsplashOrientation;
    }
  ): Observable<SearchResult> {
    return this.config$.pipe(
      mergeMap((config) => {
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

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(this.searchUrl, config);

        return this.http.get<SearchResult>(url, { headers, params });
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
   *
   * @returns Observable containing a {@link SearchResult}
   *
   * @deprecated Use {@link searchPhotos} instead
   */
  search(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: UnsplashSearchOrderBy;
      collections?: string;
      contentFilter?: UnsplashContentFilter;
      color?: UnsplashColor;
      orientation?: UnsplashOrientation;
    }
  ): Observable<SearchResult> {
    return this.searchPhotos(query, options);
  }

  /**
   * [Trigger a download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download)
   * of a photo.
   *
   * @param photo to download
   *
   * @returns Observable containing the {@link Download}
   */
  downloadPhoto(photo: Photo): Observable<Download> {
    return this.config$.pipe(
      mergeMap((config) => {
        const headers = this.unsplashHeaders(config);

        const photoUrl = new URL(photo.links.download_location);

        // Remove the leading slash from the pathname and add the search
        const url = this.unsplashUrl(
          photoUrl.pathname.substring(1) + photoUrl.search,
          config
        );

        return this.http.get<Download>(url, { headers });
      })
    );
  }

  /**
   * [Trigger a download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download)
   * of a photo.
   *
   * @param photo to download
   *
   * @returns Observable containing the {@link Download}
   *
   * @deprecated Use {@link downloadPhoto} instead
   */
  download(photo: Photo): Observable<Download> {
    return this.downloadPhoto(photo);
  }

  /**
   * [List collections](https://unsplash.com/documentation#list-collections).
   * Retrieve a list of collections.
   *
   * @param options to be used when getting collections
   *
   * @returns Observable containing a {@link Collection} array
   *
   * @throws Error if the Unsplash configuration is not provided
   */
  collections(options?: {
    page?: number;
    perPage?: number;
  }): Observable<Collection[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(this.collectionsUrl, config);

        return this.http.get<Collection[]>(url, { headers, params });
      })
    );
  }

  /**
   * [Get a collection](https://unsplash.com/documentation#get-a-collection).
   * Retrieve a single collection.
   *
   * @param id of the collection to retrieve
   *
   * @returns Observable containing a {@link Collection}
   *
   * @throws Error if the collection id is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  collection(id: string): Observable<Collection> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!id) {
          throw new Error('Collection id undefined');
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(`${this.collectionsUrl}/${id}`, config);

        return this.http.get<Collection>(url, { headers });
      })
    );
  }

  /**
   * [Get a collection's photos](https://unsplash.com/documentation#get-a-collections-photos).
   * Retrieve a list of photos in a collection.
   *
   * @param id of the collection to retrieve photos from
   * @param options to be used when getting photos from a collection
   *
   * @returns Observable containing a {@link Photo} array
   *
   * @throws Error if the collection id is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  collectionPhotos(
    id: string,
    options?: {
      page?: number;
      perPage?: number;
      orientation?: UnsplashOrientation;
    }
  ): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!id) {
          throw new Error('Collection id undefined');
        }

        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orientation) {
          params = params.set('orientation', options?.orientation);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.collectionsUrl}/${id}/photos`,
          config
        );

        return this.http.get<Photo[]>(url, { headers, params });
      })
    );
  }

  /**
   * [List related collections](https://unsplash.com/documentation#list-a-collections-related-collections).
   * Retrieve a list of collections related to a particular one.
   *
   * @param id of the collection to retrieve related collections from
   *
   * @returns Observable containing a {@link Collection} array
   *
   * @throws Error if the collection id is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  relatedCollections(id: string): Observable<Collection[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!id) {
          throw new Error('Collection id undefined');
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.collectionsUrl}/${id}/related`,
          config
        );

        return this.http.get<Collection[]>(url, { headers });
      })
    );
  }

  /**
   * [List topics](https://unsplash.com/documentation#list-topics).
   * Retrieve a list of topics.
   *
   * @param options to be used when getting topics
   *
   * @returns Observable containing a {@link Topic} array
   */
  topics(options?: {
    ids?: string[];
    page?: number;
    perPage?: number;
    orderBy?: UnsplashFeaturedOrderBy;
  }): Observable<Topic[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        let params = new HttpParams();

        if (options?.ids) {
          params = params.set('ids', options?.ids.join(','));
        }

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orderBy) {
          params = params.set('order_by', options?.orderBy);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(this.topicsUrl, config);

        return this.http.get<Topic[]>(url, { headers, params });
      })
    );
  }

  /**
   * [Get a topic](https://unsplash.com/documentation#get-a-topic).
   * Retrieve a single topic.
   *
   * @param id of the topic to retrieve
   *
   * @returns Observable containing a {@link Topic}
   *
   * @throws Error if the topic id is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  topic(id: string): Observable<Topic> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!id) {
          throw new Error('Topic id undefined');
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(`${this.topicsUrl}/${id}`, config);

        return this.http.get<Topic>(url, { headers });
      })
    );
  }

  /**
   * [Get a topic's photos](https://unsplash.com/documentation#get-a-topics-photos).
   * Retrieve a list of photos in a topic.
   *
   * @param id of the topic to retrieve photos from
   * @param options to be used when getting photos from a topic
   *
   * @returns Observable containing a {@link Photo} array
   *
   * @throws Error if the topic id is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  topicPhotos(
    id: string,
    options?: {
      page?: number;
      perPage?: number;
      orientation?: UnsplashOrientation;
      orderBy?: UnsplashOrderBy;
    }
  ): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!id) {
          throw new Error('Topic id undefined');
        }

        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orientation) {
          params = params.set('orientation', options?.orientation);
        }

        if (options?.orderBy) {
          params = params.set('order_by', options?.orderBy);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(`${this.topicsUrl}/${id}/photos`, config);

        return this.http.get<Photo[]>(url, { headers, params });
      })
    );
  }

  /**
   * [Get a user](https://unsplash.com/documentation#get-a-user).
   * Retrieve public details on a given user.
   *
   * @param username of the user to retrieve
   *
   * @returns Observable containing a {@link User}
   *
   * @throws Error if the user username is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  user(username: string): Observable<User> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!username) {
          throw new Error('User username undefined');
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(`${this.usersUrl}/${username}`, config);

        return this.http.get<User>(url, { headers });
      })
    );
  }

  /**
   * [Get a user's portfolio link](https://unsplash.com/documentation#get-a-users-portfolio-link).
   * Retrieve a single user’s portfolio link.
   *
   * @param username of the user to retrieve portfolio link from
   *
   * @returns Observable containing a {@link User}
   *
   * @throws Error if the user username is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  userPortfolio(username: string): Observable<string | undefined> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!username) {
          throw new Error('User username undefined');
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.usersUrl}/${username}/portfolio`,
          config
        );

        return this.http.get<{ url: string }>(url, { headers });
      }),
      map((response) => response.url)
    );
  }

  /**
   * [List a user’s photos](https://unsplash.com/documentation#list-a-users-photos).
   * Retrieve a list of photos uploaded by a user.
   *
   * @param username of the user to retrieve photos from
   * @param options to be used when getting photos from a user
   *
   * @returns Observable containing a {@link Photo} array
   *
   * @throws Error if the user username is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  userPhotos(
    username: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: UnsplashOrderBy;
      stats?: boolean;
      resolution?: UnsplashResolution;
      quantity?: number;
      orientation?: UnsplashOrientation;
    }
  ): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!username) {
          throw new Error('User username undefined');
        }

        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orderBy) {
          params = params.set('order_by', options?.orderBy);
        }

        if (options?.stats) {
          params = params.set('stats', options?.stats);
        }

        if (options?.resolution) {
          params = params.set('resolution', options?.resolution);
        }

        if (options?.quantity) {
          params = params.set('quantity', options?.quantity);
        }

        if (options?.orientation) {
          params = params.set('orientation', options?.orientation);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.usersUrl}/${username}/photos`,
          config
        );

        return this.http.get<Photo[]>(url, { headers, params });
      })
    );
  }

  /**
   * [List a user’s liked photos](https://unsplash.com/documentation#list-a-users-liked-photos).
   * Retrieve a list of photos liked by a user.
   *
   * @param username of the user to retrieve liked photos from
   * @param options to be used when getting liked photos from a user
   *
   * @returns Observable containing a {@link Photo} array
   *
   * @throws Error if the user username is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  userLikes(
    username: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: UnsplashOrderBy;
    }
  ): Observable<Photo[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!username) {
          throw new Error('User username undefined');
        }

        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orderBy) {
          params = params.set('order_by', options?.orderBy);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.usersUrl}/${username}/likes`,
          config
        );

        return this.http.get<Photo[]>(url, { headers, params });
      })
    );
  }

  /**
   * [List a user’s collections](https://unsplash.com/documentation#list-a-users-collections).
   * Retrieve a list of collections created by the user.
   *
   * @param username of the user to retrieve collections from
   * @param options to be used when getting collections from a user
   *
   * @returns Observable containing a {@link Collection} array
   *
   * @throws Error if the user username is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  userCollections(
    username: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: UnsplashOrderBy;
    }
  ): Observable<Collection[]> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!username) {
          throw new Error('User username undefined');
        }

        let params = new HttpParams();

        if (options?.page) {
          params = params.set('page', options?.page);
        }

        if (options?.perPage) {
          params = params.set('per_page', options?.perPage);
        }

        if (options?.orderBy) {
          params = params.set('order_by', options?.orderBy);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.usersUrl}/${username}/collections`,
          config
        );

        return this.http.get<Collection[]>(url, { headers, params });
      })
    );
  }

  /**
   * [Get a user’s statistics](https://unsplash.com/documentation#get-a-users-statistics).
   * Retrieve total number of downloads, views and likes of all user’s photos, as well as the historical breakdown and average of these stats in a specific time frame (default is 30 days).
   *
   * @param username of the user to retrieve statistics from
   * @param options to be used when getting statistics from a user
   *
   * @returns Observable containing a {@link UserStatistics} object
   *
   * @throws Error if the user username is not provided
   * @throws Error if the Unsplash configuration is not provided
   */
  userStatistics(
    username: string,
    options?: {
      resolution?: UnsplashResolution;
      quantity?: number;
    }
  ): Observable<UserStatistics> {
    return this.config$.pipe(
      mergeMap((config) => {
        if (!username) {
          throw new Error('User username undefined');
        }

        let params = new HttpParams();

        if (options?.resolution) {
          params = params.set('resolution', options?.resolution);
        }

        if (options?.quantity) {
          params = params.set('quantity', options?.quantity);
        }

        const headers = this.unsplashHeaders(config);

        const url = this.unsplashUrl(
          `${this.usersUrl}/${username}/statistics`,
          config
        );

        return this.http.get<UserStatistics>(url, { headers, params });
      })
    );
  }

  private unsplashUrl(url: string, config: UnsplashConfig): string {
    return new URL(
      url,
      config.url.endsWith('/') ? config.url : config.url + '/'
    ).toString();
  }

  private unsplashHeaders(config: UnsplashConfig): HttpHeaders {
    return new HttpHeaders().set('authorization', config.authorization);
  }
}
