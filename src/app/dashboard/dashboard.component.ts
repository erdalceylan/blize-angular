import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {UsersService} from '../shared/services/users/users.service';
import {ListStoryDialogComponent} from '../shared/story/list-story-dialog/list-story-dialog.component';
import {plainToClass} from 'class-transformer';
import {StaticService} from '../shared/services/static.service';
import {StoryGroup} from "../shared/services/story/storyGroup";
import {StoryService} from "../shared/services/story/story.service";
import {MeStoryDialogComponent} from "../shared/story/me-story-dialog/me-story-dialog.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('scrollContent') scrollContent: ElementRef|undefined;
  storyLoading = false;
  stories: StoryGroup[] = [];

  constructor(
    private storyService: StoryService,
    public dialog: MatDialog,
    public ss: StaticService,
    public usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.loadStories();
  }

  clickStoryItem(stories: StoryGroup): void{
    console.log(stories);
    const ref = this.dialog.open(ListStoryDialogComponent, {
      panelClass: 'story-dialog-panel',
      data: {stories: this.stories, showItem: stories}
    });

    const subscriber = ref.componentInstance.imageChange.subscribe((story) => {
      if (!story.seen) {
        this.storyService.seen(story).subscribe(()=> {
          story.seen =true;
        });
      }
    });

    ref.afterClosed().subscribe(() => {
      subscriber.unsubscribe();
    })

  }

  clickAddStory(): void{
    this.dialog.open(MeStoryDialogComponent, {
      panelClass: 'me-story-dialog-panel',
      data: null
    });
  }

  loadStories(offset?: number): void {
    if(this.storyLoading) {
      return;
    }

    this.storyLoading = true;
    this.storyService.list(offset ?? this.stories.length)
      .subscribe((stories) => {
        this.stories = this.stories.concat(stories.map(s => plainToClass(StoryGroup, s)));
        this.storyLoading = false;
        console.log(this.stories);
      });
  }

  scrollTest(test: any) {
    console.log(test)
  }
}
