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
    faList = faList;
    constructor(public location: Location,
        private authService: AuthService,
        private userService: UserService,
        private router: Router) {
    }

    ngOnInit() {
        // this.userService.getNotifications().subscribe(
        //     (d) => {
        //         let newnotifications = d['details']['notifications'];
        //         newnotifications.forEach(element => {
        //             if (element.seen) {

        //             } else {
        //                 this.new_notifications++;
        //             }
        //         });
        //         // if(d['details'][])
        //         // console.log("d['details']['notifications']")
        //         // console.log(d['details']['notifications'])
        //         // console.log("this.new_notifications")
        //         // console.log(this.new_notifications)
        //     }
        // )
        // this.router.events.subscribe((event) => {
        //     this.isCollapsed = true;
        //     if (event instanceof NavigationStart) {
        //         if (event.url != this.lastPoppedUrl)
        //             this.yScrollStack.push(window.scrollY);
        //     } else if (event instanceof NavigationEnd) {
        //         if (event.url == this.lastPoppedUrl) {
        //             this.lastPoppedUrl = undefined;
        //             window.scrollTo(0, this.yScrollStack.pop());
        //         } else
        //             window.scrollTo(0, 0);
        //     }
        // });
        // this.location.subscribe((ev: PopStateEvent) => {
        //     this.lastPoppedUrl = ev.url;
        // });
    }
    logout() {
        console.log('signout')

        // localStorage.clear()
        this.authService.logOut();
        // this.router.navigateByUrl('/signin')
    }

    // isHome() {
    //     var titlee = this.location.prepareExternalUrl(this.location.path());

    //     if (titlee === '#/home') {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    // isDocumentation() {
    //     var titlee = this.location.prepareExternalUrl(this.location.path());
    //     if (titlee === '#/documentation') {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
}
