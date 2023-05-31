import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Photo } from '../public-api';
import {
  UNSPLASH_CONFIG,
  UnsplashConfig,
  UnsplashService,
} from './unsplash.service';

describe('UnsplashService', () => {
  let httpTestingController: HttpTestingController;
  let service: UnsplashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UNSPLASH_CONFIG,
          useValue: {
            url: 'https://example.com',
            authorization: 'Bearer 123',
          } as UnsplashConfig,
        },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UnsplashService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.list', function (done) {
    service
      .list({
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/photos?page=1&per_page=2&order_by=latest'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.get', function (done) {
    service.get('test').subscribe((result) => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/photos/test'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.random', function (done) {
    service.random().subscribe((result) => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/photos/random'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.search', function (done) {
    service
      .search('test', {
        page: 1,
        perPage: 2,
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/search/photos?query=test&page=1&per_page=2'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.download', function (done) {
    service
      .download({
        links: {
          download_location:
            'https://api.unsplash.com/photos/LBI7cgq3pbM/download?ixid=MnwxMTc4ODl8MHwxfHNlYXJjaHwxfHxwdXBweXxlbnwwfHx8fDE2MTc3NTA2MTM',
        },
      } as Photo)
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/photos/LBI7cgq3pbM/download?ixid=MnwxMTc4ODl8MHwxfHNlYXJjaHwxfHxwdXBweXxlbnwwfHx8fDE2MTc3NTA2MTM'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.collections', function (done) {
    service
      .collections({
        page: 1,
        perPage: 2,
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/collections?page=1&per_page=2'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.collection', function (done) {
    service.collection('test').subscribe((result) => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/collections/test'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.collectionPhotos', function (done) {
    service
      .collectionPhotos('test', {
        page: 1,
        perPage: 2,
        orientation: 'landscape',
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/collections/test/photos?page=1&per_page=2&orientation=landscape'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.relatedCollections', function (done) {
    service.relatedCollections('test').subscribe((result) => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/collections/test/related'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.topics', function (done) {
    service
      .topics({
        ids: ['t1', 't2'],
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/topics?ids=t1,t2&page=1&per_page=2&order_by=latest'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.topic', function (done) {
    service.topic('test').subscribe((result) => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/topics/test'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.topicPhotos', function (done) {
    service
      .topicPhotos('test', {
        page: 1,
        perPage: 2,
        orientation: 'landscape',
        orderBy: 'latest',
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/topics/test/photos?page=1&per_page=2&orientation=landscape&order_by=latest'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.user', function (done) {
    service.user('test').subscribe((result) => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/users/test'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.userPortfolio', function (done) {
    service.userPortfolio('test').subscribe((result) => {
      expect(result).toBe('https://example.com/portfolio');
      done();
    });

    const req = httpTestingController.expectOne(
      'https://example.com/users/test/portfolio'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ url: 'https://example.com/portfolio' });
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.userPhotos', function (done) {
    service
      .userPhotos('test', {
        page: 1,
        perPage: 2,
        orderBy: 'latest',
        stats: true,
        resolution: 'days',
        quantity: 1,
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/users/test/photos?page=1&per_page=2&order_by=latest&stats=true&resolution=days&quantity=1'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.userLikes', function (done) {
    service
      .userLikes('test', {
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/users/test/likes?page=1&per_page=2&order_by=latest'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.userCollections', function (done) {
    service
      .userCollections('test', {
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/users/test/collections?page=1&per_page=2&order_by=latest'
    );
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('test @berry-cloud/ngx-unsplash.UnsplashService.userStatistics', function (done) {
    service
      .userStatistics('test', {
        resolution: 'days',
        quantity: 1,
      })
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne(
      'https://example.com/users/test/statistics?resolution=days&quantity=1'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ downloads: { total: 1 } });
  });
});

describe('UnsplashService without configuration url', () => {
  let service: UnsplashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UNSPLASH_CONFIG,
          useValue: {
            authorization: 'Client-ID 123',
          } as UnsplashConfig,
        },
      ],
    });

    service = TestBed.inject(UnsplashService);
  });

  it('should throw error', function (done) {
    service
      .list({
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(
            new Error('Unsplash configuration url undefined')
          );
          done();
        },
      });
  });
});

describe('UnsplashService without configuration authorization', () => {
  let service: UnsplashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UNSPLASH_CONFIG,
          useValue: {
            url: 'https://example.com',
          } as UnsplashConfig,
        },
      ],
    });

    service = TestBed.inject(UnsplashService);
  });

  it('should throw error', function (done) {
    service
      .list({
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(
            new Error('Unsplash configuration authorization undefined')
          );
          done();
        },
      });
  });
});

describe('UnsplashService without configuration', () => {
  let service: UnsplashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UNSPLASH_CONFIG,
          useValue: null,
        },
      ],
    });

    service = TestBed.inject(UnsplashService);
  });

  it('should throw error', function (done) {
    service
      .list({
        page: 1,
        perPage: 2,
        orderBy: 'latest',
      })
      .subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(new Error('Unsplash configuration undefined'));
          done();
        },
      });
  });
});
