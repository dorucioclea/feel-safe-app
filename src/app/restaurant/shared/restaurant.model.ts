export interface RestaurantSource {
  id: string,
  title: string,
  description: string,
  canonicalAddress: string,
  image: string,
  createdAt: string,
  updatedAt: string,
}

export class RestaurantModel {
  public id: string;
  public title: string;
  public description: string;
  public canonicalAddress: string;
  public image: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: RestaurantSource) {
    this.id = source.id;
    this.title = source.title;
    this.description = source.description;
    this.canonicalAddress = source.canonicalAddress;
    this.image = source.image;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
