import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppInfoComponent } from './app-info/app-info.component';
import { HandleExternalLinksDirective } from './handle-external-links.directive';
import { HandleInternalLinksDirective } from './handle-internal-links.directive';
import { HandleKeyboardEventsDirective } from './handle-keyboard-events.directive';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProtoBackButtonComponent } from './proto-back-button/proto-back-button.component';
import { ProtoImageComponent } from './proto-image/proto-image.component';

@NgModule({
  declarations: [
    AppInfoComponent,
    HandleExternalLinksDirective,
    HandleInternalLinksDirective,
    HandleKeyboardEventsDirective,
    ImageUploadComponent,
    ProtoBackButtonComponent,
    ProtoImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    AppInfoComponent,
    CommonModule,
    FormsModule,
    HandleExternalLinksDirective,
    HandleInternalLinksDirective,
    HandleKeyboardEventsDirective,
    ImageUploadComponent,
    IonicModule,
    ProtoBackButtonComponent,
    ProtoImageComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
// tslint:disable-next-line
export class SharedModule { }
