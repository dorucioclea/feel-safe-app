import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/@shared/auth.service';
import { URL } from '../@shared/url';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private authService: AuthService,
    // tslint:disable-next-line
    private fileTransfer: FileTransfer,
    private http: HttpClient,
  ) {}

  public upload(filepath: any): any {
    let fileName = filepath.split('/');
    fileName = fileName[fileName.length - 1];

    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      headers: {
        Authorization: this.authService.getAccessToken().id,
      },
    }

    return fileTransfer.upload(filepath, URL.filesUpload(), options);
  }

  public uploadFromUrl(fileUrl: string): Promise<any> {
    return this.http.post(URL.filesUploadFromUrl(), { url: fileUrl })
      .toPromise();
  }

  public delete(fileId: string): Promise<any> {
    return this.http.delete(URL.filesById(fileId))
      .toPromise();
  }
}
