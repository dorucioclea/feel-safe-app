import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/auth/@shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LegalService } from 'src/app/legal/@shared/legal.service';
import { LoginConsentPage } from 'src/app/auth/login-consent/login-consent.page';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { PushService } from 'src/app/@core/push.service';
import { ToastService } from 'src/app/@core/toast.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private legalService: LegalService,
    private modalController: ModalController,
    private navController: NavController,
    private pushService: PushService,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.required],
    });
  }

  public ngOnInit(): void { }

  public async login(): Promise<void> {
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

  public formIsValid(): boolean {
    return this.loginForm.valid;
  }

  public async loginWithProvider(provider: string): Promise<void> {
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

  private onLoginSucceeded(): void {
    this.isLoading = false;

    this.pushService.refreshPushToken();

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.returnUrl) {
        this.navController.navigateRoot(queryParams.returnUrl).catch();

        return;
      }

      this.navController.navigateRoot('/main').catch();
    });
  }

  private onLoginFailed(): void {
    const message = this.translate.instant('TOAST.LOGIN_ERROR.MESSAGE');
    this.toastService.show(message, false).catch();
  }
}
