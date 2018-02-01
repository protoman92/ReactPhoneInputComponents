import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { State as S, StateType } from 'type-safe-state-js';
import { ReduxStore as Store } from 'reactive-rx-redux-js';
import { Data, MVVM } from 'react-base-utilities-js';
import { ErrorDisplay } from 'react-error-display-components';

export type CountryCode = Data.CountryCode.Type;
export type ReadonlyState = Readonly<Nullable<StateType<any>>>;

export namespace Action {
  /**
   * Action for phone picker component. This is the base action that should
   * provide common functionalities for dispatch store-based or rx store-based
   * actions.
   */
  export interface Type {
    /**
     * Common substate path for phone picker actions.
     * @param {string} id A string value.
     * @returns {Try<string>} A Try string value.
     */
    substatePath(id: string): Try<string>;

    /**
     * Path to store all country codes.
     * @param {string} id A string value.
     * @returns {Try<string>} A Try string instance.
     */
    fullAllCountryCodesPath(id: string): Try<string>;

    /**
     * Path to store all selectable codes, i.e. country codes that have been
     * filtered to contain only those that could contain the inputed extension.
     * @param {string} id A string value.
     * @returns {Try<string>} A Try string instance.
     */
    fullSelectableCodesPath(id: string): Try<string>;
    fullExtensionPath(id: string): Try<string>;
    fullNumberPath(id: string): Try<string>;
    fullExtSearchPath(id: string): Try<string>;
  }

  /**
   * Provide action for a phone input component.
   * @extends {ErrorDisplay.Base.Action.ProviderType} Error display action
   * provider extension.
   */
  export interface ProviderType extends ErrorDisplay.Base.Action.ProviderType {
    phoneInput: Readonly<Type>;
  }

  /**
   * Create default base phone input action. This can be used to construct
   * more complex actions for dispatch store- or rx store-based implementations.
   * @param {string} [id] A string value.
   * @returns {Type} A type instance.
   */
  export let createDefault = (id?: string): Type => {
    let substate = 'phoneinput' + Try.unwrap(id)
      .filter(v => v.length > 0, 'Empty id')
      .map(v => '.' + v)
      .getOrElse('');

    return {
      substatePath: () => Try.success(substate),
      fullAllCountryCodesPath: () => Try.success(`${substate}.allCodes`),
      fullSelectableCodesPath: () => Try.success(`${substate}.selectable`),
      fullExtensionPath: () => Try.success(`${substate}.extension`),
      fullNumberPath: () => Try.success(`${substate}.number`),
      fullExtSearchPath: () => Try.success(`${substate}.extSearch`),
    };
  };
}

export namespace Provider {
  /**
   * Provide country codes for phone picker component.
   */
  export interface CountryCodeType {
    fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CountryCode[]>>;
  }

  /**
   * Provide the relevant dependencies for phone picker component.
   * @extends {Store.Provider.Type} Store provider extension.
   * @extends {ErrorDisplay.Base.Provider.Type} Error display provider extension.
   */
  export interface Type extends Store.Provider.Type, ErrorDisplay.Base.Provider.Type {
    action: Readonly<Action.ProviderType>;
    countryCodes: Readonly<CountryCodeType>;
  }
}

export namespace Model {
  /**
   * Model for phone picker component.
   * @extends {ErrorDisplay.Base.Model.Type} Error display model extension.
   */
  export interface Type extends ErrorDisplay.Base.Model.Type {
    id: Readonly<string>;
    substatePath: Readonly<Try<string>>;
    fullExtensionPath: Readonly<Try<string>>;
    fullExtSearchValuePath: Readonly<Try<string>>;
    fullNumberPath: Readonly<Try<string>>;
    fullSelectableCodesPath: Readonly<Try<string>>;
    fullAllCountryCodesPath: Readonly<Try<string>>;
    fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CountryCode[]>>;
    allCountryCodesTrigger(): Try<Observer<Nullable<CountryCode[]>>>;
    allCountryCodesStream(): Observable<Try<CountryCode[]>>;
    extensionTrigger(): Try<Observer<Nullable<CountryCode>>>;
    extensionStream(): Observable<Try<CountryCode>>;
    numberTrigger(): Try<Observer<Nullable<string>>>;
    numberStream(): Observable<Try<string>>;
    extSearchTrigger(): Try<Observer<Nullable<string>>>;
    extSearchStream(): Observable<Try<string>>;
    selectableCodesTrigger(): Try<Observer<Nullable<CountryCode[]>>>;
    selectableCodesStream(): Observable<Try<CountryCode[]>>;
    extensionForState(state: ReadonlyState): Try<CountryCode>;
    numberForState(state: ReadonlyState): Try<string>;
    extensionQueryForState(state: ReadonlyState): Try<string>;
    selectableCodesForState(state: ReadonlyState): Try<CountryCode[]>;

