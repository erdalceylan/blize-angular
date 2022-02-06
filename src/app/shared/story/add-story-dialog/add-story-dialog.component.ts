import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import Cropper from 'cropperjs';
import {UsersService} from "../../services/users/users.service";

@Component({
  selector: 'app-add-story-dialog',
  templateUrl: './add-story-dialog.component.html',
  styleUrls: ['./add-story-dialog.component.scss']
})
export class AddStoryDialogComponent implements AfterViewInit {

  @ViewChild('cropperImage') public imageCropper?:ElementRef;
  public cropper?: Cropper;
  constructor(
    public dialogRef: MatDialogRef<AddStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: File,
    public usersService: UsersService
  ) {

  }

  ngAfterViewInit(): void {

      const fr = new FileReader();
      fr.onload = (event) => {
        if (this.imageCropper) {

          this.imageCropper.nativeElement.src = event?.target?.result;

          this.cropper = new Cropper(this.imageCropper.nativeElement,{
            dragMode: 'move',
            autoCropArea: 1,
            viewMode: 3,
            guides: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false
          });

        }
      };

      fr.readAsDataURL(this.data);
  }

  rotateRight() {
    this.cropper?.rotate(90);
  }

  rotateLeft() {
    this.cropper?.rotate(-90);
  }

  sendFile() {
   this.cropper?.getCroppedCanvas().toBlob((blop) => {
      console.log(blop);
      this.dialogRef.close(blop);
    });

  }
  close(): void {
    this.dialogRef.close();
  }

}
