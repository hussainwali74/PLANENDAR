import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContactListsComponent } from 'src/app/pages/contact-lists/contact-lists.component';
import { ContactsComponent } from 'src/app/pages/contacts/contacts.component';
import { CreateEventComponent } from 'src/app/pages/create-event/create-event.component';
import { CalenderComponent } from 'src/app/pages/events/calender/calender.component';
import { CreatedComponent } from 'src/app/pages/events/created/created.component';
import { EventsComponent } from 'src/app/pages/events/events.component';
import { PromotionComponent } from 'src/app/pages/events/promotion/promotion.component';
import { SearchComponent } from 'src/app/pages/events/search/search.component';
import { LandingComponent } from 'src/app/pages/landing/landing.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ListsComponent } from '../../pages/lists/lists.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { ViewEventsComponent } from '../../pages/view-event/view-event.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminRoutingModule } from './admin-layout.routing';

@NgModule({
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    NotificationsComponent,
    ListsComponent,
    NotificationsComponent,
    PromotionComponent,
    EventsComponent,
    SearchComponent,
    CalenderComponent, ContactListsComponent, ContactsComponent, ListsComponent,
    LandingComponent,
    ViewEventsComponent,
    CreateEventComponent,
    CreatedComponent,
    AdminLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    FontAwesomeModule,

  ],
})

export class AdminLayoutModule { }
