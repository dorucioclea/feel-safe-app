import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { UserService } from 'src/app/user/shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  public initializeApp() {
    this.handleConsole();

    this.platform.ready().then(async () => {
      this.setTranslateConfig();
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.authService.isAuthenticated()) {
        try {
          await this.userService.refreshCurrentUser();
        } catch (error) {
          console.error(error);
        }
      }
    }).catch();
  }

  private setTranslateConfig() {
    let lang = navigator.language.split('-')[0];
    lang = /(de|en)/gi.test(lang) ? lang : 'de';

    this.translate.setDefaultLang('de');
    // We don't need language switch for this project yet
    // this.translate.use(lang);
    this.translate.use('de');
  }

  private handleConsole() {
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
      console[method] = function () { };
    });
  }
}
