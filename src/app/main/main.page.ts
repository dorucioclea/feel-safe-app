import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs, ModalController, NavController } from '@ionic/angular';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/index';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
// tslint:disable-next-line
export class MainPage implements OnInit {
  @ViewChild('tabs', { static: true }) public tabs: IonTabs;

  public activeTabDisabled = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private nav: NavController,
    private router: Router,
  ) {
  }

  public ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((e: RouterEvent) => {
        if (e instanceof NavigationStart || e instanceof NavigationEnd) {
          const canGoBack = this.tabs.outlet.canGoBack();

          this.activeTabDisabled = !canGoBack;
          // TODO: https://github.com/ionic-team/ionic/issues/18074
        }
      })
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
