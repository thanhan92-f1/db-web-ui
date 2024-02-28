import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKIP_HEADER } from '../interceptor/header.interceptor';

@Injectable()
export class UnsubscribeService {
    private readonly URL: string = `api/whois-internal/public/unsubscribe`;

    constructor(private http: HttpClient) {}

    public unsubscribe(messageId: string): Observable<any> {
        if (!messageId) {
            console.error('Unsubscribing email', messageId);
            throw new TypeError('UnsubscribeService.unsubscribe failed: no messageId');
        }
        const headers = new HttpHeaders().set('content-type', 'text/plain').set(SKIP_HEADER, '');
        return this.http.post(this.URL, messageId, { headers, responseType: 'text' as 'json' });
    }
}
