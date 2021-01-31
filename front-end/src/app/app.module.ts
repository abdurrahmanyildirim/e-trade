import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './components/header/module';
import { FooterModule } from './components/footer/module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigService } from './shared/services/site/config.service';
import { ProductService } from './shared/services/rest/product.service';
import { RestInterceptor } from './shared/services/rest/rest-interceptor';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SplashService } from './shared/services/site/splash.service';

registerLocaleData(localeTr);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PagesModule,
    HeaderModule,
    FooterModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'tr' },
    SplashService,
    {
      provide: APP_INITIALIZER,
      useFactory: (cs: SplashService) => () => cs.init(),
      deps: [SplashService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: RestInterceptor, multi: true },
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
