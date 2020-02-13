import { environment } from '../../environments/environment';

/* tslint:disable-next-line */
export class URL {
  public static get baseUrl() {
    return environment.apiBaseUrl;
  }

  public static get auth() {
    return environment.apiBaseUrl + '/auth';
  }

  public static get url() {
    return this.baseUrl + '/' + this.apiVersion;
  }

  public static get users() {
    return this.url + '/users';
  }

  public static get agreements() {
    return this.url + '/agreements';
  }

  public static get consents() {
    return this.url + '/consents';
  }

  public static get appVersions() {
    return this.url + '/app-versions';
  }

  public static get files() {
    return this.url + '/files';
  }

  public static get restaurants() {
    return this.url + '/restaurants';
  }

  public static get restaurantCategories() {
    return this.url + '/restaurant-categories';
  }

  public static get tags() {
    return this.url + '/tags';
  }

  public static get votes() {
    return this.url + '/votes';
  }

  public static get shareFab() {
    return this.baseUrl + '/fabs';
  }

  public static get apiVersion() {
    return 'api';
  }

  private static endpointsWithoutAuthentication = [
    {
      methods: ['POST'],
      path: '/users/login',
    },
    {
      methods: ['POST'],
      path: '/users/reset-password',
    },
    {
      methods: ['POST'],
      path: '/auth',
    },
  ];

  public static needsAuthentication(url: string, method: string) {
    if (url.indexOf(this.url) < 0) { return false; }

    let path = url.split('?')[0];
    path = path.replace(this.url, '');

    const endpoint = this.endpointsWithoutAuthentication.find((endpoint) => endpoint.path === path);

    if (!endpoint || endpoint.methods.includes(method)) { return true; }

    return false;
  }
}
