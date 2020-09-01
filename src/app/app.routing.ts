import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './home/home.component';

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


  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: LoginComponent },
  {
    path: '', component: HomeComponent, children: [
      { path: '', component: LandingComponent }
    ]
  },
  // { path: 'profile', component: ProfileComponent },
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
