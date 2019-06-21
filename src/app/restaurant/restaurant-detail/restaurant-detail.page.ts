import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RestaurantModel } from '../shared/restaurant.model';
import { RestaurantService } from '../shared/restaurant.service';

@Component({
  selector: 'page-restaurant-detail',
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss'],
})
export class RestaurantDetailPage implements OnInit {
  public initialized = false;
  public id: string;
  public restaurant: RestaurantModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private refresherEvent: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
  ) { }

  public ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;

    this.restaurantService.getRestaurantById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((restaurant) => {
        this.restaurant = restaurant;

        this.completeRefresher();
      });
  }

  public ionViewDidEnter() {
    if (this.initialized) { return; }

    this.initialized = true;
  }

  public refresh(event: any) {
    this.refresherEvent = event;
    this.restaurantService.refreshRestaurantById(this.id);
  }

  private completeRefresher() {
    if (this.refresherEvent) {
      this.refresherEvent.target.complete();
      this.refresherEvent = null;
    }
  }
}
