import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AgreementModel } from 'src/app/legal/@shared/agreement.model';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LegalService } from 'src/app/legal/@shared/legal.service';
import { PageTrack } from 'src/app/@shared/page-track.decorator';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-login-consent',
  templateUrl: './login-consent.page.html',
  styleUrls: ['./login-consent.page.scss'],
})
export class LoginConsentPage implements OnInit {
  public loginConsentForm: FormGroup;
  public agreements: { [key: string]: AgreementModel };
  public initialized = false;
  public isLoading: boolean;
  public firstLoadFinished = false;

  constructor(
    private formBuilder: FormBuilder,
    private legalService: LegalService,
    private modalController: ModalController,
  ) {
    this.loginConsentForm = this.formBuilder.group({
      privacyConsent: [false],
      termsConsent: [false],
    });
  }

  public ngOnInit() {}

  public ionViewDidEnter() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.loadAgreements().catch();
  }

  public formIsValid() {
    return this.loginConsentForm.valid && this.consentsValid();
  }

  public consentsValid() {
    return this.loginConsentForm.value.termsConsent && this.loginConsentForm.value.privacyConsent;
  }

  public consent() {
    this.close({ agreements: Object.values(this.agreements) });
  }

  public close(data = {}) {
    this.modalController.dismiss(data).catch();
  }

  private async loadAgreements() {
    try {
      this.isLoading = true;

      const agreements = await Promise.all([
        this.legalService.getLatestAgreement('terms').toPromise(),
        this.legalService.getLatestAgreement('privacy').toPromise(),
      ]);

      this.agreements = {
        terms: agreements[0],
        privacy: agreements[1],
      };

      this.isLoading = false;
      this.firstLoadFinished = true;
    } catch (error) {
      console.error(error);
    }
  }
}
