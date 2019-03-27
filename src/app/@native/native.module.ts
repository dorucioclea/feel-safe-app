import { NgModule } from '@angular/core';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
  providers: [
    AppVersion,
    Camera,
    Crop,
    FileTransfer,
    Network,
    SafariViewController,
    SocialSharing,
    SplashScreen,
    StatusBar,
  ],
})
// tslint:disable-next-line
export class NativeModule { }
