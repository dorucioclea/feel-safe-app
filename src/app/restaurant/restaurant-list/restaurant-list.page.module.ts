import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantListPage } from './restaurant-list.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: RestaurantListPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [RestaurantListPage],
})
// tslint:disable-next-line
export class RestaurantListPageModule {}