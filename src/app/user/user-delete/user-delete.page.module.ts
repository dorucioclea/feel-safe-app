import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDeletePage } from './user-delete.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserDeletePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [UserDeletePage],
})
// tslint:disable-next-line
export class UserDeletePageModule {}