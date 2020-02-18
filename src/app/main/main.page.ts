import { ToastService } from './../@core/toast.service';
import { NavController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

export interface Tab {
  tab: string,
  path: string,
  iconSource?: string,
  iconName?: string,
  label: string,
}

const TIME_PERIOD_TO_EXIT = 2000;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
// tslint:disable-next-line
export class MainPage implements OnInit {

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
  ) {
    this.platform.ready()
      .then(() => { this.handleBackButton(); })
      .catch();
  }

  public ngOnInit() {}

  private isTabPath(path: string) {

    return this.tabs.filter((tab) => tab.path === path).length > 0;
  }

  private handleBackButton() {

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

        this.toastService.show('Press back again to exit App').catch();
        lastTimeBackPress = new Date().getTime();
      })
      .catch((result: any) => { console.warn(result); });
    })
  }

}
