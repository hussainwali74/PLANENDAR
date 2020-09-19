import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  readonly baseURL = "http://localhost:3000/api/";

  constructor(private http: HttpClient,) { }

  createEvent(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseURL + 'create-event';
    return this.http.post(url, JSON.stringify(body), { headers })
  }

  getAllEvents() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseURL + 'view-events';
    return this.http.get(url, { headers })
  }
  swalMsgSuccess(title, details?: string) {
    swal.fire(title, details, "success");
  }

  swalMsgError(title, details?: string) {
    swal.fire(title, details, "error");
  }

}
