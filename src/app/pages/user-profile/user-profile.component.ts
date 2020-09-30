import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';
import { s3 } from 'fine-uploader/lib/core/s3';
import { UploadService } from 'src/app/services/upload.service';
import * as S3 from 'aws-sdk/clients/s3';




@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  bucketName = 'planendar-images';

  uploader: any;


  enableEdit: boolean = false;
  form: FormGroup;
  profile: { photo: string, name: string, email: string } = { email: '-', name: '-', photo: '-' };
  submitted: boolean;

  selectedFiles: FileList;
  profile_photo_link: string;


  constructor(private eventService: EventsService,
    private userService: UserService, private fb: FormBuilder,
    private uploadService: UploadService,) { }


  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: [],
    });
    this.getProfile();
  }

  getProfile() {
    this.userService.getProfile().subscribe(
      (data) => {
        console.log(data)
        this.profile = data['details']
        this.form.get('name').patchValue(this.profile.name)
        this.form.get('email').patchValue(this.profile.email)
      }, e => {
        console.log(e)
      }
    )
  }
  upload() {
    const file = this.selectedFiles.item(0);

    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: 'AKIASJPFOIKSRO746TXE',
        secretAccessKey: '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',
        region: 'eu-west-2'
      }
    );
    const params = {
      Bucket: 'planendar-images-2',
      // Key: this.FOLDER + file.name,
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, (err, data) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      console.log(data['Location'])
      // this.userService.updateProfile(body).subscribe(

      this.userService.updateProfilePhoto(data['Location']).subscribe(
        (data) => {
          console.log(data)
          this.eventService.swalMsgSuccess("Profile photo updated");
          this.enableEdit = false;
          this.getProfile();

        },
        er => console.log(er)
      )

    });

    console.log('---------------------------------')
    console.log(this.profile_photo_link)
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }


  editPage() {
    this.enableEdit = true;
  }

  onSubmit(body) {
    console.log(body)
    this.submitted = true;
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.form.invalid) {

      if (invalid.length > 1) {
        this.eventService.swalMsgError("Invalid Form", 'Please fill these fields : ' + invalid.toString());
      } else if (invalid.length == 1) {
        this.eventService.swalMsgError("Invalid Form", 'Please fill the  ' + invalid.toString().toUpperCase() + " field");
      }
      return;
    }
    console.log("onsubmit body")
    console.log(body)
    // return;
    this.userService.updateProfile(body).subscribe(
      (data) => {
        console.log(data)
        if (data['result'] == true) {
          this.eventService.swalMsgSuccess("Profile updated");
          this.enableEdit = false;
        }
      }, (error) => {
        console.log(error)
      }
    )
  }

  cancelEdit() {
    this.enableEdit = false;
  }


}
