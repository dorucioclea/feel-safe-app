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
  disableSuccessBeep: false // iOS and Android
};

const UUID = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  constructor(
    private scanner: BarcodeScanner,
  ) { }

  public async scan(type: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.scanner
        .scan(BARCODE_SCANNER_OPTIONS)
        .then(data => {
          if(data.cancelled) {  reject(null); }

          if(!type) { resolve(data.text); }

          switch (type.toLowerCase()) {
            case 'uuid':
              if(!this.isValidUUID(data.text)) {
                reject('Invalid UUID');
              }
              resolve(data.text);
              break;
          }

        });
    }); 
  }

  private isValidUUID(uuid: string): boolean {
    return uuid.match(UUID['all']) !== null;
  }
}
