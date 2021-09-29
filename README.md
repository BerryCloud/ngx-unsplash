# ngx-unsplash

Lightweight Angular wrapper for the
[Unsplash API](https://unsplash.com/developers).

It can be used to connect to the Unsplash API in a development environment or a
Unsplash Proxy API in a production environment.

It uses the Angular Http Client.

This library is not provided or supported by [Unsplash](https://unsplash.com).

## Installation

```bash
npm i @berry-cloud/ngx-unsplash
```

## Configuration injection

You must provide an UnsplashConfig to be injected into the UnsplashService. The
HttpClientModule must also be imported.

For example:

```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UnsplashConfig, UNSPLASH_CONFIG } from 'ngx-unsplash';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: UNSPLASH_CONFIG,
      useValue: {
        url: 'https://example.com/',
        authorization: 'Client-ID YOUR_ID_HERE',
      } as UnsplashConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Remember to change the url and authorization values for your environment.

The value for the authorization is sent as an authorization header when making
API requests.

NOTE: In a production environment the value of the url should be set to your Unsplash
proxy server.

NOTE: In a production environment the authorization header should not be hardcoded
into the application.

Alternatively you can provide an Observable of an UnsplashConfig which will be
injected into the UnsplashService.

For example:

```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UNSPLASH_CONFIG } from 'ngx-unsplash';
import { map } from 'rxjs/operators';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './user.service';

function unsplashConfigFactory(userService: UserService) {
  return userService.user$.pipe(
      map((user) => ({
        url: 'https://example.com/',
        authorization: `Bearer ${user.authorization}`,
      }))
    );
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: UNSPLASH_CONFIG,
      useFactory: unsplashConfigFactory,
      deps: [UserService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### List

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage
- orderBy

Example:

```TypeScript
export class ListComponent {
  photos: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  list() {
    this.unsplash.list({ perPage: 40 }).subscribe((response) => {
      this.photos = response;
    });
  }
}
```

### Get

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class GetComponent {
  photo: Photo | undefined;

  constructor(private unsplash: UnsplashService) {}

  get(id: string) {
    this.unsplash.get(id).subscribe((response) => {
      this.photo = response;
    });
  }
}
```

### Random

Inject the UnsplashService into the constructor of a component.

Options:

- collections
- topics
- username
- query
- orientation
- contentFilter
- count

Example:

```TypeScript
export class RandomComponent {
  photos: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  random() {
    this.unsplash.random({ count: 10 }).subscribe((response) => {
      this.photos = response;
    });
  }
}
```

### Search

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage
- orderBy
- collections
- contentFilter
- color
- orientation

Example:

```TypeScript
export class SearchComponent {
  photos: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  search(query: string) {
    this.unsplash.search(query, { perPage: 10 }).subscribe((response) => {
      this.photos = response.results;
    });
  }
}
```

### Triggering a download

Example:

```TypeScript
export class DownloadComponent {

constructor(private unsplash: UnsplashService) {}

  download(photo: Photo) {
    this.unsplash.download(photo).subscribe();
  }
}
```

### BlurHash Pipe

Returns a URL of the BlurHash preview and then the URL of photo once the photo been downloaded by the browser.

Parameters:

- size

Example:

```HTML
<div *ngFor="let photo of photos">
  <img [src]="photo | blurhash | async" alt="{{ photo.alt_description }}" />
</div>
```
