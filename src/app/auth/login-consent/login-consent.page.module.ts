import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginConsentPage } from './login-consent.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LoginConsentPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [LoginConsentPage],
})
// tslint:disable-next-line
export class LoginConsentPageModule {}