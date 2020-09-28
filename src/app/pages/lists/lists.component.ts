import { Component, OnInit } from '@angular/core';
import { faAlignLeft, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  faTrasho = faTrash;
  faLeft = faArrowLeft;
  faRight = faArrowRight;
  faUp = faArrowUp;
  faDown = faArrowDown;
  faPlus = faPlus;
  constructor() { }

  ngOnInit(): void {
  }

}
