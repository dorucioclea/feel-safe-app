import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';

import { PushService } from 'src/app/@core/push.service';
import { StorageService } from 'src/app/@core/storage.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slider', { static: true }) public slider: IonSlides;

  public slideOptions = {};
  public slides: any[] = [];
  public lastSlideActive = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pushService: PushService,
    private storage: StorageService,
    private translate: TranslateService,
  ) { }

  public ngOnInit() {
    this.translate.get('VIEW.ONBOARDING.SLIDES').subscribe((slides) => {
      this.slides = slides;
    });
  }

  public ionSlideReachEnd() {
    this.lastSlideActive = true;
  }

  public ionSlidePrevStart() {
    this.lastSlideActive = false;
  }

  public skip() {
    this.slider.slideTo(this.slides.length - 1).catch();
  }

  public proceed(allowPush = false) {
    this.storage.set('hasOnboardingRun', true);

    const pushStatus = this.pushService.getPushStatus();
    pushStatus.softPermission = allowPush ? 'allowed' : 'denied';
    this.pushService.setPushStatus(pushStatus);

    this.pushService.initPush().catch();

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.returnUrl) {
        this.router.navigate([queryParams.returnUrl]).catch();

        return;
      }

      this.router.navigate(['/login']).catch();
    });
  }
}
