import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UnsplashConfig } from 'dist/ngx-unsplash/public-api';
import { UnsplashService, UNSPLASH_CONFIG } from './unsplash.service';

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
