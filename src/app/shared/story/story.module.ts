import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListStoryDialogComponent } from './list-story-dialog/list-story-dialog.component';
import {SwiperModule} from 'swiper/angular';
import { CubeFaceComponent } from './cube-face/cube-face.component';


@NgModule({
  declarations: [ListStoryDialogComponent, CubeFaceComponent],
  imports: [
    CommonModule,
    SwiperModule
  ],
  exports: [
    ListStoryDialogComponent
  ]
})
export class StoryModule { }
