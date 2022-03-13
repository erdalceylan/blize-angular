import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {SearchRoutingModule} from './search-routing.module';
import {FormsModule} from '@angular/forms';
import {AvatarModule} from "../shared/avatar/avatar.module";
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    AvatarModule,
    InfiniteScrollModule
  ]
})
export class SearchModule { }
