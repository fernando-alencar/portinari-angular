import { PoDynamicFormField, PoBreadcrumb, PoPageAction } from '@portinari/portinari-ui';

/**
 * @usedBy PoPageCustomizationService
 *
 * @description
 *
 * Interface para a customização de uma página dinâmica.
 */
export interface PoPageOptions {

  /**
   * Lista dos campos usados na busca avançada. Caso o mesmo não seja passado a busca avançada não será exibida.
   */
  filters?: Array<PoDynamicFormField>;

  /**
   * Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`.
   */
  actions?: Array<PoPageAction>;

  /** Objeto com propriedades do breadcrumb. */
  breadcrumb?: PoBreadcrumb;

  /** Título da página. */
  title?: string;
}

export type PoCustomizationFunction = () => PoPageOptions;
export type UrlOrPoCustomizationFunction = string | PoCustomizationFunction;
