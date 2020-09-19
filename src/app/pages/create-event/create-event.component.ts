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
      extra_fields: new FormArray([])
    });

    console.log('create event ')
  }

  // convenience getters for easy access to form fields
  get f() { return this.dynamicForm.controls; }
  get extraField() { return this.f.extra_fields as FormArray; }

  addField() {
    // this.extraField.push(this.formBuilder.group({
    //   title: ['', Validators.required],
    //   description: ['', Validators.required],
    // }));
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
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4));
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
