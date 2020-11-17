import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { EventsService } from "src/app/services/events.service";
import { UserService } from "src/app/services/user.service";
import swal from "sweetalert2";
import { Event } from "../../models/Event.model";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  @Output() notifyEvent: EventEmitter<number> = new EventEmitter<number>();

  notifications: any[] = [];
  faCheck = faCheck;
  faTimes = faTimes;
  closeResult: string;
  showIamIn: boolean;
  modalUser: any;
  show_notifications: boolean = false;
  notification_id: any;
  @ViewChild("classic2") eventModal;

  modalEvent: Event;
  notifications_count: number;
  reject_noti_id: any;
  showUnsubButton: boolean = false;

  constructor(
    private modalService: NgbModal,
    private eventService: EventsService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getRequests();
  }
  onNotify(notifications) {
    this.notifyEvent.emit(notifications);
  }

  getRequests() {
    this.userService.getNotifications().subscribe(
      (data: []) => {
        // console.log(data)
        this.notifications = data["details"]["notifications"];
        console.log(this.notifications);
        if (this.notifications.length > 0) {
          this.show_notifications = true;
        }
        console.log(this.notifications);
        this.notifications.sort(function (a, b) {
          let date1 = new Date(a.createdAt);
          let date2 = new Date(b.createdAt);
          if (date1 < date2) return 1;
          if (date1 > date2) return -1;
        });

        let x = this.notifications.filter((x) => !x["seen"]).length;
        this.userService.getNewNotificationCount().subscribe((d) => {
          this.userService.changeNotificationCount(d["details"]);
          this.userService.current_notifications_count.subscribe((count) => {
            this.notifications_count = count;
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getEventByID(eventid, notification_id) {
    this.reject_noti_id = notification_id;
    this.notification_id = notification_id;
    this.eventService.getEventByID(eventid).subscribe(
      (data) => {
        console.log(data);
        this.showIamIn = true;
        this.modalEvent = data["details"];
        this.showIamInbtn(data["details"]["_id"]);
        this.showUnSubscribeButton(data["details"]["_id"]);

        this.open(this.eventModal, "", "", "");
      },
      (e) => {
        console.log("error getting event details");
        console.log(e);
        swal.fire("response", "couldn't send invitations", "error");
      }
    );
  }
  // ACCEPT FRIEND REQUEST
  acceptRequest(notification_id) {
    this.userService.acceptRequest(notification_id).subscribe(
      (data) => {
        console.log(data);
        if (data["result"]) {
          this.eventService.resetUser();
          swal.fire("success", data["msg"], "success");
          this.getRequests();
        }
      },
      (error) => {
        console.log(error);
      }
    );
    console.log(notification_id);
  }

  acceptInvitations(event_id) {
    this.eventService
      .acceptEventInvitation(event_id, this.notification_id)
      .subscribe(
        (data) => {
          console.log(data);
          swal.fire("success", data["msg"], "success");
          this.eventService.resetUser();
          this.modalService.dismissAll();
          this.getRequests();
        },
        (e) => console.log(e)
      );
  }

  checkRejectedEvent(event_id) {
    let me = JSON.parse(localStorage.getItem("user"));
    if (me) {
      if (me["rejected_events"].includes(event_id)) {
        this.showUnsubButton = false;
      } else {
        this.showUnsubButton = true;
      }
      // if(me['events'])
    }
  }

  showIamInbtn(event_id) {
    let x = false;
    let me = JSON.parse(localStorage.getItem("user"));
    if (me) {
      if (this.modalEvent["invitees"].length > 0) {
        if (this.modalEvent["invitees"].includes(me["_id"])) {
          x = true;
          console.log(this.modalEvent["invitees"]);
        } else {
          x = false;
        }
      }

      if (me["events"].length > 0) {
        if (me["events"].includes(event_id)) {
          x = false;
        }
      }
      if (me["rejected_events"].length > 0) {
        if (me["rejected_events"].includes(event_id)) {
          x = false;
        }
      }

      this.showIamIn = x;
    }
  }
  showUnSubscribeButton(event_id) {
    let x = false;
    let me = JSON.parse(localStorage.getItem("user"));
    if (me) {
      if (this.modalEvent["invitees"].length > 0) {
        if (this.modalEvent["invitees"].includes(me["_id"])) {
          x = true;
          console.log(this.modalEvent["invitees"]);
        } else {
          x = false;
        }
      }
      // if I am going to this event
      if (me["events"].length > 0) {
        if (me["events"].includes(event_id)) {
          x = true;
          console.log(me["events"]);
        }
      }

      if (me["rejected_events"].length > 0) {
        if (me["rejected_events"].includes(event_id)) {
          x = false;
        }
      }
      console.log(x);
      this.showUnsubButton = x;
    }
  }

  rejectInvitations(event_id) {
    if (this.reject_noti_id) {
      this.eventService
        .rejecteEventInvitation(event_id, this.reject_noti_id)
        .subscribe(
          (data) => {
            this.eventService.resetUser();
            console.log(data);
            swal.fire("success", data["msg"], "error");
            this.modalService.dismissAll();
            this.getRequests();
          },
          (e) => console.log(e)
        );
    } else {
      this.eventService
        .rejecteEventInvitation(event_id, this.notification_id)
        .subscribe(
          (data) => {
            this.eventService.resetUser();
            console.log(data);
            swal.fire("success", data["msg"], "error");
            this.modalService.dismissAll();
            this.getRequests();
          },
          (e) => console.log(e)
        );
    }
  }
  //REJECT FRIEND REQUEST
  cancelRequest(id) {
    this.userService.rejectRequest(id).subscribe(
      (data) => {
        if (data["result"]) {
          swal.fire("success", "Friend request rejected", "success");
          this.getRequests();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  translateThis(detail) {
    let x = detail.split(" ");

    if (
      x.includes("Friend") ||
      (x.includes("friend") && x.includes("Request")) ||
      x.includes("request")
    ) {
      if (x.includes("sent")) {
        let y = this.translate.instant("notification.has-sent");
        y = x[0] + " " + x[1] + " " + y;
        return y;
      }
      if (x.includes("accepted")) {
        let y = this.translate.instant("notification.accepted");
        y = x[0] + " " + x[1] + " " + y;
        return y;
      }
      if (x.includes("rejected")) {
        let y = this.translate.instant("notification.rejected");
        y = x[0] + " " + x[1] + " " + y;
        return y;
      }
    } else if (
      x.includes("event") ||
      x.includes("event:") ||
      x.includes("Event")
    ) {
      if (x.includes("invited")) {
        let y = this.translate.instant("notification.invited");
        y = x[0] + " " + x[1] + " " + y;
        return y;
      } else {
        return detail;
      }
    } else {
      return detail;
    }
  }

  open(content, type, modalDimension, modalUser) {
    console.log(modalUser);

    if (modalUser) {
      this.notificationSeen(modalUser);
      this.modalUser = modalUser.sender;
    } else {
      this.showIamInbtn(this.modalEvent._id);
      this.showUnSubscribeButton(this.modalEvent._id);
    }

    if (modalDimension === "sm" && type === "modal_mini") {
      this.modalService
        .open(content, {
          windowClass: "modal-mini",
          size: "sm",
          centered: true,
        })
        .result.then(
          (result) => {
            this.closeResult = "Closed with: $result";
          },
          (reason) => {
            this.closeResult = "Dismissed $this.getDismissReason(reason)";
          }
        );
    } else if (modalDimension === "" && type === "Notification") {
      this.modalService
        .open(content, { windowClass: "modal-danger", centered: true })
        .result.then(
          (result) => {
            this.closeResult = "Closed with: $result";
          },
          (reason) => {
            this.closeResult = "Dismissed $this.getDismissReason(reason)";
          }
        );
    } else {
      this.modalService
        .open(content, { windowClass: "mt-md-5", centered: true })
        .result.then(
          (result) => {
            this.closeResult = "Closed with: $result";
          },
          (reason) => {
            this.closeResult = "Dismissed $this.getDismissReason(reason)";
          }
        );
    }
  }

  notificationSeen(notification) {
    console.log(notification);
    if (!notification.seen) {
      this.eventService
        .notificationSeen(notification["_id"])
        .subscribe((data) => {
          this.getRequests();
        });
    }
  }
  open2(content, type, modalDimension, modalUser) {
    this.eventService.getEventByID(modalUser.event).subscribe(
      (data) => {
        this.notification_id = modalUser._id;
        this.modalEvent = data["details"];
        this.eventService.resetUser();
        //LOGIC FOR SHOWIAMIN BUTTON:
        //SHOW BUTTON IF I AM INVITED TO THE EVENT-> ME['INVITED EVENTS']
        //SHOW IF I HAVE NOT CREATED THE EVENT -> !ME['CREATEDEVENTS]

        // LOGIC FOR SHOWUNSUBSCRIBE BUTTON
        // SHOW IF AM INVITED
        // SHOW IF I HAVE NOT CREATED
        // SHOW IF i HAVE ACCEPTED

        this.showIamInbtn(this.modalEvent._id);
        this.showUnSubscribeButton(this.modalEvent._id);
        if (modalDimension === "sm" && type === "modal_mini") {
          this.modalService
            .open(content, {
              windowClass: "modal-mini",
              size: "sm",
              centered: true,
            })
            .result.then(
              (result) => {
                this.closeResult = "Closed with: $result";
              },
              (reason) => {
                this.closeResult = "Dismissed $this.getDismissReason(reason)";
              }
            );
        } else if (modalDimension === "" && type === "Notification") {
          this.modalService
            .open(content, { windowClass: "modal-danger", centered: true })
            .result.then(
              (result) => {
                this.closeResult = "Closed with: $result";
              },
              (reason) => {
                this.closeResult = "Dismissed $this.getDismissReason(reason)";
              }
            );
        } else {
          this.modalService
            .open(content, { windowClass: "mt-md-5", centered: true })
            .result.then(
              (result) => {
                this.closeResult = "Closed with: $result";
              },
              (reason) => {
                this.closeResult = "Dismissed $this.getDismissReason(reason)";
              }
            );
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.modalUser = modalUser;
  }
}
