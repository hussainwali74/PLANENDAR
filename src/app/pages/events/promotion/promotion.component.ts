import { Component, OnInit } from "@angular/core";
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Person } from "src/app/models/Person.model";
import { EventsService } from "src/app/services/events.service";
import { Event } from "../../../models/Event.model";
import swal from "sweetalert2";

@Component({
  selector: "app-promotion",
  templateUrl: "./promotion.component.html",
  styleUrls: ["./promotion.component.css"],
})
export class PromotionComponent implements OnInit {
  faLeft = faArrowLeft;
  faRight = faArrowRight;
  faUp = faArrowUp;
  events: Event[] = [];
  faDown = faArrowDown;
  friends: Person[];
  term;
  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.eventService.getUserCreatedEvents().subscribe(
      (data: Event[]) => {
        this.events = data["details"];
        this.events.map((event) => {
          event["selected"] = false;
        });
      },
      (error) => {
        console.log(error);
      }
    );
    this.eventService.getUserContacts().subscribe(
      (data: Person[]) => {
        console.log("data");
        console.log(data);
        this.friends = data["details"]["friends"];
        this.friends.map((friend) => {
          friend["selected"] = false;
        });
        console.log("friends");
        console.log(this.friends);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  selectEvent(event: Event) {
    event.selected = !event.selected;
  }
  selectFriend(friend: Person) {
    console.log("friendddd");
    friend.selected = !friend.selected;
  }

  sendInvitations() {
    var selected_events = this.events.filter((e) => e.selected);
    var selected_contactss = this.friends.filter((e) => e.selected);

    let receivers = [];
    selected_contactss.forEach((contact) => {
      receivers.push(contact._id);
    });

    let body = {};
    body["event_id"] = selected_events[0]["_id"];
    body["receivers"] = receivers;
    console.log("\n");
    console.log("body");
    console.log(body);
    console.log("\n");
    this.eventService.sendEventInvitations(body).subscribe(
      (data) => {
        if (data) {
          console.log(data);
          if (data["details"]) {
            console.log(data["details"]);
            if (data["details"]["alreadyinvited"]) {
              if (data["details"]["alreadyinvited"].length) {
                console.log(data["details"]["alreadyinvited"].toString());
                let x = `Invitation already sent to these contacts: ${data[
                  "details"
                ]["alreadyinvited"].toString()}`;
                swal.fire("response", x, "success");
              }
            }
            if (data["details"]["currentInvited"]) {
              if (data["details"]["currentInvited"].length) {
                let x =
                  "Invitation sent to these contacts: " +
                  data["details"]["currentInvited"].toString();
                swal.fire("response", x, "success");
              }
            }
          }
        }
      },
      (e) => {
        console.log("error sending invitation");
        console.log(e);
        swal.fire("response", "couldn't send invitations", "error");
      }
    );
  }
}
