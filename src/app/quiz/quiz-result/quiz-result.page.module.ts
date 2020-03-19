import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizResultPage } from './quiz-result.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: QuizResultPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [QuizResultPage],
})
// tslint:disable-next-line
export class QuizResultPageModule {}