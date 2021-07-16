import { Component, OnInit } from '@angular/core';
import SwiperCore, {Autoplay, EffectFade} from 'swiper';
import {SwiperComponent} from 'swiper/angular';
import Swiper from 'swiper';
SwiperCore.use([EffectFade, Autoplay]);
@Component({
  selector: 'app-cube-face',
  templateUrl: './cube-face.component.html',
  styleUrls: ['./cube-face.component.scss']
})
export class CubeFaceComponent implements OnInit {

  constructor() { }

  stories = [
    'https://i.imgur.com/T4jwXEX.png',
    'https://i.imgur.com/AY5z4ZP.jpg',
    'https://i.imgur.com/HJBbtOI.jpg',
    'https://i.imgur.com/tXgQukC.jpg',
    'https://i.imgur.com/A7BMaSe.jpg'
  ];

  ngOnInit(): void {
  }

  tap(e: Swiper|any, swiperComponent: SwiperComponent): void{
    console.log(e);
    console.log(swiperComponent);

    const clickLeft = e.touches.currentX <= window.innerWidth / 2;
    console.log(clickLeft ? 'sola' : 'sağa');
  }

  press(e: any): void {
    console.log(e);
  }

  pressup(e: any): void {
    e.preventDefault();
    console.log(e);
  }

  disableContext(e: any): void {
    e.preventDefault();
  }

  onProgress(e: any): void {
    console.log(e.progress);
  }
}
