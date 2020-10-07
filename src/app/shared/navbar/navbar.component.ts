import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBell, faCalendar, faHome, faList, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl: string;
    rla: any;
    private yScrollStack: number[] = [];
    faHome = faHome;
    faCalender = faCalendar;
    faBell = faBell;
    faUser = faUser;
    new_notifications: number = 0;
    faUserCircle = faUserCircle;
    notifications_count: number = 0;
    faList = faList;
    constructor(public location: Location,
        private authService: AuthService,
        private userService: UserService,
        private router: Router) {
    }

    ngOnInit() {
        this.userService.getNewNotificationCount().subscribe(
            d => {
                this.userService.changeNotificationCount(d['details']);
                this.userService.current_notifications_count.subscribe(count => {
                    this.notifications_count = count
                })
            }
        )
    }

    logout() {
        console.log('signout')
        // localStorage.clear()
        this.authService.logOut();
        // this.router.navigateByUrl('/signin')
    }
}
