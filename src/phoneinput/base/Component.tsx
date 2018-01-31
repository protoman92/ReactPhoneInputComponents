import { Subscription } from 'rxjs';
import { Component } from 'react';
import { Nullable } from 'javascriptutilities';
import { StateType } from 'type-safe-state-js';
import { Component as ComponentUtil } from 'react-base-utilities-js';
import { ViewModel } from './Dependency';
import { CountryCode as CC } from './Dependency';

export namespace Props {
  /**
   * Base props type for phone input component.
   */
  export interface Type {
    viewModel: Readonly<ViewModel.Type>;
  }
}

/**
 * Base component to pick phone numbers. Platform-specific components should
 * extend this component.
 * @extends {Component<P, StateType<any>>} Component extension.
 * @template P Props generics.
 */
export abstract class Self<P extends Props.Type> extends
  Component<P, StateType<any>> implements
  ComponentUtil.Custom.Type<P, StateType<any>> {
  public abstract readonly platform: ComponentUtil.Platform.Case;
  protected readonly viewModel: ViewModel.Type;
  protected readonly subscription: Subscription;

  public constructor(props: P) {
    super(props);
    this.viewModel = props.viewModel;
    this.subscription = new Subscription();
  }

  public componentWillMount(): void {
    let viewModel = this.viewModel;
    viewModel.initialize();
    ComponentUtil.Custom.connectState(this, viewModel, this.subscription);
  }

  public componentWillUnmount(): void {
    this.viewModel.deinitialize();
    this.subscription.unsubscribe();
  }

  /**
   * Trigger state update for number input.
   * @param {Nullable<string>} input Nullable<string>.
   */
  protected handleNumberInput = (input: Nullable<string>): void => {
    this.viewModel.triggerNumberInput(input);
  }

  /**
   * Trigger state update for extension search input.
   * @param {Nullable<string>} input A string value.
   */
  protected handleExtSearchInput = (input: Nullable<string>): void => {
    this.viewModel.triggerExtSearchInput(input);
  }

  /**
   * Trigger state update to select extension.
   * @param {CC} code Country code instance.
   */
  protected handleCountryCodeItemSelection(code: CC): void {
    this.viewModel.triggerSelectedCountryCode(code);
  }

  protected createSelectableCodeComponents = (): JSX.Element[] => {
    let codes = this.viewModel.selectableCodesForState(this.state);
    return codes.getOrElse([]).map(v => this.createCountryCodeItemComponent(v));
  }

  /**
   * Create country code item component.
   * @param {CC} cc Country code instance.
   * @returns {JSX.Element} A JSX element instance.
   */
  protected abstract createCountryCodeItemComponent(cc: CC): JSX.Element;
  public abstract render(): JSX.Element;
}