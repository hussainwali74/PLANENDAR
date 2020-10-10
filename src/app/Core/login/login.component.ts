import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading:boolean = false;

  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;

  title = "Login"

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
          client_id: '650149861773-t6f61rfhr9bh8of90kpvb3uub4i5ak9r.apps.googleusercontent.com',
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
        console.log('Email: ' + profile.getEmail(), profile.getName());

        // this.router.navigate(['/']);
        this.authService.saveGoogleCreds({ email: profile.getEmail(), name: profile.getName(), image: profile.getImageUrl(), password: '12345', }).subscribe(
          (data) => {
            console.log(data)
            localStorage.setItem('token', data['token']);
            localStorage.setItem('user', JSON.stringify(data['user']));
            swal.fire("Welcome Back!", "Your have successfully Logged IN! ", "success");
            setTimeout(() => {
              this.ngZone.run(() => {
                console.log('navigating to  / 85')
                this.router.navigateByUrl('/');
              })
            }, 1000);
          },
          (error) => { console.log(error) },
        )
        this.ngZone.run(() => {
          console.log('navigating to  / 94')
          this.router.navigateByUrl('/');
          // this._router.navigate([to])
        })
      }, (error) => {
        console.log(error)
        // alert(JSON.stringify(error, undefined, 2));
      });
  }

  login() {
    this.loading = true;
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.login(this.form.value).subscribe(res => {
        let temp: any = res;
      
        this.loading = false;
        if (temp.result) {
          console.log(temp);
          localStorage.setItem('token', temp.token);
          swal.fire("Welcome Back!", "Your have successfully Logged IN! ", "success").then((d) => {

            this.router.navigate(['/']);
          });
        } else {
          swal.fire("Invalid Credentials", "Failed Login!", "error");
        }
      }, err => {
        this.loading = false;
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
    this.loading = true;
    this.authService.googleLogin().subscribe(
      (data) => {
        this.loading = false;
        console.log(data)
      },
      (error) => {
        console.log(error)
      }
    );
  }

}
