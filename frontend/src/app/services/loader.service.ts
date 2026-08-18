import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubjects: Map<string, BehaviorSubject<boolean>> = new Map();

  getLoadingState(modalId: string): Observable<boolean> {
    if (!this.loadingSubjects.has(modalId)) {
      this.loadingSubjects.set(modalId, new BehaviorSubject<boolean>(false));
    }
    return this.loadingSubjects.get(modalId)!.asObservable();
  }

  setLoading(modalId: string, loading: boolean): void {
    if (!this.loadingSubjects.has(modalId)) {
      this.loadingSubjects.set(modalId, new BehaviorSubject<boolean>(loading));
    }
    this.loadingSubjects.get(modalId)!.next(loading);
  }

  startLoading(modalId: string): void {
    this.setLoading(modalId, true);
  }

  stopLoading(modalId: string): void {
    this.setLoading(modalId, false);
  }

  clearLoadingState(modalId: string): void {
    if (this.loadingSubjects.has(modalId)) {
      this.loadingSubjects.get(modalId)!.complete();
      this.loadingSubjects.delete(modalId);
    }
  }

  simulateLoading(modalId: string, delay: number = 800): Promise<void> {
    return new Promise((resolve) => {
      this.startLoading(modalId);
      setTimeout(() => {
        this.stopLoading(modalId);
        resolve();
      }, delay);
    });
  }
}
