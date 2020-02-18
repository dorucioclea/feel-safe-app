import { environment } from 'src/environments/environment';
import { urlParamsFromObject } from 'src/app/@shared/utils';

type Params = {
  queryParams?: any;
  filter?: {
    where?: any;
    order?: string;
    skip?: number;
    limit?: number;
    include?: any;
    scope?: any;
  };
};

/* tslint:disable-next-line */
export class URL {
  public static get baseUrl(): string {
    return environment.apiBaseUrl;
  }

  public static get auth() {
    return (provider: string): string => {
      return `${environment.apiBaseUrl}/auth/${provider}`;
    }
  }

  public static get url(): string {
    return `${this.baseUrl}/${this.apiVersion}`;
  }

  public static get users() {
    return (params?: Params): string => {
      return `${this.url}/users${this.transformParamsToString(params)}`;
    }
  }

  public static get usersById() {
    return (id: string, params?: Params): string => {
      return `${this.url}/users/${id}${this.transformParamsToString(params)}`;
    }
  }

  public static get usersLogin() {
    return (params?: Params): string => {
      return `${this.url}/users/login${this.transformParamsToString(params)}`;
    }
  }

  public static get usersSetPushToken() {
    return (id: string): string => {
      return `${this.url}/users/${id}/set-push-token`;
    }
  }

  public static get usersBlockedUsers() {
    return (id: string): string => {
      return `${this.url}/users/${id}/blockedUsers`;
    }
  }

  public static get usersDeleteAccount() {
    return (id: string): string => {
      return `${this.url}/users/${id}/delete-account`;
    }
  }

  public static get usersReset() {
    return (): string => {
      return `${this.url}/users/reset`;
    }
  }

  public static get usersResetPassword() {
    return (): string => {
      return `${this.url}/users/reset-password`;
    }
  }

  public static get usersLogout() {
    return (): string => {
      return `${this.url}/users/logout`;
    }
  }

  public static get agreements() {
    return (params?: Params): string => {
      return `${this.url}/agreements${this.transformParamsToString(params)}`;
    }
  }

  public static get agreementsLatest() {
    return (type: string): string => {
      return `${this.url}/agreements/${type}/latest`;
    }
  }

  public static get agreementsRequireAction() {
    return (): string => {
      return `${this.url}/require-action`;
    }
  }

  public static get consents() {
    return (params?: Params): string => {
      return `${this.url}/consents${this.transformParamsToString(params)}`;
    }
  }

  public static get appVersions() {
    return (params?: Params): string => {
      return `${this.url}/app-versions${this.transformParamsToString(params)}`;
    }
  }

  public static get files() {
    return (params?: Params): string => {
      return `${this.url}/files${this.transformParamsToString(params)}`;
    }
  }

  public static get filesUpload() {
    return (): string => {
      return `${this.url}/files/upload`;
    }
  }

  public static get filesUploadFromUrl() {
    return (): string => {
      return `${this.url}/files/upload-from-url`;
    }
  }

  public static get filesDownload() {
    return (id: string, params?: Params): string => {
      return `${this.url}/files/${id}/download${this.transformParamsToString(params)}`;
    }
  }

  public static get filesById() {
    return (id: string): string => {
      return `${this.url}/files/${id}`;
    }
  }

  public static get restaurants() {
    return (params?: Params): string => {
      return `${this.url}/restaurants${this.transformParamsToString(params)}`;
    }
  }

  public static get restaurantsById() {
    return (id: string, params?: Params): string => {
      return `${this.url}/restaurants/${id}${this.transformParamsToString(params)}`;
    }
  }

  public static get restaurantCategories() {
    return (params?: Params): string => {
      return `${this.url}/restaurant-categories${this.transformParamsToString(params)}`;
    }
  }

  public static get tags() {
    return (params?: Params): string => {
      return `${this.url}/tags${this.transformParamsToString(params)}`;
    }
  }

  public static get apiVersion(): string {
    return 'api';
  }

  private static endpointsWithoutAuthentication: any = [
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

  public static needsAuthentication(url: string, method: string): boolean {
    if (!url.includes(this.url)) { return false; }

    const urlWithoutParams = url.split('?')[0];
    const path = urlWithoutParams.replace(this.url, '');

    const endpoint = this.endpointsWithoutAuthentication.find((endpoint): boolean => this.matchWildcardString(path, endpoint.path));

    if (!endpoint || !endpoint.methods.includes(method)) { return true; }

    return false;
  }

  private static transformParamsToString(params: Params): string {
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

  private static matchWildcardString(str: string, rule: string): boolean {
    const escapeRegex = (str): string => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }
}
