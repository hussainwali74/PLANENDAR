import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  dynamicForm: FormGroup;
  submitted = false;
  privatee: boolean = true;;
  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventsService,
  ) { }

  ngOnInit(): void {
    this.dynamicForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      description: ['', Validators.required],
      privacity: [true, Validators.required],
      extra_fields: new FormArray([])
    });

    console.log('create event ')
  }
  privacityChange() {
    console.log(this.privatee)
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
    console.log(this.dynamicForm)
  };

  deleteField() {
    if (this.extraField.length) {
      this.extraField.removeAt(this.extraField.length - 1);
    }
  };

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    }
    this.dynamicForm.value.privacity = this.dynamicForm.value.privacity ? "private" : "public";
    console.log(this.dynamicForm.value)
    return;
    this.eventService.createEvent(this.dynamicForm.value).subscribe(
      (data) => {
        console.log(data)
        this.onReset();
        this.eventService.swalMsgSuccess('Event Created');
      },
      (error) => {
        console.log(error)
      }
    )
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
