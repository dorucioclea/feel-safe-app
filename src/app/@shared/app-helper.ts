import { C } from './constants';
import { URL } from './url';

export interface ImageSource {
  large: string
  original?: string,
  preload?: string,
  preview?: string,
  largeOriginalRatio?: string,
}

export interface GeoPoint {
  lat: number,
  lng: number,
}

 /* tslint:disable-next-line */
export class AppHelper {
  public static getImage(id: string, width?: number, height?: number | 'auto'): string {
    if (!id) {
      return this.getFallbackImage('fallback_default');
    }
    if (id.includes('fallback')) {
      return this.getFallbackImage(id, width);
    }
    if (!width) {
      return URL.filesDownload(id);
    }
    if (!height) {
      return URL.filesDownload(id, { queryParams: { square: width } });
    }
    if (height === 'auto') {
      return URL.filesDownload(id, { queryParams: { width } });
    }

    return URL.filesDownload(id, { queryParams: { width, height } });
  }

  private static getFallbackImage(id: string, width?: number): string {
    let key: string = id.substring(id.indexOf('_') + 1);

    if (!key || !C.imageFallback[key]) {
      key = 'default';
    }
    if (!width || width > C.imageSizes.preload) {
      return C.imageFallback[key].large;
    }

    return C.imageFallback[key].preload;
  }
}
