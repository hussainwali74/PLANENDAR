import { Component, OnInit } from "@angular/core";
import {
  faAlignLeft,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { List } from "src/app/models/List.model";
import { Person } from "src/app/models/Person.model";
import { EventsService } from "src/app/services/events.service";
import { ListService } from "src/app/services/lists.service";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"],
})
export class ListsComponent implements OnInit {
  faTrasho = faTrash;
  faLeft = faArrowLeft;
  faRight = faArrowRight;
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

  constructor(
    private listService: ListService,
    private eventService: EventsService
  ) {}

  ngOnInit(): void {
    this.getMyLists();
    this.getAllMyContacts();
  }

  getAllMyContacts() {
    this.allMyContacts = [];
    this.eventService.getUserContacts().subscribe(
      (data) => {
        console.log("allmycontacts");
        this.allMyContactsTemp = this.allMyContacts =
          data["details"]["friends"];
        console.log(this.allMyContacts);
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
        if (data["details"]["contacts"].length) {
          this.selected_list_contacts = this.selected_list.contacts;
          let ids_array = this.selected_list_contacts.map((e) => e._id);
          console.log(this.allMyContactsTemp);
          this.allMyContactsTemp = this.allMyContactsTemp.filter((e) => {
            console.log(e);
            return !ids_array.includes(e._id);
          });
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

  setSelectedListName(id) {
    this.selected_list_id = id;
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
            this.selected_list_id = this.allMylists["0"]["_id"];
            this.getListDetails(this.selected_list_id);
          }
        }
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  }
}
