import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from 'src/app/auth/@shared/auth.service';
import { C } from './@shared/constants';
import { DeeplinkService } from 'src/app/@core/deeplink.service';
import { LanguageService } from 'src/app/@core/language.service';
import { PushService } from 'src/app/@core/push.service';
import { TrackingService } from 'src/app/@core/tracking.service';
import { UserService } from 'src/app/user/@shared/user.service';
import { environment } from '../environments/environment';

declare let cordova: any;
declare let window: any;

const SPLASH_TIMEOUT = 3000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public splashImage: string = '';
  public splashImageLoaded: boolean;
  public splashTimeout: any;

  constructor(
    private authService: AuthService,
    private deeplinkService: DeeplinkService,
    private languageService: LanguageService,
    private platform: Platform,
    private pushService: PushService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private trackingService: TrackingService,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  public initializeApp(): void {
    this.handleConsole();

    this.platform.ready().then(async () => {
      this.languageService.initialize();
      this.deeplinkService.initialize();
      
      this.trackingService.initTracking();

      if (this.platform.is('cordova')) {
        window.open = cordova.InAppBrowser.open;

        this.statusBar.styleLightContent();
      }

      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();

        // provide extra css class for low end android devices
        if (C.isLowEndDevice()) {
          document.documentElement.classList.add('low-end');
        }
      }

      this.splashImage = this.getSplashImage(this.platform.width());

      // if onSplashImageLoaded callback hasn't fired
      this.splashTimeout = setTimeout(() => {
        this.onSplashImageLoaded();
      }, SPLASH_TIMEOUT);

      this.pushService.initPush();

      if (this.authService.isAuthenticated()) {
        try {
          await this.userService.refreshCurrentUser();
        } catch (error) {
          console.error(error);
        }
      }
    }).catch(() => {});
  }

  public onSplashImageLoaded(): void {
    clearTimeout(this.splashTimeout);
    this.splashImageLoaded = true;

    if (!this.platform.is('cordova')) { return; }

    // timeout prevents flickering
    const t = 300;
    setTimeout(() => {
      this.splashScreen.hide();
    }, t);
  }

  private handleConsole(): void {
    if (window.localStorage.getItem('PROTO_DEBUG')) { return; }

    let methods: string[] = [];

    switch (environment.name) {
      case 'production':
      case 'staging':
        methods = ['log', 'debug', 'info', 'warn'];
        break;

      default:
        break;
    }

    if (methods.length) {
      console.warn('=====================================================');
      console.warn(' ');
      console.warn(`    🚨 Console output is disabled on ${environment.name}!`);
      console.warn(' ');
      console.warn('=====================================================');
    }

    methods.forEach((method) => {
      console[method] = function(): void { };
    });
  }

  private getSplashImage(width: number): string {
    const WIDTH_IPHONE_5 = 320;
    const WIDTH_ANDROID_DEFAULT = 360;

    // TODO: missing splashscreen for s7 edge (and most probably other devices)

    if (width === WIDTH_IPHONE_5) {
      return './assets/img/splash/Default-568h@2x~iphone.png';
    }

    if (width === WIDTH_ANDROID_DEFAULT) {
      return './assets/img/splash/drawable-port-xhdpi-screen.png';
    }

    return './assets/img/splash/Default-667h.png';
  }
}
