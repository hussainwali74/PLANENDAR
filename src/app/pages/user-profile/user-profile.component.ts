import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  enableEdit: boolean = false;
  form: FormGroup;
  profile: { photo: string, name: string, email: string } = { email: '-', name: '-', photo: '-' };
  submitted: boolean;
  constructor(private eventService: EventsService,
    private userService: UserService, private fb: FormBuilder,) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: [],
    });
    this.userService.getProfile().subscribe(
      (data) => {
        console.log(data)
        this.profile = data['details']
        this.form.get('name').patchValue(this.profile.name)
        this.form.get('email').patchValue(this.profile.email)
      }, e => {
        console.log(e)
      }
    )
  }
  editPage() {
    this.enableEdit = true;
  }

  onSubmit(body) {
    console.log(body)
    this.submitted = true;
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.form.invalid) {

      if (invalid.length > 1) {
        this.eventService.swalMsgError("Invalid Form", 'Please fill these fields : ' + invalid.toString());
      } else if (invalid.length == 1) {
        this.eventService.swalMsgError("Invalid Form", 'Please fill the  ' + invalid.toString().toUpperCase() + " field");
      }
      return;
    }
    console.log("onsubmit body")
    console.log(body)
    // return;
    this.userService.updateProfile(body).subscribe(
      (data) => {
        console.log(data)
        if (data['result'] == true) {
          this.eventService.swalMsgSuccess("Profile updated");
          this.enableEdit = false;
        }
      }, (error) => {
        console.log(error)
      }
    )
  }

  cancelEdit() {
    this.enableEdit = false;
  }


}
