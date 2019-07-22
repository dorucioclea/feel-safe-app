import { NgModule } from '@angular/core';

import { MainPage } from './main.page';
import { MainPageRoutingModule } from './main.router.module';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  imports: [
    MainPageRoutingModule,
    SharedModule,
  ],
  declarations: [MainPage],
})
// tslint:disable-next-line
export class MainPageModule {}
