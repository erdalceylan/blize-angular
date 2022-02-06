import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsersService} from "../../services/users/users.service";
import {AddStoryDialogComponent} from "../add-story-dialog/add-story-dialog.component";
import {StoryService} from "../../services/story/story.service";

@Component({
  selector: 'app-me-story-dialog',
  templateUrl: './me-story-dialog.component.html',
  styleUrls: ['./me-story-dialog.component.scss']
})
export class MeStoryDialogComponent implements OnInit {

  public items = [];
  constructor(
    public dialogRef: MatDialogRef<MeStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public usersService:UsersService,
    private storyService: StoryService
  ) { }

  ngOnInit(): void {
  }

  getActiveItem(): any{
    return null;
  }

  timeEnd(e: any){

  }
  openImageCropper(file: File){
    const ref = this.dialog.open(AddStoryDialogComponent, {
      panelClass: 'add-story-dialog-panel',
      data: file
    });

    ref.afterClosed().subscribe((blob: Blob)=> {
      this.storyService.add(blob)
        .subscribe((res)=> {
          console.log(res);
        })
    });
  }

  readImage(e: any) {
    const target = e.target;
    if (target?.files?.length) {
      this.openImageCropper(target.files[0]);
    }
    console.log(e);
  }

  close(): void {
    this.dialogRef.close();
  }
}
