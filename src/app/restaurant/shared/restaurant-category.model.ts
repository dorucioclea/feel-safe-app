export interface RestaurantCategorySource {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
}

export class RestaurantCategoryModel {
  public id: string;
  public title: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: RestaurantCategorySource) {
    this.id = source.id;
    this.title = source.title;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
