import { Injectable } from '@angular/core';

import { Events } from 'src/app/@core/event.service';
import { StorageService } from 'src/app/@core/storage.service';

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
    this.events.subscribe('view:enter', (data: any) => {
      this.track('page_view', { page_title: data });
    });
  }

  private track(eventName: string, eventProperties?: any) {
    const isTrackingEnabled = this.storage.get('isTrackingEnabled', false);
    if (!isTrackingEnabled) { return console.warn('Tracking is disabled'); }

    // TODO Implement track function here
    // this.firebase.logEvent(eventName, eventProperties || {})
    //   .then((res: any) => { this.logger.info('log event success', res); })
    //   .catch((res: any) => { this.logger.info('log event error', res); });

    console.info('Tracking', eventName, eventProperties);
  }
}
