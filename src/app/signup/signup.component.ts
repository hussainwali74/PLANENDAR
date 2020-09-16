import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
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
    @ViewChild('regRef', { static: true }) regRef: ElementRef;

    loading: boolean = false;
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
    auth2: any;




    constructor(private router: Router, private userService: AuthService,
        private ngZone: NgZone,

    ) { }

    ngOnInit() {
        this.googleInitialize()
        // console.log(this.regRef)

        this.errorMessage = "Passwords do not match";
        this.usernameExists = "Username already exists.";
    }

    googleInitialize() {
        window['googleSDKLoaded'] = () => {
            window['gapi'].load('auth2', () => {
                this.auth2 = window['gapi'].auth2.init({
                    client_id: '631867203803-gfnbuj33563dmuorhmfm6cv2prqasulq.apps.googleusercontent.com',
                    cookie_policy: 'single_host_origin',
                    scope: 'profile email'
                });
                this.prepareLogin();
            });
        }
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    }

    prepareLogin() {
        this.auth2.attachClickHandler(this.regRef.nativeElement, {},
            (googleUser) => {
                let profile = googleUser.getBasicProfile();
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                // this.show = true;
                // this.Name =  profile.getName();
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                // this.router.navigate(['/']);
                this.ngZone.run(() => {
                    this.router.navigateByUrl('/');
                    // this._router.navigate([to])
                })


            }, (error) => {
                console.log(error)
                // alert(JSON.stringify(error, undefined, 2));
            });
    }

    // loginGoogle() {
    //     console.log('comp')
    //     this.loading = true;
    //     this.userService.googleLogin().subscribe(
    //         (data) => {
    //             this.loading = true;
    //             console.log(data)
    //         },
    //         (error) => {
    //             this.loading = true;
    //             console.log(error)
    //         }
    //     );
    // }

    signup() {
        if (this.form.valid) {
            console.log(this.form.value);
            this.loading = true
            this.userService.signup(this.form.value).subscribe(res => {
                console.log(res);
                let temp: any = res;
                this.loading = false;
                if (temp.result) {
                    if (temp.emailSent) {
                        swal.fire("Signed Up!", "Signup successfully! Please check your email for confirmation link!", "success");
                    } else {
                        swal.fire("Signed Up!", "Your have successfully signup!", "success");
                    }
                    this.router.navigate(['/signin']);

                } else {
                    swal.fire("Oops", "Failed signusp!", "error");
                }
            }, err => {
                this.loading = false;
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
