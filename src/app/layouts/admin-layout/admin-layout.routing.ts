import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages//user-profile/user-profile.component';
// import { TableListComponent } from '../../pages/table-list/table-list.component';
// import { TypographyComponent } from '../../typography/typography.component';
// import { IconsComponent } from '../../icons/icons.component';
// import { MapsComponent } from '../../maps/maps.component';
// import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { ContactsComponent } from '../../pages/contacts/contacts.component';
import { ListsComponent } from '../../pages/lists/lists.component';
import { ContactListsComponent } from '../../pages/contact-lists/contact-lists.component';
import { LandingComponent } from '../../pages/landing/landing.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { CreateEventComponent } from '../../pages/create-event/create-event.component';
import { CalenderComponent } from '../../pages/events/calender/calender.component';
import { EventsComponent } from '../../pages/events/events.component';
import { SearchComponent } from '../../pages/events/search/search.component';
import { CreatedComponent } from '../../pages/events/created/created.component';
import { PromotionComponent } from '../../pages/events/promotion/promotion.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEventsComponent } from 'src/app/pages/view-event/view-event.component';

const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'create-event', component: CreateEventComponent },
    { path: 'view-events', component: ViewEventsComponent },
    // { path: 'table-list', component: TableListComponent },
    // { path: 'typography', component: TypographyComponent },
    // { path: 'icons', component: IconsComponent },
    // { path: 'maps', component: MapsComponent },
    // { path: 'upgrade', component: UpgradeComponent },
    { path: 'calender', component: CalenderComponent },
    {
        path: 'contactlists', component: ContactListsComponent, children: [
            { path: '', pathMatch: "full", redirectTo: 'contact' },
            {
                path: 'contact',
                component: ContactsComponent
            },
            { path: 'list', component: ListsComponent },
        ]
    },
    {
        path: 'events',
        component: EventsComponent,
        children: [
            {
                path: 'search',
                component: SearchComponent,
            },

            {
                path: 'calendar',
                component: CalenderComponent,
            },
            {
                path: 'created',
                component: CreatedComponent,
            },
            {
                path: 'promotion',
                component: PromotionComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'search'

            }

        ]
    },

]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes)
    ]
})
export class AdminRoutingModule { }