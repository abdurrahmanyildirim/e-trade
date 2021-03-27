import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/rest/order.service';

@Component({
  selector: 'app-management',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [OrderService]
})
export class ManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
