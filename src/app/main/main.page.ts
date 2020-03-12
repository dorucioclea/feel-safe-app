import { RestaurantService } from './../restaurant/@shared/restaurant.service';
import { ScanService } from './../@core/scan.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { ToastService } from 'src/app/@core/toast.service';

export interface Tab {
  tab: string;
  path: string;
  iconSource?: string;
  iconName?: string;
  label: string;
}

const TIME_PERIOD_TO_EXIT = 2000;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
// tslint:disable-next-line
export class MainPage implements OnInit {
  public modalIsOpen: boolean = false;
  public tabs: Tab[] = [
    {
      tab: 'restaurants',
      path: '/main/restaurants',
      iconSource: './assets/icons/list.svg',
      label: 'VIEW.RESTAURANT_LIST.TITLE',
    },
    { 
      tab: 'more',
      path: '/main/more',
      iconName: 'options',
      label: 'VIEW.MORE.TITLE',
    },
  ];

  constructor(
    private navController: NavController,
    private platform: Platform,
    private toastService: ToastService,
    private translate: TranslateService,
    private scanService: ScanService,
    private router: Router,
    private restaurantService:  RestaurantService
  ) {
    this.platform.ready()
      .then(() => { this.handleBackButton(); })
      .catch();
  }

  public ngOnInit(): void {}

  public scan(): void {
    this.modalIsOpen = true;
    
    this.scanService.scan('url-uuid')
      .then(id => {
        this.router.navigate(['main/restaurants', id]);
        this.modalIsOpen = false;
      })
      .catch((err) => {
        this.modalIsOpen = false;
        this.toastService.show(err).catch();
      })

  }

  private isTabPath(path: string): boolean {
    return this.tabs.filter((tab) => tab.path === path).length > 0;
  }

  private handleBackButton(): void {
    if (!this.platform.is('android')) { return; }

    let lastTimeBackPress = 0;
    this.platform.backButton.subscribeWithPriority(0, () => {
      const path = window.location.pathname;
      this.navController.pop()
        .then(() => {

          if (!this.isTabPath(path)) { return; }

          if (new Date().getTime() - lastTimeBackPress < TIME_PERIOD_TO_EXIT) {
            navigator['app'].exitApp();

            return;
          }
          this.showAlert().catch()
          lastTimeBackPress = new Date().getTime();
        })
        .catch((result: any) => { console.warn(result); });
    })
  }

  private showAlert(): any {
    return this.toastService.show(this.translate.instant('TOAST.EXIT_APP.MESSAGE')).catch();
  }
}
