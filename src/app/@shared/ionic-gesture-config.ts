import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  public overrides: any = {
    // 'press': { time: 1000 },
  };

  public buildHammer(element: HTMLElement): any {
    const mc = new(<any> window).Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }

    return mc;
  }
}