    /**
     * Filter selectable options to display only those that match the extension
     * search query.
     * @param {CountryCode[]} options All options.
     * @param {string} query A string value.
     * @returns {CountryCode[]} An Array of country codes.
     */
    filterCodes(options: CountryCode[], query: string): CountryCode[];
  }

  /**
   * Provide model for phone picker component.
   */
  export interface ProviderType {
    phoneInput_model(id: string): Type;
  }

  /**
   * Model for phone picker component.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    public readonly id: string;
    private readonly provider: Provider.Type;

    public get substatePath(): Readonly<Try<string>> {
      return this.provider.action.phoneInput.substatePath(this.id);
    }

    public get fullExtensionPath(): Readonly<Try<string>> {
      return this.provider.action.phoneInput.fullExtensionPath(this.id);
    }

    public get fullNumberPath(): Readonly<Try<string>> {
      return this.provider.action.phoneInput.fullNumberPath(this.id);
    }

    public get fullExtSearchValuePath(): Readonly<Try<string>> {
      return this.provider.action.phoneInput.fullExtSearchPath(this.id);
    }

    public get fullSelectableCodesPath(): Readonly<Try<string>> {
      return this.provider.action.phoneInput.fullSelectableCodesPath(this.id);
    }

    public get fullAllCountryCodesPath(): Readonly<Try<string>> {
      return this.provider.action.phoneInput.fullAllCountryCodesPath(this.id);
    }

    private get extensionValuePath(): Readonly<Try<string>> {
      let separator = this.provider.substateSeparator;

      return this.fullExtensionPath
        .map(v => S.separateSubstateAndValuePaths(v, separator))
        .map(v => v[1]);
    }

    private get numberValuePath(): Readonly<Try<string>> {
      let separator = this.provider.substateSeparator;

      return this.fullNumberPath
        .map(v => S.separateSubstateAndValuePaths(v, separator))
        .map(v => v[1]);
    }

    private get extSearchValuePath(): Readonly<Try<string>> {
      let separator = this.provider.substateSeparator;

      return this.fullExtSearchValuePath
        .map(v => S.separateSubstateAndValuePaths(v, separator))
        .map(v => v[1]);
    }

    private get selectableCodesValuePath(): Readonly<Try<string>> {
      let separator = this.provider.substateSeparator;

      return this.fullSelectableCodesPath
        .map(v => S.separateSubstateAndValuePaths(v, separator))
        .map(v => v[1]);
    }

    public constructor(provider: Provider.Type, id: string) {
      this.provider = provider;
      this.id = id;
    }

    public fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CountryCode[]>> {
      return this.provider.countryCodes.fetchCodes(prev);
    }

    public allCountryCodesStream(): Observable<Try<CountryCode[]>> {
      try {
        let allPath = this.fullAllCountryCodesPath.getOrThrow();

        return this.provider.store.valueAtNode(allPath)
          .map(v => v.filter(
            v1 => v1 instanceof Array,
            v1 => `${v1} does not contain country codes`,
          ))
          .map(v => v.map(v1 => v1 as CountryCode[]));
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public extensionStream(): Observable<Try<CountryCode>> {
      try {
        let extensionPath = this.fullExtensionPath.getOrThrow();

        return this.provider.store.valueAtNode(extensionPath)
          .map(v => v.filter(
            v1 => Data.CountryCode.isInstance(v1),
            v1 => `${v1} is not a country code`,
          ))
          .map(v => v.map(v1 => <CountryCode>v1));
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public numberStream = (): Observable<Try<string>> => {
      try {
        let numberPath = this.fullNumberPath.getOrThrow();
        return this.provider.store.stringAtNode(numberPath);
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public extSearchStream = (): Observable<Try<string>> => {
      try {
        let extSearchPath = this.fullExtSearchValuePath.getOrThrow();
        return this.provider.store.stringAtNode(extSearchPath);
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public selectableCodesStream(): Observable<Try<CountryCode[]>> {
      try {
        let selectablePath = this.fullSelectableCodesPath.getOrThrow();

        return this.provider.store
          .valueAtNode(selectablePath)
          .map(v => v.filter(
            v1 => v1 instanceof Array,
            v1 => `${v1} does not contain country codes`,
          ))
          .map(v => v.map(v1 => v1 as CountryCode[]));
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public extensionForState(state: ReadonlyState): Try<CountryCode> {
      return Try.unwrap(state)
        .map(v => S.fromKeyValue(v))
        .zipWith(this.extensionValuePath, (v1, v2) => v1.valueAtNode(v2))
        .flatMap(v => v)
        .filter(v => Data.CountryCode.isInstance(v), 'No country code found')
        .map(v => <CountryCode>v);
    }

    public numberForState = (state: ReadonlyState): Try<string> => {
      return Try.unwrap(state)
        .map(v => S.fromKeyValue(v))
        .zipWith(this.numberValuePath, (v1, v2) => v1.stringAtNode(v2))
        .flatMap(v => v);
    }

    public extensionQueryForState = (state: ReadonlyState): Try<string> => {
      return Try.unwrap(state)
        .map(v => S.fromKeyValue(v))
        .zipWith(this.extSearchValuePath, (v1, v2) => v1.stringAtNode(v2))
        .flatMap(v => v);
    }

    public selectableCodesForState(state: ReadonlyState): Try<CountryCode[]> {
      return Try.unwrap(state)
        .map(v => S.fromKeyValue(v))
        .zipWith(this.selectableCodesValuePath, (v1, v2) => v1.valueAtNode(v2))
        .flatMap(v => v)
        .filter(
          v => v instanceof Array,
          v => `${v} does not contain country codes`,
        )
        .map(v => v as CountryCode[]);
    }

    /**
     * Filter selectable country codes based on its name/code/calling code,
     * i.e. any match means the code is included in the final result.
     * @param {CountryCode[]} options Array of country codes.
     * @param {string} query A string value.
     * @returns {CountryCode[]} Array of country codes.
     */
    public filterCodes(options: CountryCode[], query: string): CountryCode[] {
      let queryLC = query.toLowerCase();

      return options.filter(v => {
        let name = v.name.toLowerCase();
        let code = v.code.toLowerCase();
        let callingCode = v.callingCode.toLowerCase();

        return name.search(queryLC) >= 0
          || code.search(queryLC) >= 0
          || callingCode.search(queryLC) >= 0;
      });
    }

