import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/shared/auth.guard';
import { UnathorizedOnlyGuard } from './auth/shared/unauthorized-only.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], loadChildren: './main/main.page.module#MainPageModule' },
  { path: 'onboarding', loadChildren: './static-pages/onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'imprint', loadChildren: './static-pages/imprint/imprint.page.module#ImprintPageModule' },
  { path: 'god-mode', loadChildren: './god-mode/god-mode/god-mode.page.module#GodModePageModule' },
  { path: 'agreements/:type', loadChildren: './legal/agreement/agreement.page.module#AgreementPageModule' },
  { path: 'login', canActivate: [UnathorizedOnlyGuard], loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'register', canActivate: [UnathorizedOnlyGuard], loadChildren: './auth/register/register.module#RegisterPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
// tslint:disable-next-line
export class AppRoutingModule {}
