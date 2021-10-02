import {Component, Inject, OnInit} from '@angular/core';
import {UsersService} from './shared/services/users/users.service';
import {SocketService} from './shared/services/socket.service';
import {StaticService} from './shared/services/static.service';
import {DOCUMENT} from '@angular/common';
import {EventService} from "./shared/services/event.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CallComponent} from "./shared/call/call.component";
import {Call} from "./shared/services/call/call";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public theme = '';
  private callBusy = false;
  private matDialogRef: MatDialogRef<CallComponent>|undefined;

  constructor(
    public userService: UsersService,
    public socketService: SocketService,
    public ss: StaticService,
    @Inject(DOCUMENT) private document: Document,
    private eventService: EventService,
    private matDialog : MatDialog
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

    this.eventService.startCall.subscribe((event) => {
      if (event.user?.id && !this.callBusy) {
        this.matDialogRef = this.matDialog.open(CallComponent, {
          data: {user: event.user, type: 'call', video: event.video },
          disableClose: true,
          panelClass: 'call-modal'
        });

        this.matDialogRef.afterClosed().subscribe(()=> {
          this.callBusy = false;
        });

        this.callBusy = true;
      }
    });

    this.socketService.onCall.subscribe((call: Call)=> {
      if (!this.callBusy) {
        this.matDialogRef = this.matDialog.open(CallComponent, {
          data: {user: call.from, type: 'accept', payload: call},
          disableClose: true,
          panelClass: 'call-modal'
        });

        this.matDialogRef.afterClosed().subscribe(()=> {
          this.callBusy = false;
        });

        this.callBusy = true;
      }
    });
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
