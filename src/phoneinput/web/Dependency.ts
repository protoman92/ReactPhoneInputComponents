import { Try } from 'javascriptutilities';
import { Component } from 'react-base-utilities-js';
import { ErrorDisplay } from 'react-error-display-components';

export namespace Identity {
  /**
   * Identity for phone input component.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface Type extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input extension input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ExtensionType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input number input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface NumberType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input extension search input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ExtSearchType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input country code container.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface CountryCodeListType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input country code item.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface CountryCodeItemType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input input container. The input container consists
   * of the extension input and the phone number input.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface InputContainerType extends Component.Web.Identity.Type {}

  /**
   * Identity for phone input extension search container. The ext search
   * container consists of the extension search input and the extension result
   * list.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ExtSearchContainerType extends Component.Web.Identity.Type {}

  /**
   * Select identity for phone input component, based on the provided id.
   */
  export interface SelectorType {
    identity(id: string): Try<Type>;
    extension_identity(id: string): Try<ExtensionType>;
    number_identity(id: string): Try<NumberType>;
    inputCT_identity(id: string): Try<InputContainerType>;
    extSearch_identity(id: string): Try<ExtSearchType>;
    countryCode_item_identity(id: string): Try<CountryCodeItemType>;
    countryCode_list_identity(id: string): Try<CountryCodeListType>;
    extSearchCT_identity(id: string): Try<ExtSearchContainerType>;
  }

  /**
   * Provide identity selector for phone input component.
   * @extends {ErrorDisplay.Web.Identity.ProviderType} Error identity provider.
   */
  export interface ProviderType extends ErrorDisplay.Web.Identity.ProviderType {
    phoneInput?: SelectorType;
  }
}