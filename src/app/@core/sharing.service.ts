import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { C } from '../@shared/constants';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  constructor(
    private platform: Platform,
    private socialSharing: SocialSharing,
  ) { }

  public share(subject = null, message = null, url = null) {
    if (!this.platform.is('cordova')) {
      console.log('SHARE', subject, message, url);

      return;
    }

    this.socialSharing.shareWithOptions({
      subject: subject,
      message: message,
      url: url,
    }).catch((error) => {
      console.error(error);
    });
  }

  public shareFab(fabId: string) {
    this.share(null, null, `${C.urls.shareFab}/${fabId}`);
  }
}
