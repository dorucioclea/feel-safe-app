import { NgModule } from '@angular/core';

import { MainPage } from './main.page';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  imports: [
    MainRoutingModule,
    SharedModule,
  ],
  declarations: [MainPage],
})
// tslint:disable-next-line
export class MainPageModule {}
