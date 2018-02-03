import * as React from 'react';
import { ChangeEvent } from 'react';
import { Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { Component as ComponentUtil, Data } from 'react-base-utilities-js';
import * as Base from './../base';
import { Identity } from './Dependency';

import { CountryCode as CC } from './../base/Dependency';

export namespace Props {
  /**
   * Props type for a web phone input component.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends Base.Component.Props.Type {
    readonly identityProvider?: Identity.ProviderType;
  }
}

/**
 * Base component to pick phone numbers. Platform-specific components should
 * extend this component.
 * @extends {Base.Component.Self<Props.Type>} Base component extension.
 */
export abstract class Self extends Base.Component.Self<Props.Type> {
  public get platform(): ComponentUtil.Platform.Case {
    return ComponentUtil.Platform.Case.WEB;
  }

  /**
   * Trigger state update for number input.
   * @param {ChangeEvent<HTMLInputElement>} e Change event instance.
   */
  private handleNumberInputEvent = (e: ChangeEvent<HTMLInputElement>): void => {
    this.handleNumberInput(e.target.value);
  }

  /**
   * Trigger state update for extension search input.
   * @param {ChangeEvent<HTMLInputElement>} e Change event instance.
   */
  private handleExtSearchInputEvent = (e: ChangeEvent<HTMLInputElement>): void => {
    this.handleExtensionQueryInput(e.target.value);
  }

  protected createCountryCodeItemComponent(cc: CC): JSX.Element {
    let vm = this.viewModel;

    let identity = Try.unwrap(this.props.identityProvider)
      .flatMap(v => Try.unwrap(v.phoneInput))
      .map(v => v.countryCode_item_identity(vm.id));

    return <div
      key={cc.code}
      onClick={this.handleCountryCodeItemSelection.bind(this, cc)}
      {...identity.value}>
      {vm.formatCountryCode(cc)}
    </div>;
  }

  public render(): JSX.Element {
    let vm = this.viewModel;
    let id = vm.id;
    let state = S.fromKeyValue(this.state);

    let identity = Try.unwrap(this.props.identityProvider)
      .flatMap(v => Try.unwrap(v.phoneInput));

    return <div {...identity.flatMap(v => v.identity(id)).value}>
      <div {...identity.flatMap(v => v.inputCT_identity(id)).value}>
        <input
          disabled={true}
          onChange={this.handleExtSearchInputEvent.bind(this)}
          type={Data.InputType.Web.Case.TEXT}
          value={this.currentExtension(state).value}
          {...identity.flatMap(v => v.extension_identity(id)).value}/>
        <input
          onChange={this.handleNumberInputEvent.bind(this)}
          type={Data.InputType.Web.Case.TEXT}
          value={this.currentPhoneNumber(state).value}
          {...identity.flatMap(v => v.number_identity(id)).value}/>
      </div>
      <div {...identity.flatMap(v => v.extSearchCT_identity(id)).value}>
        <input
          onChange={this.handleExtSearchInputEvent.bind(this)}
          type={Data.InputType.Web.Case.TEXT}
          value={this.currentExtensionQuery(state).value}
          {...identity.flatMap(v => v.extSearch_identity(id)).value}/>
        <div {...identity.flatMap(v => v.countryCode_list_identity(id)).value}>
          {this.createSelectableCodeComponents()}
        </div>
      </div>
    </div>;
  }
}