import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {ChatRoutingModule} from './chat-routing.module';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {AvatarModule} from "../../shared/avatar/avatar.module";



@NgModule({
  declarations: [ChatComponent],
    imports: [
        CommonModule,
        FormsModule,
        ChatRoutingModule,
        MatListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        InfiniteScrollModule,
        AvatarModule
    ]
})
export class ChatModule { }
