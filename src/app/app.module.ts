import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
// import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './Core/login/login.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './app.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ForgotPasswordComponent } from './Core/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Core/reset-password/reset-password.component';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    // LandingComponent,
    ProfileComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    LoaderComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,


  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AdminLayoutModule,
    HomeModule,
    HttpClientModule,
    FontAwesomeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function jwtTokenGetter() {
  return localStorage.getItem("access_token");
}
