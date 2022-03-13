import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {StoryViewItem} from "../../../services/story/StoryViewItem";
import {StoryService} from "../../../services/story/story.service";
import {plainToClass} from "class-transformer";
import {StoryMeItem} from "../../../services/story/StoryMeItem";

@Component({
  selector: 'app-views-sheet',
  templateUrl: './views-sheet.component.html',
  styleUrls: ['./views-sheet.component.scss']
})
export class ViewsSheetComponent implements AfterViewInit {

  views: StoryViewItem[] = [];
  loading = false;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ViewsSheetComponent>,
    private storyService: StoryService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public storyMeItem: StoryMeItem
  ) { }

  ngAfterViewInit(): void {
    this.loadViews(this.storyMeItem, 0);
  }

  loadViews(storyMeItem?: StoryMeItem, offset?: number): void {
    if(this.loading) {
      return;
    }

    this.loading = true;
    this.storyService.viewList(storyMeItem,offset ?? this.views.length)
      .subscribe((stories) => {
        this.views = this.views.concat(stories.map(s => plainToClass(StoryMeItem, s)));
        this.loading = false;
      });
  }

  close(){
    this.bottomSheetRef.dismiss();
  }
}
