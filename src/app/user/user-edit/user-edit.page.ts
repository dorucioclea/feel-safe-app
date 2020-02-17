import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { ToastService } from 'src/app/@core/toast.service';
import { UserModel } from 'src/app/user/@shared/user.model';
import { UserService } from 'src/app/user/@shared/user.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  public editForm: FormGroup;
  public isLoading = false;
  public currentUser: UserModel;
  public passwordMinLength = C.validation.passwordMinLength;

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.editForm = this.formBuilder.group({
      avatarId: [''],
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      newPassword: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength)])],
    });
  }

  public ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }

  public ionViewDidEnter() {
    this.editForm.patchValue({
      avatarId: this.currentUser.avatarId,
      username: this.currentUser.username,
      email: this.currentUser.email,
    });
  }

  public updateAvatar(id: string) {
    console.log(id);
    this.editForm.patchValue({ avatarId: id });
  }

  public formIsValid() {
    return this.editForm.valid;
  }

  public async save() {
    if (this.isLoading) { return; }

    this.isLoading = true;

    const userAttributes: any = {
      username: this.editForm.value.username,
      email: this.editForm.value.email,
      avatar: this.editForm.value.avatarId,
    };

    if (this.editForm.value.newPassword) {
      userAttributes.password = this.editForm.value.newPassword;
    }

    try {
      this.currentUser = await this.userService.updateUserAttributes(userAttributes);
      this.navController.back();
      this.toastService.show(this.translate.instant('TOAST.SAVE_SUCCESS.MESSAGE'), true).catch();
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.toastService.show(this.translate.instant('TOAST.SAVE_ERROR.MESSAGE'), false).catch();
      this.isLoading = false;
    }
  }
}
