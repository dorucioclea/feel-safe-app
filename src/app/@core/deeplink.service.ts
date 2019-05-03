import { Injectable } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeeplinkService {
  constructor(
    private deeplinks: Deeplinks,
  ) { }

  public initialize() {
    this.deeplinks.route({}).subscribe((data) => {
      this.handleDeeplink(data);
    }, (data) => {
      this.handleDeeplink(data);
    });
  }

  public route() {
    return Observable.create((observer) => {
      this.deeplinks.route({}).subscribe((data) => {
        observer.next(data);
      }, (data) => {
        observer.next(data);
      });
    });
  }

  private handleDeeplink(data: any) {
    // TODO: implement deeplink handling
    console.log('Handle deeplink', data);
  }
}
