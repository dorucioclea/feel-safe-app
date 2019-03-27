import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(
    private events: Events,
    private storage: StorageService,
  ) { }

  public initTracking() {
    let appStarts = this.storage.get('appStarts', 0);

    if (appStarts === 0) {
      this.storage.set('firstVisit', new Date().toISOString());
      this.track('firstVisit');
    }

    this.storage.set('lastVisit', new Date().toISOString());
    this.storage.set('appStarts', ++appStarts);

    this.track('appStart', { appStarts: appStarts });

    this.bindEvents();
  }

  private bindEvents() {
    this.events.subscribe('viewOnboarding', () => {
      this.track('viewOnboarding');
    });
  }

  private track(eventName: string, eventProperties?: any) {
    const isTrackingDisabled = this.storage.get('isTrackingDisabled', false);
    if (isTrackingDisabled) { return console.warn('Tracking is disabled'); }

    // TODO Implement track function here
    // this.firebase.logEvent(eventName, eventProperties || {})
    //   .then((res: any) => { this.logger.info('log event success', res); })
    //   .catch((res: any) => { this.logger.info('log event error', res); });

    console.info('Tracking', eventName, eventProperties);
  }
}
