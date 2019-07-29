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
            loadChildren: () => import('../restaurant/restaurant-list/restaurant-list.page.module').then((mod) => mod.RestaurantListPageModule),
          },
          {
            path: ':id',
            loadChildren: () => import('../restaurant/restaurant-detail/restaurant-detail.page.module').then((mod) => mod.RestaurantDetailPageModule),
          },
        ],
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: () => import('../static-pages/more-menu/more-menu.page.module').then((mod) => mod.MoreMenuPageModule),
          },
          {
            path: 'imprint',
            loadChildren: () => import('../static-pages/imprint/imprint.page.module').then((mod) => mod.ImprintPageModule),
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
