import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { C } from 'src/app/@shared/constants';
import { RestaurantModel, RestaurantSource } from './restaurant.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';

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

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private restaurantsStore: Restaurants = null;
  private restaurants: BehaviorSubject<Restaurants> = new BehaviorSubject(null);
  private restaurantsByIdStore: RestaurantsByIdStore = {};
  private restaurantsById: RestaurantsById = {};

  constructor(
    private http: HttpClient,
  ) { }

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
    this.restaurantsStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
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

  private loadRestaurants(skip = 0, limit = DEFAULT_LIMIT) {
    const filter = {
      skip: skip,
      limit: limit,
    };

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
          this.restaurantsStore = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

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
}
