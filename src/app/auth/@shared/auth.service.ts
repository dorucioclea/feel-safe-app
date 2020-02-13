import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DeeplinkService } from 'src/app/@core/deeplink.service';
import { InAppBrowserService } from 'src/app/@core/in-app-browser.service';
import { StorageService } from 'src/app/@core/storage.service';
import { URL } from 'src/app/@shared/url';
import { UserService } from 'src/app/user/@shared/user.service';
import { UserSource, UserModel } from 'src/app/user/@shared/user.model';

export interface LoginData {
  email: string,
  password: string,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private inAppBrowserService: InAppBrowserService,
    private deeplinkService: DeeplinkService,
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
    const url = `${URL.url}/users`;

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
    const url = `${URL.url}/users/login?include=user`;

    return new Promise((resolve, reject) => {
      this.http.post(url, loginData).subscribe((response: any) => {
        const accessToken: any = Object.assign({}, response);
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

  public async loginWithProvider(provider: string) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.inAppBrowserService.openUrl(`${URL.auth}/${provider}`);

        const unsubscribe: Subject<void> = new Subject<void>();

        return this.deeplinkService.route()
          .pipe(takeUntil(unsubscribe))
          .subscribe((data: any) => {
            if (data && data.$link && data.$link.url && data.$link.url.indexOf('://auth/') > -1) {
              unsubscribe.next();
              unsubscribe.complete();

              this.inAppBrowserService.hide();

              const response = JSON.parse(decodeURIComponent(data.$link.url.split('://auth/')[1]));

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
      try {
        window.open(`${URL.auth}/${provider}`, '_blank', 'width=900,height=500');
        window.onmessage = async (event) => {
          if (event.data.response) {
            const response = JSON.parse(decodeURIComponent(event.data.response));

            this.storage.set('accessToken', response.accessToken);

            const user = await this.http.get<UserSource>(`${URL.users}/${response.accessToken.userId}`).toPromise() as UserSource;
            this.userService.setCurrentUser(user);
            
            return resolve(new UserModel(user));
          }

          return reject();
        };
      } catch (error) {
        reject();
      }
    });
  }

  public logout() {
    const url = `${URL.users}/logout`;

    return this.http.post(url, {})
      .pipe(
        tap(() => {
          this.userService.removeCurrentUser();
          this.storage.remove('accessToken');
        }),
      )
      .toPromise();
  }

  public requestPasswordReset(email: string) {
    const url = `${URL.users}/reset`;

    return this.http.post(url, { email: email })
      .toPromise();
  }

  public resetPassword(token: string, newPassword: string) {
    const url = `${URL.users}/reset-password`;

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.post(url, { newPassword: newPassword }, { headers: headers })
      .toPromise();
  }

  private async loginWithAccessToken(accessToken: any) {
    try {
      this.storage.set('accessToken', accessToken);

      const user = await this.http.get<UserSource>(`${URL.users}/${accessToken.userId}`).toPromise() as UserSource;

      this.userService.setCurrentUser(user);
      
      return Promise.resolve(new UserModel(user));
    } catch (error) {
      console.error(error);
    }
  }
}
