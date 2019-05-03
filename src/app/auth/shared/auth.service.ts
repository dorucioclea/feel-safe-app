import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
import { tap, takeUntil } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { C } from 'src/app/@shared/constants';
import { DeeplinkService } from 'src/app/@core/deeplink.service';
import { DynamicScriptLoaderService } from 'src/app/@core/dynamic-script-loader.service';
import { StorageService } from 'src/app/@core/storage.service';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/user/shared/user.service';
import { UserSource, UserModel } from 'src/app/user/shared/user.model';
import { environment } from 'src/environments/environment';

declare var FB: any;

export interface LoginData {
  email: string,
  password: string,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private inAppBrowser: InAppBrowser,
    private deeplinkService: DeeplinkService,
    private dynamicScriptLoaderService: DynamicScriptLoaderService,
    private facebook: Facebook,
    private http: HttpClient,
    private platform: Platform,
    private storage: StorageService,
    private userService: UserService,
  ) { }

  public getAccessToken() {
    return this.storage.get('accessToken', null);
  }

  public isAuthenticated() {
    return !!this.getAccessToken();
  }

  public register(registerData: any) {
    const url = `${C.urls.url}/users`;

    return new Promise((resolve, reject) => {
      this.http.post(url, registerData).subscribe(() => {
        const loginData = {
          email: registerData.email,
          password: registerData.password,
        }

        this.login(loginData).then((accessToken) => {
          resolve(accessToken);
        }).catch();
      }, (error) => {
        reject(error);
      });
    });
  }

  public login(loginData: any) {
    const url = `${C.urls.url}/users/login?include=user`;

    return new Promise((resolve, reject) => {
      this.http.post(url, loginData).subscribe((response: any) => {
        const accessToken = Object.assign({}, response);
        const user = response.user;

        delete accessToken.user;

        this.userService.setCurrentUser(response.user);
        this.storage.set('accessToken', accessToken);
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }

  public async loginWithFacebook(): Promise<UserModel> {
    try {
      const facebookAccessToken = await this.obtainFacebookAccessToken();

      const url = `${C.urls.baseUrl}/auth/facebook-token/callback?access_token=${facebookAccessToken}`;

      const authResponse: any = await this.http.get(url).toPromise();

      const accessToken = {
        id: authResponse.access_token,
        userId: authResponse.userId,
      };

      this.storage.set('accessToken', accessToken);

      const user = await this.http.get<UserSource>(`${C.urls.users}/${accessToken.userId}`).toPromise();
      this.userService.setCurrentUser(user);
      
      return Promise.resolve(new UserModel(user));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async loginWithTwitter(): Promise<UserModel | any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {

        this.inAppBrowser.create(`${C.urls.baseUrl}/auth/twitter`, '_system');

        const unsubscribe: Subject<void> = new Subject<void>();

        return this.deeplinkService.route()
          .pipe(takeUntil(unsubscribe))
          .subscribe((data) => {
            if (data && data.$link && data.$link.url && data.$link.url.indexOf('fabvote://?twitter') > -1) {
              unsubscribe.next();
              unsubscribe.complete();

              const response = JSON.parse(decodeURIComponent(data.$link.url.split('fabvote://?twitter=')[1]));

              if (response.success) {
                return this.loginWithAccessToken(response.accessToken).then((user) => {
                  return resolve(user);
                }, (error) => {
                  return reject(error);
                });
              }

              return reject();
            }
          });
      }

      // web fallback
      // TODO: implement new web fallback
    });
  }

  public logout() {
    const url = `${C.urls.users}/logout`;

    return this.http.post(url, {})
      .pipe(
        tap(() => {
          this.userService.removeCurrentUser();
          this.storage.remove('accessToken');
        }),
      )
      .toPromise();
  }

  private async obtainFacebookAccessToken(): Promise<string> {
    try {
      if (this.platform.is('cordova')) {
        const authResponse: any = await this.facebook.login(['public_profile', 'email']);

        return Promise.resolve(authResponse.authResponse.accessToken);
      }

      await this.initFacebookJsSdk();

      const accessToken = await this.obtainFacebookAccessTokenWeb();

      return Promise.resolve(accessToken);
    } catch (error) {
      console.error(error);
    }
  }

  private initFacebookJsSdk(): Promise<any> {
    return this.dynamicScriptLoaderService.loadScript('facebooksdk').then(() => {
      FB.init({
        appId: environment.facebookAppId,
        cookie: true,
        xfbml: false,
        version: 'v3.2',
      });

      return Promise.resolve();
    }, (error) => {
      return Promise.reject(error);
    });
  }

  private obtainFacebookAccessTokenWeb(): Promise<string> {
    return new Promise((resolve, reject) => {
      FB.login((response) => {
        return resolve(response.authResponse.accessToken);
      }, { scope: 'public_profile,email' });
    });
  }

  private async loginWithAccessToken(accessToken: any) {
    try {
      this.storage.set('accessToken', accessToken);

      const user = await this.http.get<UserSource>(`${C.urls.users}/${accessToken.userId}`).toPromise();

      this.userService.setCurrentUser(user);
      
      return Promise.resolve(new UserModel(user));
    } catch (error) {
      console.error(error);
    }
  }
}
