import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  faBell,
  faCalendar,
  faHome,
  faList,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  rla: any;
  faHome = faHome;
  faCalender = faCalendar;
  faBell = faBell;
  faUser = faUser;
  new_notifications: number = 0;
  faUserCircle = faUserCircle;
  notifications_count: number = 0;
  faList = faList;
  constructor(
    public location: Location,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("ln")) {
      this.translate.use(localStorage.getItem("ln"));
    } else {
      this.translate.use("en");
    }

    this.userService.getNewNotificationCount().subscribe((d) => {
      this.userService.changeNotificationCount(d["details"]);
      this.userService.current_notifications_count.subscribe((count) => {
        this.notifications_count = count;
      });
    });
  }

  useLanguage(language: string) {
    localStorage.setItem("ln", language);
    this.translate.use(language);
  }

  logout() {
    console.log("signout");
    this.authService.logOut();
  }
}
