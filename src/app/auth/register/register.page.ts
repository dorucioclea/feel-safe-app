import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AgreementModel } from 'src/app/legal/@shared/agreement.model';
import { AuthService } from 'src/app/auth/@shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LegalService } from 'src/app/legal/@shared/legal.service';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { ToastService } from 'src/app/@core/toast.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public emailTaken: boolean = false;
  public isLoading: boolean = false;
  public agreements: { [key: string]: AgreementModel };
  public passwordMinLength: number = C.validation.passwordMinLength;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private legalService: LegalService,
    private modalController: ModalController,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(C.validation.passwordMinLength)])],
      privacyConsent: [false],
      termsConsent: [false],
    });
  }

  public ngOnInit(): void {
    this.loadAgreements().catch();
  }

  public register(): void {
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
      this.toastService.show(this.translate.instant('TOAST.GENERIC_ERROR.MESSAGE'), false).catch();
    });
  }

  public formIsValid(): boolean {
    return this.registerForm.valid && this.consentsValid();
  }

  public consentsValid(): boolean {
    return this.registerForm.value.termsConsent && this.registerForm.value.privacyConsent;
  }

  private onRegistrationSucceeded(): void {
    this.isLoading = false;
    this.navController.navigateRoot('/main')
      .then(() => {
        this.toastService.show(this.translate.instant('TOAST.REGISTER_SUCCESS.MESSAGE'), true).catch();
      })
      .catch();
  }

  private onRegistrationFailed(err: any): void | Promise<void> {
    this.isLoading = false;

    if (err && err.status === C.status.unprocessableEntity &&
      this.getUnprocessableEntityMessage(err).includes('Email already exists')) {
      this.emailTaken = true;

      return this.toastService.show(this.translate.instant('TOAST.EMAIL_EXISTS.MESSAGE'), false).catch();
    }

    this.toastService.show(this.translate.instant('TOAST.GENERIC_ERROR.MESSAGE'), false).catch();
  }

  private getUnprocessableEntityMessage(data: any): string {
    try {
      return data.error.error.message;
    } catch (catchErr) {
      return '';
    };
  }

  private async loadAgreements(): Promise<void> {
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
