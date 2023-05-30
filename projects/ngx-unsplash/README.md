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

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class DownloadComponent {

constructor(private unsplash: UnsplashService) {}

  download(photo: Photo) {
    this.unsplash.download(photo).subscribe();
  }
}
```

### List Collections

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage

Example:

```TypeScript
export class ListCollections {
  collections: Collection[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  collections() {
    this.unsplash.collections({ perPage: 10 }).subscribe((response) => {
      this.collections = response.results;
    });
  }
}
```

### Get a Collection by id

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class GetCollection {
  collection: Collection | undefined;

  constructor(private unsplash: UnsplashService) {}

  collection(id: string) {
    this.unsplash.collection(id).subscribe((response) => {
      this.collection = response.results;
    });
  }
}
```

### Get a collection's photos

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage
- orientation

Example:

```TypeScript
export class getCollectionPhotos {
  collectionPhotos: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  collectionPhotos(id: string) {
    this.unsplash.collectionPhotos(id, { perPage: 10 }).subscribe((response) => {
      this.collectionPhotos = response.results;
    });
  }
}
```

### List Related Collections

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class ListRelatedCollections {
  relatedCollections: Collection[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  relatedCollections(id: string) {
    this.unsplash.relatedCollections(id).subscribe((response) => {
      this.relatedCollections = response.results;
    });
  }
}
```

### List Topics

Inject the UnsplashService into the constructor of a component.

Options:

- ids
- page
- perPage
- orderBy

Example:

```TypeScript
export class ListTopics {
  topics: Topic[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  topics() {
    this.unsplash.topics({ perPage: 10 }).subscribe((response) => {
      this.topics = response.results;
    });
  }
}
```

### Get a Topic by id

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class GetTopic {
  topic: Topic | undefined;

  constructor(private unsplash: UnsplashService) {}

  topic(id: string) {
    this.unsplash.topic(id).subscribe((response) => {
      this.topic = response.results;
    });
  }
}
```

### Get a Topic's Photos

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class GetTopicPhotos {
  topicPhotos: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  topicPhotos(id: string) {
    this.unsplash.topicPhotos(id).subscribe((response) => {
      this.topicPhotos = response.results;
    });
  }
}
```

### Get a User's Public Profile

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class GetUser {
  user: User | undefined;

  constructor(private unsplash: UnsplashService) {}

  user(username: string) {
    this.unsplash.user(username).subscribe((response) => {
      this.user = response.results;
    });
  }
}
```

### Get a User's Portfolio Link

Inject the UnsplashService into the constructor of a component.

Example:

```TypeScript
export class GetUserPortfolio {
  url: string | undefined;

  constructor(private unsplash: UnsplashService) {}

  userPortfolio(username: string) {
    this.unsplash.userPortfolio(username).subscribe((response) => {
      this.url = response.results;
    });
  }
}
```

### List a User’s Photos

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage
- orderBy
- stats
- resolution
- quantity
- orientation

Example:

```TypeScript
export class ListUserPhotos {
  userPhotos: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  userPhotos(username: string) {
    this.unsplash.userPhotos(username, { perPage: 10 }).subscribe((response) => {
      this.userPhotos = response.results;
    });
  }
}
```

### List a User’s Liked Photos

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage
- orderBy
- orientation

Example:

```TypeScript
export class ListUserLikedPhotos {
  userLikes: Photo[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  userLikes(username: string) {
    this.unsplash.userLikes(username, { perPage: 10 }).subscribe((response) => {
      this.userLikes = response.results;
    });
  }
}
```

### List a User’s Collections

Inject the UnsplashService into the constructor of a component.

Options:

- page
- perPage

Example:

```TypeScript
export class ListUserCollections {
  userCollections: Collection[] | undefined;

  constructor(private unsplash: UnsplashService) {}

  userCollections(username: string) {
    this.unsplash.userCollections(username, { perPage: 10 }).subscribe((response) => {
      this.userCollections = response.results;
    });
  }
}
```

### Get a User’s Statistics

Inject the UnsplashService into the constructor of a component.

Options:

- resolution
- quantity

Example:

```TypeScript
export class GetUserStatistics {
  userStatistics: UserStatistics | undefined ;

  constructor(private unsplash: UnsplashService) {}

  userStatistics(username: string) {
    this.unsplash.userStatistics(username, { perPage: 10 }).subscribe((response) => {
      this.userStatistics = response.results;
    });
  }
}
```

### BlurHash Pipe

Returns a URL of the BlurHash preview and then the URL of photo once the photo
been downloaded by the browser.

Parameters:

- size

Example:

```HTML
<div *ngFor="let photo of photos">
  <img [src]="photo | blurhash | async" alt="{{ photo.alt_description }}" />
</div>
```
