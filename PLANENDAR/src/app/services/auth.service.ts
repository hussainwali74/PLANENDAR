import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { environment } from '../../environments/environment';

import { Person } from '../models/Person.model';
import { NgForm } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  selectedPerson = Person;
  // persons: Person[];
  readonly baseURL = "http://localhost:3000/api/";
  // apiBaseUrl: 'http://localhost:3000/api'
  // 
  constructor(private http: HttpClient) { }

  googleLogin() {
    // /auth/google
    console.log('serv')
    const headers = new HttpHeaders();

    return this.http.get('http://localhost:3000/auth/google', { headers: headers })
  }


  baseUrl = this.baseURL;

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  createUser(user: any) {
    console.log(user)
    return this.http.post(this.baseUrl + '/register', user, this.noAuthHeader);

    return this.http.post(this.baseUrl + '/register', user)
      .map((response: Response) => {
        return response.json();
      });
  }

  login(obj) {
    return this.http.post(this.baseURL + 'login', obj);
  }
  signup(obj) {
    return this.http.post(this.baseURL + 'signup', obj);
  }
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