import { Try } from 'javascriptutilities';

import {
  TextProperties,
  TextStyle,
  ViewProperties,
  ViewStyle,
} from 'react-native';

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
   * Style selector for a native phone input component.
   */
  export interface SelectorType {
    mainContainer(id: string): Try<ContainerType>;
    inputContainer(id: string): Try<InputContainerType>;
    extensionInputField(id: string): Try<ExtensionInputType>;
    phoneInputField(id: string): Try<PhoneInputType>;
    extensionQueryField(id: string): Try<ExtensionQueryType>;
    extensionSearchContainer(id: string): Try<ExtensionQueryType>;
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
   * Properties selector for a native phone input component.
   */
  export interface SelectorType {
    mainContainer?(id: string): Try<ContainerType>;
    inputContainer?(id: string): Try<InputContainerType>;
    extensionInputField?(id: string): Try<ExtensionInputType>;
    phoneInputField?(id: string): Try<PhoneInputType>;
    extensionQueryField?(id: string): Try<ExtensionQueryType>;
    extensionSearchContainer?(id: string): Try<ExtensionSearchContainerType>;
  }

  /**
   * Provide properties selector for a native phone input component.
   */
  export interface ProviderType {
    phoneInput?: Readonly<SelectorType>;
  }
}