import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

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
  constructor() { }

  ngOnInit(): void {
  }

}
