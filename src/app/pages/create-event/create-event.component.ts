import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  dynamicForm: FormGroup;
  submitted = false;
  privatee: boolean = true;
  event_id: string;
  editing: boolean = false;
  private sub: any;
  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dynamicForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      description: ['', Validators.required],
      privacity: [true],
      extra_fields: new FormArray([])
    });

    console.log('create event ')

    this.sub = this.route.params.subscribe(params => {
      console.log(params)
      this.event_id = params['event_id']
      console.log("this.event_id")
      console.log(this.event_id)
    });
    if (this.event_id != undefined) {
      this.eventService.getEventByID(this.event_id).subscribe(
        (data) => {
          console.log(data)
          this.dynamicForm.patchValue(data['details'])
          this.editing = true;
        }
      )
    }


  }
  ngOnDestroy() {
    this.sub.unsubscribe();

  }
  privacityChange() {
    this.privatee = !this.privatee;
  }
  // convenience getters for easy access to form fields
  get f() { return this.dynamicForm.controls; }
  get extraField() { return this.f.extra_fields as FormArray; }

  addField() {
    let control = <FormArray>this.dynamicForm.controls["extra_fields"];
    let newRow: FormGroup = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });
    control.push(newRow);
  };

  deleteField() {
    if (this.extraField.length) {
      this.extraField.removeAt(this.extraField.length - 1);
    }
  };

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
        this.eventService.swalMsgError("Invalid Form", 'Please fill these fields : ' + invalid.toString());
      } else if (invalid.length == 1) {
        this.eventService.swalMsgError("Invalid Form", 'Please fill the  ' + invalid.toString().toUpperCase() + " field");
      }
      return;
    }
    this.dynamicForm.value.privacity = this.dynamicForm.value.privacity ? "private" : "public";

    if (this.editing) {
      this.eventService.updateEvent(this.dynamicForm.value, this.event_id).subscribe(
        (data) => {
          this.onReset();
          this.eventService.swalMsgSuccess('Event Updated');
          this.router.navigateByUrl('/events/created');
        },
        (error) => {
          console.log(error)
        }
      )
    } else {

      this.eventService.createEvent(this.dynamicForm.value).subscribe(
        (data) => {
          this.onReset();
          this.eventService.swalMsgSuccess('Event Created');
          this.router.navigateByUrl('/events/created');
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }
  onCancel() {
    this.router.navigateByUrl('/')
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
