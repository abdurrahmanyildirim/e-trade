import { Component } from '@angular/core';

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
}
