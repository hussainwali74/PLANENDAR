import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-lists',
  templateUrl: './contact-lists.component.html',
  styleUrls: ['./contact-lists.component.css']
})
export class ContactListsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }
  gotoContacts() {
    this.router.navigate(['contact'], { relativeTo: this.route });
  }
  gotoLists() {
    this.router.navigate(['list'], { relativeTo: this.route });
  }
}
