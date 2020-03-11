import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgxQRCodeModule } from 'ngx-qrcode2';

import { RestaurantDetailPage } from './restaurant-detail.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: RestaurantDetailPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgxQRCodeModule,
  ],
  declarations: [RestaurantDetailPage],
})
// tslint:disable-next-line
export class RestaurantDetailPageModule {}