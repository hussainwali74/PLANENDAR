import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.url
  private notificationSource = new BehaviorSubject<number>(0);

  current_notifications_count = this.notificationSource.asObservable();
  notifications_count: number = 0;

  constructor(private http: HttpClient,) {
    this.baseUrl = this.baseUrl + '/api/';

    // this.getNewNotificationCount().subscribe(
    //   (data) => {
    //     console.log(data)
    //     this.notifications_count = data['details']
    //     this.notificationSource.next(this.notifications_count)
    //   }, e => console.log(e)
    // )
  }
  changeNotificationCount(count: number) {
    this.notificationSource.next(count)
  }





  getNewNotificationCount() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-new-notification-count';
    return this.http.get(url, { headers })
  }

  createEvent(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'create-event';
    return this.http.post(url, JSON.stringify(body), { headers })
  }

  getNotifications() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-notifications';
    return this.http.get(url, { headers })
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

  updateProfile(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'update-profile';
    return this.http.put(url, JSON.stringify(body), { headers })
  }

  getProfile() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-profile';
    return this.http.get(url, { headers })
  }

  sendFriendRequest(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'friend-request';
    return this.http.post(url, { receiver_id: id }, { headers })
  }
  cancelFriendRequest(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'cancel-friend-request';
    return this.http.post(url, { receiver_id: id }, { headers })
  }
  unFriend(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'unfriend';
    console.log('id')
     return this.http.post(url, { receiver_id: id }, { headers })
  }
  acceptRequest(notification_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'accept-friend-request';
    return this.http.put(url, { notification_id: notification_id }, { headers })
  }

  rejectRequest(notification_id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'reject-friend-request';
    return this.http.put(url, { notification_id: notification_id }, { headers })
  }
  updateProfilePhoto(photo) {

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'save-profile-pic';
    // console.log(url)
    return this.http.put(url, { photo: photo }, { headers });
  }

}
