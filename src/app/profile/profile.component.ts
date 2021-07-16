import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../shared/services/users/users.service';
import {StaticService} from '../shared/services/static.service';
import {User} from '../shared/services/users/user';
import {plainToClass} from 'class-transformer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User|null = null;
  constructor( private router: Router,
               private route: ActivatedRoute,
               public userService: UsersService,
               public ss: StaticService) { }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.userService.detailByUsername(username).subscribe((user) => {
      this.user = plainToClass(User, user);
    });
  }

}
