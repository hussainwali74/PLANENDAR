import { Component, OnInit } from "@angular/core";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { List } from "src/app/models/List.model";
import { Person } from "src/app/models/Person.model";
import { EventsService } from "src/app/services/events.service";
import { ListService } from "src/app/services/lists.service";
import swal from "sweetalert2";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"],
})
export class ListsComponent implements OnInit {
  closeResult: string;
  edit_list_name: string;

  term;
  faTrasho = faTrash;
  faLeft = faArrowLeft;
  faRight = faArrowRight;
  faPen = faPen;
  faUp = faArrowUp;
  faDown = faArrowDown;
  faPlus = faPlus;
  list_name: string = "";
  selected_list_name: string = "";
  selected_list_id: string = "";
  selected_list: List;
  allMylists: List[] = [];
  selected_contacts: string[] = [];
  allMyContacts: Person[] = [];
  allMyContactsTemp: Person[] = [];
  selected_list_contacts: Person[] = [];
  edit_list: boolean = false;

  constructor(
    private listService: ListService,
    private eventService: EventsService,
    private modalService: NgbModal
  ) {}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return "with: $reason";
    }
  }
  ngOnInit(): void {
    this.selected_list_id = localStorage.getItem("selected_list_id");
    this.getMyLists();
    this.getAllMyContacts();
  }

  getAllMyContacts() {
    this.allMyContacts = [];
    this.eventService.getUserContacts().subscribe(
      (data) => {
        this.allMyContactsTemp = this.allMyContacts =
          data["details"]["friends"];
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  }

  deleteThisList(id) {
    this.selected_list_id = id;
    this.deleteList();
    console.log(this.selected_list_id);
  }
  editThisList(id) {
    this.edit_list = true;
    this.selected_list_id = id;
    this.getListDetails(id);
    localStorage.setItem("list_id", id.toString());
  }

  selectContact(contact: Person) {
    contact.selected = !contact.selected;
    if (contact.selected) {
      if (!this.selected_contacts.includes(contact._id)) {
        this.selected_contacts.push(contact._id);
      }
    } else {
      if (this.selected_contacts.includes(contact._id)) {
        this.selected_contacts = this.selected_contacts.filter(
          (x) => x != contact._id
        );
      }
    }
  }

  selectList(contact: Person) {
    contact.selected = !contact.selected;

    if (!this.selected_contacts.includes(contact._id)) {
      this.selected_contacts.push(contact._id);
    }
    console.log(this.selected_contacts);
  }

  addContactsTOList() {
    console.log("this.selected_list_id");
    console.log(this.selected_list_id);
    console.log("this.selected_contacts");
    console.log(this.selected_contacts);
    if (this.allMylists.length <= 0) {
      swal.fire("response", "Please create a list first", "error");
    }
    if (!this.selected_list_id) {
      swal.fire("response", "Please select a list", "error");
      return;
    }
    if (this.selected_contacts == null || this.selected_contacts.length == 0) {
      swal.fire("response", "Please select contacts", "error");
      return;
    }
    this.listService
      .addContactsToList(this.selected_list_id, this.selected_contacts)
      .subscribe(
        (data) => {
          console.log("data");
          console.log(data);
          window.location.reload();
          this.getMyLists();
          this.listService.swalMsgSuccess(data["msg"]);
        },
        (error) => {
          console.log("error");
          console.log(error);
          // this.listService.swalMsgSuccess(error['msg'])
        }
      );
  }

  removeFromSelectedList() {
    console.log(this.selected_list_id);
    console.log(this.selected_contacts);
    this.listService
      .removeFromSelectedList(this.selected_list_id, this.selected_contacts)
      .subscribe(
        (data) => {
          console.log("data");
          console.log(data);
          window.location.reload();
          this.getMyLists();
          this.listService.swalMsgSuccess(data["msg"]);
        },
        (error) => {
          console.log("error");
          console.log(error);
          // this.listService.swalMsgSuccess(error['msg'])
        }
      );
  }
  refreshContacts() {
    console.log("\n 137 refreshing tempcontacts \n");
    this.allMyContactsTemp = this.allMyContacts;
  }

  getListDetails(id) {
    console.log(id);
    this.setSelectedListName(id);
    this.selected_list_contacts = [];
    this.refreshContacts();
    this.listService.getListDetails(id).subscribe(
      (data) => {
        this.selected_list = data["details"];
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log(this.selected_list);
        if (data["details"]["contacts"].length) {
          this.selected_list_contacts = this.selected_list.contacts;
          let ids_array = this.selected_list_contacts.map((e) => e._id);
          console.log(this.allMyContactsTemp);
          this.allMyContactsTemp = this.allMyContactsTemp.filter((e) => {
            return !ids_array.includes(e._id);
          });

          if (this.edit_list) {
            this.selected_list_name = this.selected_list.name;
          }
        } else {
          this.refreshContacts();
        }
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  }

  open(content, type, modalDimension) {
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
  }
  updateList() {
    console.log("selected_list_name");
    console.log(this.selected_list_name);
    console.log(this.selected_list_id);
    if (!this.selected_list_name) {
      this.listService.swalMsgError("Form invalid", "Please enter a list name");
      return;
    } else {
      this.listService
        .updateList({
          list_name: this.selected_list_name,
          list_id: this.selected_list_id,
        })
        .subscribe(
          (data) => {
            this.selected_list_name = "";
            this.edit_list = false;
            this.getMyLists();
            this.listService.swalMsgSuccess(data["msg"]);
          },
          (error) => {
            console.log("error");
            console.log(error);
            // this.listService.swalMsgSuccess(error['msg'])
          }
        );
    }
  }
  cancelUpdateList() {
    this.edit_list = false;
  }

  setSelectedListName(id) {
    this.selected_list_id = id;
    localStorage.setItem("selected_list_id", this.selected_list_id);
    let x = this.allMylists.find((x) => x["_id"] == id);
    this.selected_list_name = x["name"];
  }

  createList() {
    if (!this.list_name) {
      this.listService.swalMsgError("Form invalid", "Please enter a list name");
      return;
    } else {
      this.listService.createList(this.list_name).subscribe(
        (data) => {
          this.list_name = "";
          this.getMyLists();
          this.listService.swalMsgSuccess(data["msg"]);
        },
        (error) => {
          console.log("error");
          console.log(error);
          // this.listService.swalMsgSuccess(error['msg'])
        }
      );
    }
  }

  deleteList() {
    this.listService.deleteList(this.selected_list_id).subscribe(
      (data) => {
        this.getMyLists();
        this.listService.swalMsgSuccess(data["msg"]);
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  }
  editList() {
    this.getListDetails(this.selected_list_id);
  }

  getMyLists() {
    this.allMylists = [];
    this.listService.getMyLists().subscribe(
      (data: []) => {
        // console.log("197:all mylists");
        // console.log(data);
        if (data["details"].length) {
          this.allMylists = data["details"];
          this.selected_list_name = this.allMylists["0"]["name"];
          if (!this.selected_list_id) {
            console.log('localStorage.getItem("selected_list_id")');
            console.log(localStorage.getItem("selected_list_id"));
            if (!localStorage.getItem("selected_list_id")) {
              this.selected_list_id = this.allMylists["0"]["_id"];
            } else {
              this.selected_list_id = localStorage.getItem("selected_list_id");
            }
            this.getListDetails(this.selected_list_id);
          } else {
            this.selected_list_id = localStorage.getItem("selected_list_id");
          }
          this.getListDetails(this.selected_list_id);
        }
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  }
}
