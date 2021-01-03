import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-carousel',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CarouselComponent {
  photos = [
    {
      id: '0',
      pic: 'https://www.webtrakya.com/images/e-ticaret-sitesi.jpg'
    },
    {
      id: '1',
      pic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKTA7uPPKpgKCvtlWssZMQ7fcZ23MnSL6BxQ&usqp=CAU'
    }
  ];

  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    autoplay: true,
    navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: true
  };
}
