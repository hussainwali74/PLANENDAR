import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private readonly TOKEN = "access_token";
  private readonly USER = "user";

  baseUrl: string = environment.url

  constructor(
    private http: HttpClient,
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
    this.router.navigate(["/signin"]);
    return;
  }

  private token: string;
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  createUser(user: any) {
    return this.http.post(this.baseUrl + '/register', user, this.noAuthHeader);
  }
  updatePassword(body, token) {
    console.log(token);
    console.log(body);
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
    console.log('token')
    console.log(this.jwtHelper.isTokenExpired(token))

    return !this.jwtHelper.isTokenExpired(token);
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
    // let token_expires_in_miliseconds = +token_expires_in_seconds * 60;
    // this.refreshTokenInterval = setInterval(() => {
    //   this.refreshToken();
    // }, +token_expires_in_miliseconds - 5000);

    // save refresh token
    localStorage.setItem(this.REFRESH_TOKEN, response.refresh_token);
    this.token = response[this.TOKEN];
  }
  // refreshToken() {
  //   let refresh_token = { refresh_token: this.getRefreshToken() };
  //   let finalURL = this.baseUrl + `login/renew_token`;
  //   const searchParams = Object.keys(refresh_token)
  //     .map(key => {
  //       return (
  //         encodeURIComponent(key) + "=" + encodeURIComponent(refresh_token[key])
  //       );
  //     })
  //     .join("&");

  //   let headers = new HttpHeaders().set(
  //     "Content-Type",
  //     "application/x-www-form-urlencoded"
  //   );
  //   headers = headers.set("accept", "application/json");
  //   headers = headers.set("refresh_token", this.getRefreshToken());
  //   // console.log('inside refreshTOken()')
  //   return this.http
  //     .post(finalURL, searchParams, { headers })
  //     .pipe(
  //       tap(
  //         (tokens: AccessToken) => {
  //           console.log(tokens);
  //           this.storeNewToken(tokens.access_token);
  //         },
  //         (error: any) => {
  //           console.log(error);
  //           if (error instanceof HttpErrorResponse) {
  //             console.log(error);
  //           }
  //         }
  //       )
  //     )
  //     .pipe(
  //       catchError(error => {
  //         console.log(error);
  //         let errorMessage = "An error occurred!";
  //         if (!error.error || !error.error.detail) {
  //           return throwError(errorMessage);
  //         }
  //         errorMessage = error.error.detail;
  //         this.router.navigate(["/login"]);
  //         return throwError(errorMessage);
  //       })
  //     );
  // }

  login(obj) {
    return this.http.post(this.baseUrl + 'login', obj);
  }
  signup(obj) {
    return this.http.post(this.baseUrl + 'signup', obj);
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('token');
    this.router.navigateByUrl('/');
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