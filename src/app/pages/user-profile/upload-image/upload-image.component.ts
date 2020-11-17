import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Person } from "src/app/models/Person.model";
import { UserService } from "src/app/services/user.service";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-upload-image",
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.css"],
})
export class UploadImageComponent implements OnInit {
  @Input()
  public photoUrl: string;
  @Input()
  public name: string;

  loading: boolean = false;
  faRobot = faRobot;
  @Input() public editing: boolean = true;
  show_upload: boolean;

  profileImageChangedStatus = "init";
  uploadImageLabel = "Choose file (max size 1MB)";
  imageFileIsTooBig = false;
  selectedFileSrc: string;
  userData: Person;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log("=====================================");
    this.userData = JSON.parse(localStorage.getItem("user"));
    if (this.userData.photo == null) {
      this.userData.photo = null;
    }
    console.log(this.userData);
  }

  changeImage(imageInput: HTMLInputElement) {
    const file: File = imageInput.files[0];
    this.uploadImageLabel = `${file.name} (${(file.size * 0.000001).toFixed(
      2
    )} MB)`;
    if (file.size > 1048576) {
      this.imageFileIsTooBig = true;
    } else {
      this.imageFileIsTooBig = false;
      const reader = new FileReader();

      reader.addEventListener("load", (event: any) => {
        this.selectedFileSrc = event.target.result;
        console.log("updloaing image");
        console.log(this.userData._id);
        this.userService.uploadProfileImage(this.userData._id, file).subscribe(
          (response) => {
            console.log(response);
            this.userService.resetUser();
            // this.userData.profile.imageUrl = response.url;
          },
          (err) => {
            console.log(err);
          }
        );
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
}
