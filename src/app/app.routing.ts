import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./Core/login/login.component";

import { LandingComponent } from "./pages/landing/landing.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./guards/auth.guard";
import { ForgotPasswordComponent } from "./Core/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Core/reset-password/reset-password.component";
import { EventDetailComponent } from "./pages/event-detail/event-detail.component";

const routes: Routes = [
  // { path: 'notifications', component: NotificationsComponent },
  // { path: 'events/search', component: SearchComponent },

  // {
  //   path: '',
  //   component: AdminLayoutComponent,
  //   children: [{
  //     path: '',
  //     // component: LandingComponent,
  //     loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  //   }],
  // },

  { path: "signup", component: SignupComponent },
  { path: "signin", component: LoginComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password/:token", component: ResetPasswordComponent },
  {
    path: "",
    component: HomeComponent,
    children: [{ path: "", component: LandingComponent }],
  },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'landing', component: LandingComponent },
  // { path: '**', redirectTo: 'signin', pathMatch: 'full' }
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
