import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  faLeft = faArrowLeft;
  faRight = faArrowRight;
  faUp = faArrowUp;
  faDown = faArrowDown;
  constructor(
    private eventService: EventsService,
  ) { }

  ngOnInit(): void {
    this.eventService.getUserContacts().subscribe(
      (data) => {

        console.log(data)
      },
      (error) => {

        console.log(error)
      }

    )
  }

}
