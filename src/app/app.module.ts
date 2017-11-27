import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { Globals } from './shared/globals';
import { AuthInterceptor } from './auth/auth-interceptor';
import { FetcherService } from './shared/fetcher.service';
import { NotFoundErrorComponent } from './errors/not-found-error/not-found-error.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    Globals,
    AuthGuard,
    AuthService,
    FetcherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
