import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import {MessagesRoutingModule} from './messages-routing.module';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormsModule} from '@angular/forms';
import {InfiniteScrollModule} from "ngx-infinite-scroll";



@NgModule({
  declarations: [MessagesComponent],
    imports: [
        CommonModule,
        MessagesRoutingModule,
        MatListModule,
        MatGridListModule,
        FormsModule,
        InfiniteScrollModule
    ]
})
export class MessagesModule { }
