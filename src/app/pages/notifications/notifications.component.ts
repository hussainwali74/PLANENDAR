import { Component, OnInit, ViewChild } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';
import { Event } from '../../models/Event.model';

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
  dontshowbuttons: boolean;
  modalUser: any;
  show_notifications: boolean = false;
  notification_id: any;
  @ViewChild('classic2') eventModal;

  modalEvent: Event;

  constructor(private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private eventService: EventsService,
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
  getEventByID(eventid) {
    this.eventService.getEventByID(eventid).subscribe(
      (data) => {
        console.log(data)
        this.dontshowbuttons = true;
        this.modalEvent = data['details']
        this.open(this.eventModal, '', '', '')
      },
      (e) => {
        console.log("error getting event details")
        console.log(e)
        swal.fire("response", "couldn't send invitations", "error");
      })
  }
  // ACCEPT FRIEND REQUEST
  acceptRequest(notification_id) {
    this.userService.acceptRequest(notification_id).subscribe(
      (data) => {
        console.log(data)
        if (data['result']) {
          swal.fire("success", data['msg'], "success");
          this.getRequests();
        }
      }, (error) => {
        console.log(error)
      });
    console.log(notification_id)
  }

  acceptInvitations(event_id) {

    this.eventService.acceptEventInvitation(event_id, this.notification_id).subscribe(
      (data) => {
        console.log(data)
        swal.fire("success", data['msg'], "success");

        this.activeModal.close();

      }, e => console.log(e)
    )
  }

  rejectInvitations(event_id) {
    this.eventService.rejecteEventInvitation(event_id, this.notification_id).subscribe(
      (data) => {
        console.log(data)
        swal.fire("success", data['msg'], "error");
        this.activeModal.close();
      }, e => console.log(e)
    )
  }
  //REJECT FRIEND REQUEST
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
  open2(content, type, modalDimension, modalUser) {
    this.dontshowbuttons = false;

    this.eventService.getEventByID(modalUser.event).subscribe(
      (data) => {
        this.notification_id = modalUser._id
        this.modalEvent = data['details'];
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
          this.modalService.open(content, { windowClass: 'mt-md-5', centered: true }).result.then((result) => {
            this.closeResult = 'Closed with: $result';
          }, (reason) => {
            this.closeResult = 'Dismissed $this.getDismissReason(reason)';
          });
        }
      },
      error => { console.log(error) }
    )
    this.modalUser = modalUser;
  }


}
