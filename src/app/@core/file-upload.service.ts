import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/shared/auth.service';
import { C } from '../@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private authService: AuthService,
    private fileTransfer: FileTransfer,
    private http: HttpClient,
  ) {}

  public upload(filepath: any) {
    const url = `${C.urls.files}/upload`;
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

    return fileTransfer.upload(filepath, url, options);
  }

  public uploadFromUrl(fileUrl: string) {
    const url = `${C.urls.files}/upload-from-url`;

    return this.http.post(url, { url: fileUrl })
      .toPromise();
  }

  public delete(fileId: string) {
    const url = `${C.urls.files}/${fileId}`;

    return this.http.delete(url)
      .toPromise();
  }
}
