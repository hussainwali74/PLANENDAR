import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { EventsComponent } from './pages/events/events.component';
import { SearchComponent } from './pages/events/search/search.component';
import { CalenderComponent } from './pages/events/calender/calender.component';
import { CreatedComponent } from './pages/events/created/created.component';
import { PromotionComponent } from './pages/events/promotion/promotion.component';
import { CarHomeComponent } from './car/car-home/car-home.component';
import { BuggatiComponent } from './car/buggati/buggati.component';
import { SuzukiComponent } from './car/suzuki/suzuki.component';
import { LandingComponent } from './pages/landing/landing.component';

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


  { path: '', component: LandingComponent },
  // { path: 'profile', component: ProfileComponent },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'landing', component: LandingComponent },
  // { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
