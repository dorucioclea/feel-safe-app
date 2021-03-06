const pStyle: CSSStyleDeclaration = getComputedStyle(document.documentElement);

export type ProtoImageType = 'default' | 'banner' | 'thumbnail' | 'avatar' | 'preload';

/* tslint:disable-next-line */
export class ProtoImageConfig {
  public static ratio: { [key: string]: number } = {
    avatar: parseFloat(pStyle.getPropertyValue('--ratio-square')),
    avatar_large: parseFloat(pStyle.getPropertyValue('--ratio-square')),
    banner: parseFloat(pStyle.getPropertyValue('--proto-image-ratio-banner')),
    default: parseFloat(pStyle.getPropertyValue('--proto-image-ratio-default')),
    preload: parseFloat(pStyle.getPropertyValue('--proto-image-ratio-default')),
    thumbnail: parseFloat(pStyle.getPropertyValue('--proto-image-ratio-thumbnail')),
  };

  public static width: { [key: string]: number } = {
    avatar: parseFloat(pStyle.getPropertyValue('--proto-image-width-avatar')),
    avatar_large: parseFloat(pStyle.getPropertyValue('--proto-image-width-avatar-l')),
    default: parseFloat(pStyle.getPropertyValue('--proto-image-width-default')),
    placeholder: parseFloat(pStyle.getPropertyValue('--proto-image-width-placeholder')),
    preload: parseFloat(pStyle.getPropertyValue('--proto-image-width-preload')),
    thumbnail: parseFloat(pStyle.getPropertyValue('--proto-image-width-thumbnail')),
  };

  public static fallback: { [key: string]: string } = {
    default: './assets/img/placeholder.png',
    error: './assets/img/default.png',
  };
}
