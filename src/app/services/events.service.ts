import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  baseUrl: string = environment.url

  constructor(private http: HttpClient,) {
    this.baseUrl = this.baseUrl + '/api/';
  }

  createEvent(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'create-event';
    return this.http.post(url, JSON.stringify(body), { headers })
  }
  sendEventInvitations(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'send-event-invites';
    return this.http.post(url, JSON.stringify(body), { headers })
  }

  getAllEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'view-events';
    return this.http.get(url, { headers })
  }
  swalMsgSuccess(title, details?: string) {
    swal.fire(title, details, "success");
  }

  //used in events/promotions
  //GET THE CONTACTS, FRIENDS OF THE USER
  getUserContacts() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-friends';
    return this.http.get(url, { headers })
  }

  getUserCreatedEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'view-user-events';
    return this.http.get(url, { headers })
  }


  swalMsgError(title, details?: string) {
    swal.fire(title, details, "error");
  }

}
