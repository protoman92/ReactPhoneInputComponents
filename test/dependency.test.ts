import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { Collections, Nullable, Numbers, Try } from 'javascriptutilities';
import { StateType } from 'type-safe-state-js';
import { ReduxStore as Store, DispatchReducer } from 'reactive-rx-redux-js';
import { Data } from 'react-base-utilities-js';
import { ErrorDisplay } from 'react-error-display-components';
import { PhoneInput } from './../src';

type CC = Data.CountryCode.Type;

let countryCodes: CC[] = Numbers.range(1, 1000)
  .map(v => '' + v)
  .map(v => ({ code: v, callingCode: v, name: 'place' + v }));

namespace CountryCode {
  export class Self implements PhoneInput.Base.Provider.CountryCodeType {
    public fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CC[]>> {
      return Observable.of(prev.map(() => countryCodes));
    }
  }
}

class MockModel implements PhoneInput.Base.Model.Type {
  public model: PhoneInput.Base.Model.Type;
  public mockFetchCountryCodes?: () => CC[];

  public get id(): Readonly<string> {
    return this.model.id;
  }

  public get substatePath(): Readonly<Try<string>> {
    return this.model.substatePath;
  }

  public get fullExtensionPath(): Readonly<Try<string>> {
    return this.model.fullExtensionPath;
  }

  public get fullNumberPath(): Readonly<Try<string>> {
    return this.model.fullNumberPath;
  }

  public get fullExtSearchValuePath(): Readonly<Try<string>> {
    return this.model.fullExtSearchValuePath;
  }

  public get fullSelectableCodesPath(): Readonly<Try<string>> {
    return this.model.fullSelectableCodesPath;
  }

  public get fullAllCountryCodesPath(): Readonly<Try<string>> {
    return this.model.fullAllCountryCodesPath;
  }

  public constructor(model: PhoneInput.Base.Model.Type) {
    this.model = model;
  }

