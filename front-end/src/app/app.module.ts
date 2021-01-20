import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PagesModule,
    HeaderModule,
    FooterModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (cs: ConfigService) => () => cs.initSiteConfig(),
      deps: [ConfigService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: RestInterceptor, multi: true },
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
