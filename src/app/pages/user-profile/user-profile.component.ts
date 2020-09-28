import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile: { photo: string, name: string, email: string } = { email: '-', name: '-', photo: '-' };
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getProfile().subscribe(
      (data) => {
        console.log(data)
        this.profile = data['details']
      }, e => {
        console.log(e)
      }
    )
  }

}
