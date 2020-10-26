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
import { ListService } from "src/app/services/lists.service";
import { List } from "src/app/models/List.model";

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
  blocked: Person[];
  eliminated: Person[];
  confirmed: Person[];
  attendees: Person[];
  selected_list_name: string = "";
  selected_list_id: string = "";

  allMylists: List[] = [];
  term;
  constructor(
    private eventService: EventsService,
    private listService: ListService
  ) {}

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
    this.getMyLists();
  }

  getMyLists() {
    console.log("gettlisn");
    this.listService.getMyLists().subscribe(
      (data) => {
        console.log(data);
        if (data["details"].length) {
          this.allMylists = data["details"];
          this.selected_list_name = this.allMylists["0"]["name"];
          if (!this.selected_list_id) {
            console.log('localStorage.getItem("selected_list_id")');
            console.log(localStorage.getItem("selected_list_id"));
            if (!localStorage.getItem("selected_list_id")) {
              this.selected_list_id = this.allMylists["0"]["_id"];
            } else {
              this.selected_list_id = localStorage.getItem("selected_list_id");
            }
          } else {
            this.selected_list_id = localStorage.getItem("selected_list_id");
          }
        }
      },
      (e) => console.log(e)
    );
  }
  selectEvent(event: Event) {
    this.events.map((x) => (x.selected = false));
    event.selected = !event.selected;
    this.getEventDetail(event._id);
  }
  getEventDetail(id) {
    this.eventService.getEventByID(id).subscribe(
      (data) => {
        console.log(data);
        this.confirmed = data["details"]["attendees"];
        this.blocked = data["details"]["blocked"];
        this.eliminated = data["details"]["eliminated"];
      },
      (e) => {
        swal.fire("response", "couldn't get event details", "error");
      }
    );
  }
  selectFriend(friend: Person) {
    friend.selected = !friend.selected;
  }

  sendInvitations() {
    var selected_events = this.events.filter((e) => e.selected);
    var selected_contactss = this.friends.filter((e) => e.selected);

    let receivers = [];
    selected_contactss.forEach((contact) => {
      receivers.push(contact._id);
    });
    if (!selected_events[0]) {
      swal.fire("response", "please select an event", "error");
      return;
    }
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
            if (data["details"]["blockedUsers"]) {
              if (data["details"]["blockedUsers"].length) {
                let x = `Invitation has been blocked to these contacts: ${data[
                  "details"
                ]["blockedUsers"].toString()}`;
                swal.fire("response", x, "error");
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
  blockInvitations() {
    var selected_events = this.events.filter((e) => e.selected);
    var selected_contactss = this.friends.filter((e) => e.selected);

    if (!selected_events[0]) {
      swal.fire("response", "please select an event", "error");
      return;
    }
    let receivers = [];
    selected_contactss.forEach((contact) => {
      receivers.push(contact._id);
    });

    let body = {};

    body["event_id"] = selected_events[0]["_id"];
    body["receivers"] = receivers;

    alert("kl");
    this.eventService.blockEventInvitations(body).subscribe(
      (data) => {
        if (data) {
          if (data["details"]) {
            this.getEventDetail(selected_events[0]["_id"]);
            if (data["details"]["alreadyBlocked"]) {
              if (data["details"]["alreadyBlocked"].length) {
                let x = `Invitation already already to these contacts: ${data[
                  "details"
                ]["alreadyBlocked"].toString()}`;
                swal.fire("response", x, "success");
              }
            }
            if (data["details"]["currentBlocked"]) {
              if (data["details"]["currentBlocked"].length) {
                let x =
                  "Invitation blocked  to these contacts: " +
                  data["details"]["currentBlocked"].toString();
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
