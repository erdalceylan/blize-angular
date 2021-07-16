import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import SwiperCore, {Autoplay, EffectCube, EffectFade, Swiper} from 'swiper/core';

// install Swiper modules
SwiperCore.use([EffectCube, EffectFade, Autoplay]);
@Component({
  selector: 'app-list-story-dialog',
  templateUrl: './list-story-dialog.component.html',
  styleUrls: ['./list-story-dialog.component.scss']
})
export class ListStoryDialogComponent implements OnInit {

  width = 320;
  height = 480;
  stories = [
    'https://i.imgur.com/T4jwXEX.png',
    'https://i.imgur.com/AY5z4ZP.jpg',
    'https://i.imgur.com/HJBbtOI.jpg',
    'https://i.imgur.com/tXgQukC.jpg',
    'https://i.imgur.com/A7BMaSe.jpg'
  ];

  constructor(
    public dialogRef: MatDialogRef<ListStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  change(e: any): void{
    console.log(e);
  }
}
