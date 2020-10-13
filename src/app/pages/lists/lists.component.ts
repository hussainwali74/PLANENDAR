import { Component, OnInit } from '@angular/core';
import { faAlignLeft, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
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
lists:[] = [];
  constructor(
    private listService:ListService,
  ) { }
  thisList(id){
 this.selected_list_id = id;
 this.deleteList();
console.log(this.selected_list_id)
  }
  ngOnInit(): void {
    this.getMyLists()
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
      (data)=>{
        this.lists = data['details']
        console.log("data")
        console.log(this.lists)
        // this.listService.swalMsgSuccess(data['msg'])
      },(error)=>{
        console.log("error")
        console.log(error)
        // this.listService.swalMsgSuccess(error['msg'])
      }
    )
  }
}
