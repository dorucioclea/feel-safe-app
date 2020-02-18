import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { StorageService } from 'src/app/@core/storage.service';
import { URL } from 'src/app/@shared/url';
import { UserService } from 'src/app/user/@shared/user.service';

export interface PushStatus {
  softPermission: 'unknown' | 'allowed' | 'denied';
  permission: 'unknown' | 'allowed' | 'denied';
}

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private pushObject: PushObject;
  private initialized: boolean = false;

  constructor(
    private push: Push,
    private http: HttpClient,
    private platform: Platform,
    private storage: StorageService,
    private userService: UserService,
  ) {
    this.platform.resume
      .subscribe(() => {
        this.clearAllNotifications();
      });

    this.userService.currentUser.subscribe((user) => {
      if (!user) { return; }

      this.initPush();
    });
  }

  public getPushStatus(): PushStatus {
    const pushStatus: PushStatus = this.storage.get('pushStatus', { softPermission: 'unknown', permission: 'unknown' });

    return pushStatus;
  }

  public setPushStatus(pushStatus: PushStatus): void {
    this.storage.set('pushStatus', pushStatus);
  }

  public initPush(): void {
    if (this.initialized) { return; }

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

    this.initialized = true;

    this.pushObject = this.push.init(options);

    this.pushObject.on('registration').subscribe((registration) => {
      console.log('PUSH REGISTRATION', registration);
      this.updatePushToken(registration.registrationId);
    });
  }

  private updatePushToken(token: string): Promise<any> {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) { return Promise.resolve(); }

    return this.http.post(URL.usersSetPushToken(currentUser.id), { token: token })
      .pipe(
        tap(() => {
          console.log('Push token successfully updated!');
        }),
      )
      .toPromise();
  }

  private clearAllNotifications(): void {
    if (!this.pushObject) { return; }

    this.pushObject.clearAllNotifications().catch();
    this.pushObject.setApplicationIconBadgeNumber(0).catch();
  }
}
