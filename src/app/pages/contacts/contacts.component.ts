import { Component, OnInit } from "@angular/core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "src/app/services/user.service";
import swal from "sweetalert2";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.css"],
})
export class ContactsComponent implements OnInit {
  closeResult: string;

  faCheck = faCheck;
  faTimes = faTimes;

  modalUser: any;

  contacts: [];
  term;

  private colors = [
    "#EB7181", // red
    "#468547", // green
    "#FFD558", // yellow
    "#3670B2", // blue
  ];

  public initials: string;
  public circleColor: string;

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    const randomIndex = Math.floor(
      Math.random() * Math.floor(this.colors.length)
    );
    this.circleColor = this.colors[randomIndex];
  }

  private createInititals(name): void {
    let initials = "";

    for (let i = 0; i < name.length; i++) {
      if (name.charAt(i) === " ") {
        continue;
      }

      if (name.charAt(i) === name.charAt(i).toUpperCase()) {
        initials += name.charAt(i);

        if (initials.length == 2) {
          break;
        }
      }
    }
    this.initials = initials;
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data: []) => {
        data["details"].forEach((element) => {
          element.rank = 0;
        });

        this.contacts = data["details"];
        console.log(this.contacts);
        this.contacts.forEach((element) => {
          this.isFriend(element);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sendFriendRequest(id) {
    console.log("send friend request");
    this.userService.sendFriendRequest(id).subscribe(
      (data) => {
        swal.fire("response", data["msg"], "success");
        this.getAllUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancelFriendRequest(id) {
    console.log("send friend request");
    this.userService.cancelFriendRequest(id).subscribe(
      (data) => {
        swal.fire("response", data["msg"], "success");
        this.getAllUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  unFriend(id) {
    swal
      .fire({
        title: "Are you sure?",
        text: "Do you want to unfriend this friend?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Unfriend",
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.value) {
          console.log(result.value);
          this.userService.unFriend(id).subscribe(
            (data) => {
              console.log(data);
              swal.fire("response", data["msg"], "success");
              this.getAllUsers();
            },
            (error) => {
              console.log(error);
            }
          );
        } else if (result.dismiss === swal.DismissReason.cancel) {
        }
      });
  }
  isFriendReqSent(friendReq: any[]) {
    let myId = JSON.parse(localStorage.getItem("user"))["_id"];
    let x = friendReq.filter((x) => x.sender == myId);
    console.log(x);
    if (x.length > 0) {
      if (x["0"]["status"] == "rejected") {
        return false;
      }
      return true;
    }
    // else if(x.){

    // }
    else {
      return false;
    }
  }
  isFriend(friend) {
    let myId = JSON.parse(localStorage.getItem("user"))["_id"];
    if (friend.friends) {
      if (friend.friends.length > 0) {
        if (friend.friends.includes(myId)) {
          friend.rank = 1;
          this.contacts.sort(function (a, b) {
            return b["rank"] - a["rank"];
          });
          return true;
        } else {
          return false;
        }
      }
    }
  }

  open(content, type, modalDimension, modalUser) {
    if (modalUser) {
      this.modalUser = modalUser.sender;
      console.log(modalUser);
    }
    if (modalDimension === "sm" && type === "modal_mini") {
      this.modalService
        .open(content, {
          windowClass: "modal-mini",
          size: "sm",
          centered: true,
        })
        .result.then(
          (result) => {
            this.closeResult = "Closed with: $result";
          },
          (reason) => {
            this.closeResult = "Dismissed $this.getDismissReason(reason)";
          }
        );
    } else if (modalDimension === "" && type === "Notification") {
      this.modalService
        .open(content, { windowClass: "modal-danger", centered: true })
        .result.then(
          (result) => {
            this.closeResult = "Closed with: $result";
          },
          (reason) => {
            this.closeResult = "Dismissed $this.getDismissReason(reason)";
          }
        );
    } else {
      this.modalService.open(content, { centered: true }).result.then(
        (result) => {
          this.closeResult = "Closed with: $result";
        },
        (reason) => {
          this.closeResult = "Dismissed $this.getDismissReason(reason)";
        }
      );
    }

    this.modalUser = modalUser;
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return "with: $reason";
    }
  }
}
