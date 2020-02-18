/* eslint-disable @typescript-eslint/no-unused-expressions */
// hide html splash image
export function HideSplash(): ClassDecorator {
  return function(constructor: any): any {
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function(...args: any[]): any {
      document.body.classList.add('page-ready');
      ionViewDidEnter && ionViewDidEnter.apply(this, args);
    }
  }
}
