import { Component, OnInit } from '@angular/core';
import {UsersService} from '../shared/services/users/users.service';
import {plainToClass} from 'class-transformer';
import {User} from '../shared/services/users/user';
import {StaticService} from '../shared/services/static.service';
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  users: User[] = [];
  input = '';
  loading = false;

  constructor(
    private usersService: UsersService,
    public ss: StaticService
  ) { }

  ngOnInit(): void {
    this.loadUsers(0);
  }

  loadUsers(offset: number): void {
    if(this.loading) {
      return;
    }

    this.loading = true;
    this.usersService.search(new HttpParams(), offset)
      .subscribe((users) => {
        this.users = this.users.concat(users.map(u => plainToClass(User, u)));
        this.loading = false;
      });
  }
}
