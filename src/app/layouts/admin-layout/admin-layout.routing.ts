import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { HomeComponent } from 'src/app/home/home.component';
import { ViewEventsComponent } from 'src/app/pages/view-event/view-event.component';
import { UserProfileComponent } from '../../pages//user-profile/user-profile.component';
import { ContactListsComponent } from '../../pages/contact-lists/contact-lists.component';
import { ContactsComponent } from '../../pages/contacts/contacts.component';
import { CreateEventComponent } from '../../pages/create-event/create-event.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CalenderComponent } from '../../pages/events/calender/calender.component';
import { CreatedComponent } from '../../pages/events/created/created.component';
import { EventsComponent } from '../../pages/events/events.component';
import { PromotionComponent } from '../../pages/events/promotion/promotion.component';
import { SearchComponent } from '../../pages/events/search/search.component';
import { LandingComponent } from '../../pages/landing/landing.component';
import { ListsComponent } from '../../pages/lists/lists.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';


const AdminLayoutRoutes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
            { path: '', component: LandingComponent },

            { path: 'dashboard', component: DashboardComponent },
            { path: 'user-profile', component: UserProfileComponent },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'create-event', component: CreateEventComponent },
            { path: 'create-event/:event_id', component: CreateEventComponent },
            { path: 'view-events', component: ViewEventsComponent },
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
                        path: 'promotion/:event_id',
                        component: PromotionComponent,
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'search'

                    },
                    { path: '**', redirectTo: 'signin', pathMatch: 'full' }


                ]
            }]
    }

]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes)
    ]
})
export class AdminRoutingModule { }