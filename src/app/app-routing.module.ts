import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './main/main.module#MainPageModule' },
  { path: 'onboarding', loadChildren: './static-pages/onboarding/onboarding.module#OnboardingPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
// tslint:disable-next-line
export class AppRoutingModule {}
