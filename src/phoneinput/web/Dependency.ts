import { Try } from 'javascriptutilities';
import { Component } from 'react-base-utilities-js';
import { ErrorDisplay } from 'react-error-display-components';

export namespace Identity {
  /**
   * Identity for phone picker component.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface Type extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker extension input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ExtensionType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker number input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface NumberType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker extension search input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ExtSearchType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker country code container.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface CCodeListType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker country code item.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface CCodeItemType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker input container. The input container consists
   * of the extension input and the phone number input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface InputCTType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone picker extension search container. The ext search
   * container consists of the extension search input and the extension result
   * list.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ExtSearchCTType extends Component.Web.Identity.Type {}

  /**
   * Select identity for phone picker component, based on the provided id.
   */
  export interface SelectorType {
    identity(id: string): Try<Type>;
    extension_identity(id: string): Try<ExtensionType>;
    number_identity(id: string): Try<NumberType>;
    inputCT_identity(id: string): Try<InputCTType>;
    extSearch_identity(id: string): Try<ExtSearchType>;
    countryCode_item_identity(id: string): Try<CCodeItemType>;
    countryCode_list_identity(id: string): Try<CCodeListType>;
    extSearchCT_identity(id: string): Try<ExtSearchCTType>;
  }

  /**
   * Provide identity selector for phone picker component.
   * @extends {ErrorDisplay.Web.Identity.ProviderType} Error identity provider.
   */
  export interface ProviderType extends ErrorDisplay.Web.Identity.ProviderType {
    phoneInput?: SelectorType;
  }
}