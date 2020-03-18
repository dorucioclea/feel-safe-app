/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
        path: 'quizzes',
        children: [
          {
            path: ':id',
            loadChildren: () => import('../quiz/quiz-detail/quiz-detail.page.module').then((mod) => mod.QuizDetailPageModule),
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
            path: 'profile',
            loadChildren: () => import('src/app/user/user-edit/user-edit.page.module').then((mod) => mod.UserEditPageModule),
          },
          {
            path: 'delete-user',
            loadChildren: () => import('src/app/user/user-delete/user-delete.page.module').then((mod) => mod.UserDeletePageModule),
          },
          {
            path: 'imprint',
            loadChildren: () => import('../static-pages/imprint/imprint.page.module').then((mod) => mod.ImprintPageModule),
          },
          {
            path: 'agreements/:type',
            loadChildren: () => import('src/app/legal/agreement/agreement.page.module').then((mod) => mod.AgreementPageModule),
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
export class MainRoutingModule { }
