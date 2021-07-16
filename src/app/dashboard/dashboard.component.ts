import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {UsersService} from '../shared/services/users/users.service';
import {ListStoryDialogComponent} from '../shared/story/list-story-dialog/list-story-dialog.component';
import {plainToClass} from 'class-transformer';
import {User} from '../shared/services/users/user';
import {StaticService} from '../shared/services/static.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  users: User[] = [];

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    public ss: StaticService
  ) { }

  ngOnInit(): void {

    this.usersService.search()
      .subscribe((users) => {
        this.users = users.map(u => plainToClass(User, u));
      });
  }

  clickStoryItem(): void{
    this.dialog.open(ListStoryDialogComponent, {
      panelClass: 'story-dialog-panel'
    });
  }
}
