import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Security {
  symbol: string;
  description: string;
  price: number;
}

interface SecurityRequest {
  symbol: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly apiUrl = 'https://localhost:7230/api/Security/get';

  constructor(private http: HttpClient) {}

  getSecurities(symbols: string[]): Observable<{ foundSecurities: Security[], missingSymbols: string[] }> {
    return this.http.post<{ foundSecurities: Security[], missingSymbols: string[] }>(
      this.apiUrl,
        {
            "userId": "ronakvip",
            "requestId": this.generateGuid(),
            "requestType": "GetSecurity",
            "symbols": symbols
        }
    );
  }

    generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
