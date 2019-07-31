import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { LegalService } from 'src/app/legal/shared/legal.service';
import { LoginConsentPage } from 'src/app/auth/login-consent/login-consent.page';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public isCordova = true;
  public isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private legalService: LegalService,
    private modalController: ModalController,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength), Validators.required])],
    });
  }

  public ngOnInit() { }

  public async login() {
    if (!this.loginForm.valid || this.isLoading) { return; }

    this.isLoading = true;

    try {
      await this.authService.login({
        email: this.loginForm.get('email').value.toLowerCase(),
        password: this.loginForm.get('password').value,
      });

      this.onLoginSucceeded();
    } catch (error) {
      this.isLoading = false;
      console.error(error);

      return this.onLoginFailed();
    }
  }

  public formIsValid() {
    return this.loginForm.valid;
  }

  public async loginWithProvider(provider: string) {
    const modal = await this.modalController.create({
      component: LoginConsentPage,
    } as ModalOptions);

    await modal.present();

    modal.onWillDismiss().then(async ({ data }) => {
      if (data && data.agreements) {
        this.isLoading = true;

        const user = await this.authService.loginWithProvider(provider);

        if (!user) { return Promise.reject(); }

        for (const agreement of data.agreements) {
          await this.legalService.consentToAgreement(agreement.id, agreement, agreement.type);
        }

        // TODO: handle incomplete users

        this.onLoginSucceeded();
      }
    }).catch();
  }

  public openPasswordResetPage() {
    this.router.navigate(['/password-reset']).catch();
  }

  private onLoginSucceeded() {
    this.isLoading = false;

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.returnUrl) {
        this.router.navigate([queryParams.returnUrl]).catch();

        return;
      }

      this.router.navigate(['/main']).catch();
    });
  }

  private onLoginFailed() {
    // TODO: implement onLoginFailed()
    console.log('TODO: implement onLoginFailed()');
  }
}
