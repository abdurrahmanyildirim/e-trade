import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteCategory } from './model';

@Injectable()
export class AdminService {
  routeInfo = new BehaviorSubject<RouteCategory[]>([]);
}
