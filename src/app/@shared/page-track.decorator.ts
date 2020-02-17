import { CoreModule } from 'src/app/@core/core.module';
import { Events } from 'src/app/@core/event.service';

export function PageTrack(): ClassDecorator {
  return function (constructor: any) {
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function (...args: any[]) {
      const events = CoreModule.injector.get(Events);
      /* tslint:disable-next-line */
      events.publish('view:enter', this.constructor.name);
      /* tslint:disable-next-line */
      ionViewDidEnter && ionViewDidEnter.apply(this, args);
    }
  }
}