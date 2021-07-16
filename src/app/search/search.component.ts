import { Component, OnInit } from '@angular/core';
import {UsersService} from '../shared/services/users/users.service';
import {plainToClass} from 'class-transformer';
import {User} from '../shared/services/users/user';
import {StaticService} from '../shared/services/static.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  users: User[] = [];
  input = '';

  constructor(
    private usersService: UsersService,
    public ss: StaticService
  ) { }

  ngOnInit(): void {
    this.usersService.search()
      .subscribe((users) => {
        this.users = users.map(u => plainToClass(User, u));
      });
  }

}
