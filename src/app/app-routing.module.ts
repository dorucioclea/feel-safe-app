/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/@shared/auth.guard';
import { UnathorizedOnlyGuard } from './auth/@shared/unauthorized-only.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], loadChildren: () => import('./main/main.page.module').then((mod) => mod.MainPageModule) },
  { path: 'onboarding', loadChildren: () => import('./static-pages/onboarding/onboarding.page.module').then((mod) => mod.OnboardingPageModule) },
  { path: 'imprint', loadChildren: () => import('./static-pages/imprint/imprint.page.module').then((mod) => mod.ImprintPageModule) },
  { path: 'god-mode', loadChildren: () => import('./god-mode/god-mode/god-mode.page.module').then((mod) => mod.GodModePageModule) },
  { path: 'agreements', loadChildren: () => import('./legal/agreement/agreement.page.module').then((mod) => mod.AgreementPageModule) },
  { path: 'agreements/:type', loadChildren: () => import('./legal/agreement/agreement.page.module').then((mod) => mod.AgreementPageModule) },
  { path: 'login', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('./auth/login/login.page.module').then((mod) => mod.LoginPageModule) },
  { path: 'register', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('./auth/register/register.page.module').then((mod) => mod.RegisterPageModule) },
  { path: 'password-reset', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('./auth/password-reset/password-reset.page.module').then((mod) => mod.PasswordResetPageModule) },
  { path: 'password-reset/:token', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('./auth/password-reset/password-reset.page.module').then((mod) => mod.PasswordResetPageModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
// tslint:disable-next-line
export class AppRoutingModule {}
