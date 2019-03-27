import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

import { C } from '../@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class InAppBrowserService {
  constructor(
    private platform: Platform,
    private safariViewController: SafariViewController,
  ) { }

  public openUrl(url: string) {
    if (!this.platform.is('cordova')) {
      return window.open(url, '_system');
    }
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: url,
            tintColor: C.colors.primary,
          })
            .subscribe((result: any) => {
              /* tslint:disable-next-line */
              console.info(result);
            }, (error: any) => {
              /* tslint:disable-next-line */
              console.error(error)
            });
        } else {
          // fallback browser
          window.open(url, '_system');
        }
      }).catch((error) => {
        /* tslint:disable-next-line */
        console.error(error);
      });
  }

  public hide() {
    if (this.platform.is('ios')) {
      this.safariViewController.hide().catch((error) => {
        console.error(error);
      });
    }
  }
}
