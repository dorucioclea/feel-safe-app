import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

const CHECK_DURATION: number = 2000;

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private checkDuration: number = CHECK_DURATION;
  private connectSubscription: Subscription;
  private disconnectSubscription: Subscription;
  private networkTimeout: any;

  constructor(
    private network: Network,
    private platform: Platform,
  ) {
    this.platform.ready().then(() => {
      this.initWatcher();
      this.subscribeOnResume();
      this.unsubscribeOnPause();
      this.checkNetwork();
    }).catch((error) => {
      console.error(error);
    });
  }

  public initWatcher(): void {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(this.onDisconnected.bind(this));
    this.connectSubscription = this.network.onConnect().subscribe(this.onConnected.bind(this));
  }

  public destroyWatcher(): void {
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
    clearTimeout(this.networkTimeout);
  }

  private checkNetwork(): void {
    this.networkTimeout = setTimeout(() => {
      if (this.platform.is('cordova') && this.network.type === 'none') {
        // TODO: show toast
        console.info('offline');

        return;
      }
      // TODO: hide toast
      console.info('connected');
    }, this.checkDuration);
  }

  private onDisconnected(): void {
    // we don't want to open the offline modal immediately
    // to prevent edge cases like losing wifi and switch to mobile connection
    // which would also trigger the offline state for a short time
    this.networkTimeout = setTimeout(() => {
      // TODO: show toast
      console.info('offline');
    }, this.checkDuration);
  }

  private onConnected(): void {
    clearTimeout(this.networkTimeout);
    // TODO: hide toast
    console.info('connected');
  }

  private subscribeOnResume(): void {
    this.platform.resume.subscribe(() => {
      this.initWatcher();
      this.checkNetwork();
    });
  }

  private unsubscribeOnPause(): void {
    this.platform.pause.subscribe(() => {
      this.destroyWatcher();
    });
  }
}
