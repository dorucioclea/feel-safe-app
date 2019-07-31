import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AgreementPageModule } from 'src/app/legal/agreement/agreement.page.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './@core/core.module';
import { LoginConsentPageModule } from 'src/app/auth/login-consent/login-consent.page.module';
import { NativeModule } from './@native/native.module';
import { SharedModule } from './@shared/shared.module';
import { RestaurantFilterPageModule } from 'src/app/restaurant/restaurant-filter/restaurant-filter.page.module';

// --- Factories ---------------------------------------------------------------
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const IONIC_CONFIG = {
  inputShims: true,
  rippleEffect: false,
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    /**/AppRoutingModule, // AppRoutingModule has to be imported first
    AgreementPageModule,
    BrowserModule,
    CoreModule,
    HttpClientModule,
    IonicModule.forRoot(IONIC_CONFIG),
    LoginConsentPageModule,
    NativeModule,
    RestaurantFilterPageModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
// tslint:disable-next-line
export class AppModule {}
