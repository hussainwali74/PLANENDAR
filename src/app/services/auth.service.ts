import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/Rx';
import { environment } from 'src/environments/environment';
import { Person } from '../models/Person.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  selectedPerson = Person;

  private readonly TOKEN_EXPIRY_TIME = "expires_in";
  private readonly REFRESH_TOKEN = "refresh_token";
  private readonly TOKEN = "token";
  private readonly USER = "user";

  baseUrl: string = environment.url

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private router: Router,
    public jwtHelper: JwtHelperService
  ) {
    this.baseUrl = this.baseUrl + '/auth/';
  }
  saveGoogleCreds(body) {
    return this.http.post(this.baseUrl + 'save-social-login', body, this.noAuthHeader);
  }
  googleLogin() {
    // /auth/google
    console.log('serv')
    const headers = new HttpHeaders();
    return this.http.get(environment.url + '/auth/google', { headers: headers })
  }

  logOut() {
    window.localStorage.removeItem(this.TOKEN);
    window.localStorage.removeItem(this.REFRESH_TOKEN);
    window.localStorage.clear();
    alert('login out')
    console.log('----------------------------------------------------')
    console.log('LOGGED OUT')
    console.log('----------------------------------------------------')

    this.ngZone.run(() => {
      // this.router.navigateByUrl('/signin');
      window.open("/signin", "_self")
    })
    return;
  }

  private token: string;
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  createUser(user: any) {
    return this.http.post(this.baseUrl + '/register', user, this.noAuthHeader);
  }
  updatePassword(body, token) {
    // return;
    return this.http.post(this.baseUrl + '/update-password/' + token, body, this.noAuthHeader);
  }

  //send email for password reset link
  public resetPassword(email) {
    return this.http.post(this.baseUrl + '/forgot-password', email, this.noAuthHeader);

  }

  //CHECK IF TOKEN IS VALID
  public isAuthenticated(): boolean {
    const token = this.getToken();
    // Check whether the token is expired and return
    // true or false
    if (token == "undefined") {
      this.logOut();
    } else {
      return !this.jwtHelper.isTokenExpired(token);
    }
  }
  setTokens(response) {
    //save access token in local storage
    localStorage.setItem(this.TOKEN, response[this.TOKEN]);

    //save token expiry time
    let token_expires_in_seconds = "" + response.expires_in * 60;
    localStorage.setItem(
      this.TOKEN_EXPIRY_TIME,
      String(token_expires_in_seconds)
    );
    // save refresh token
    localStorage.setItem(this.REFRESH_TOKEN, response.refresh_token);
    this.token = response[this.TOKEN];
  }

  login(obj) {
    return this.http.post(this.baseUrl + 'login', obj);
  }
  signup(obj) {
    return this.http.post(this.baseUrl + 'signup', obj);
  }

  // private saveToken(token: string): void {
  //   localStorage.setItem(this.TOKEN, token);
  //   this.token = token;
  // }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem(this.TOKEN);
    }
    return this.token;
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  public getUserDetails() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
  //=========================================================================================================================================
  // login(authCredentials) {
  //   return this.http.post(this.baseUrl + '/authenticate', authCredentials, this.noAuthHeader);
  // }

  getUserProfile() {
    return this.http.get(this.baseUrl + '/userProfile');
  }

  findUserById(userId: string) {
    return this.http.get(this.baseUrl + '/user/' + userId)
      .map((response: Response) => {
        return response.json();
      });
  }

  findUserByUsername(username: string) {
    return this.http.get(this.baseUrl + '/user/?username=' + username)
      .map((response: Response) => {
        return response.json();
      });
  }

  findUserByCredentials(username: string, password: string) {
    return this.http.get(this.baseUrl + '/user/?username=' + username + '&password=' + password)
      .map((response: Response) => {
        return response.json();
      });
  }

  updateUser(userId: string, user: any) {
    return this.http.put(this.baseUrl + "/user/" + userId, user)
      .map((response: Response) => {
        return response.json();
      });
  }

  deleteUser(userId: string) {
    return this.http.delete(this.baseUrl + '/api/user/' + userId)
      .map((response: Response) => {
        if (response) {
          return {};
        }
      });
  }

}