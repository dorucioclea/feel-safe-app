export interface RestaurantSource {
  id: string,
  title: string,
  description: string,
  canonicalAddress: string,
  image: string,
  numberOfSeats: number,
  priceRange: 'low' | 'mid' | 'high',
  restaurantCategoryId: string,
  restaurantCategory: any,
  createdAt: string,
  updatedAt: string,
}

export class RestaurantModel {
  public id: string;
  public title: string;
  public description: string;
  public canonicalAddress: string;
  public image: string;
  public numberOfSeats: number;
  public priceRange: 'low' | 'mid' | 'high';
  public restaurantCategoryId: string;
  public restaurantCategory: any;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: RestaurantSource) {
    this.id = source.id;
    this.title = source.title;
    this.description = source.description;
    this.canonicalAddress = source.canonicalAddress;
    this.image = source.image;
    this.numberOfSeats = source.numberOfSeats;
    this.priceRange = source.priceRange;
    this.restaurantCategoryId = source.restaurantCategoryId;
    this.restaurantCategory = source.restaurantCategory;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
