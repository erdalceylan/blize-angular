import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {AvatarModule} from "../shared/avatar/avatar.module";



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AvatarModule
  ]
})
export class ProfileModule { }
