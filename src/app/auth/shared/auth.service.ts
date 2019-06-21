import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { C } from 'src/app/@shared/constants';
import { DeeplinkService } from 'src/app/@core/deeplink.service';
import { InAppBrowserService } from 'src/app/@core/in-app-browser.service';
import { StorageService } from 'src/app/@core/storage.service';
import { UserService } from 'src/app/user/shared/user.service';
import { UserSource, UserModel } from 'src/app/user/shared/user.model';

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

  public async loginWithProvider(provider: string) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.inAppBrowserService.openUrl(`${C.urls.auth}/${provider}`, true);

        const unsubscribe: Subject<void> = new Subject<void>();

        return this.deeplinkService.route()
          .pipe(takeUntil(unsubscribe))
          .subscribe((data) => {
            if (data && data.$link && data.$link.url && data.$link.url.indexOf('://auth/') > -1) {
              unsubscribe.next();
              unsubscribe.complete();

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
        window.open(`${C.urls.auth}/${provider}`, '_blank', 'width=900,height=500');
        window.onmessage = async (event) => {
          if (event.data.response) {
            const response = JSON.parse(decodeURIComponent(event.data.response));

            this.storage.set('accessToken', response.accessToken);

            const user = await this.http.get<UserSource>(`${C.urls.users}/${response.accessToken.userId}`).toPromise();
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
