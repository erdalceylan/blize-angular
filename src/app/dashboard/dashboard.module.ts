import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {StoryModule} from '../shared/story/story.module';
import {MatDialogModule} from '@angular/material/dialog';
import {AvatarModule} from "../shared/avatar/avatar.module";
import {InfiniteScrollModule} from "ngx-infinite-scroll";



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatDialogModule,
    StoryModule,
    AvatarModule,
    InfiniteScrollModule
  ]
})
export class DashboardModule { }
