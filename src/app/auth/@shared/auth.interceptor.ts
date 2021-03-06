import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/@core/storage.service';
import { URL } from 'src/app/@shared/url';

const STATUS_UNAUTHORIZED = 401;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (URL.needsAuthentication(request.url, request.method)) {
      if (this.storage.get('accessToken')) {
        const accessToken = this.storage.get('accessToken');
        request = request.clone({ headers: request.headers.set('Authorization', `${accessToken.id}`) });
      }

      return next.handle(request).pipe(catchError((error) => {
        this.handleAuthError(error);

        return of(error);
      }) as any);
    }

    return next.handle(request);
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (error.status === STATUS_UNAUTHORIZED) {
      //navigate /delete cookies or whatever
      console.debug('handled auth error ' + error.status);
      this.router.navigate(['/login']).catch();
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.

      return of(error.message);
    }

    throw error;
  }
}
