import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/auth/@shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-more-menu',
  templateUrl: './more-menu.page.html',
  styleUrls: ['./more-menu.page.scss'],
})
export class MoreMenuPage implements OnInit {
  public onboardingReturnUrl: string;
  public showLanguageSwitcher: boolean = false;

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private navController: NavController,
    private router: Router,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
  ) { }

  public ngOnInit(): void {
    this.onboardingReturnUrl = this.router.routerState.snapshot.url;

    this.showLanguageSwitcher = C.availableLanguages.length > 1;
  }

  public async logout(): Promise<void> {
    const confirmation = await this.confirmLogout();

    if (!confirmation) { return; }

    this.splashScreen.show();
    this.authService.logout().then(() => {
      this.navController.navigateRoot('/login').then(() => {
        window.location.reload();
      }).catch();
    }).catch();
  }

  private confirmLogout(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: this.translate.instant('ALERT.LOGOUT.HEADER'),
        message: this.translate.instant('ALERT.LOGOUT.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: (): void => {
              return resolve(false);
            },
          }, {
            text: this.translate.instant('BUTTON.OK'),
            handler: (): void => {
              return resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }
}