    public allCountryCodesTrigger(): Try<Observer<Nullable<CountryCode[]>>> {
      throw new Error(`Must override this for ${this}`);
    }

    public numberTrigger = (): Try<Observer<Nullable<string>>> => {
      throw new Error(`Must override this for ${this}`);
    }

    public extensionTrigger(): Try<Observer<Nullable<CountryCode>>> {
      throw new Error(`Must override this for ${this}`);
    }

    public extSearchTrigger = (): Try<Observer<Nullable<string>>> => {
      throw new Error(`Must override this for ${this}`);
    }

    public selectableCodesTrigger(): Try<Observer<Nullable<CountryCode[]>>> {
      throw new Error(`Must override this for ${this}`);
    }

    public operationErrorTrigger = (): Observer<Nullable<Error>> => {
      throw new Error(`Must override this for ${this}`);
    }

    public operationErrorStream = (): Observable<Try<Error>> => {
      throw new Error(`Must override this for ${this}`);
    }
  }
}

export namespace ViewModel {
  /**
   * View model for phone picker component.
   * @extends {MVVM.ViewModel.ReduxType} Redux VM extension.
   * @extends {ErrorDisplay.Base.ViewModel.Type} Error VM extension.
   */
  export interface Type extends MVVM.ViewModel.ReduxType, ErrorDisplay.Base.ViewModel.Type {
    id: Readonly<string>;
    extensionForState(state: ReadonlyState): Try<string>;
    numberForState(state: ReadonlyState): Try<string>;
    extensionQueryForState(state: ReadonlyState): Try<string>;
    selectableCodesForState(state: Readonly<StateType<any>>): Try<CountryCode[]>;
    triggerNumberInput(value: Nullable<string>): void;
    triggerExtensionQueryInput(value: Nullable<string>): void;
    triggerSelectedCountryCode(code: Nullable<CountryCode>): void;

    /**
     * Format a country code for display (i.e. when the country code item is
     * displayed on screen).
     * @param {CountryCode} code A Country Code instance.
     * @returns {string} A string value.
     */
    formatCountryCode(code: CountryCode): string;
  }

  /**
   * Provide view model for phone picker component.
   */
  export interface ProviderType {
    phoneInput_viewModel(id: string): Type;
  }

