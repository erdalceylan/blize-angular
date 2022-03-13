import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StoryGroup} from "../../services/story/storyGroup";
import {Story} from "../../services/story/story";

@Component({
  selector: 'app-list-story-dialog',
  templateUrl: './list-story-dialog.component.html',
  styleUrls: ['./list-story-dialog.component.scss']
})
export class ListStoryDialogComponent implements OnInit {

  @ViewChild('cube') public cube?: ElementRef;
  @Output('imageChange') public imageChange = new EventEmitter<Story>();
  @Output('sendMessage') public sendMessage = new EventEmitter<{story:Story, text: string}>();
  rotateClass: 'rotate-left'|'rotate-right'|'rotate-reset'|'' = '';
  cubeRotate = 0;
  frontIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<ListStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {stories: StoryGroup[], showItem: StoryGroup}
    ) { }

  ngOnInit(): void {
    this.frontIndex = this.data.stories.indexOf(this.data.showItem);
  }

  pan(e:any) {

    const width = this.cube?.nativeElement.offsetWidth;
    const angle = 90 / width * e.deltaX

    if (Math.abs(angle) <= 90) {
      if (!(this.isFirstFace() && angle < 0) || !(this.isLastFace() && angle > 0)) {
        this.cubeRotate =  angle;
      }
    }
  }

  panEnd(e:any) {

    const width = this.cube?.nativeElement.offsetWidth;
    const angle = 90 / width * e.deltaX

    if (Math.abs(angle) >= 30) {
      this.rotate(angle > 0 ? 'left' : 'right');
    } else {
      this.rotate('reset');
    }
  }

  rotate(direction:'left'|'right'|'reset') {
    if (direction == "left") {
      if (this.frontIndex > 0) {
        this.rotateClass = 'rotate-left';
      } else {
        this.close();
      }
    } else if (direction == "right") {
      if (this.frontIndex < this.data.stories.length - 1) {
        this.rotateClass = 'rotate-right';
      } else {
        this.close();
      }
    } else if (direction == 'reset') {
      this.rotateClass = 'rotate-reset';
    }

    setTimeout(()=>{
      this.cubeRotate = 0;
      if (this.rotateClass == 'rotate-left') {
        this.frontIndex --;
      }
      if (this.rotateClass == 'rotate-right') {
        this.frontIndex ++;
      }

      this.rotateClass ='';
    }, 400)
  }

  isFirstFace() {
    return this.frontIndex == 0;
  }

  isLastFace() {
    return this.frontIndex >= this.data.stories.length - 1;
  }

  constextmenu(e:any) {
    return false;
  }

  close(): void {
    this.dialogRef.close();
  }
}
