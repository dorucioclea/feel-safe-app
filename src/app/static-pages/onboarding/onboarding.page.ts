import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';

import { StorageService } from '../../@core/storage.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slider') public slider: IonSlides;

  public slideOptions = {};
  public slides: any[] = [];
  public lastSlideActive = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

  public proceed() {
    this.storage.set('hasOnboardingRun', true);

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.returnUrl) {
        this.router.navigate([queryParams.returnUrl]).catch();

        return;
      }

      this.router.navigate(['/login']).catch();
    });
  }
}
