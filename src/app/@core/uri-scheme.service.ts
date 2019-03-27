import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageService } from './storage.service';

const uriSchemeName = 'uriScheme';

@Injectable({
  providedIn: 'root',
})
export class UriSchemeService {
  public  uriScheme: Observable<any>;

  constructor(
    private storage: StorageService,
  ) {
    this.initWatchUriScheme();
  }

  private initWatchUriScheme() {
    const source = fromEvent(window, uriSchemeName);

    this.uriScheme = source.pipe(
      map(() => {
        const url = localStorage.getItem(uriSchemeName);
        localStorage.removeItem(uriSchemeName);

        return url;
      }),
    );
  }
}
