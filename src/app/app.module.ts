import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FeedsComponent } from './pages/feeds/feeds.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventsComponent } from './pages/events/events.component';
import { ContactListsComponent } from './pages/contact-lists/contact-lists.component';
import { CalenderComponent } from './pages/events/calender/calender.component';
import { SearchComponent } from './pages/events/search/search.component';
import { PromotionComponent } from './pages/events/promotion/promotion.component';
import { CreatedComponent } from './pages/events/created/created.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LandingComponent,
    ProfileComponent,
    FeedsComponent,
    ContactsComponent,
    CreateEventComponent,
    EventsComponent,


    ContactListsComponent,


    CalenderComponent,


    SearchComponent,


    PromotionComponent,


    CreatedComponent,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
