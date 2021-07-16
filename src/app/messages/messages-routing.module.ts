import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MessagesComponent} from './messages.component';

const routes: Routes = [
  {
    path:  '',
    component: MessagesComponent,
    children: [
      { path: ':id', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
