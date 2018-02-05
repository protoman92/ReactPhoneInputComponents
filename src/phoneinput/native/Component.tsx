import * as React from 'react';

import {
  FlatList,
  ListRenderItemInfo,
  TextInput,
  View,
} from 'react-native';

import { Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { Component as ComponentUtil } from 'react-base-utilities-js';
import { TouchableButton } from 'react-native-basic-components';
import * as Base from './../base';
import { CountryCode as CC } from './../base/Dependency';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native phone input component.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends Base.Component.Props.Type {
    readonly propertiesProvider?: Properties.ProviderType;
    readonly styleProvider: Style.ProviderType;
  }
}

/**
 * Native phone input component.
 * @extends {Base.Component.Self<Props.Type>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): ComponentUtil.Platform.Case {
    return ComponentUtil.Platform.Case.NATIVE_COMMON;
  }

  protected createCountryCodeItemComponent(cc: CC): JSX.Element {
    let props = this.props;
    let viewModel = this.viewModel;
    let id = viewModel.id;

    let buttonProps: TouchableButton.Component.Props.Type = {
      id: id,
      propertiesProvider: props.propertiesProvider,
      styleProvider: props.styleProvider,
      onPress: this.handleCountryCodeItemSelection.bind(this, cc),
      value: viewModel.formatCountryCode(cc),
    };

    return <TouchableButton.Component.Self {...buttonProps}/>;
  }

  /**
   * Render a country code item.
   * @param {ListRenderItemInfo<CC>} info A ListRenderItemInfo instance.
   * @returns {JSX.Element} A JSX Element instance.
   */
  private renderItem = (info: ListRenderItemInfo<CC>): JSX.Element => {
    return this.createCountryCodeItemComponent(info.item);
  }

  /**
   * Key selector for seletable country code list.
   * @param {CC} item A CC instance.
   * @returns {string} A string value.
   */
  private keyExtractor = (item: CC): string => item.code;

  public render(): JSX.Element {
    let props = this.props;
    let style = props.styleProvider.phoneInput;
    let viewModel = this.viewModel;
    let id = viewModel.id;
    let state = S.fromKeyValue(this.state);

    let properties = Try.unwrap(props.propertiesProvider)
      .flatMap(v => Try.unwrap(v.phoneInput));

    let Compulsory = Style.Compulsory;

    return <View
      {...properties
        .flatMap(v => Try.unwrap(v.mainContainer))
        .flatMap(v => v(id)).value}
      style={style.mainContainer(id).value}>
      <View
        {...properties
          .flatMap(v => Try.unwrap(v.inputContainer))
          .flatMap(v => v(id)).value}
        style={style.inputContainer(id)
          .map(v => Object.assign({}, v, Compulsory.inputContainer())).value}>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap(v.extensionInputField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          editable={false}
          style={style.extensionInputField(id)
            .map(v => Object.assign({}, v, Compulsory.extensionInput())).value}
          value={this.currentExtension(state).value}/>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap(v.phoneInputField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          onChangeText={this.handleNumberInput.bind(this)}
          style={style.phoneInputField(id)
            .map(v => Object.assign({}, v, Compulsory.phoneInput())).value}
          value={this.currentPhoneNumber(state).value}/>
      </View>
      <View
        {...properties
          .flatMap(v => Try.unwrap(v.extensionSearchContainer))
          .flatMap(v => v(id)).value}
        style={style.extensionSearchContainer(id)
          .map(v => Object.assign({}, v, Compulsory.extensionSearchContainer())).value}>
        <TextInput
          {...properties
            .flatMap(v => Try.unwrap(v.extensionQueryField))
            .flatMap(v => v(id)).value}
          autoCorrect={false}
          onChangeText={this.handleExtensionQueryInput.bind(this)}
          style={style.extensionQueryField(id)
            .map(v => Object.assign({}, v, Compulsory.extensionQueryInput())).value}
          value={this.currentExtensionQuery(state).value}/>
        <FlatList
          {...properties
            .flatMap(v => Try.unwrap(v.selectableCountryCodeList))
            .flatMap(v => v(id)).value}
          data={this.currentSelectableCountryCodes(state).getOrElse([])}
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