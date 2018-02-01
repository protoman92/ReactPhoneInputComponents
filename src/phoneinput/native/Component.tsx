import * as React from 'react';

import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    let props = this.props;
    let viewModel = this.viewModel;
    let id = viewModel.id;
    let style = props.style;

    let properties = Try.unwrap(props.properties)
      .flatMap(v => Try.unwrap(v.phoneInput));

    let Compulsory = Style.Compulsory;

    return <TouchableOpacity
      {...properties
        .flatMap(v => Try.unwrap<Function>(v.countryCodeItemContainer))
        .flatMap(v => v(id, cc)).value}
      onPress={this.handleCountryCodeItemSelection.bind(this, cc)}
      style={style.phoneInput.countryCodeItemContainer(id, cc)
        .map(v => Object.assign({}, v, Compulsory.countryCodeItemContainer())).value}>
      <Text
        {...properties
          .flatMap(v => Try.unwrap<Function>(v.countryCodeItem))
          .flatMap(v => v(id, cc)).value}
        style={style.phoneInput.countryCodeItem(id, cc).value}>
          {viewModel.formatCountryCode(cc)}
        </Text>
    </TouchableOpacity>;
  }

  /**
   * Render a country code item.
   * @param {ListRenderItemInfo<CC>} item A ListRenderItemInfo instance.
   * @returns {JSX.Element} A JSX Element instance.
   */
  private renderItem = (item: ListRenderItemInfo<CC>): JSX.Element => {
    return this.createCountryCodeItemComponent(item.item);
  }

  /**
   * Key selector for seletable country code list.
   * @param {CC} item A CC instance.
   * @returns {string} A string value.
   */
  private keyExtractor = (item: CC): string => item.code;

  public render(): JSX.Element {
    let props = this.props;
    let style = props.style.phoneInput;
    let viewModel = this.viewModel;
    let id = viewModel.id;

    let properties = Try.unwrap(props.properties)
      .flatMap(v => Try.unwrap(v.phoneInput));

    let Compulsory = Style.Compulsory;

    return <View
      {...properties
        .flatMap(v => Try.unwrap<Function>(v.mainContainer))
        .flatMap(v => v(id)).value}
      style={style.mainContainer(id).value}>
      <View
        {...properties
          .flatMap(v => Try.unwrap<Function>(v.inputContainer))
          .flatMap(v => v(id)).value}
        style={style.inputContainer(id)
          .map(v => Object.assign({}, v, Compulsory.inputContainer())).value}>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.extensionInputField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          editable={false}
          style={style.extensionInputField(id)
            .map(v => Object.assign({}, v, Compulsory.extensionInput())).value}
          value={this.currentExtension().value}/>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.phoneInputField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          onChangeText={this.handleNumberInput.bind(this)}
          style={style.phoneInputField(id)
            .map(v => Object.assign({}, v, Compulsory.phoneInput())).value}
          value={this.currentPhoneNumber().value}/>
      </View>
      <View
        {...properties
          .flatMap(v => Try.unwrap<Function>(v.extensionSearchContainer))
          .flatMap(v => v(id)).value}
        style={style.extensionSearchContainer(id)
          .map(v => Object.assign({}, v, Compulsory.extensionSearchContainer())).value}>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.extensionQueryField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          onChangeText={this.handleExtensionQueryInput.bind(this)}
          style={style.extensionQueryField(id)
            .map(v => Object.assign({}, v, Compulsory.extensionQueryInput())).value}
          value={this.currentExtensionQuery().value}/>
        <FlatList
          {...properties
            .flatMap(v => Try.unwrap<Function>(v.selectableCountryCodeList))
            .flatMap(v => v(id)).value}
          data={this.currentSelectableCountryCodes().getOrElse([])}
          extraData={this.state}
          keyExtractor={this.keyExtractor.bind(this)}
          numColumns={1}
          renderItem={this.renderItem.bind(this)}
          style={style.selectableCountryCodeList(id)
            .map(v => Object.assign({}, v, Compulsory.selectableCountryCodeList())).value}/>
      </View>
    </View>;
  }
}