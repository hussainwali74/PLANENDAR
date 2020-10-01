import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: [] = [];
  faCheck = faCheck;
  faTimes = faTimes
  closeResult: string;
  modalUser: any;
  show_notifications: boolean = false;

  constructor(private modalService: NgbModal,
    private userService: UserService,) { }

  ngOnInit(): void {
    this.getRequests();
  }
  getRequests() {
    this.userService.getNotifications().subscribe(
      (data: []) => {
        console.log(data)
        this.notifications = data['details'];
        if (this.notifications['notifications'].length > 0) {
          this.show_notifications = true;
        }
      }, (error) => {
        console.log(error)
      });

  }

  acceptRequest(notification_id) {
    this.userService.acceptRequest(notification_id).subscribe(
      (data) => {
        console.log(data)
        if (data['result']) {
          swal.fire("success", "Friend request accepted", "success");
          this.getRequests();
        }
      }, (error) => {
        console.log(error)
      });
    console.log(notification_id)
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
  open(content, type, modalDimension, modalUser) {
    console.log(modalUser)
    this.modalUser = modalUser;
    if (modalDimension === 'sm' && type === 'modal_mini') {
      this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else if (modalDimension === '' && type === 'Notification') {
      this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else {
      this.modalService.open(content, { centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    }
  }

}
