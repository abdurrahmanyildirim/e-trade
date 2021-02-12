import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetail } from 'src/app/shared/models/order';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { OrderService } from 'src/app/shared/services/rest/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [OrderService]
})
export class OrderDetailComponent implements OnInit {
  order: OrderDetail;
  currentUser: User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser.value;
    this.activatedRoute.params.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      this.initOrder(params['id']);
    });
  }

  initOrder(id: string): void {
    this.orderService.orderDetail(id).subscribe({
      next: (data) => {
        this.order = data;
      },
      error: (err) => console.log(err)
    });
  }
}
