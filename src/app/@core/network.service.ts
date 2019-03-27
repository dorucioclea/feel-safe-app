import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private checkDuration = 2000;
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

  public initWatcher() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(this.onDisconnected.bind(this));
    this.connectSubscription = this.network.onConnect().subscribe(this.onConnected.bind(this));
  }

  public destroyWatcher() {
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
    clearTimeout(this.networkTimeout);
  }

  private checkNetwork() {
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

  private onDisconnected() {
    // we don't want to open the offline modal immediately
    // to prevent edge cases like losing wifi and switch to mobile connection
    // which would also trigger the offline state for a short time
    this.networkTimeout = setTimeout(() => {
      // TODO: show toast
      console.info('offline');
    }, this.checkDuration);
  }

  private onConnected() {
    clearTimeout(this.networkTimeout);
    // TODO: hide toast
    console.info('connected');
  }

  private subscribeOnResume() {
    this.platform.resume.subscribe(() => {
      this.initWatcher();
      this.checkNetwork();
    });
  }

  private unsubscribeOnPause() {
    this.platform.pause.subscribe(() => {
      this.destroyWatcher();
    });
  }
}
