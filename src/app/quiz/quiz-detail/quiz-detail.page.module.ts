import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizDetailPage } from './quiz-detail.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: QuizDetailPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [QuizDetailPage],
})
// tslint:disable-next-line
export class QuizDetailPageModule {}