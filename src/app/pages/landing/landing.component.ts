import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent implements OnInit {
  constructor(
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    translate.setDefaultLang("en");
  }

  ngOnInit(): void {
    console.log("landing page");
    // alert('ladingpage')
    // this.router.navigate(['/'])
  }
}
