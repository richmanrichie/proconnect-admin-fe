import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetupResponse, MenuItem, User } from '../models/admin.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiBaseUrl}/admins`;
  private setupData: SetupResponse | null = null;

  constructor(private http: HttpClient) {}

  getSetupData(forceRefresh: boolean = false): Observable<SetupResponse> {
    if (this.setupData && !forceRefresh) {
      return new Observable(observer => {
        observer.next(this.setupData!);
        observer.complete();
      });
    }

    return this.http.get<SetupResponse>(`${this.apiUrl}/setup`).pipe(
      map(response => {
        this.setupData = response;
        return response;
      })
    );
  }

  getMenu(): Observable<MenuItem[]> {
    return this.getSetupData().pipe(
      map(response => response.data.menu)
    );
  }

  getUser(): Observable<User> {
    return this.getSetupData().pipe(
      map(response => response.data.user)
    );
  }

  clearCache(): void {
    this.setupData = null;
  }
}
