import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RestaurantService } from 'src/app/restaurant/shared/restaurant.service';
import { RestaurantCategoryModel } from 'src/app/restaurant/shared/restaurant-category.model';

@Component({
  selector: 'page-restaurant-filter',
  templateUrl: './restaurant-filter.page.html',
  styleUrls: ['./restaurant-filter.page.scss'],
})
export class RestaurantFilterPage implements OnInit {
  @Input() public whereFilter: any;
  @Input() public orderBy: any;

  public categories: RestaurantCategoryModel[];
  public currentLocation = { lat: 52.52451, lng: 13.395346 };
  public priceRange: string;
  public restaurantCategoryId: string;
  public range: number;
  public infinityStartsAt = 50;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private restaurantService: RestaurantService,
  ) { }

  public ngOnInit() {
    this.splitWhereFilter();

    this.restaurantService.getCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public clearFilter() {
    this.priceRange = null;
    this.restaurantCategoryId = null;
    this.range = this.infinityStartsAt;
    this.orderBy = this.restaurantService.getDefaultOrderBy();

    this.applyFilter();
  }

  public applyFilter() {
    this.updateWhereFilter();

    this.restaurantService.setFilter(this.whereFilter, this.orderBy);
    this.dismiss();
  }

  public dismiss() {
    this.modalController.dismiss().catch();
  }

  private splitWhereFilter() {
    this.priceRange = this.whereFilter.priceRange || '___ALL___';
    this.restaurantCategoryId = this.whereFilter.restaurantCategoryId || '___ALL___';
    this.range = this.whereFilter.location && this.whereFilter.location.maxDistance ? this.whereFilter.location.maxDistance : this.infinityStartsAt;
  }

  private updateWhereFilter() {
    this.whereFilter.priceRange = this.priceRange;
    this.whereFilter.restaurantCategoryId = this.restaurantCategoryId;

    if (this.range !== this.infinityStartsAt) {
      this.whereFilter.location = {
        maxDistance: this.range,
        near: this.currentLocation,
      };
    }

    if (this.range === this.infinityStartsAt) {
      this.whereFilter.location = null;
    }

    for (const key in this.whereFilter) {
      if (this.whereFilter[key] === null || this.whereFilter[key] === undefined || this.whereFilter[key] === '___ALL___') {
        delete this.whereFilter[key];
      }
    }
  }
}