  public fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CC[]>> {
    if (this.mockFetchCountryCodes !== undefined) {
      try {
        prev.getOrThrow();
        let codes = this.mockFetchCountryCodes();
        return Observable.of(Try.success(codes));
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    } else {
      return this.model.fetchCodes(prev);
    }
  }

  public allCountryCodesStream(): Observable<Try<CC[]>> {
    return this.model.allCountryCodesStream();
  }

  public extensionStream(): Observable<Try<CC>> {
    return this.model.extensionStream();
  }

  public numberStream = (): Observable<Try<string>> => {
    return this.model.numberStream();
  }

  public extSearchStream = (): Observable<Try<string>> => {
    return this.model.extSearchStream();
  }

  public selectableCodesStream(): Observable<Try<CC[]>> {
    return this.model.selectableCodesStream();
  }

  public extensionForState(state: Readonly<Nullable<StateType<any>>>): Try<CC> {
    return this.model.extensionForState(state);
  }

  public numberForState = (state: Readonly<Nullable<StateType<any>>>): Try<string> => {
    return this.model.numberForState(state);
  }

  public extensionQueryForState = (state: Readonly<Nullable<StateType<any>>>): Try<string> => {
    return this.model.extensionQueryForState(state);
  }

  public selectableCodesForState(state: Readonly<Nullable<StateType<any>>>): Try<CC[]> {
    return this.model.selectableCodesForState(state);
  }

  public filterCodes(options: CC[], query: string): CC[] {
    return this.model.filterCodes(options, query);
  }

  public allCountryCodesTrigger(): Try<Observer<Nullable<CC[]>>> {
    return this.model.allCountryCodesTrigger();
  }

  public numberTrigger = (): Try<Observer<Nullable<string>>> => {
    return this.model.numberTrigger();
  }

  public extensionTrigger(): Try<Observer<Nullable<CC>>> {
    return this.model.extensionTrigger();
  }

  public extSearchTrigger = (): Try<Observer<Nullable<string>>> => {
    return this.model.extSearchTrigger();
  }

  public selectableCodesTrigger(): Try<Observer<Nullable<CC[]>>> {
    return this.model.selectableCodesTrigger();
  }

  public operationErrorTrigger = (): Observer<Nullable<Error>> => {
    return this.model.operationErrorTrigger();
  }

  public operationErrorStream = (): Observable<Try<Error>> => {
    return this.model.operationErrorStream();
  }
}

describe('Phone input view model should work correctly', () => {
  let delay = 0.2;
  let subscription: Subscription;
  let dispatchProvider: PhoneInput.Dispatch.Provider.Type;
  let dispatchModel: PhoneInput.Dispatch.Model.Type;
  let rxProvider: PhoneInput.Rx.Provider.Type;
  let rxModel: PhoneInput.Rx.Model.Self;

  beforeEach(() => {
    subscription = new Subscription();

    /// Initialize dispatch provider.
    let dispatchAction = PhoneInput.Dispatch.Action.createDefault();
    let dispatchErrorAction = ErrorDisplay.Dispatch.Action.createDefault();
    let dispatchErrorActionProvider = { error: dispatchErrorAction };

    let dispatchActionProvider = {
      ...dispatchErrorActionProvider,
      phoneInput: dispatchAction,
    };

    let dispatchReducer = PhoneInput.Dispatch.Reducer.createDefault();
    let dispatchErrorReducer = ErrorDisplay.Dispatch.Reducer.createDefault();

    let allDispatchReducer: DispatchReducer<any> = (state, action) => {
      switch (true) {
        case ErrorDisplay.Dispatch.Action.isInstance(action):
          return dispatchErrorReducer(state, action);

        case PhoneInput.Dispatch.Action.isInstance(action):
          return dispatchReducer(state, action);

        default:
          return state;
      }
    };

    afterEach(() => subscription.unsubscribe());

    let dispatchStore = Store.Dispatch.createDefault(allDispatchReducer);

    dispatchProvider = {
      action: dispatchActionProvider,
      constants: { error: { displayDuration: 0 }},
      countryCodes: new CountryCode.Self(),
      store: dispatchStore,
      substateSeparator: '.',
    };

    dispatchModel = new PhoneInput.Dispatch.Model.Self(dispatchProvider, '');

    /// Initialize Rx provider.
    let rxAction = PhoneInput.Rx.Action.createDefault();
    let rxErrorAction = ErrorDisplay.Rx.Action.createDefault();
    let rxErrorActionProvider = { error: rxErrorAction };
    let rxActionProvider = { ...rxErrorActionProvider, phoneInput: rxAction };
    let rxErrorReducers = ErrorDisplay.Rx.Reducer.createDefault(rxErrorActionProvider);
    let rxReducers = PhoneInput.Rx.Reducer.createDefault('', rxActionProvider);
    let rxStore = new Store.Rx.Self(rxErrorReducers, ...rxReducers);

    rxProvider = {
      action: rxActionProvider,
      countryCodes: new CountryCode.Self(),
      constants: { error: { displayDuration: 0 } },
      store: rxStore,
      substateSeparator: '.',
    };

    rxModel = new PhoneInput.Rx.Model.Self(rxProvider, '');
  });

  let testFetchAllCountryCodes = (
    provider: PhoneInput.Base.Provider.Type,
    model: PhoneInput.Base.Model.Type,
  ): void => {
    /// Setup
    let errors: Error[] = [];
    let mockModel = new MockModel(model);
    let viewModel = new PhoneInput.Base.ViewModel.Self(provider, mockModel);
    let fetchError = 'Failed to fetch country codes';

    mockModel.operationErrorStream()
      .mapNonNilOrEmpty(v => v)
      .doOnNext(e => errors.push(e))
      .subscribe()
      .toBeDisposedBy(subscription);

    mockModel.mockFetchCountryCodes = () => {
      throw new Error(fetchError);
    };

    /// When
    viewModel.initialize();

    /// Then
    let lastError = Collections.last(errors).getOrThrow();
    expect(errors.length).toBe(1);
    expect(lastError.message).toBe(fetchError);
  };

  let testExtensionSearchQuery = (
    provider: PhoneInput.Base.Provider.Type,
    model: PhoneInput.Base.Model.Type,
  ): void => {
    /// Setup
    let selectableSbj = new BehaviorSubject<CC[]>([]);
    let extSearchInputSbj = new BehaviorSubject<Nullable<string>>(undefined);
    let extSbj = new BehaviorSubject<Nullable<CC>>(undefined);
    let mockModel = new MockModel(model);
    let viewModel = new PhoneInput.Base.ViewModel.Self(provider, mockModel);
    let stateStream = viewModel.stateStream().mapNonNilOrEmpty(v => v).shareReplay(1);

    viewModel.initialize();

    stateStream
      .map(v => viewModel.selectableCodesForState(v))
      .mapNonNilOrElse(v => v, () => [])
      .subscribe(selectableSbj)
      .toBeDisposedBy(subscription);

    stateStream
      .map(v => model.extensionForState(v))
      .mapNonNilOrEmpty(v => v)
      .subscribe(extSbj)
      .toBeDisposedBy(subscription);

    stateStream
      .map(v => model.extensionQueryForState(v))
      .mapNonNilOrElse(v => v, '')
      .subscribe(extSearchInputSbj)
      .toBeDisposedBy(subscription);

    for (let code of countryCodes) {
      /// When
      viewModel.triggerExtensionQueryInput(code.name);

      // This part needs a timeout because there's a slight delay between the
      // extension search input trigger and the selectable code trigger.
      setTimeout(() => {
        let filtered = model.filterCodes(countryCodes, code.name);
        let selectable = selectableSbj.value;
        expect(filtered).toEqual(selectable);

        /// Select a country code item to see if the extension code is updated.
        let selected = Collections.randomElement(filtered).getOrThrow();
        viewModel.triggerSelectedCountryCode(selected);
        expect(extSbj.value).toBe(selected);
        expect(extSearchInputSbj.value).toBe('');
      }, delay);
    }
  };

  it('Fetch country codes fail for dispatch - should update error state', () => {
    testFetchAllCountryCodes(dispatchProvider, dispatchModel);
  });

  it('Fetch country codes fail for rx - should update error state', () => {
    testFetchAllCountryCodes(rxProvider, rxModel);
  });

  it('Trigger dispatch extension search query - should update selectable codes', () => {
    testExtensionSearchQuery(dispatchProvider, dispatchModel);
  });

  it('Trigger rx extension search query - should update selectable codes', () => {
    testExtensionSearchQuery(rxProvider, rxModel);
  });
});