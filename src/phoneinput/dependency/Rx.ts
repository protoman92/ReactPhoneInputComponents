import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { StateType } from 'type-safe-state-js';
import { ReduxStore as Store, RxReducer } from 'reactive-rx-redux-js';
import { ErrorDisplay } from 'react-error-display-components';
import * as Base from './../base';
import { CountryCode } from './../base/Dependency';

export namespace Action {
  /**
   * Rx store-based action for a phone input component.
   * @extends {Base.Action.Type} Base action extension.
   */
  export interface Type extends Base.Action.Type {
    allCountryCodesTrigger(id: string): Try<Observer<Nullable<CountryCode[]>>>;
    allCountryCodesStream(id: string): Try<Observable<Nullable<CountryCode[]>>>;
    selectableCodesTrigger(id: string): Try<Observer<Nullable<CountryCode[]>>>;
    selectableCodesStream(id: string): Try<Observable<Nullable<CountryCode[]>>>;
    extensionTrigger(id: string): Try<Observer<Nullable<CountryCode>>>;
    extensionStream(id: string): Try<Observable<Nullable<CountryCode>>>;
    numberTrigger(id: string): Try<Observer<Nullable<string>>>;
    numberStream(id: string): Try<Observable<Nullable<string>>>;
    extSearchTrigger(id: string): Try<Observer<Nullable<string>>>;
    extSearchStream(id: string): Try<Observable<Nullable<string>>>;
  }

  /**
   * Provide actions for a phone input component.
   * @extends {Base.Action.ProviderType} Base action provider extension.
   * @extends {ErrorDisplay.Rx.Action.ProviderType} Error display action
   * provider extension.
   */
  export interface ProviderType extends
    Base.Action.ProviderType,
    ErrorDisplay.Rx.Action.ProviderType {
    error: ErrorDisplay.Rx.Action.Type;
    phoneInput: Readonly<Type>;
  }

  /**
   * Create default phone picker action.
   * @returns {Type} A Action type instance.
   */
  export let createDefault = (): Type => {
    let substate = 'phonePicker';
    let allOptionsTrigger = new BehaviorSubject<Nullable<CountryCode[]>>(undefined);
    let selectableTrigger = new BehaviorSubject<Nullable<CountryCode[]>>(undefined);
    let extensionTrigger = new BehaviorSubject<Nullable<CountryCode>>(undefined);
    let numberTrigger = new BehaviorSubject<Nullable<string>>(undefined);
    let extSearchTrigger = new BehaviorSubject<Nullable<string>>(undefined);

    return {
      ...Base.Action.createDefault(),
      substatePath: () => Try.success(substate),
      allCountryCodesTrigger: () => Try.success(allOptionsTrigger),
      allCountryCodesStream: () => Try.success(allOptionsTrigger),
      selectableCodesTrigger: () => Try.success(selectableTrigger),
      selectableCodesStream: () => Try.success(selectableTrigger),
      extensionTrigger: () => Try.success(extensionTrigger),
      extensionStream: () => Try.success(extensionTrigger),
      numberTrigger: () => Try.success(numberTrigger),
      numberStream: () => Try.success(numberTrigger),
      extSearchTrigger: () => Try.success(extSearchTrigger),
      extSearchStream: () => Try.success(extSearchTrigger),
    };
  };
}

export namespace Reducer {
  /**
   * Create default phone input reducers for a rx store.
   * @param {string} id A string value.
   * @param {Action.ProviderType} action An Action provider instance.
   * @returns {Observable<RxReducer<any>>[]} An Array of reducers.
   */
  export let createDefault = (id: string, action: Action.ProviderType): Observable<RxReducer<any>>[] => {
    let ppAction = action.phoneInput;
    let allCodesPath = ppAction.fullAllCountryCodesPath(id).getOrElse('');
    let selectablePath = ppAction.fullSelectableCodesPath(id).getOrElse('');
    let extensionPath = ppAction.fullExtensionPath(id).getOrElse('');
    let numberPath = ppAction.fullNumberPath(id).getOrElse('');
    let extSearchPath = ppAction.fullExtSearchPath(id).getOrElse('');

    let allCodesStream = ppAction
      .allCountryCodesStream(id)
      .getOrElse(Observable.empty());

    let selectableStream = ppAction
      .selectableCodesStream(id)
      .getOrElse(Observable.empty());

    let extStream = ppAction
      .extensionStream(id)
      .getOrElse(Observable.empty());

    let numberStream = ppAction
      .numberStream(id)
      .getOrElse(Observable.empty());

    let extSearchStream = ppAction
      .extSearchStream(id)
      .getOrElse(Observable.empty());

    let allOptionsRd = Store.Rx.createReducer(allCodesStream, (state, v) => {
      return state.updatingValue(allCodesPath, v.value);
    });

    let selectableRd = Store.Rx.createReducer(selectableStream, (state, v) => {
      return state.updatingValue(selectablePath, v.value);
    });

    let extRd = Store.Rx.createReducer(extStream, (state, v) => {
      return state.updatingValue(extensionPath, v.value);
    });

    let numberRd = Store.Rx.createReducer(numberStream, (state, v) => {
      return state.updatingValue(numberPath, v.value);
    });

    let extSearchRd = Store.Rx.createReducer(extSearchStream, (state, v) => {
      return state.updatingValue(extSearchPath, v.value);
    });

    return [allOptionsRd, extSearchRd, selectableRd, extRd, numberRd];
  };
}

