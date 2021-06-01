import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import {interval} from 'rxjs';
import {filter, map, take, scan} from 'rxjs/operators'

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.css']
})
export class RandomComponent implements OnInit {

  constructor(private renderer: Renderer2, private flashMessage: FlashMessagesService) { }

  @ViewChild("container", {read: ElementRef}) private container: ElementRef;

  active_button = true;
  active_random = true;

  string: any;

  ngOnInit(): void {

  }
  randomString(){
    this.string = Math.random().toString(36).substr(2, 5).split('');

    if(this.string.join('') == this.string.reverse().join('')){
      this.string.push('red');
    }

    if(Number(this.string.join('')) >= 0){
      this.string.push('blue');
    }

    if(this.string.indexOf('0') != -1){
      this.randomString();
      this.flashMessage.show('Строка к сожалению содержала 0, поэтому я вам покажу другую)',
        {
          cssClass: 'alert-success',
          timeout: 3000
        });
    }

    return this.string;
  }

  random() {

    this.active_button = false;
    this.active_random = true;

    interval(3000).pipe(

      map( value => this.randomString())
    )
    .subscribe(res =>{
      for( let i = 1; i <= 5; i++){
        if(!this.active_random) return false;
        let text = this.renderer.createText(res[i-1]);

        let div = this.renderer.selectRootElement('#symbol_' + i);

        if(res.length == 6){
          this.renderer.setStyle(div, 'color', res[5]);
        }

        this.renderer.appendChild(div, text);
        }
      console.log(res);
    });
  }

  stop(){
    this.active_button = true;
    this.active_random = false;
  }

}
