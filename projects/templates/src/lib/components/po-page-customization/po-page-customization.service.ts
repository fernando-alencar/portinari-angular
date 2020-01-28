import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';

import { PoPageOptions, UrlOrPoCustomizationFunction } from './po-page-options';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PoPageCustomizationService {

  constructor(private http: HttpClient) { }

  getCustomOptions(origin: UrlOrPoCustomizationFunction, originalOption: PoPageOptions): Observable<PoPageOptions> {
    return this.createObservable(origin).pipe(
      map(newPageOptions => this.mergePageOptions(originalOption, newPageOptions))
    );
  }

  changeOriginalOptionsToNewOptions<T, K>(objectToChange: T, newOptions: K) {
    Object.keys(newOptions).forEach(key => {
      const value = newOptions[key];
      if (objectToChange[key]) {
        if (Array.isArray(value)) {
          objectToChange[key] = [...value];
          return;
        }
        if ((typeof (value) === 'number' || typeof (value) === 'string')) {
          objectToChange[key] = value;
          return;
        }
        if (typeof (value) === 'object') {
          objectToChange[key] = { ...value };
        }
      }
    });
  }

  private createObservable(origin: UrlOrPoCustomizationFunction): Observable<PoPageOptions> {
    if (typeof origin === 'string') {
      return this.http.post<PoPageOptions>(origin, {});
    }
    return from(Promise.resolve(origin()));
  }

  private mergePageOptions(originalOption: PoPageOptions, newPageOptions: PoPageOptions): PoPageOptions {
    const mergePageOptions: PoPageOptions = {};
    const filters = this.mergeOption(originalOption.filters, newPageOptions.filters, 'property');
    const actions = this.mergeOption(originalOption.actions, newPageOptions.actions, 'label');
    const breadcrumb = newPageOptions.breadcrumb ? newPageOptions.breadcrumb : originalOption.breadcrumb;
    const title = newPageOptions.title ? newPageOptions.title : originalOption.title;

    if (filters) {
      mergePageOptions.filters = filters;
    }
    if (actions) {
      mergePageOptions.actions = actions;
    }
    if (breadcrumb) {
      mergePageOptions.breadcrumb = breadcrumb;
    }
    if (title) {
      mergePageOptions.title = title;
    }

    return mergePageOptions;
  }

  private mergeOption<T>(originalOption: Array<T>, newOptions: Array<T>, filterProp: keyof T): Array<T> {

    if (!originalOption && !newOptions) {
      return;
    }
    if (!newOptions) {
      return originalOption;
    }
    if (!originalOption) {
      return newOptions;
    }

    const deduplicateNewOption = newOptions.filter(
      newItem => !originalOption.find(originalItem => originalItem[filterProp] === newItem[filterProp]));
    const mergedOriginalOption = originalOption.map(originalItem => {
      const newFoundItem = newOptions.find(newItem => originalItem[filterProp] === newItem[filterProp]);
      return newFoundItem ? newFoundItem : originalItem;
    });

    return [...mergedOriginalOption, ...deduplicateNewOption];
  }
}
