import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { GodModePage } from './god-mode.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: GodModePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxJsonViewerModule,
  ],
  declarations: [GodModePage],
})
// tslint:disable-next-line
export class GodModePageModule {}