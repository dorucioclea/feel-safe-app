import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../shared/auth.service';
import { C } from '../../@shared/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public emailTaken = false;
  public isLoading = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(C.validation.passwordMinLength)])],
      privacyConsent: [false],
      termsConsent: [false],
    });
  }

  public ngOnInit() { }

  public register() {
    if (!this.registerForm.valid || this.isLoading) { return; }

    this.isLoading = true;

    const registerData = {
      email: this.registerForm.value.email.toLowerCase(),
      password: this.registerForm.value.password,
      consents: {
        // TODO: add privacy shizzle
        // privacy: this.privacyAgreement,
        // terms: this.termsAgreement,
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

  private getUnprocessableEntityMessage(data: any): string {
    const errorData = data.error ? data.error.error : data;

    if (errorData && errorData.message.includes('Email already exists')) {
      this.emailTaken = true;

      return this.translate.instant('TOAST.EMAIL_ALREADY_TAKEN');
    }

    return this.translate.instant('TOAST.REGISTER_ERROR');
  }
}
