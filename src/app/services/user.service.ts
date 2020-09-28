import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.url

  constructor(private http: HttpClient,) {
    this.baseUrl = this.baseUrl + '/api/';
  }

  createEvent(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'create-event';
    return this.http.post(url, JSON.stringify(body), { headers })
  }

  getAllUsers() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-users';
    return this.http.get(url, { headers })
  }

  getAllFriendRequests() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'friend-requests';
    return this.http.get(url, { headers })
  }

  sendFriendRequest(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'friend-request';
    return this.http.post(url, { id: id }, { headers })
  }
  acceptRequest(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'accept-friend-request';
    return this.http.put(url, { id: id }, { headers })
  }

  rejectRequest(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'reject-friend-request';
    return this.http.put(url, { id: id }, { headers })
  }

}
