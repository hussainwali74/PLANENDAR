import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Navbar2Component } from './navbar2/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    Navbar2Component
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    Navbar2Component
  ]
})
export class ComponentsModule { }
