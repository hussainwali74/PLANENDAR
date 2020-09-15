import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      // put the code from `ngOnInit` here
      console.log(val)
    });
  }

  ngOnInit(): void {
    console.log('landing page')
    // alert('ladingpage')
    // this.router.navigate(['/'])
  }

}
