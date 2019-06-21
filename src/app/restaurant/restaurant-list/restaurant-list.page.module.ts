import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [RestaurantListPage],
})
// tslint:disable-next-line
export class RestaurantListPageModule {}