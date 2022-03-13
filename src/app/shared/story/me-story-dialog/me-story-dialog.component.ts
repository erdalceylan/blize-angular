import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsersService} from "../../services/users/users.service";
import {AddStoryDialogComponent} from "../add-story-dialog/add-story-dialog.component";
import {StoryService} from "../../services/story/story.service";
import {plainToClass} from "class-transformer";
import {StaticService} from "../../services/static.service";
import {StoryMeItem} from "../../services/story/StoryMeItem";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ViewsSheetComponent} from "./views-sheet/views-sheet.component";

@Component({
  selector: 'app-me-story-dialog',
  templateUrl: './me-story-dialog.component.html',
  styleUrls: ['./me-story-dialog.component.scss']
})
export class MeStoryDialogComponent implements OnInit {


  meStories: StoryMeItem[] = [];
  _paused = false;
  imageIndex = 0;
  constructor(
    public dialogRef: MatDialogRef<MeStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public usersService:UsersService,
    private storyService: StoryService,
    public ss: StaticService,
    public bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.loadMeStories();
  }

  getActiveItem(): any{
    return null;
  }

  openImageCropper(file: File){
    const ref = this.dialog.open(AddStoryDialogComponent, {
      panelClass: 'add-story-dialog-panel',
      data: file
    });

    ref.afterClosed().subscribe((blob: Blob)=> {
      if (blob) {
        this.storyService.add(blob)
          .subscribe((res)=> {
            this.meStories.unshift(plainToClass(StoryMeItem, res));
          })
      }
    });
  }

  openBottomSheet(storyMeItem: StoryMeItem){
    if(!storyMeItem.viewsLength){
      return;
    }

    const ref = this.bottomSheet.open(ViewsSheetComponent,{
      panelClass: 'story-me-view-bottom-sheet',
      data: storyMeItem
    });
    this.pause(null);

    ref.afterDismissed().subscribe(()=>{
      this.unPause(null);
    });
  }

  loadMeStories(): void{
    this.storyService.meList()
      .subscribe((stories) => {
        this.meStories = stories.map(s => plainToClass(StoryMeItem, s));
      });
  }

  delete(index:number){
    const storyId = this.meStories[index].id ?? '' ;

    this.storyService.delete(storyId)
      .subscribe( ()=> {
        this.meStories = this.meStories.filter((i) => {
          return i.id != storyId
        });
      });
  }

  readImage(e: any) {
    const target = e.target;
    if (target?.files?.length) {
      this.openImageCropper(target.files[0]);
    }
  }

  pause(e:any) {
    this._paused = true;
    e?.srcEvent?.stopPropagation();
  }

  unPause(e:any) {
    this._paused = false;
  }

  timeEnd(e:any) {
    this.tapRight(null);
  }

  tapLeft(e:any) {
    if (this.imageIndex > 0){
      this.imageIndex--;
    }
  }

  tapRight(e:any) {
    if (this.meStories.length > this.imageIndex + 1){
      this.imageIndex++;
    }
  }

  createEmptyArray(size:number): Array<any> {
    return new Array(size);
  }

  close(): void {
    this.dialogRef.close();
  }
}
