import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { RestaurantModel } from '../shared/restaurant.model';
import { RestaurantService, Restaurants } from '../shared/restaurant.service';

@Component({
  selector: 'page-restaurant-list',
  templateUrl: './restaurant-list.page.html',
  styleUrls: ['./restaurant-list.page.scss'],
})
export class RestaurantListPage implements OnInit {
  public restaurants: Restaurants;

  private ngUnsubscribe: Subject<any> = new Subject();
  private infiniteScrollEvent: any;
  private refresherEvent: any;
  
  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
  ) { }

  public ngOnInit() {
    this.restaurantService.getRestaurants()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((restaurants) => {
        this.restaurants = restaurants;

        this.completeInfiniteScroll();
        this.completeRefresher();
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public refresh(event: any) {
    this.refresherEvent = event;
    this.restaurantService.refreshRestaurants();
  }

  public loadMore(event: any) {
    this.infiniteScrollEvent = event;

    if (!this.restaurants.meta.hasMore) {
      this.completeInfiniteScroll();

      return;
    }

    this.restaurantService.getMoreRestaurants();
  }

  public openDetailPage(restaurant: RestaurantModel) {
    if (!restaurant) { return; }

    this.router.navigate(['/main/restaurants', restaurant.id]).catch();
  }

  private completeInfiniteScroll() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
      this.infiniteScrollEvent = null;
    }
  }

  private completeRefresher() {
    if (this.refresherEvent) {
      this.refresherEvent.target.complete();
      this.refresherEvent = null;
    }
  }
}
