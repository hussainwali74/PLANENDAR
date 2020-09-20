import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form = new FormGroup({
    'password': new FormControl('', Validators.required),
    'confirm_password': new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  token: any;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    })
  }

  onSubmit() {
    console.log(this.form.value)
    if (this.form.valid) {
      console.log(this.form.value);
      if (this.form.get('password').value === this.form.get('confirm_password').value) {
        this.authService.updatePassword(this.form.value, this.token).subscribe(
          (data) => {
            console.log(data)
            swal.fire("success", "Pasword updated!", "success");
            this.router.navigate(['/signin'])
          },
          (error) => {
            console.log(error)
          }
        )
      } else {
        this.form.markAllAsTouched();
      }
    } else {
      swal.fire("Passwords mismatch", "Password and Confirm Password don't match", "error");

    }
  }
}
