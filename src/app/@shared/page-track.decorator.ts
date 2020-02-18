/* eslint-disable @typescript-eslint/no-unused-expressions */
import { CoreModule } from 'src/app/@core/core.module';
import { Events } from 'src/app/@core/event.service';

export function PageTrack(): ClassDecorator {
  return function(constructor: any): void {
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function(...args: any[]): void {
      const events = CoreModule.injector.get(Events);
      events.publish('view:enter', this.constructor.name);
      ionViewDidEnter && ionViewDidEnter.apply(this, args);
    }
  }
}