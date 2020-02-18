import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/auth/@shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnathorizedOnlyGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated()) { return true; }

    this.router.navigate(['/']).catch();

    return false;
  }
}