export namespace Provider {
  /**
   * Provide the necessary dependencies for a rx store-based view model.
   * @extends {Base.Provider.Type} Base provider extension.
   */
  export interface Type extends Base.Provider.Type, ErrorDisplay.Rx.Provider.Type {
    action: Action.ProviderType;
  }
}

export namespace Model {
  /**
   * Rx store-based model for a phone input component.
   * @extends {Base.Model.Type} Base model extension.
   */
  export interface Type extends Base.Model.Type {}

  /**
   * Rx store-based model for a phone input component.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    private readonly provider: Provider.Type;
    private readonly baseModel: Base.Model.Type;
    private readonly errorModel: ErrorDisplay.Base.Model.Type;

    public get id(): Readonly<string> {
      return this.baseModel.id;
    }

    public get substatePath(): Readonly<Try<string>> {
      return this.baseModel.substatePath;
    }

    public constructor(provider: Provider.Type, id: string) {
      this.provider = provider;
      this.baseModel = new Base.Model.Self(provider, id);
      this.errorModel = new ErrorDisplay.Rx.Model.Self(provider);
    }

    public fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CountryCode[]>> {
      return this.baseModel.fetchCodes(prev);
    }

    public allCountryCodesTrigger(): Try<Observer<Nullable<CountryCode[]>>> {
      return this.provider.action.phoneInput.allCountryCodesTrigger(this.id);
    }

    public numberTrigger = (): Try<Observer<Nullable<string>>> => {
      return this.provider.action.phoneInput.numberTrigger(this.id);
    }

    public extensionTrigger(): Try<Observer<Nullable<CountryCode>>> {
      return this.provider.action.phoneInput.extensionTrigger(this.id);
    }

    public extSearchTrigger = (): Try<Observer<Nullable<string>>> => {
      throw this.provider.action.phoneInput.extSearchTrigger(this.id);
    }

    public selectableCodesTrigger(): Try<Observer<Nullable<CountryCode[]>>> {
      throw this.provider.action.phoneInput.selectableCodesTrigger(this.id);
    }

    public operationErrorTrigger = (): Observer<Nullable<Error>> => {
      return this.errorModel.operationErrorTrigger();
    }

    public operationErrorStream = (): Observable<Try<Error>> => {
      return this.errorModel.operationErrorStream();
    }

    public allCountryCodesStream(): Observable<Try<CountryCode[]>> {
      return this.baseModel.allCountryCodesStream();
    }

    public extensionStream(): Observable<Try<CountryCode>> {
      return this.baseModel.extensionStream();
    }

    public numberStream = (): Observable<Try<string>> => {
      return this.baseModel.numberStream();
    }

    public extSearchStream = (): Observable<Try<string>> => {
      return this.baseModel.extSearchStream();
    }

    public selectableCodesStream(): Observable<Try<CountryCode[]>> {
      return this.baseModel.selectableCodesStream();
    }

    public extensionForState(state: Readonly<Nullable<StateType<any>>>): Try<CountryCode> {
      return this.baseModel.extensionForState(state);
    }

    public numberForState(state: Readonly<Nullable<StateType<any>>>): Try<string> {
      return this.baseModel.numberForState(state);
    }

    public extSearchForState(state: Readonly<Nullable<StateType<any>>>): Try<string> {
      return this.baseModel.extSearchForState(state);
    }

    public selectableCodesForState(state: Readonly<Nullable<StateType<any>>>): Try<CountryCode[]> {
      return this.baseModel.selectableCodesForState(state);
    }

    public filterCodes(options: CountryCode[], query: string): CountryCode[] {
      return this.baseModel.filterCodes(options, query);
    }
  }
}