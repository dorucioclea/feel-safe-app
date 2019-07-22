import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantFilterPage } from './restaurant-filter.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: RestaurantFilterPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [RestaurantFilterPage],
})
// tslint:disable-next-line
export class RestaurantFilterPageModule {}