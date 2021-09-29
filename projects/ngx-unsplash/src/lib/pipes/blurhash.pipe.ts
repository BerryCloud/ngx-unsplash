import { Pipe, PipeTransform } from '@angular/core';
import { decode } from 'blurhash';
import { Observable } from 'rxjs';
import { Photo } from '../model/photo';

@Pipe({
  name: 'BlurHash',
})
export class BlurHashPipe implements PipeTransform {
  transform(
    photo: Photo,
    size: 'raw' | 'full' | 'regular' | 'small' | 'thumb' = 'thumb'
  ): Observable<string> {
    return new Observable<string>((observer) => {
      // Send URL of blur hash image
      observer.next(this.getImageFromBlurHash(photo).toDataURL());

      const img = new Image();
      img.src = photo.urls[size];
      img.onload = () => {
        // Send URL of loaded image
        observer.next(img.src);
        observer.complete();
      };

      img.onerror = (err) => observer.error(err);
    });
  }

  private getImageFromBlurHash(photo: Photo): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    let width = photo.width || 240;
    let r = width / 240;
    canvas.width = width / r;
    canvas.height = photo.height / r;

    const pixels = decode(photo.blur_hash, canvas.width, canvas.height);

    const ctx = canvas.getContext('2d');
    const imageData = ctx!.createImageData(canvas.width, canvas.height);
    imageData.data.set(pixels);
    ctx!.putImageData(imageData, 0, 0);

    return canvas;
  }
}
