import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { AgreementModel } from 'src/app/legal/shared/agreement.model';
import { AgreementPage } from 'src/app/legal/agreement/agreement.page';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { LegalService } from 'src/app/legal/shared/legal.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public emailTaken = false;
  public isLoading = false;
  public agreements: { [key: string]: AgreementModel };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private legalService: LegalService,
    private modalController: ModalController,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(C.validation.passwordMinLength)])],
      privacyConsent: [false],
      termsConsent: [false],
    });
  }

  public ngOnInit() {
    this.loadAgreements().catch();
  }

  public register() {
    if (!this.registerForm.valid || this.isLoading) { return; }

    this.isLoading = true;

    const registerData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email.toLowerCase(),
      password: this.registerForm.value.password,
      consents: {
        privacy: this.agreements.privacy,
        terms: this.agreements.terms,
      },
    };

    this.authService.register(registerData).then(() => {
      return this.onRegistrationSucceeded();
    }, (err) => {
      return this.onRegistrationFailed(err);
    }).catch(() => {
      this.isLoading = false;
    });
  }

  public formIsValid() {
    return this.registerForm.valid && this.consentsValid();
  }

  public consentsValid() {
    return this.registerForm.value.termsConsent && this.registerForm.value.privacyConsent;
  }

  public async openAgreement(type: string) {
    const modal = await this.modalController.create({
      component: AgreementPage,
      componentProps: {
        type: type,
        agreement: this.agreements[type],
      },
    });

    return await modal.present();
  }

  private onRegistrationSucceeded() {
    // TODO:
    // this.navController.setRoot('TabsPage', null, { animate: true, direction: 'left' }).then(() => {
    //   this.isLoading = false;
    //   this.showToast(this.translate.instant('TOAST.REGISTER_SUCCESS'), true);
    // }).catch(() => {
    //   this.isLoading = false;
    // });
  }

  private onRegistrationFailed(err: any) {
    this.isLoading = false;
    // TODO:
    // let message = this.translate.instant('TOAST.REGISTER_ERROR');
    // if (err && err.status === C.status.unprocessableEntity) {
    //   message = this.getUnprocessableEntityMessage(err);
    // }

    // this.showToast(message, false);
  }

  // TODO:
  // private getUnprocessableEntityMessage(data: any): string {
  //   const errorData = data.error ? data.error.error : data;

  //   if (errorData && errorData.message.includes('Email already exists')) {
  //     this.emailTaken = true;

  //     return this.translate.instant('TOAST.EMAIL_ALREADY_TAKEN');
  //   }

  //   return this.translate.instant('TOAST.REGISTER_ERROR');
  // }

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
    } catch (error) {
      console.error(error);
    }
  }
}
