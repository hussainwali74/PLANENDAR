import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl: string = environment.url

  constructor(private http: HttpClient,) {
    this.baseUrl = this.baseUrl + '/api/';
  }


  addContactsToList(id,contacts) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'add-list-contacts';
    return this.http.post(url, {list_id:id,contacts:contacts}, { headers })
  }
  removeFromSelectedList(id,contacts) {
     let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'remove-list-contacts';
    return this.http.post(url, {list_id:id,contacts:contacts}, { headers })
  }
  createList(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'create-list';
    return this.http.post(url, {list_name:body}, { headers })
  }
  deleteList(body) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'delete-list';
    return this.http.post(url, {list_id:body}, { headers })
  }

  getMyLists() {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-my-lists';
    return this.http.get(url, { headers })
  }
  getListDetails(id) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'get-list/'+id;
    return this.http.get(url, { headers })
  }

  swalMsgSuccess(title, details?: string) {
    swal.fire(title, details, "success");
  }

  swalMsgError(title, details?: string) {
    swal.fire(title, details, "error");
  }

}
