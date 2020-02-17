import { environment } from '../../environments/environment';
import { urlParamsFromObject } from 'src/app/@shared/utils';

type Params = { queryParams?: any, filter?: any };

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
    return (id?: string, params?: Params) => {
      return `${this.url}/restaurants${id ? `/${id}` : ''}${this.transformParamsToString(params)}`;
    }
  }

  public static get restaurantCategories() {
    return this.url + '/restaurant-categories';
  }

  public static get tags() {
    return this.url + '/tags';
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
    // wildcard matching
    // {
    //   methods: ['GET'],
    //   path: '/restaurants/*',
    // },
  ];

  public static needsAuthentication(url: string, method: string) {
    if (url.indexOf(this.url) < 0) { return false; }

    const urlWithoutParams = url.split('?')[0];
    const path = urlWithoutParams.replace(this.url, '');

    const endpoint = this.endpointsWithoutAuthentication.find((endpoint) => this.matchWildcardString(path, endpoint.path));

    if (!endpoint || !endpoint.methods.includes(method)) { return true; }

    return false;
  }

  private static transformParamsToString(params: Params) {
    if (!params) { return ''; }

    let filterString = '';
    let queryParamsString = '';
        
    if (params.filter) {
      filterString = `filter=${encodeURIComponent(JSON.stringify(params.filter))}`;
    }

    if (params.queryParams) {
      queryParamsString = `${filterString ? '&' : ''}${urlParamsFromObject(params.queryParams)}`;
    }

    return `?${filterString}${queryParamsString}`;
  }

  private static matchWildcardString(str, rule) {
    const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }
}
