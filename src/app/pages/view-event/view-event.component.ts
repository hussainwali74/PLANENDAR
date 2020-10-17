import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { EventsService } from "src/app/services/events.service";
import { Event } from "../../models/Event.model";
@Component({
  selector: "app-view-event",
  templateUrl: "./view-event.component.html",
  styleUrls: ["./view-event.component.css"],
})
export class ViewEventsComponent implements OnInit {
  closeResult: string;
  all_events: Event[] = [];
  term;
  constructor(
    private modalService: NgbModal,
    private eventService: EventsService
  ) {}

  ngOnInit(): void {
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

  open(content, type, modalDimension) {
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
      this.modalService.open(content, { centered: true }).result.then(
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
