import { Try } from 'javascriptutilities';

import {
  ScrollViewProperties,
  ScrollViewStyle,
  TextInputProperties,
  TextStyle,
  ViewProperties,
  ViewStyle,
} from 'react-native';

import { TouchableButton } from 'react-native-basic-components';

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
      /// We set width 0 here to avoid this input field growing/shrinking when
      /// different inputs are set (on Android). This property forces this input
      /// field to grow based on the specified proportion.
      return { flexGrow: 1, width: 0, textAlign: 'center' };
    };

    /**
     * Create compulsory style for the phone input field. This style will be
     * added to provided style, if applicable.
     * @returns {PhoneInputType} A PhoneInputType instance.
     */
    export let phoneInput = (): PhoneInputType => {
      return { flexGrow: 5, textAlign: 'center' };
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
  }

  /**
   * Provide style selector for a native phone input component.
   * @extends {TouchableButton.Style.ProviderType} Touchable button style
   * provider extension.
   */
  export interface ProviderType extends TouchableButton.Style.ProviderType {
    readonly phoneInput: SelectorType;
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
  export interface ExtensionInputType extends TextInputProperties {}

  /**
   * Properties for a native phone input component.
   * @extends {TextInputProperties} TextInputProperties extension.
   */
  export interface PhoneInputType extends TextInputProperties {}

  /**
   * Properties for a native phone input extension query component.
   * @extends {TextInputProperties} TextInputProperties extension.
   */
  export interface ExtensionQueryType extends TextInputProperties {}

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
   * Properties selector for a native phone input component.
   */
  export interface SelectorType {
    mainContainer(id: string): Try<ContainerType>;
    inputContainer(id: string): Try<InputContainerType>;
    extensionInputField(id: string): Try<ExtensionInputType>;
    phoneInputField(id: string): Try<PhoneInputType>;
    extensionQueryField(id: string): Try<ExtensionQueryType>;
    extensionSearchContainer(id: string): Try<ExtensionSearchContainerType>;
    selectableCountryCodeList(id: string): Try<SelectableCountryCodeType>;
  }

  /**
   * Provide properties selector for a native phone input component.
   * @extends {TouchableButton.Properties.ProviderType} Touchable button
   * properties provider extension.
   */
  export interface ProviderType extends TouchableButton.Properties.ProviderType {
    readonly phoneInput?: SelectorType;
  }
}