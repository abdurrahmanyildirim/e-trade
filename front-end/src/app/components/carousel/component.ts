import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CarouselComponent {
  public arrows = true;
  photos = [
    {
      pic: 'https://www.webtrakya.com/images/e-ticaret-sitesi.jpg'
    },
    {
      pic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKTA7uPPKpgKCvtlWssZMQ7fcZ23MnSL6BxQ&usqp=CAU'
    },
    {
      pic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi1t0dtRA5XrwcpeENfBOPSLswPAe0eW2smA&usqp=CAU'
    },
    {
      pic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwssQ5-t6evusu6Z82sE23rQmv4lYceYaG6w&usqp=CAU'
    }
  ];
}
