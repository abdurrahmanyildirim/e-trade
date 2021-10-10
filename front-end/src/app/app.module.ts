import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth';
import { AdminGuard } from './shared/guards/admin';

registerLocaleData(localeTr);

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/module').then((m) => m.PageModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'prefix' }
];

@NgModule({
  declarations: [AppComponent, SnackbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' }),
    CoreModule,
    MatSnackBarModule,
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
