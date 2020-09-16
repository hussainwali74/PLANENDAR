import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Person } from '../models/Person.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  selectedPerson = Person;
  // persons: Person[];
  readonly baseURL = "http://localhost:3000/auth/";
  // apiBaseUrl: 'http://localhost:3000/api'
  // 
  constructor(private http: HttpClient, private router: Router) { }

  googleLogin() {
    // /auth/google
    console.log('serv')
    const headers = new HttpHeaders();

    return this.http.get('http://localhost:3000/auth/google', { headers: headers })
  }


  baseUrl = this.baseURL;
  private token: string;

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  createUser(user: any) {
    console.log(user)
    return this.http.post(this.baseUrl + '/register', user, this.noAuthHeader);
  }

  login(obj) {
    return this.http.post(this.baseURL + 'login', obj);
  }
  signup(obj) {
    return this.http.post(this.baseURL + 'signup', obj);
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