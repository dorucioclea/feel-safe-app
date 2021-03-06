import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GeoPoint } from 'src/app/@shared/app-helper';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { RestaurantCategoryModel } from 'src/app/restaurant/@shared/restaurant-category.model';
import { RestaurantService } from 'src/app/restaurant/@shared/restaurant.service';

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 50;
const DEFAULT_DISTANCE = 25;

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-restaurant-filter',
  templateUrl: './restaurant-filter.page.html',
  styleUrls: ['./restaurant-filter.page.scss'],
})
export class RestaurantFilterPage implements OnInit {
  @Input() public whereFilter: any;
  @Input() public orderBy: any;

  public categories: RestaurantCategoryModel[] = [];
  public currentLocation: GeoPoint = { lat: 52.52451, lng: 13.395346 };
  public priceRange: string;
  public restaurantCategoryId: string;

  public locationDistance: any = {
    isActive: false,
    current: DEFAULT_DISTANCE,
    min: MIN_DISTANCE,
    max: MAX_DISTANCE,
  };

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private restaurantService: RestaurantService,
  ) { }

  public ngOnInit(): void {
    this.restoreFilter();

    this.restaurantService.getCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public clearFilter(): void {
    this.priceRange = '___ALL___';
    this.restaurantCategoryId = '___ALL___';
    this.locationDistance.isActive = false;
    this.orderBy = this.restaurantService.getDefaultOrderBy();

    this.applyFilter();
  }

  public applyFilter(): void {
    this.updateWhereFilter();

    this.restaurantService.setFilter(this.whereFilter, this.orderBy);
    this.dismiss();
  }

  public dismiss(): void {
    console.log(this.whereFilter, this.orderBy);
    this.modalController.dismiss().catch();
  }

  private restoreFilter(): void {
    this.priceRange = this.whereFilter.priceRange || '___ALL___';
    this.restaurantCategoryId = this.whereFilter.restaurantCategoryId || '___ALL___';

    if (this.whereFilter.location && this.whereFilter.location.maxDistance) {
      this.locationDistance.isActive = true;
      this.locationDistance.current = this.whereFilter.location.maxDistance;
    }
  }

  private updateWhereFilter(): void {
    this.whereFilter.priceRange = this.priceRange;
    this.whereFilter.restaurantCategoryId = this.restaurantCategoryId;

    if (this.locationDistance.isActive) {
      this.whereFilter.location = {
        maxDistance: this.locationDistance.current,
        near: this.currentLocation,
      };
    } else {
      this.whereFilter.location = null;
    }

    for (const key in this.whereFilter) {
      if (this.whereFilter[key] === null || this.whereFilter[key] === undefined || this.whereFilter[key] === '___ALL___') {
        delete this.whereFilter[key];
      }
    }
  }
}
