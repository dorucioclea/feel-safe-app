import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LanguageService } from 'src/app/@core/language.service';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { PushService } from 'src/app/@core/push.service';
import { StorageService } from 'src/app/@core/storage.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slider', { static: true }) public slider: IonSlides;

  public slideOptions: any = {};
  public slides: any[] = [];
  public firstSlideActive: boolean = true;
  public lastSlideActive: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private navController: NavController,
    private pushService: PushService,
    private storage: StorageService,
  ) { }

  public ngOnInit(): void {
    this.languageService.getTranslation('VIEW.ONBOARDING.SLIDES').subscribe((slides) => {
      this.slides = slides;
    });
  }

  public ionViewDidLeave(): void {
    this.lastSlideActive = false;
    this.slider.length().then(() => {
      this.slider.slideTo(0).catch();
    }).catch();
  }

  public ionSlideWillChange(): void {
    this.slider.getActiveIndex().then((index: number) => {
      this.firstSlideActive = index === 0;
      this.lastSlideActive = index === this.slides.length - 1;
    }).catch();
  }

  public skip(): void {
    this.slider.length().then((length: number) => {
      this.slider.slideTo(length - 1).catch();
    }).catch();
  }

  public prev(): void {
    this.slider.slidePrev().catch();
  }

  public next(): void {
    if (!this.lastSlideActive) {
      this.slider.slideNext().catch();

      return;
    }

    this.proceed(true);
  }

  public proceed(allowPush: boolean = false): void {
    this.storage.set('hasOnboardingRun', true);

    const pushStatus = this.pushService.getPushStatus();
    pushStatus.softPermission = allowPush ? 'allowed' : 'denied';
    this.pushService.setPushStatus(pushStatus);

    this.pushService.initPush();

    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.returnUrl) {
      this.navController.navigateForward([queryParams.returnUrl]).catch();

      return;
    }

    this.navController.navigateForward(['/login']).catch();
  }
}
