import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Download } from './model/download';
import { Photo } from './model/photo';
import { SearchResult } from './model/search-result';

export interface UnsplashConfig {
  url: string;
  authorization: string;
}

export const UNSPLASH_CONFIG = new InjectionToken<UnsplashConfig>(
  'unsplash.config'
);

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private readonly searchUrl = 'search/photos';
  private config?: UnsplashConfig;

  constructor(
    private http: HttpClient,
    @Inject(UNSPLASH_CONFIG)
    config: UnsplashConfig | Observable<UnsplashConfig>
  ) {
    if (config instanceof Observable) {
      config.subscribe((config) => (this.config = config));
    } else {
      this.config = config;
    }
  }

  search(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
      orderBy?: 'latest' | 'relevant';
      collections?: string;
      contentFilter?: 'low' | 'high';
      color?:
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
      orientation?: 'landscape' | 'portrait' | 'squarish';
    }
  ): Observable<SearchResult> {
    if (!this.config) {
      throw new Error('Unsplash configuration undefined');
    }

    let headers = new HttpHeaders().set(
      'authorization',
      this.config.authorization
    );

    const url = new URL(
      this.searchUrl,
      this.config.url.endsWith('/') ? this.config.url : this.config.url + '/'
    ).toString();

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

    return this.http.get<SearchResult>(url, { headers, params });
  }

  /**
   * [Trigger a download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download)
   * of a photo.
   *
   * @param photo to download
   * @returns Observable containing the [[Download]]
   */
  download(photo: Photo): Observable<Download> {
    if (!this.config) {
      throw new Error('Unsplash configuration undefined');
    }

    let headers = new HttpHeaders().set(
      'authorization',
      this.config.authorization
    );

    return this.http.get<Download>(photo.links.download_location, { headers });
  }
}
