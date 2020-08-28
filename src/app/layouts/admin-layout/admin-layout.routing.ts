import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { ContactsComponent } from 'app/pages/contacts/contacts.component';
import { ListsComponent } from 'app/pages/lists/lists.component';
import { ContactListsComponent } from 'app/pages/contact-lists/contact-lists.component';
import { LandingComponent } from 'app/pages/landing/landing.component';
import { NotificationsComponent } from 'app/pages/notifications/notifications.component';
import { CreateEventComponent } from 'app/create-event/create-event.component';
import { CalenderComponent } from 'app/pages/events/calender/calender.component';
import { EventsComponent } from 'app/pages/events/events.component';
import { SearchComponent } from 'app/pages/events/search/search.component';
import { CreatedComponent } from 'app/pages/events/created/created.component';
import { PromotionComponent } from 'app/pages/events/promotion/promotion.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    {
        path: '',
        component: LandingComponent,
    },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'create-event', component: CreateEventComponent },
    { path: 'upgrade', component: UpgradeComponent },
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
        path: 'events', component: EventsComponent, children: [
            { path: '', pathMatch: "full", redirectTo: 'search' },
            {
                path: 'search',
                component: SearchComponent
            },

            {
                path: 'calendar',
                component: CalenderComponent
            },
            {
                path: 'created',
                component: CreatedComponent
            },
            {
                path: 'promotion',
                component: PromotionComponent
            },

        ]
    }
];
