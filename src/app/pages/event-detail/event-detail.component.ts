import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventsService } from "src/app/services/events.service";
import { Event } from "../../models/Event.model";
import swal from "sweetalert2";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.css"],
})
export class EventDetailComponent implements OnInit {
  event_id: String;
  modalEvent: Event;
  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.event_id = param["event_id"];
    });
    if (this.event_id) {
      this.getEventByID(this.event_id);
    }
  }
  getEventByID(eventid) {
    console.log(eventid);
    this.eventService.getEventByID(eventid).subscribe(
      (data) => {
        console.log("\n");
        console.log(data);
        console.log("\n");
        // this.dontshowbuttons = true;
        this.modalEvent = data["details"];
        // this.checkRejectedEvent(data["details"]["_id"]);
        // this.showIamInbtn(data["details"]["_id"]);

        // this.showUnSubscribeButton(data["details"]["_id"]);

        // this.open(this.eventModal, "", "", "");
      },
      (e) => {
        console.log("error getting event details");
        console.log(e);
        swal.fire("response", "there was an error", "error");
      }
    );
  }
}
