import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { map, tap } from 'rxjs/operators';

import { StorageService } from 'src/app/@core/storage.service';
import { URL } from 'src/app/@shared/url';
import { UserModel, UserSource } from './user.model';

interface UserDetailsStore {
  [key: string]: UserModel;
};

interface UserDetails {
  [key: string]: BehaviorSubject<UserModel>;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public currentUser: BehaviorSubject<UserModel | null> = new BehaviorSubject(null);
  private userDetailsStore: UserDetailsStore = {};
  private userDetails: UserDetails = {};

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {
    const currentUser = this.getCurrentUser();

    if (!currentUser) { return; }
    this.currentUser.next(currentUser);
  }

  public getUserDetail(userId: string): Observable<UserModel> {
    if (this.userDetails[userId]) {
      this.loadUserDetail(userId).toPromise().catch();

      return this.userDetails[userId].asObservable();
    }

    return this.loadUserDetail(userId).pipe(
      concatMap(() => {
        return this.userDetails[userId].asObservable();
      }),
    );
  }

  public refreshCurrentUser(): Promise<UserModel> {
    const currentUser = this.getCurrentUser();

    if (!currentUser) { return; }

    return this.http.get<UserSource>(URL.usersById(currentUser.id))
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
        }),
        map((user) => new UserModel(user)),
      )
      .toPromise();
  }

  public getCurrentUser(): UserModel {
    const user: UserSource = this.storage.get('user');
    if (user) {
      return new UserModel(user);
    }

    return null;
  }

  public getCurrentUserSource(): UserSource {
    return this.storage.get('user');
  }

  public setCurrentUser(user: UserSource): void {
    this.storage.set('user', user);
    this.currentUser.next(new UserModel(user));
  }

  public removeCurrentUser(): void {
    this.storage.remove('user');
    this.currentUser.next(null);
  }

  public getUserById(id: string): Observable<UserModel> {
    return this.http.get<UserSource>(URL.usersById(id))
      .pipe(
        map((user) => new UserModel(user)),
      );
  }

  public updateUserAttributes(attributes: any): Promise<UserModel> {
    const user = this.getCurrentUser();
    if (!user) { return Promise.reject('No user logged in yet'); }

    return this.http.patch<UserSource>(URL.usersById(user.id), attributes)
      .pipe(
        tap((user: UserSource) => {
          this.storage.set('user', user);
          this.currentUser.next(new UserModel(user));
        }),
        map((user: UserSource) => new UserModel(user)),
      )
      .toPromise();
  }

  public deleteAccount(email: string, password: string): Promise<any> {
    return this.http.post(URL.usersDeleteAccount(this.getCurrentUser().id), { email, password })
      .toPromise();
  }

  public blockUserById(blockedUserId: string): Promise<any> {
    const currentUser = this.getCurrentUser();

    const data = {
      blockedUserId: blockedUserId,
    };

    return this.http.post(URL.usersBlockedUsers(currentUser.id), data)
      .toPromise();
  }

  private loadUserDetail(userId: string): Observable<UserModel> {
    return this.http.get(URL.usersById(userId))
      .pipe(
        tap((user: any) => {
          this.userDetailsStore[userId] = user;

          if (!this.userDetails[userId]) {
            this.userDetails[userId] = new BehaviorSubject(null);
          }
          
          this.userDetails[userId].next(this.userDetailsStore[userId]);
        }),
      );
  }
}
