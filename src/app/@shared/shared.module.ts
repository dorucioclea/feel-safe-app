import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AppInfoComponent } from './app-info/app-info.component';
import { AppSvgIcon } from './app-svg-icon.component';
import { HandleInternalLinksDirective } from './handle-internal-links.directive';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProtoBackButtonComponent } from './proto-back-button/proto-back-button.component';
import { ProtoImageComponent } from './proto-image/proto-image.component';

@NgModule({
  declarations: [
    AppInfoComponent,
    AppSvgIcon,
    HandleInternalLinksDirective,
    ImageUploadComponent,
    ProtoBackButtonComponent,
    ProtoImageComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
  ],
  exports: [
    AppInfoComponent,
    AppSvgIcon,
    HandleInternalLinksDirective,
    ImageUploadComponent,
    ProtoBackButtonComponent,
    ProtoImageComponent,
    TranslateModule,
  ],
})
// tslint:disable-next-line
export class SharedModule { }
