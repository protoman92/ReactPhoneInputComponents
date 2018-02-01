import { Try } from 'javascriptutilities';

import {
  ScrollViewProperties,
  ScrollViewStyle,
  TextProperties,
  TextStyle,
  ViewProperties,
  ViewStyle,
} from 'react-native';

import { CountryCode as CC } from '../base/Dependency';

export namespace Style {
  /**
   * Style for a native phone input container component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface ContainerType extends ViewStyle {}

  /**
   * Style for a native phone input container component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface InputContainerType extends ViewStyle {}

  /**
   * Style for a native phone input extension input component.
   * @extends {TextStyle} TextStyle extension.
   */
  export interface ExtensionInputType extends TextStyle {}

  /**
   * Style for a native phone input component.
   * @extends {TextStyle} TextStyle extension.
   */
  export interface PhoneInputType extends TextStyle {}

  /**
   * Style for a native phone input extension search container component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface ExtensionSearchContainerType extends ViewStyle {}

  /**
   * Style for a native phone input extension query component.
   * @extends {TextStyle} TextStyle extension.
   */
  export interface ExtensionQueryType extends TextStyle {}

  /**
   * Style for a native phone input selectable code list component.
   * @extends {ScrollViewStyle} ScrollViewStyle extension.
   */
  export interface SelectableCountryCodeListType extends ScrollViewStyle {}

  /**
   * Style for a native phone input country code item container component. This
   * is the component that wraps country code items to provide touch recognition.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface CountryCodeItemContainerType extends ViewStyle {}

  /**
   * Style for a native phone input selectable code item component.
   * @extends {TextStyle} TextStyle extension.
   */
  export interface CountryCodeItemType extends TextStyle {}

  /**
   * Style selector for a native phone input component.
   */
  export interface SelectorType {
    mainContainer(id: string): Try<ContainerType>;
    inputContainer(id: string): Try<InputContainerType>;
    extensionInputField(id: string): Try<ExtensionInputType>;
    phoneInputField(id: string): Try<PhoneInputType>;
    extensionQueryField(id: string): Try<ExtensionQueryType>;
    extensionSearchContainer(id: string): Try<ExtensionQueryType>;
    selectableCountryCodeList(id: string): Try<SelectableCountryCodeListType>;
    countryCodeItem(id: string, cc: CC): Try<CountryCodeItemType>;
    countryCodeItemContainer(id: string, cc: CC): Try<CountryCodeItemContainerType>;
  }

  export namespace Compulsory {
    /**
     * Create compulsory style for the input container. This style will be added
     * to provided style, if applicable.
     * @returns {InputContainerType} A InputContainerType instance.
     */
    export let inputContainer = (): InputContainerType => {
      return { flexDirection: 'row'};
    };

    /**
     * Create compulsory style for the extension input field. This style will be
     * added to provided style, if applicable.
     * @returns {ExtensionInputType} A ExtensionInputType instance.
     */
    export let extensionInput = (): ExtensionInputType => {
      return { flexGrow: 1, textAlign: 'center' };
    };

    /**
     * Create compulsory style for the phone input field. This style will be
     * added to provided style, if applicable.
     * @returns {PhoneInputType} A PhoneInputType instance.
     */
    export let phoneInput = (): PhoneInputType => {
      return { flexGrow: 4, textAlign: 'center' };
    };

    /**
     * Create compulsory style for the extension search container. This style
     * will be added to provided style, if applicable.
     * @returns {ExtensionSearchContainerType} A ExtensionSearchContainerType instance.
     */
    export let extensionSearchContainer = (): ExtensionSearchContainerType => {
      return { flexDirection: 'column', flexGrow: 1 };
    };

    /**
     * Create compulsory style for the extension query field. This style will 
     * be added to provided style, if applicable.
     * @returns {ExtensionQueryType} A ExtensionQueryType instance.
     */
    export let extensionQueryInput = (): ExtensionQueryType => {
      return { textAlign: 'center' };
    };

    /**
     * Create compulsory style for the selectable code list. This style will be
     * added to provided style, if applicable.
     * @returns {ExtensionQueryType} A ExtensionQueryType instance.
     */
    export let selectableCountryCodeList = (): SelectableCountryCodeListType => {
      /// We need to set height to 0 to force wrap the list.
      return { height: 0, flexDirection: 'column' };
    };

    /**
     * Create compulsory style for the country code item container. This style
     * will be added to provided style, if applicable.
     * @returns {ExtensionQueryType} A ExtensionQueryType instance.
     */
    export let countryCodeItemContainer = (): CountryCodeItemContainerType => {
      return { justifyContent: 'center' };
    };
  }

  /**
   * Provide style selector for a native phone input component.
   */
  export interface ProviderType {
    phoneInput: Readonly<SelectorType>;
  }
}

export namespace Properties {
  /**
   * Properties for a native phone input container component.
   * @extends {ViewProperties} ViewProperties extension.
   */
  export interface ContainerType extends ViewProperties {}

  /**
   * Properties for a native phone input container component.
   * @extends {ViewProperties} ViewStyle extension.
   */
  export interface InputContainerType extends ViewProperties {}

  /**
   * Properties for a native phone input extension input component.
   * @extends {TextProperties} TextProperties extension.
   */
  export interface ExtensionInputType extends TextProperties {}

  /**
   * Properties for a native phone input component.
   * @extends {TextProperties} TextProperties extension.
   */
  export interface PhoneInputType extends TextProperties {}

  /**
   * Properties for a native phone input extension query component.
   * @extends {TextProperties} TextProperties extension.
   */
  export interface ExtensionQueryType extends TextProperties {}

  /**
   * Properties for a native phone input extension search container component.
   * @extends {ViewProperties} ViewProperties extension.
   */
  export interface ExtensionSearchContainerType extends ViewProperties {}

  /**
   * Properties for a native phone input selectable code list component.
   * @extends {ScrollViewProperties} ScrollViewProperties extension.
   */
  export interface SelectableCountryCodeType extends ScrollViewProperties {}

  /**
   * StyPropertiesle for a native phone input selectable code item component.
   * @extends {TextProperties} TextProperties extension.
   */
  export interface CountryCodeItemType extends TextProperties {}

  /**
   * Properties for a native phone input country code item container component.
   * @extends {ViewProperties} ViewProperties extension.
   */
  export interface CountryCodeItemContainerType extends ViewProperties {}

  /**
   * Properties selector for a native phone input component.
   */
  export interface SelectorType {
    mainContainer?(id: string): Try<ContainerType>;
    inputContainer?(id: string): Try<InputContainerType>;
    extensionInputField?(id: string): Try<ExtensionInputType>;
    phoneInputField?(id: string): Try<PhoneInputType>;
    extensionQueryField?(id: string): Try<ExtensionQueryType>;
    extensionSearchContainer?(id: string): Try<ExtensionSearchContainerType>;
    selectableCountryCodeList?(id: string): Try<SelectableCountryCodeType>;
    countryCodeItem?(id: string, cc: CC): Try<CountryCodeItemType>;
    countryCodeItemContainer?(id: string, cc: CC): Try<CountryCodeItemContainerType>;
  }

  /**
   * Provide properties selector for a native phone input component.
   */
  export interface ProviderType {
    phoneInput?: Readonly<SelectorType>;
  }
}