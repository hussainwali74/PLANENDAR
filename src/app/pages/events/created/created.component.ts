import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.css']
})
export class CreatedComponent implements OnInit {

  events: [];
  constructor(
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

}
