import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/auth/@shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { ToastService } from 'src/app/@core/toast.service';
import { UserModel } from 'src/app/user/@shared/user.model';
import { UserService } from 'src/app/user/@shared/user.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-user-delete',
  templateUrl: './user-delete.page.html',
  styleUrls: ['./user-delete.page.scss'],
})
export class UserDeletePage implements OnInit {
  public deleteForm: FormGroup;
  public isLoading: boolean = false;
  public currentUser: UserModel;
  public passwordMinLength: number = C.validation.passwordMinLength;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.deleteForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(C.validation.passwordMinLength)])],
    });
  }

  public ngOnInit(): void { }

  public formIsValid(): boolean {
    return this.deleteForm.valid;
  }

  public async save(): Promise<void> {
    if (this.isLoading) { return; }

    this.isLoading = true;

    try {
      await this.userService.deleteAccount(this.userService.getCurrentUser().email, this.deleteForm.value.password);

      this.isLoading = false;

      this.authService.removeCriticalData();

      this.navController.navigateRoot('/login').then(() => {
        window.location.reload();
      }).catch();
    } catch (error) {
      this.isLoading = false;

      console.error(error);

      if (error.status === C.status.unprocessableEntity) {
        this.toastService.show(this.translate.instant('TOAST.USER_DELETE_ERROR.MESSAGE'), false).catch();

        return;
      }

      this.toastService.show(this.translate.instant('TOAST.GENERIC_ERROR.MESSAGE'), false).catch();
    }
  }
}
