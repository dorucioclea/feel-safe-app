import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IonContent, ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { RESTAURANT_DUMMY_DATA } from '../@shared/restaurant.model';
import { RestaurantFilterPage } from 'src/app/restaurant/restaurant-filter/restaurant-filter.page';
import { RestaurantService, Restaurants } from '../@shared/restaurant.service';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-restaurant-list',
  templateUrl: './restaurant-list.page.html',
  styleUrls: ['./restaurant-list.page.scss'],
})
export class RestaurantListPage implements OnInit {
  @ViewChild('ListContent', { static: true }) public content: IonContent;
  public restaurants: Restaurants = {
    items: RESTAURANT_DUMMY_DATA,
    meta: { isFirstLoad: true, isLoading: true },
  };
  public searchValue: string;
  public currentLang: string;
  public initialized: boolean = false;

  private ngUnsubscribe: Subject<any> = new Subject();
  private infiniteScrollEvent: any;
  private refresherEvent: any;
  private searchResultsLoading: boolean = false;

  constructor(
    private modalController: ModalController,
    private restaurantService: RestaurantService,
    private translate: TranslateService,
  ) {
    this.currentLang = this.translate.currentLang;
  }

  public ngOnInit(): void { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ionViewDidEnter(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.loadRestaurants();
  }

  public search(event: any): void {
    this.searchResultsLoading = true;

    this.searchValue = event.detail.value;

    if (!this.searchValue) {
      return this.restaurantService.clearSearch();
    }

    this.restaurantService.searchRestaurants({ title: { ilike: `%${this.searchValue}%` } });
  }

  public refresh(event: any): void {
    this.refresherEvent = event;
    this.restaurantService.refreshRestaurants();
  }

  public loadMore(event: any): void {
    this.infiniteScrollEvent = event;

    if (!this.restaurants.meta.hasMore) {
      return this.completeInfiniteScroll();
    }

    this.restaurantService.getMoreRestaurants();
  }

  public async openFilterModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: RestaurantFilterPage,
      componentProps: {
        whereFilter: JSON.parse(JSON.stringify(this.restaurants.meta.whereFilter)),
        orderBy: JSON.parse(JSON.stringify(this.restaurants.meta.orderBy)),
      },
    } as ModalOptions);

    return await modal.present();
  }

  public trackByFunction(index: number, item: any): any  {
    return item ? item.id : index;
  }

  private loadRestaurants(): void {
    this.restaurantService.getRestaurants()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((restaurants: Restaurants) => {
        this.restaurants.meta = restaurants.meta;

        // otherwise completeInfiniteScroll and completeRefresher would complete too early!
        if (this.restaurants.meta.isLoading) { return; }

        this.restaurants.items = restaurants.items;

        this.completeInfiniteScroll();
        this.completeRefresher();

        if (this.searchResultsLoading) {
          this.searchResultsLoading = false;
          this.content.scrollToTop(0).catch();
        }

      });
  }

  private completeInfiniteScroll(): void {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
    }
  }

  private completeRefresher(): void {
    if (this.refresherEvent) {
      this.refresherEvent.target.complete();
    }
  }
}
