import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.css"],
})
export class AvatarComponent implements OnInit {
  @Input()
  public photoUrl: string;

  @Input()
  public name: string;

  public showInitials = false;
  public initials: string;
  public circleColor: string;

  private colors = [
    "#EB7181", // red

    "#468547", // green
    "#FFD558", // yellow
    "#3670B2", // blue
  ];
  constructor() {}

  ngOnInit(): void {
    if (!this.photoUrl) {
      this.showInitials = true;
      this.createInititals();

      const randomIndex = Math.floor(
        Math.random() * Math.floor(this.colors.length)
      );
      this.circleColor = this.colors[randomIndex];
    }
  }

  private createInititals(): void {
    var initials2: string;

    // for (let i = 0; i < this.name.length; i++) {
    //     if (this.name.charAt(i) === ' ') {
    //         continue;
    //     }

    //     if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
    //         initials += this.name.charAt(i);

    //         if (initials.length == 2) {
    //             break;
    //         }
    //     }
    // }
    console.log(this.name);
    console.log(this.photoUrl);
    var names = this.name.split(" "),
      initials2 = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials2 += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    this.initials = initials2;
  }
}
