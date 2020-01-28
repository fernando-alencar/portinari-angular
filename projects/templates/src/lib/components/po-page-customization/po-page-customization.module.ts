import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoPageCustomizationService } from './po-page-customization.service';

/**
 * @description
 *
 * Módulo do template do po-page-dynamic-detail.
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    PoPageCustomizationService
  ]
})
export class PoPageCustomizationModule { }
