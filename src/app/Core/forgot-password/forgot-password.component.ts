import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private authService: AuthService) { }
  form = new FormGroup({
    'email': new FormControl('', Validators.required),
  });
  ngOnInit(): void {
  }

  login() {
    console.log(this.form.value)
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.resetPassword(this.form.value).subscribe(
        (data) => {
          console.log(data)
          swal.fire("Email Sent!", "Reset pasword link has been sent to the email you provided", "success");
        },
        (error) => {
          console.log(error)
        }
      )
    } else {
      this.form.markAllAsTouched();
    }
  }

}
