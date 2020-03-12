import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Injectable } from '@angular/core';

const BARCODE_SCANNER_OPTIONS = {
  preferFrontCamera: false, // iOS and Android
  showFlipCameraButton: true, // iOS and Android
  showTorchButton: true, // iOS and Android
  torchOn: true, // Android, launch with the torch switched on (if available)
  saveHistory: false, // Android, save scan history (default false)
  prompt: 'Place a QR Code inside the scan area', // Android
  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
  formats: 'QR_CODE', // default: all but PDF_417 and RSS_EXPANDED
  orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
  disableAnimations: false, // iOS
  disableSuccessBeep: false, // iOS and Android
  color: undefined, // Reticle finder color 
};

const UUID = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

type ScanType = 'url-uuid' | 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  constructor(
    private scanner: BarcodeScanner,
  ) { }

  public async scan(type: ScanType): Promise<string> {

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary');

    BARCODE_SCANNER_OPTIONS.color = BARCODE_SCANNER_OPTIONS.color || primaryColor;

    return new Promise((resolve, reject) => {
      this.scanner
        .scan(BARCODE_SCANNER_OPTIONS)
        .then(scanData => {
          if(scanData.cancelled) {  reject(null); }

          if(!type) { resolve(scanData.text); }

          switch (type.toLowerCase()) {
            case 'uuid':
              const uuid = scanData.text;
              if(!this.isValidUUID(uuid)) {
                reject('Invalid UUID');
              }
              resolve(uuid);
              break;
            case 'url-uuid':
              const url_uuid = this.parseURLData(scanData.text);
              if(!this.isValidUUID(url_uuid)) {
                reject('Invalid UUID');
              }
              resolve(url_uuid);
              break;
          }

        });
    }); 
  }

  private isValidUUID(uuid: string): boolean {
    return uuid.match(UUID['all']) !== null;
  }

  private parseURLData(url: string): string {
    const split = url.split('/');

    return split[split.length - 1];
  }
}
