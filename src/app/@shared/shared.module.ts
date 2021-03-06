import { NgxQRCodeModule } from 'ngx-qrcode2';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';

import { AppInfoComponent } from './app-info/app-info.component';
import { HandleExternalLinksDirective } from './handle-external-links.directive';
import { HandleInternalLinksDirective } from './handle-internal-links.directive';
import { HandleKeyboardEventsDirective } from './handle-keyboard-events.directive';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { ProtoImageComponent } from './proto-image/proto-image.component';
import { ProtoParallaxDirective } from './proto-parallax.directive';
import { ProtoQrCodePage } from './proto-qr-code/proto-qr-code.page';
import { QuizItemPreviewComponent } from 'src/app/quiz/@shared/quiz-item-preview/quiz-item-preview.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { SkeletonComponent } from 'src/app/@shared/skeleton/skeleton.component';

@NgModule({
  declarations: [
    AppInfoComponent,
    HandleExternalLinksDirective,
    HandleInternalLinksDirective,
    HandleKeyboardEventsDirective,
    ImageUploadComponent,
    LanguageSwitchComponent,
    ProtoImageComponent,
    ProtoParallaxDirective,
    ProtoQrCodePage,
    QuizItemPreviewComponent,
    ShowHidePasswordComponent,
    SkeletonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxQRCodeModule,
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
    LanguageSwitchComponent,
    MomentModule,
    ProtoImageComponent,
    ProtoParallaxDirective,
    ProtoQrCodePage,
    QuizItemPreviewComponent,
    ReactiveFormsModule,
    ShowHidePasswordComponent,
    SkeletonComponent,
    TranslateModule,
  ],
  entryComponents: [
    ProtoQrCodePage,
  ]
})
// tslint:disable-next-line
export class SharedModule { }
