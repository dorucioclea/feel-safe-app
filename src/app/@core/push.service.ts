import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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
  private initialized: boolean = false;
  private token: string;

  constructor(
    private firebase: FirebaseX,
    private http: HttpClient,
    private platform: Platform,
    private storage: StorageService,
    private userService: UserService,
  ) {
    this.platform.resume
      .subscribe(() => {
        this.clearAllNotifications().catch();
      });
  }

  public getPushStatus(): PushStatus {
    const pushStatus: PushStatus = this.storage.get('pushStatus', { softPermission: 'unknown', permission: 'unknown' });

    return pushStatus;
  }

  public setPushStatus(pushStatus: PushStatus): void {
    this.storage.set('pushStatus', pushStatus);
  }

  public async initPush(): Promise<void> {
    if (this.initialized) { return; }

    const pushStatus = this.getPushStatus();

    console.log('check push permissions', pushStatus);

    if (pushStatus.softPermission !== 'allowed' || pushStatus.permission === 'denied') { return; }

    console.log('init push');

    this.initialized = true;

    let hasPermission = await this.firebase.hasPermission();

    if (!hasPermission) {
      hasPermission = await this.firebase.grantPermission();
    }
    
    if (!hasPermission) {
      pushStatus.permission = 'denied';
      this.setPushStatus(pushStatus);

      return;
    }

    pushStatus.permission = 'allowed';
    this.setPushStatus(pushStatus);

    this.firebase.onTokenRefresh()
      .subscribe(async () => {
        const token = await this.firebase.getToken();
        console.log('Got new push token', token);
        this.token = token;

        this.updatePushToken(token);
      });
  }

  public refreshPushToken(): void {
    if (!this.token) { return; }

    this.updatePushToken(this.token);
  }

  private updatePushToken(token: string): Promise<any> {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) { return Promise.resolve(); }

    const url = `${URL.usersById(currentUser.id)}/set-push-token`;

    return this.http.post(url, { token: token })
      .pipe(
        tap(() => {
          console.log('Push token successfully updated!');
        }),
      )
      .toPromise();
  }

  private async clearAllNotifications(): Promise<void> {
    const pushStatus = this.getPushStatus();

    if (pushStatus.softPermission !== 'allowed' || pushStatus.permission === 'denied') { return; }

    const hasPermission = await this.firebase.grantPermission();

    if (!hasPermission) { return; }

    this.firebase.clearAllNotifications().catch();
    this.firebase.setBadgeNumber(0).catch();
  }
}
