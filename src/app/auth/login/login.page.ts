import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../shared/auth.service';
import { C } from '../../@shared/constants';

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
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength), Validators.required])],
    });
  }

  public ngOnInit() { }

  public login() {
    if (!this.loginForm.valid || this.isLoading) { return; }
    
    this.isLoading = true;

    this.authService.login({
      email: this.loginForm.get('email').value.toLowerCase(),
      password: this.loginForm.get('password').value,
    }).then(() => {
      return this.onLoginSucceeded();
    }, () => {
      this.isLoading = false;

      return this.onLoginFailed();
    }).catch(() => {
      this.isLoading = false;
    });
  }

  public formIsValid() {
    return this.loginForm.valid;
  }

  public loginWithFacebook() {
    this.authService.loginWithFacebook().then((user) => {
      this.onLoginSucceeded();
    }).catch();
  }

  public loginWithTwitter() {
    this.authService.loginWithTwitter().then((user) => {
      if (!user) { return; }

      if (user.profileIsIncomplete) {
        this.router.navigate(['/user-edit'], { queryParams: { returnUrl: '/main' } }).catch();

        return;
      }

      this.onLoginSucceeded();
    }).catch();
  }

  private onLoginSucceeded() {
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
