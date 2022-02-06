import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {SearchRoutingModule} from './search-routing.module';
import {FormsModule} from '@angular/forms';
import {AvatarModule} from "../shared/avatar/avatar.module";

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    AvatarModule
  ]
})
export class SearchModule { }
