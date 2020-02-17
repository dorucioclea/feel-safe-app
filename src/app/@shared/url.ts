import { environment } from '../../environments/environment';
import { urlParamsFromObject } from 'src/app/@shared/utils';

type Params = {
  queryParams?: any,
  filter?: {
    where?: any,
    order?: string,
    skip?: number,
    limit?: number,
    include?: any,
    scope?: any,
  },
};

/* tslint:disable-next-line */
export class URL {
  public static get baseUrl() {
    return environment.apiBaseUrl;
  }

  public static get auth() {
    return (provider: string) => {
      return `${environment.apiBaseUrl}/auth/${provider}`;
    }
  }

  public static get url() {
    return `${this.baseUrl}/${this.apiVersion}`;
  }

  public static get users() {
    return (params?: Params) => {
      return `${this.url}/users${this.transformParamsToString(params)}`;
    }
  }

  public static get usersById() {
    return (id: string, params?: Params) => {
      return `${this.url}/users/${id}${this.transformParamsToString(params)}`;
    }
  }

  public static get usersLogin() {
    return (params?: Params) => {
      return `${this.url}/users/login${this.transformParamsToString(params)}`;
    }
  }

  public static get usersSetPushToken() {
    return (id: string) => {
      return `${this.url}/users/${id}/set-push-token`;
    }
  }

  public static get usersBlockedUsers() {
    return (id: string) => {
      return `${this.url}/users/${id}/blockedUsers`;
    }
  }

  public static get usersReset() {
    return () => {
      return `${this.url}/users/reset`;
    }
  }

  public static get usersResetPassword() {
    return () => {
      return `${this.url}/users/reset-password`;
    }
  }

  public static get usersLogout() {
    return () => {
      return `${this.url}/users/logout`;
    }
  }

  public static get agreements() {
    return (params?: Params) => {
      return `${this.url}/agreements${this.transformParamsToString(params)}`;
    }
  }

  public static get agreementsLatest() {
    return (type: string) => {
      return `${this.url}/agreements/${type}/latest`;
    }
  }

  public static get agreementsRequireAction() {
    return () => {
      return `${this.url}/require-action`;
    }
  }

  public static get consents() {
    return (params?: Params) => {
      return `${this.url}/consents${this.transformParamsToString(params)}`;
    }
  }

  public static get appVersions() {
    return (params?: Params) => {
      return `${this.url}/app-versions${this.transformParamsToString(params)}`;
    }
  }

  public static get files() {
    return (params?: Params) => {
      return `${this.url}/files${this.transformParamsToString(params)}`;
    }
  }

  public static get filesUpload() {
    return () => {
      return `${this.url}/files/upload`;
    }
  }

  public static get filesUploadFromUrl() {
    return () => {
      return `${this.url}/files/upload-from-url`;
    }
  }

  public static get filesDownload() {
    return (id: string, params?: Params) => {
      return `${this.url}/files/${id}/download${this.transformParamsToString(params)}`;
    }
  }

  public static get filesById() {
    return (id: string) => {
      return `${this.url}/files/${id}`;
    }
  }

  public static get restaurants() {
    return (params?: Params) => {
      return `${this.url}/restaurants${this.transformParamsToString(params)}`;
    }
  }

  public static get restaurantsById() {
    return (id: string, params?: Params) => {
      return `${this.url}/restaurants/${id}${this.transformParamsToString(params)}`;
    }
  }

  public static get restaurantCategories() {
    return (params?: Params) => {
      return `${this.url}/restaurant-categories${this.transformParamsToString(params)}`;
    }
  }

  public static get tags() {
    return (params?: Params) => {
      return `${this.url}/tags${this.transformParamsToString(params)}`;
    }
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
