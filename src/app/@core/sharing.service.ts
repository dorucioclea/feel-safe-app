import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Platform } from '@ionic/angular';
import { URL } from '../@shared/url';

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

  public shareRestaurant(id: string) {
    this.share(null, null, URL.restaurantsById(id));
  }
}
