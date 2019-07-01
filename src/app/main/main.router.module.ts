import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'main',
    component: MainPage,
    children: [
      {
        path: 'restaurants',
        children: [
          {
            path: '',
            loadChildren: '../restaurant/restaurant-list/restaurant-list.page.module#RestaurantListPageModule',
          },
          {
            path: ':id',
            loadChildren: '../restaurant/restaurant-detail/restaurant-detail.page.module#RestaurantDetailPageModule',
          },
        ],
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../tab2/tab2.module#Tab2PageModule',
          },
        ],
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: '../static-pages/more-menu/more-menu.page.module#MoreMenuPageModule',
          },
          {
            path: 'imprint',
            loadChildren: '../static-pages/imprint/imprint.page.module#ImprintPageModule',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/main/restaurants',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/main/restaurants',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
// tslint:disable-next-line
export class MainPageRoutingModule { }
