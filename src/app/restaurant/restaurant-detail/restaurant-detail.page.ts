import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RESTAURANT_DUMMY_DATA, RestaurantModel } from '../shared/restaurant.model';
import { RestaurantService } from '../shared/restaurant.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'page-restaurant-detail',
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss'],
})
export class RestaurantDetailPage implements OnInit {
  public initialized = false;
  public restaurant: RestaurantModel = RESTAURANT_DUMMY_DATA[0];

  private id: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private refresherEvent: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
  ) { }

  public ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  public ionViewDidEnter() {
    if (this.initialized) { return; }

    this.initialized = true;

    this.loadRestaurant();
  }

  public refresh(event: any) {
    this.refresherEvent = event;
    this.restaurantService.refreshRestaurantById(this.id);
  }

  private loadRestaurant() {
    this.restaurantService.getRestaurantById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((restaurant) => {
        this.restaurant = restaurant;

        this.completeRefresher();
      });
  }

  private completeRefresher() {
    if (this.refresherEvent) {
      this.refresherEvent.target.complete();
      this.refresherEvent = null;
    }
  }
}
