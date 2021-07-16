import {Component, Inject, OnInit} from '@angular/core';
import {UsersService} from './shared/services/users/users.service';
import {SocketService} from './shared/services/socket.service';
import {User} from './shared/services/users/user';
import {StaticService} from './shared/services/static.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public theme = '';
  constructor(
    public userService: UsersService,
    public socketService: SocketService,
    public ss: StaticService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userService.sessionInit().subscribe(
      (user) => {
          socketService.init();
        }, (error) => {
        console.log(error);
        window.location.href = '/login';
       });
  }

  ngOnInit(): void {
  }

  toggleTheme(): void {

    const darkTheme = 'app-dark';

    if (this.theme === darkTheme) {
      this.document.body.classList.remove(darkTheme);
      this.theme = '';
    } else {
      this.document.body.classList.add(darkTheme);
      this.theme = darkTheme;
    }
  }
}
