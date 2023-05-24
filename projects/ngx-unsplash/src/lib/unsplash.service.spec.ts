import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  UNSPLASH_CONFIG,
  UnsplashConfig,
  UnsplashService,
} from './unsplash.service';

describe('UnsplashService', () => {
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
    service = TestBed.inject(UnsplashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
