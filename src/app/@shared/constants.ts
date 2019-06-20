import { environment } from '../../environments/environment';

// Do NEVER remove or modify the following line (appVersionFromConfigXml)
// under any circumstances as the world will explode if you do so!
const appVersionFromConfigXml = '0.9.3_RC1'

/* tslint:disable-next-line */
export class C {
  public static ENV = environment.name;

  public static STORAGE_PREFIX_SEPARATOR = 'ಠ_ಠ';
  public static STORAGE_APP_PREFIX = 'blueprint';
  public static STORAGE_PREFIX = `${C.STORAGE_APP_PREFIX}-${environment.name}${C.STORAGE_PREFIX_SEPARATOR}`;

  // for non-cordova platforms
  public static APP_VERSION = {
    name: 'prototype',
    package: 'berlin.prototype.starter2',
    number: appVersionFromConfigXml,
  };

  public static appReloadThreshold = 3600000;

  public static urls: any = {
    get baseUrl() {
      return environment.apiBaseUrl;
    },
    get auth() {
      return environment.apiBaseUrl + '/auth';
    },
    apiVersion: 'api',
    get url() {
      return this.baseUrl + '/' + this.apiVersion;
    },
    get users() {
      return this.url + '/users';
    },
    get agreements() {
      return this.url + '/agreements';
    },
    get files() {
      return this.url + '/files';
    },
    get fabs() {
      return this.url + '/fabs';
    },
    get tags() {
      return this.url + '/tags';
    },
    get votes() {
      return this.url + '/votes';
    },
    get shareFab() {
      return this.baseUrl + '/fabs';
    },
  };

  // {8,100}           - Assert password is between 8 and 100 characters
  // (?=.*[0-9])       - Assert a string has at least one number
  // /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/
  public static regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    strongPassword: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,100}$/,
  };

  public static validation = {
    passwordMinLength: 8,
  };

  public static status = {
    unprocessableEntity: 422,
    unauthorized: 401,
  };

  public static colors = {
    primary: '#C2B096',
    secondary: '#F4F4F4',
    danger: '#FF687A',
    light: '#fff',
    dark: '#1D3C5D',
  };

  public static imageUploadOptions: any = {
    quality: 80,
    targetWidth: 1024,
    targetHeight: 1024,
  };

  public static statusBarSettings = {
    style: 'light', // works for iOS | optional | default = dark text (other option: 'light')
    background: C.colors.primary, // works for Android and iOS (if overlaysWebview is false)
    overlaysWebview: true, // if true, status bar background is transparent on iOS
  };

  public static imageSizes: any = {
    preload: 12,
    preview: 120,
    large: 750,
  };

  public static imageFallback: any = {
    default: {
      large: './assets/img/default.png',
      preload: './assets/img/default-preload.png',
    },
    restaurant: {
      large: './assets/img/restaurant.jpg',
      preload: './assets/img/restaurant-preload.jpg',
    },
  };

  public static facebook = {
    page: 'https://www.facebook.com/prototype.berlin/',
  };

  public static google = {
    geocoding: {
      key: 'AIzaSyBWofL-OT0ZZfh5sFfhNvRwHQI2b_QSEBQ',
    },
    maps: {
      key: 'AIzaSyBdcFMydB2OhLucCDSIt9GvxzvqB9TzBhg',
    },
  };
}