import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.css']
})
export class CreatedComponent implements OnInit {
  modalEvent: any;
  events: [];
  closeResult: string;


  constructor(private modalService: NgbModal,
    private eventService: EventsService,
  ) { }

  ngOnInit(): void {
    this.eventService.getUserCreatedEvents().subscribe((data: []) => {
      console.log(data)
      this.events = data['details'];
      console.log(this.events)
    }, (error) => {
      console.log(error)

    })
  }

  open(content, type, modalDimension, event) {
    this.modalEvent = event;
    console.log(this.modalEvent)
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
