import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: [] = [];
  faCheck = faCheck;
  faTimes = faTimes

  constructor(private userService: UserService,) { }

  ngOnInit(): void {
    this.getRequests();
  }
  getRequests() {
    this.userService.getAllFriendRequests().subscribe(
      (data: []) => {
        console.log(data)
        this.notifications = data['details'];
      }, (error) => {
        console.log(error)
      });

  }

  acceptRequest(id) {
    this.userService.acceptRequest(id).subscribe(
      (data) => {
        console.log(data)
        if (data['result']) {

          swal.fire("success", "Friend request accepted", "success");
          this.getRequests();
        }
      }, (error) => {
        console.log(error)
      });
    console.log(id)
  }

  cancelRequest(id) {
    this.userService.rejectRequest(id).subscribe(
      (data) => {
        if (data['result']) {

          swal.fire("success", "Friend request rejected", "success");
          this.getRequests();
        }
      }, (error) => {
        console.log(error)
      });
  }

}
