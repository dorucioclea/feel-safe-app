import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/@shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { ToastService } from 'src/app/@core/toast.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  public requestForm: FormGroup;
  public resetForm: FormGroup;
  public isLoading: boolean = false;
  public showRequestSuccessMessage: boolean = false;
  public showResetSuccessMessage: boolean = false;
  public token: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.requestForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
    });

    this.resetForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength), Validators.required])],
    });
  }

  public ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.params.token;
  }

  public requestFormIsValid(): boolean {
    return this.requestForm.valid;
  }

  public resetFormIsValid(): boolean {
    return this.resetForm.valid;
  }

  public sendRequest(): void {
    if (!this.requestFormIsValid()) { return; }

    this.isLoading = true;

    this.authService.requestPasswordReset(this.requestForm.value.email).then(() => {
      this.isLoading = false;
      this.showRequestSuccessMessage = true;
    }).catch((error) => {
      console.error(error);
      this.onSubmitFailed(this.translate.instant('TOAST.EMAIL_NOT_FOUND.MESSAGE'));
      this.isLoading = false;
    });
  }

  public reset(): void {
    if (!this.resetFormIsValid()) { return; }

    this.isLoading = true;

    this.authService.resetPassword(this.token, this.resetForm.value.password).then(() => {
      this.isLoading = false;
      this.showResetSuccessMessage = true;
    }).catch((error) => {
      console.error(error);
      this.onSubmitFailed(this.translate.instant('TOAST.PASSWORD_RESET.MESSAGE'));
      this.isLoading = false;
    });
  }

  private onSubmitFailed(message: string): void {
    this.toastService.show(message, false).catch();
  }
}
