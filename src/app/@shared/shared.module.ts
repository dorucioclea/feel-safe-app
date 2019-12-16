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
    ReactiveFormsModule,
    ShowHidePasswordComponent,
    SkeletonComponent,
    TranslateModule,
  ],
})
// tslint:disable-next-line
export class SharedModule { }
