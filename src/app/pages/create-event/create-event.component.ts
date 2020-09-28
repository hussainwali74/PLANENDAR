import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
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
