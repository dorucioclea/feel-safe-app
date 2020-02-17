import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AgreementModel } from 'src/app/legal/@shared/agreement.model';
import { URL } from 'src/app/@shared/url';

@Injectable({
  providedIn: 'root',
})
export class LegalService {
  constructor(
    private http: HttpClient,
  ) { }

  public getLatestAgreement(agreementType: string): Observable<AgreementModel> {
    return this.http.get<AgreementModel>(URL.agreementsLatest(agreementType));
  }

  public consentToAgreement(agreementId: string, agreement: AgreementModel, agreementType: string) {
    return this.http.post(URL.consents(), {
      agreementId: agreementId,
      agreement: agreement,
      agreementType: agreementType,
    }).toPromise();
  }

  public checkForRequiredActions(): Promise<any[]> {
    return this.http.get<any[]>(URL.agreementsRequireAction()).toPromise();
  }
}
