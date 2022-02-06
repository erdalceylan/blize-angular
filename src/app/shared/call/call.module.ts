import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallComponent } from './call.component';
import {AvatarModule} from "../avatar/avatar.module";



@NgModule({
  declarations: [
    CallComponent
  ],
  imports: [
    CommonModule,
    AvatarModule
  ],
  exports: [CallComponent]
})
export class CallModule { }
