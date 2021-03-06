import { Injectable } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DeeplinkService {
  constructor(
    private deeplinks: Deeplinks,
    private navController: NavController,
  ) { }

  public initialize(): void {
    console.log('INIT DEEPLINKS');
    this.deeplinks.route({}).subscribe((data) => {
      this.handleDeeplink(data);
    }, (data) => {
      this.handleDeeplink(data);
    });
  }

  public route(): Observable<any> {
    return new Observable((observer) => {
      this.deeplinks.route({}).subscribe((data) => {
        observer.next(data);
      }, (data) => {
        observer.next(data);
      });
    });
  }

  private handleDeeplink(data: any): void {
    // TODO: implement deeplink handling
    console.log('Handle deeplink', data);

    if (typeof data === 'string') { return; } 

    if (data.$link.path.indexOf('/password-reset') > -1) {
      const parts = data.$link.path.split('/');

      this.navController.navigateRoot(['/password-reset', parts[parts.length - 1]]).catch();

      return;
    }

    if (data.$link.path.indexOf('/restaurants') > -1) {
      const parts = data.$link.path.split('/');

      this.navController.navigateRoot(['/main/restaurants', parts[parts.length - 1]]).catch();

      return;
    }
  }
}
