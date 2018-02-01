import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Try } from 'javascriptutilities';
import { Component as ComponentUtil } from 'react-base-utilities-js';
import * as Base from './../base';
import { CountryCode as CC } from './../base/Dependency';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native phone input component.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends Base.Component.Props.Type {
    properties?: Properties.ProviderType;
    style: Style.ProviderType;
  }
}

/**
 * Native phone input component.
 * @extends {Base.Component.Self<Props.Type>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<ComponentUtil.Platform.Case> {
    return ComponentUtil.Platform.Case.NATIVE_COMMON;
  }

  protected createCountryCodeItemComponent(cc: CC): JSX.Element {
    let viewModel = this.viewModel;

    return <TouchableOpacity>
      <Text>{viewModel.formatCountryCode(cc)}</Text>
    </TouchableOpacity>;
  }

  public render(): JSX.Element {
    let props = this.props;
    let style = props.style.phoneInput;
    let viewModel = this.viewModel;
    let id = viewModel.id;

    let properties = Try.unwrap(props.properties)
      .flatMap(v => Try.unwrap(v.phoneInput));

    return <View
      {...properties
        .flatMap(v => Try.unwrap<Function>(v.mainContainer))
        .flatMap(v => v(id)).value}
      style={style.mainContainer(id).value}>
      <View
        {...properties
          .flatMap(v => Try.unwrap<Function>(v.inputContainer))
          .flatMap(v => v(id)).value}
        style={style.inputContainer(id).value}>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.extensionInputField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          editable={false}
          style={style.extensionInputField(id).value}
          value={this.currentExtension().value}/>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.phoneInputField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          onChangeText={this.handleNumberInput.bind(this)}
          style={style.phoneInputField(id).value}
          value={this.currentPhoneNumber().value}/>
      </View>
      <View
        {...properties
          .flatMap(v => Try.unwrap<Function>(v.extensionSearchContainer))
          .flatMap(v => v(id)).value}
        style={style.extensionSearchContainer(id).value}>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.extensionQueryField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          onChangeText={this.handleExtensionQueryInput.bind(this)}
          style={style.extensionQueryField(id).value}
          value={this.currentExtensionQuery().value}/>
      </View>
    </View>;
  }
}