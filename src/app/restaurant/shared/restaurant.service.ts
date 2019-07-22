import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { AppHelper } from 'src/app/@shared/app-helper';
import { C } from 'src/app/@shared/constants';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { RestaurantModel, RestaurantSource } from './restaurant.model';
import { RestaurantCategoryModel, RestaurantCategorySource } from 'src/app/restaurant/shared/restaurant-category.model';

export interface Restaurants extends ProtoItems {
  items: RestaurantModel[],
}

interface RestaurantsByIdStore {
  [key: string]: RestaurantModel,
}

interface RestaurantsById {
  [key: string]: BehaviorSubject<RestaurantModel>,
}

const DEFAULT_LIMIT = 25;
const DEFAUL_WHERE_FILTER = {};
const DEFAULT_ORDER_BY = 'createdAt DESC';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private whereFilter: any = DEFAUL_WHERE_FILTER;
  private orderBy = DEFAULT_ORDER_BY;
  private search: { [key: string]: string } = {};
  private restaurantsStore: Restaurants = null;
  private restaurants: BehaviorSubject<Restaurants> = new BehaviorSubject(null);
  private restaurantsByIdStore: RestaurantsByIdStore = {};
  private restaurantsById: RestaurantsById = {};
  private restaurantCategoriesStore: RestaurantCategoryModel[];
  private restaurantCategories: BehaviorSubject<RestaurantCategoryModel[]> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
  ) { }

  public setFilter(whereFilter: any = DEFAUL_WHERE_FILTER, orderBy: string = DEFAULT_ORDER_BY) {
    this.whereFilter = whereFilter;
    this.orderBy = orderBy;

    this.updateFilter();
  }

  public resetFilter() {
    this.whereFilter = DEFAUL_WHERE_FILTER;
    this.orderBy = DEFAULT_ORDER_BY;

    this.updateFilter();
  }

  public getDefaultWhereFilter(): any {
    return DEFAUL_WHERE_FILTER;
  }

  public getDefaultOrderBy(): string {
    return DEFAULT_ORDER_BY;
  }

  public searchRestaurants(search: { [key: string]: any }) {
    this.updateSearch(search);
  }

  public clearSearch() {
    this.updateSearch({});
  }

  public getRestaurantById(restaurantId: string): Observable<RestaurantModel> {
    if (this.restaurantsById[restaurantId]) {
      return this.restaurantsById[restaurantId].asObservable();
    }

    return this.loadRestaurantById(restaurantId).pipe(mergeMap(() => {
      return this.restaurantsById[restaurantId].asObservable();
    }));
  }

  public refreshRestaurantById(restaurantId: string) {
    this.loadRestaurantById(restaurantId).toPromise().catch((error) => {
      console.error(`Error refreshing restaurant ${restaurantId}`);
      console.error(error);
    });
  }

  public getRestaurants(): Observable<Restaurants> {
    this.restaurantsStore = { items: [], meta: { isFirstLoad: true, isLoading: true, filterIsActive: AppHelper.isEmptyObject(this.whereFilter), whereFilter: this.whereFilter, orderBy: this.orderBy } };
    this.restaurants.next(this.restaurantsStore);

    this.loadRestaurants().toPromise().catch((error) => {
      this.restaurantsStore.meta.error = error;
      this.restaurantsStore.meta.isLoading = false;

      this.restaurants.next(this.restaurantsStore);
    });

    return this.restaurants.asObservable();
  }

  public getMoreRestaurants() {
    this.restaurantsStore.meta.isLoading = true;
    this.restaurants.next(this.restaurantsStore);

    this.loadRestaurants(this.restaurantsStore.items.length).toPromise().catch((error) => {
      this.restaurantsStore.meta.error = error;
      this.restaurantsStore.meta.isLoading = false;

      this.restaurants.next(this.restaurantsStore);
    });
  }

  public refreshRestaurants() {
    if (!this.restaurantsStore) { return; }

    this.restaurantsStore.meta.isLoading = true;
    this.restaurants.next(this.restaurantsStore);

    this.loadRestaurants().toPromise().catch((error) => {
      this.restaurantsStore.meta.error = error;
      this.restaurantsStore.meta.isLoading = false;

      this.restaurants.next(this.restaurantsStore);
    });
  }

  public getCategories(): Observable<RestaurantCategoryModel[]> {
    if (this.restaurantCategoriesStore) {
      return this.restaurantCategories.asObservable();
    }

    return this.loadCategories().pipe(mergeMap(() => {
      return this.restaurantCategories.asObservable();
    }));
  }

  private loadRestaurants(skip = 0, limit = DEFAULT_LIMIT) {
    const filter = {
      skip: skip,
      limit: limit,
      where: JSON.parse(JSON.stringify(this.whereFilter)),
      order: this.orderBy,
    };

    if (!AppHelper.isEmptyObject(this.search)) {
      filter.where = Object.assign(filter.where, this.search);
    }

    const url = `${C.urls.restaurants}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((restaurants: RestaurantSource[]) => restaurants.map((restaurant) => new RestaurantModel(restaurant))),
        tap((restaurants: RestaurantModel[]) => {
          const items = skip ? this.restaurantsStore.items.concat(restaurants) : restaurants;
          const hasMore = items.length < totalCount;

          this.restaurantsStore.items = items;
          this.restaurantsStore.meta.hasMore = hasMore;
          this.restaurantsStore.meta.totalCount = totalCount;
          this.restaurantsStore.meta.isLoading = false;

          this.restaurants.next(this.restaurantsStore);
        }),
        tap((restaurants) => {
          this.updateRestaurantsById(restaurants);
        }),
      );
  }

  private loadRestaurantById(restaurantId: string) {
    const url = `${C.urls.restaurants}/${restaurantId}`;

    return this.http.get<RestaurantSource>(url)
      .pipe(
        map((restaurant) => new RestaurantModel(restaurant)),
        tap((restaurant) => {
          this.restaurantsByIdStore[restaurant.id] = restaurant;

          if (!this.restaurantsById[restaurant.id]) {
            this.restaurantsById[restaurant.id] = new BehaviorSubject(null);
          }

          this.restaurantsById[restaurant.id].next(this.restaurantsByIdStore[restaurant.id]);
        }),
      );
  }

  private updateRestaurantsById(restaurants: RestaurantModel[]) {
    restaurants.forEach((restaurant) => {
      this.restaurantsByIdStore[restaurant.id] = restaurant;
      
      if (!this.restaurantsById[restaurant.id]) {
        this.restaurantsById[restaurant.id] = new BehaviorSubject(null);
      }

      this.restaurantsById[restaurant.id].next(this.restaurantsByIdStore[restaurant.id]);
    });
  }

  private loadCategories() {
    const url = `${C.urls.restaurantCategories}`;

    return this.http.get<RestaurantCategorySource[]>(url)
      .pipe(
        map((categories) => categories.map((category) => new RestaurantCategoryModel(category))),
        tap((categories) => {
          this.restaurantCategoriesStore = categories;
          this.restaurantCategories.next(this.restaurantCategoriesStore);
        }),
      );
  }

  private updateFilter() {
    this.restaurantsStore.items = [];
    this.restaurantsStore.meta.isLoading = true;
    this.restaurantsStore.meta.filterIsActive = AppHelper.isEmptyObject(this.whereFilter);
    this.restaurantsStore.meta.whereFilter = this.whereFilter;
    this.restaurantsStore.meta.orderBy = this.orderBy;
    this.restaurants.next(this.restaurantsStore);

    this.loadRestaurants().toPromise().catch((error) => {
      this.restaurantsStore.meta.error = error;
      this.restaurantsStore.meta.isLoading = false;

      this.restaurants.next(this.restaurantsStore);
    });
  }
  
  private updateSearch(search: { [key: string]: any }) {
    this.search = search;

    this.restaurantsStore.items = [];
    this.restaurantsStore.meta.isLoading = true;
    this.restaurantsStore.meta.search = this.search;

    this.loadRestaurants().toPromise().catch((error) => {
      this.restaurantsStore.meta.error = error;
      this.restaurantsStore.meta.isLoading = false;

      this.restaurants.next(this.restaurantsStore);
    });
  }
}
