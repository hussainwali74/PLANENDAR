import { Component, OnInit } from '@angular/core';
import { faAlignLeft, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { List } from 'src/app/models/List.model';
import { Person } from 'src/app/models/Person.model';
import { EventsService } from 'src/app/services/events.service';
import { ListService } from 'src/app/services/lists.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  faTrasho = faTrash;
  faLeft = faArrowLeft;
  faRight = faArrowRight;
  faUp = faArrowUp;
  faDown = faArrowDown;
  faPlus = faPlus;
list_name:string = "";
selected_list_name:string = "";
selected_list_id:string = "";
selected_list:List;
lists:List[] = [];
selected_contacts:string[]=[];
mycontacts:Person[] = [];
selected_list_contacts:Person[] = [];
  constructor(
    private listService:ListService,
    private eventService:EventsService,
  ) { }
  
  thisList(id){
    this.selected_list_id = id;
    this.deleteList();
    console.log(this.selected_list_id)
  }
  selectContact(contact:Person){
    contact.selected = !contact.selected;
 
    if(!this.selected_contacts.includes(contact._id)){
      this.selected_contacts.push(contact._id);
    }
    console.log(this.selected_contacts)
  }
  selectList(contact:Person){
      contact.selected = !contact.selected;
 
    if(!this.selected_contacts.includes(contact._id)){
      this.selected_contacts.push(contact._id);
    }
    console.log(this.selected_contacts)
  }
  ngOnInit(): void {
    this.getMyLists()
 
    this.eventService.getUserContacts().subscribe(
      (data)=>{ 
          this.mycontacts = data['details']['friends'];
        },(error)=>{
        console.log("error")
        console.log(error)
       }
    )
  }
 
  addContactsTOList(){

    this.listService.addContactsToList(this.selected_list_id,this.selected_contacts).subscribe(
      (data)=>{
        console.log("data")
        console.log(data)
        window.location.reload()
        this.getMyLists()
        this.listService.swalMsgSuccess(data['msg']) 
      },(error)=>{
        console.log("error")
        console.log(error)
        // this.listService.swalMsgSuccess(error['msg'])
      }
    )
  }

  removeFromSelectedList(){ 
    console.log(this.selected_list_id)
    console.log(this.selected_contacts) 
    this.listService.removeFromSelectedList(this.selected_list_id,this.selected_contacts).subscribe(
      (data)=>{
        console.log("data")
        console.log(data)
        window.location.reload()
        this.getMyLists()
        this.listService.swalMsgSuccess(data['msg'])
      },(error)=>{
        console.log("error")
        console.log(error)
        // this.listService.swalMsgSuccess(error['msg'])
      }
    )
  }

  getListDetails(id){
    this.setSelectedListName(id)
    this.selected_list_contacts = []
        this.listService.getListDetails(id).subscribe(
      (data)=>{
        this.selected_list = data['details']
 
        data['details']['contacts'].forEach(element => {
          if(this.mycontacts.includes(element)){
            let i = this.selected_list_contacts.indexOf(element);
            this.selected_list_contacts.splice(i,1);
          }else{
            
            this.selected_list_contacts.push(element);
            let i = this.mycontacts.indexOf(element);
            this.mycontacts.splice(i,1);
          }
        
        });
 
        // this.getMyLists()
        // this.listService.swalMsgSuccess(data['msg'])
      },(error)=>{
        console.log("error")
        console.log(error)
        // this.listService.swalMsgSuccess(error['msg'])
      }
    )
   }
  
  setSelectedListName(id){
    let x = this.lists.find(x=>x['_id'] == id);
    this.selected_list_name = x['name'];
  }

  createList(){
    if(!this.list_name){
      this.listService.swalMsgError('Form invalid',"Please enter a list name")
      return;
    }else{

      this.listService.createList(this.list_name).subscribe(
        (data)=>{
          console.log("data")
          console.log(data)
          this.list_name = "";
          this.getMyLists()
          this.listService.swalMsgSuccess(data['msg'])
        },(error)=>{
          console.log("error")
          console.log(error)
          // this.listService.swalMsgSuccess(error['msg'])
        }
        )
      }
  }

  deleteList(){
    this.listService.deleteList(this.selected_list_id).subscribe(
      (data)=>{
        console.log("data")
        console.log(data)
        this.getMyLists()
        this.listService.swalMsgSuccess(data['msg'])
      },(error)=>{
        console.log("error")
        console.log(error)
        // this.listService.swalMsgSuccess(error['msg'])
      }
      )
  }
  
  getMyLists(){
    this.lists = [];
    this.listService.getMyLists().subscribe(
      (data:[])=>{
     
        if(data['details'].length){ 
          this.lists = data['details']
           this.selected_list_name = this.lists['0']['name']
          if(!this.selected_list_id){ 
            this.selected_list_id = this.lists['0']['_id']
            this.getListDetails(this.selected_list_id)
          }
        }
       },(error)=>{
        console.log("error")
        console.log(error)
       }
    )
  }
}
