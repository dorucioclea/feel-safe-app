import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { OnboardingPage } from './onboarding.page';
import { SharedModule } from '../../@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [OnboardingPage],
})
// tslint:disable-next-line
export class OnboardingPageModule {}
