import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoDynamicModule, PoModalModule, PoPageModule } from '@portinari/portinari-ui';

import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';
import { PoPageDynamicSearchComponent } from './po-page-dynamic-search.component';
import { PoPageCustomizationModule } from '../po-page-customization/po-page-customization.module';

/**
 * @description
 *
 * Módulo do template do po-page-dynamic-search.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    PoDynamicModule,
    PoModalModule,
    PoPageModule,
    PoPageCustomizationModule
  ],
  declarations: [
    PoAdvancedFilterComponent,
    PoPageDynamicSearchComponent
  ],
  exports: [
    PoPageDynamicSearchComponent
  ]
})
export class PoPageDynamicSearchModule { }
