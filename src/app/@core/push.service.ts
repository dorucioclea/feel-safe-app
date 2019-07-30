import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StorageService } from 'src/app/@core/storage.service';
import { UserService } from 'src/app/user/shared/user.service';
import { C } from 'src/app/@shared/constants';
import { HttpClient } from '@angular/common/http';

export interface PushStatus {
  softPermission: 'unknown' | 'allowed' | 'denied',
  permission: 'unknown' | 'allowed' | 'denied',
}

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private ngUnsubscribe: Subject<any> = new Subject();
  private pushObject: PushObject;

  constructor(
    private push: Push,
    private http: HttpClient,
    private platform: Platform,
    private storage: StorageService,
    private userService: UserService,
  ) {
    this.platform.resume
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.clearAllNotifications();
      });

    this.userService.currentUser.subscribe((user) => {
      if (!user) { return; }

      this.initPush().catch();
    });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getPushStatus(): PushStatus {
    const pushStatus: PushStatus = this.storage.get('pushStatus', { softPermission: 'unknown', permission: 'unknown' });

    return pushStatus;
  }

  public setPushStatus(pushStatus: PushStatus) {
    this.storage.set('pushStatus', pushStatus);
  }

  public async initPush() {
    const pushStatus = this.getPushStatus();

    console.log('check push permissions', pushStatus);

    if (pushStatus.softPermission !== 'allowed' || pushStatus.permission === 'denied') { return; }

    const options: PushOptions = {
      android: {
        icon: 'pushicon',
        iconColor: '#c31b1d',
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false',
      },
    };

    console.log('init push');

    this.pushObject = this.push.init(options);

    this.pushObject.on('registration').subscribe((registration) => {
      console.log('PUSH REGISTRATION', registration);
      this.updatePushToken(registration.registrationId).catch();
    });
  }

  private updatePushToken(token: string) {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) { return Promise.resolve(); }

    const url = `${C.urls.users}/${currentUser.id}/set-push-token`;

    return this.http.post(url, {token: token })
      .pipe(
        tap(() => {
          console.log('Push token successfully updated!');
        }),
      )
      .toPromise();
  }

  private clearAllNotifications() {
    if (!this.pushObject) { return; }

    this.pushObject.clearAllNotifications().catch();
    this.pushObject.setApplicationIconBadgeNumber(0).catch();
  }
}