  /**
   * View model for phone picker component.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    private readonly provider: Provider.Type;
    private readonly model: Model.Type;
    private readonly subscription: Subscription;
    private readonly ccSelectTrigger: Subject<CountryCode>;

    public get screen(): Nullable<MVVM.Navigation.Screen.BaseType> {
      return undefined;
    }

    public get id(): Readonly<string> {
      return this.model.id;
    }

    public constructor(provider: Provider.Type, model: Model.Type) {
      this.provider = provider;
      this.model = model;
      this.subscription = new Subscription();
      this.ccSelectTrigger = new Subject();
    }

    public initialize = (): void => {
      let subscription = this.subscription;
      let model = this.model;
      let fetchCodes = this.model.fetchCodes(Try.success({})).shareReplay(1);
      let ccSelectStream = this.ccSelectionStream().shareReplay(1);

      try {
        fetchCodes
          .mapNonNilOrEmpty(v => v)
          .subscribe(model.allCountryCodesTrigger().getOrThrow())
          .toBeDisposedBy(subscription);

        this.selectableOnSearchInputTriggered()
          .mapNonNilOrEmpty(v => v)
          .distinctUntilChanged()

          /// The debounce here serves to space out the extension search query
          /// event and the selectable country codes event so that they happen
          /// in sequence. If we do not do this, both these events may happen
          /// at the same time, messing up the state update order. The time to
          /// debounce can be as small as the value seen below - so it does not
          /// matter whether the value is small, just that there is some delay
          /// at least.
          .debounceTime(0.1)
          .subscribe(this.model.selectableCodesTrigger().getOrThrow())
          .toBeDisposedBy(subscription);

        ccSelectStream
          .subscribe(this.model.extensionTrigger().getOrThrow())
          .toBeDisposedBy(subscription);

        /// Clear the extension search query once the user has selected a
        /// country code from the list.
        ccSelectStream.map(() => '')
          .subscribe(this.model.extSearchTrigger().getOrThrow())
          .toBeDisposedBy(subscription);
      } catch (e) {
        this.operationErrorTrigger().next(e);
      }

      fetchCodes
        .mapNonNilOrEmpty(v => v.error)
        .subscribe(this.operationErrorTrigger())
        .toBeDisposedBy(subscription);
    }

    public deinitialize = (): void => {
      this.subscription.unsubscribe();
    }

    public stateStream = (): Observable<Try<S.Self<any>>> => {
      try {
        let substatePath = this.model.substatePath.getOrThrow();

        return this.provider.store.stateStream()
          .map(v => v.substateAtNode(substatePath));
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    /**
     * Every time the extension search query triggers, we need to filter out
     * irrelevant country codes and display only those that contain the query.
     * @returns {Observable<Try<CountryCode[]>>} An Observable instance.
     */
    public selectableOnSearchInputTriggered(): Observable<Try<CountryCode[]>> {
      let model = this.model;

      return model.extSearchStream()
        .startWith(Try.success(''))
        .withLatestFrom(model.allCountryCodesStream(), (v1, v2) => {
          return v2.zipWith(v1, (a, b) => model.filterCodes(a, b));
        });
    }

    public operationErrorTrigger = (): Observer<Nullable<Error>> => {
      return this.model.operationErrorTrigger();
    }

    public operationErrorStream = (): Observable<Try<Error>> => {
      return this.model.operationErrorStream();
    }

    public extensionForState = (state: ReadonlyState): Try<string> => {
      return this.model.extensionForState(state).map(v => '+' + v.callingCode);
    }

    public numberForState = (state: ReadonlyState): Try<string> => {
      return this.model.numberForState(state);
    }

    public extensionQueryForState = (state: ReadonlyState): Try<string> => {
      return this.model.extensionQueryForState(state);
    }

    public selectableCodesForState(state: ReadonlyState): Try<CountryCode[]> {
      return this.model.selectableCodesForState(state);
    }

    public triggerNumberInput = (value: string): void => {
      this.model.numberTrigger().map(v => v.next(value));
    }

    public triggerExtensionQueryInput = (value: string): void => {
      this.model.extSearchTrigger().map(v => v.next(value));
    }

    public triggerSelectedCountryCode(code: CountryCode): void {
      this.ccSelectionTrigger().next(code);
    }

    public formatCountryCode(cc: CountryCode): string {
      return `${cc.name} (${cc.code}), ${cc.callingCode}`;
    }

    private ccSelectionTrigger = (): Observer<CountryCode> => {
      return this.ccSelectTrigger;
    }

    private ccSelectionStream = (): Observable<CountryCode> => {
      return this.ccSelectTrigger;
    }
  }
}