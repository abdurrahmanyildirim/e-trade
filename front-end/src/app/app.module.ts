import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './shared/components/header/module';
import { FooterModule } from './shared/components/footer/module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestInterceptor } from './shared/services/rest/rest-interceptor';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SplashService } from './shared/services/site/splash.service';
import { SnackbarComponent } from './shared/components/snackbar/component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from './core/module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

registerLocaleData(localeTr);

@NgModule({
  declarations: [AppComponent, SnackbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    HeaderModule,
    MatSnackBarModule,
    FooterModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'tr' },
    {
      provide: APP_INITIALIZER,
      useFactory: (cs: SplashService) => () => cs.init(),
      deps: [SplashService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: RestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
