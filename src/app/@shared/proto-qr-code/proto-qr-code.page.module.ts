import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtoQrCodePage } from './proto-qr-code.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ProtoQrCodePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [ProtoQrCodePage],
})
// tslint:disable-next-line
export class ProtoQrCodePageModule {}