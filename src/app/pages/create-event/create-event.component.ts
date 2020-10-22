import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EventsService } from "src/app/services/events.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"],
})
export class CreateEventComponent implements OnInit {
  dynamicForm: FormGroup;
  submitted = false;
  privatee: boolean = false; //public == true; private == false;
  event_id: string;
  editing: boolean = false;
  private sub: any;
  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.formBuilder.group({
      title: ["", Validators.required],
      date: ["", Validators.required],
      time: ["", Validators.required],
      description: ["", Validators.required],
      privacity: [Boolean],
      extra_fields: new FormArray([]),
    });

    this.sub = this.route.params.subscribe((params) => {
      this.event_id = params["event_id"];
    });
    if (this.event_id != undefined) {
      this.eventService.getEventByID(this.event_id).subscribe((data) => {
        console.log(data["details"]["privacity"]);
        if (data["details"]["privacity"] == "public") {
          this.privatee = true;
          data["details"]["privacity"] = true;
        } else {
          data["details"]["privacity"] = false;
          this.privatee = false;
        }

        this.dynamicForm.patchValue(data["details"]);
        this.dynamicForm.get("privacity").patchValue(this.privatee);
        console.log("privateee");
        console.log(this.privatee);

        this.editing = true;
      });
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  privacityChange() {
    this.privatee = !this.privatee;
    console.log(this.privatee);
  }
  // convenience getters for easy access to form fields
  get f() {
    return this.dynamicForm.controls;
  }
  get extraField() {
    return this.f.extra_fields as FormArray;
  }

  addField() {
    let control = <FormArray>this.dynamicForm.controls["extra_fields"];
    let newRow: FormGroup = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });
    control.push(newRow);
  }

  deleteField() {
    if (this.extraField.length) {
      this.extraField.removeAt(this.extraField.length - 1);
    }
  }

  onSubmit() {
    this.submitted = true;
    const invalid = [];
    const controls = this.dynamicForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.dynamicForm.invalid) {
      if (invalid.length > 1) {
        this.eventService.swalMsgError(
          "Invalid Form",
          "Please fill these fields : " + invalid.toString()
        );
      } else if (invalid.length == 1) {
        this.eventService.swalMsgError(
          "Invalid Form",
          "Please fill the  " + invalid.toString().toUpperCase() + " field"
        );
      }
      return;
    }
    // return;
    console.log("this.dynamicForm.value.privacity");
    console.log(this.dynamicForm.value.privacity);

    // this.dynamicForm.value.privacity =
    //   ? "public"
    //   : "private";

    if (this.editing) {
      if (this.dynamicForm.value.privacity === true) {
        this.dynamicForm.value.privacity = "public";
      } else if (this.dynamicForm.value.privacity === false) {
        this.dynamicForm.value.privacity = "private";
      }
      console.log("updating");
      console.log(this.dynamicForm.value);
      this.eventService
        .updateEvent(this.dynamicForm.value, this.event_id)
        .subscribe(
          (data) => {
            this.onReset();
            this.eventService.getMyEvents().subscribe((data) => {
              localStorage.setItem("user", JSON.stringify(data["details"]));
            });
            this.eventService.swalMsgSuccess("Event Updated");
            this.router.navigateByUrl("/events/created");
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      if (this.dynamicForm.value.privacity === false) {
        this.dynamicForm.value.privacity = "public";
      } else if (this.dynamicForm.value.privacity === true) {
        this.dynamicForm.value.privacity = "private";
      }
      this.eventService.createEvent(this.dynamicForm.value).subscribe(
        (data) => {
          this.onReset();
          this.eventService.getMyEvents().subscribe((data) => {
            localStorage.setItem("user", JSON.stringify(data["details"]));
          });
          this.eventService.swalMsgSuccess("Event Created");
          this.router.navigateByUrl("/events/created");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  onCancel() {
    this._location.back();
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
    this.extraField.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.extraField.reset();
  }
}
