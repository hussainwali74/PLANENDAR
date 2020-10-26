import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import swal from "sweetalert2";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  baseUrl: string = environment.url;

  constructor(private http: HttpClient) {
    this.baseUrl = this.baseUrl + "/api/";
  }

  acceptEventInvitation2(event_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + `accept-event-invite/${event_id}`;
    return this.http.post(url, { headers });
  }
  acceptEventInvitation(event_id, notification_id) {
    console.log("notification_id");
    console.log(notification_id);
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + `accept-event-invite/${event_id}`;
    return this.http.post(
      url,
      { notification_id: notification_id },
      { headers }
    );
  }
  resetUser() {
    this.getMe().subscribe((data) => {
      localStorage.setItem("user", JSON.stringify(data["details"]));
    });
  }
  getMe() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-me";
    console.log(url);
    return this.http.get(url, { headers });
  }
  //EVENTS in calender
  getMyCalenderEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-calender-events";
    console.log(url);
    return this.http.get(url, { headers });
  }
  //EVENTS THAT USER IS GOING TO
  getMyEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-my-events";
    console.log(url);
    return this.http.get(url, { headers });
  }
  //EVENTS THAT USER IS GOING TO
  getMyCreatedEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-my-created-events";
    console.log(url);
    return this.http.get(url, { headers });
  }
  getMySubscribedEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-my-subscribed-events";
    console.log(url);
    return this.http.get(url, { headers });
  }
  notificationSeen(notification_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + `notification_see`;
    return this.http.post(
      url,
      { notification_id: notification_id },
      { headers }
    );
  }
  rejecteEventInvitation(event_id, notification_id) {
    console.log("notification_id");
    console.log(notification_id);
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + `reject-event-invite/${event_id}`;
    return this.http.post(
      url,
      { notification_id: notification_id },
      { headers }
    );
  }
  unSubcribeToEvent(event_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + `unsubscribe-event-invite/${event_id}`;
    return this.http.post(url, { headers });
  }

  createEvent(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "create-event";
    return this.http.post(url, JSON.stringify(body), { headers });
  }

  updateEvent(body, event_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "update-event/" + event_id;
    return this.http.put(url, JSON.stringify(body), { headers });
  }

  sendEventInvitations(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "send-event-invites";
    return this.http.post(url, JSON.stringify(body), { headers });
  }
  blockEventInvitations(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "block-event-invites";
    return this.http.post(url, JSON.stringify(body), { headers });
  }

  // getAllEvents() {
  //   let headers = new HttpHeaders().set("Content-Type", "application/json");
  //   let url = this.baseUrl + "view-events";
  //   return this.http.get(url, { headers });
  // }

  getAllPublicEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-all-events";
    console.log(url);
    return this.http.get(url, { headers });
  }

  getEventByID(event_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-event/" + event_id;
    return this.http.get(url, { headers });
  }
  swalMsgSuccess(title, details?: string) {
    swal.fire(title, details, "success");
  }

  //used in events/promotions
  //GET THE CONTACTS, FRIENDS OF THE USER
  getUserContacts() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "get-friends";
    return this.http.get(url, { headers });
  }

  getUserCreatedEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + "view-user-events";
    return this.http.get(url, { headers });
  }

  swalMsgError(title, details?: string) {
    swal.fire(title, details, "error");
  }
}
