import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { EventsService } from "src/app/services/events.service";
import { Event } from "../../models/Event.model";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-view-event",
  templateUrl: "./view-event.component.html",
  styleUrls: ["./view-event.component.css"],
})
export class ViewEventsComponent implements OnInit {
  closeResult: string;
  all_events: Event[] = [];
  term;
  @ViewChild("classic2") eventModal;
  dontshowbuttons: boolean;
  modalUser: any;
  @Input("title") title: String;
  isCreatedPage: boolean = false;

  modalEvent: Event;
  showUnsubButton: boolean = false;
  showIamIn: boolean = false;
  showRejectButton: boolean = false;
  showacceptbuttons: boolean = false;
  reject_noti_id: any;

  constructor(
    private modalService: NgbModal,
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let route = this.router.url;
    if (route == "/events/calendar") {
      this.eventService.getMyCalenderEvents().subscribe(
        (data) => {
          this.all_events = data["details"];
          this.all_events.sort(function (a, b) {
            let date1 = new Date(a.date);
            let date2 = new Date(b.date);
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
          });
        },
        (e) => {
          console.log(e);
        }
      );
    } else if (route == "/events/created") {
      this.isCreatedPage = true;
      this.eventService.getMyCreatedEvents().subscribe(
        (data) => {
          console.log(data);
          this.all_events = data["details"];
          this.all_events.sort(function (a, b) {
            let date1 = new Date(a.date);
            let date2 = new Date(b.date);
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
          });
        },
        (e) => {
          console.log(e);
        }
      );
    } else {
      this.eventService.getAllPublicEvents().subscribe(
        (data) => {
          console.log(data);
          this.all_events = data["details"];
          this.all_events.sort(function (a, b) {
            let date1 = new Date(a.date);
            let date2 = new Date(b.date);
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
          });
          // this.all_events.sort(function (a, b) {
          //   // Turn your strings into dates, and then subtract them
          //   // to get a value that is either negative, positive, or zero.
          //   return new Date(a.date) - new Date(b.date);
          // });
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }
  getEventByID(eventid) {
    this.eventService.getEventByID(eventid).subscribe(
      (data) => {
        this.dontshowbuttons = true;
        this.modalEvent = data["details"];
        // this.checkRejectedEvent(data["details"]["_id"]);
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
  showIamInbtn(event_id) {
    let x = false;
    let me = JSON.parse(localStorage.getItem("user"));
    if (me) {
      if (this.modalEvent["invitees"]) {
        if (this.modalEvent["invitees"].length > 0) {
          if (this.modalEvent["invitees"].includes(me["_id"])) {
            x = true;
            console.log(this.modalEvent["invitees"]);
          } else {
            x = false;
          }
        }
      }

      if (me["events"]) {
        if (me["events"].length > 0) {
          if (me["events"].includes(event_id)) {
            x = false;
          }
        }
      }
      if (me["rejected_events"]) {
        if (me["rejected_events"].length > 0) {
          if (me["rejected_events"].includes(event_id)) {
            x = false;
          }
        }
      }

      this.showIamIn = x;
    }
  }
  showUnSubscribeButton(event_id) {
    let x = false;
    let me = JSON.parse(localStorage.getItem("user"));
    if (me) {
      if (this.modalEvent["invitees"]) {
        if (this.modalEvent["invitees"].length > 0) {
          if (this.modalEvent["invitees"].includes(me["_id"])) {
            x = true;
            console.log(this.modalEvent["invitees"]);
          } else {
            x = false;
          }
        }
      }
      // if I am going to this event
      if (me["events"]) {
        if (me["events"].length > 0) {
          if (me["events"].includes(event_id)) {
            x = true;
            console.log(me["events"]);
          }
        }
      }
      // if (me["createdevents"].length > 0) {
      //   if (me["createdevents"].includes(event_id)) {
      //     x = false;
      //   } else {
      //     x = true;
      //     console.log(me["createdevents"]);
      //   }
      // }
      if (me["rejected_events"]) {
        if (me["rejected_events"].length > 0) {
          if (me["rejected_events"].includes(event_id)) {
            x = false;
          }
        }
      }
      console.log(x);
      this.showUnsubButton = x;
    }
  }

  acceptInvitations(event_id) {
    this.eventService.acceptEventInvitation2(event_id).subscribe(
      (data) => {
        console.log(data);
        swal.fire("success", data["msg"], "success");
        this.modalService.dismissAll();
      },
      (e) => console.log(e)
    );
  }
  rejectInvitations(event_id) {
    console.log("reject event_id");
    console.log(this.reject_noti_id);
    if (this.reject_noti_id) {
      this.eventService.unSubcribeToEvent(event_id).subscribe(
        (data) => {
          console.log(data);
          swal.fire("success", data["msg"], "error");
          this.modalService.dismissAll();
        },
        (e) => console.log(e)
      );
    } else {
      // UNSUBSCRIBE TO EVENT
    }
  }

  unsubscribeToEvent(event_id) {
    this.eventService.unSubcribeToEvent(event_id).subscribe(
      (data) => {
        swal.fire("success", data["msg"], "error");
        this.eventService.resetUser();
        this.modalService.dismissAll();
      },
      (e) => console.log(e)
    );
  }

  checkRejectedEvent(event_id) {
    let me = JSON.parse(localStorage.getItem("user"));
    if (me["rejected_events"]) {
      if (me["rejected_events"].includes(event_id)) {
        this.showUnsubButton = true;
      } else {
        this.showUnsubButton = false;
      }
    }
  }
  checkMyEvent(event_id) {
    let me = JSON.parse(localStorage.getItem("user"));
    if (me["createdevents"]) {
      if (me["createdevents"].includes(event_id)) {
        return true;
      } else {
        return false;
      }
    }
  }
  open(content, type, modalDimension, modalUser) {
    if (modalUser) {
      this.modalUser = modalUser.sender;
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return "with: $reason";
    }
  }
}
