import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";

import { AppComponent } from "./app.component";
import { SignupComponent } from "./signup/signup.component";
// import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";

import { HomeModule } from "./home/home.module";
import { LoginComponent } from "./Core/login/login.component";
import { AdminLayoutModule } from "./layouts/admin-layout/admin-layout.module";
import { HomeComponent } from "./home/home.component";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { RequestInterceptor } from "./app.interceptor";
import { LoaderComponent } from "./shared/loader/loader.component";
import { JwtModule } from "@auth0/angular-jwt";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ForgotPasswordComponent } from "./Core/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Core/reset-password/reset-password.component";
import { EditComponent } from "./pages/lists/edit/edit.component";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AddProductComponent } from './admin/add-product/add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    // LandingComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    LoaderComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EditComponent,
    AddProductComponent,
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
        tokenGetter: jwtTokenGetter,
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function jwtTokenGetter() {
  return localStorage.getItem("access_token");
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
