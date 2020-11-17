import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"],
})
export class EventsComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}
  useLanguage(language: string) {
    this.translate.use(language);
  }
}
