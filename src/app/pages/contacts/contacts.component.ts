import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  closeResult: string;

  faCheck = faCheck;
  faTimes = faTimes
  contacts: [];

  constructor(private modalService: NgbModal,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers(){
    this.userService.getAllUsers().subscribe(
      (data: []) => {
        console.log(data)
        this.contacts = data['details'];
      }, (error) => {
        console.log(error)
      });
  }
  sendFriendRequest(id) {
    console.log('send friend request')
    this.userService.sendFriendRequest(id).subscribe(
      (data) => {
         swal.fire("response", data['msg'], "success");
        this.getAllUsers();
      }, (error) => {
        console.log(error)
      }
    )
  }
  cancelFriendRequest(id) {
    console.log('send friend request')
    this.userService.cancelFriendRequest(id).subscribe(
      (data) => {
         swal.fire("response", data['msg'], "success");
        this.getAllUsers();
      }, (error) => {
        console.log(error)
      }
    )
  }
  unFriend(id) {
     this.userService.unFriend(id).subscribe(
      (data) => {
        console.log(data)
         swal.fire("response", data['msg'], "success");
        this.getAllUsers();
      }, (error) => {
        console.log(error)
      }
    )
  }
  isFriendReqSent(friendReq:any[]){
    let myId= JSON.parse(localStorage.getItem('user'))['_id']
    let x = friendReq.filter(x=> x.sender==myId)
    if(x.length>0){ 
      return true
    }else{
      return false;
    } 
  }
  isFriend(friend){
    let myId= JSON.parse(localStorage.getItem('user'))['_id']
    if(friend.friends){
      if(friend.friends.length>0){
      if(friend.friends.includes(myId)){ 
           return true
        }else{
            return false;
          } 
          } 
        }
  }

  open(content, type, modalDimension) {
    if (modalDimension === 'sm' && type === 'modal_mini') {
      this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else if (modalDimension === '' && type === 'Notification') {
      this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else {
      this.modalService.open(content, { centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: $reason';
    }
  }


}
