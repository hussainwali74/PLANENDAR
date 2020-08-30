import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
// import { TableListComponent } from '../../table-list/table-list.component';
// import { TypographyComponent } from '../../typography/typography.component';
// import { IconsComponent } from '../../icons/icons.component';
// import { MapsComponent } from '../../maps/maps.component';
// import { UpgradeComponent } from '../../upgrade/upgrade.component';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatRippleModule } from '@angular/material/core';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatSelectModule } from '@angular/material/select';
import { ListsComponent } from '../../pages/lists/lists.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { PromotionComponent } from 'src/app/pages/events/promotion/promotion.component';
import { EventsComponent } from 'src/app/pages/events/events.component';
import { SearchComponent } from 'src/app/pages/events/search/search.component';
import { CalenderComponent } from 'src/app/pages/events/calender/calender.component';
import { ContactListsComponent } from 'src/app/pages/contact-lists/contact-lists.component';
import { ContactsComponent } from 'src/app/pages/contacts/contacts.component';
import { LandingComponent } from 'src/app/pages/landing/landing.component';
import { ViewEventsComponent } from '../../pages/view-event/view-event.component';


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
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
  ],
})

export class AdminLayoutModule { }
