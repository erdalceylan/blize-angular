import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListStoryDialogComponent } from './list-story-dialog/list-story-dialog.component';
import {SwiperModule} from 'swiper/angular';
import { CubeFaceComponent } from './cube-face/cube-face.component';
import { TimerLineItemComponent } from './cube-face/timer-line-item/timer-line-item.component';
import {FormsModule} from "@angular/forms";
import {AvatarModule} from "../avatar/avatar.module";
import { AddStoryDialogComponent } from './add-story-dialog/add-story-dialog.component';
import { MeStoryDialogComponent } from './me-story-dialog/me-story-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [ListStoryDialogComponent, CubeFaceComponent, TimerLineItemComponent, AddStoryDialogComponent, MeStoryDialogComponent],
  imports: [
    CommonModule,
    SwiperModule,
    FormsModule,
    AvatarModule,
    MatDialogModule
  ],
  exports: [
    ListStoryDialogComponent
  ]
})
export class StoryModule { }
