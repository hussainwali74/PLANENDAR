import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    form = new FormGroup({
        'email': new FormControl('', Validators.required),
        'name': new FormControl('', Validators.required),
        'password': new FormControl('', Validators.required)
    });
    test: Date = new Date();
    focus;
    focus1;
    focus2;

    @ViewChild('f') registerForm: NgForm;

    //properties
    username: string;
    email: string;
    name: string;
    password: string;
    verifypassword: string;
    user: Object = {};
    errorFlag: boolean;
    errorMessage: string;
    usernameFlag: boolean;
    usernameExists: string;

    constructor(private router: Router, private userService: AuthService) { }

    ngOnInit() {
        this.errorMessage = "Passwords do not match";
        this.usernameExists = "Username already exists.";
    }
    loginGoogle() {
        console.log('comp')
        this.userService.googleLogin().subscribe(
            (data) => {
                console.log(data)
            },
            (error) => {
                console.log(error)
            }
        );
    }

    signup() {
        if (this.form.valid) {
            console.log(this.form.value);
            this.userService.signup(this.form.value).subscribe(res => {
                console.log(res);
                let temp: any = res;
                if (temp.result) {
                    this.router.navigate(['/signin']);
                    swal.fire("Signed Up!", "Your have successfully signup!", "success");

                } else {
                    swal.fire("Oops", "Failed signusp!", "error");
                }
            }, err => {
                console.log(err);
                if (err.error) {
                    swal.fire("Oops", err.error.details, "error");
                } else {
                    swal.fire("Oops", "Failed signup!", "error");
                }
            })
        } else {
            this.form.markAllAsTouched();
        }
    }


}
