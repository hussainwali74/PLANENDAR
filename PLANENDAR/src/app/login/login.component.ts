import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;

  title = "Login hh"



  form = new FormGroup({
    'email': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required)
  });
  focus;
  focus1;
  constructor(private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) { }
  //properties

  auth2: any;

  email: string;
  password: string;
  errorFlag: boolean;
  errorMessage: string;
  notFoundFlag: boolean;
  userNotFound: string;
  ngOnInit() {
    this.googleInitialize()
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
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
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

  login() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.login(this.form.value).subscribe(res => {
        let temp: any = res;
        if (temp.result) {
          this.router.navigate(['/']);
          console.log(temp);
          localStorage.setItem('token', temp.token);
          swal.fire("Login Authorized!", "Your have successfully Logged IN! (Check Console For JWT Token)", "success");
        } else {
          swal.fire("Invalid Credentials", "Failed Login!", "error");
        }
      }, err => {
        console.log(err);
        if (err.error) {

          swal.fire("Login Failed", err.error.msg, "error");
        } else {
          swal.fire("Invalid Credentials", "Failed Login!", "error");
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  loginGoogle() {
    console.log('comp')
    this.authService.googleLogin().subscribe(
      (data) => {
        console.log(data)
      },
      (error) => {
        console.log(error)
      }
    );
  }

}
