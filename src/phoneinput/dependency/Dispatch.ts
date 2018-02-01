import { Observable, Observer } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { ReduxStore as Store, DispatchReducer } from 'reactive-rx-redux-js';
import { ErrorDisplay } from 'react-error-display-components';
import * as Base from './../base';
import { CountryCode as CC, ReadonlyState } from './../base/Dependency';

export type ActionType = Store.Dispatch.Action.Type<any>;

export namespace Action {
  export let UPDATE_ALL_COUNTRY_CODES = 'UPDATE_ALL_COUNTRY_CODES';
  export let UPDATE_SELECTABLE_CODES = 'UPDATE_SELECTABLE_CODES';
  export let UPDATE_EXTENSION = 'UPDATE_EXTENSION';
  export let UPDATE_NUMBER = 'UPDATE_NUMBER';
  export let UPDATE_EXTENSION_SEARCH = 'UPDATE_EXTENSION_SEARCH';

  /**
   * Dispatch store-based action for a phone input component.
   * @extends {Base.Action.Type} Base action extension.
   */
  export interface CreatorType extends Base.Action.Type {
    updateAllCountryCodes(path: string, codes: Nullable<CC[]>): ActionType;
    updateSelectableCountryCodes(path: string, codes: Nullable<CC[]>): ActionType;
    updateExtension(path: string, code: Nullable<CC>): ActionType;
    updateNumber(path: string, phone: Nullable<string>): ActionType;
    updateExtensionSearch(path: string, query: Nullable<string>): ActionType;
  }

  /**
   * Provide actions for a phone input component.
   * @extends {Base.Action.ProviderType} Base action provider extension.
   * @extends {ErrorDisplay.Dispatch.Action.ProviderType} Error display action
   * provider extension.
   */
  export interface ProviderType extends
    Base.Action.ProviderType,
    ErrorDisplay.Dispatch.Action.ProviderType {
    error: ErrorDisplay.Dispatch.Action.CreatorType;
    phoneInput: Readonly<CreatorType>;
  }

  /**
   * Check if an action is part of this action set.
   * @param {ActionType} action An ActionType instance.
   * @returns {boolean} A boolean value.
   */
  export function isInstance(action: ActionType): boolean {
    switch (action.id) {
      case UPDATE_ALL_COUNTRY_CODES:
      case UPDATE_SELECTABLE_CODES:
      case UPDATE_EXTENSION:
      case UPDATE_EXTENSION_SEARCH:
      case UPDATE_NUMBER:
        return true;

      default:
        return false;
    }
  }

  /**
   * Create default phone input action.
   * @param {string} [id] A string value.
   * @returns {CreatorType} A Action type instance.
   */
  export let createDefault = (id?: string): CreatorType => {
    let updateAction = (name: string, path: string, payload: any): ActionType => {
      return { id: name, fullValuePath: path, payload };
    };

    return {
      ...Base.Action.createDefault(id),

      updateAllCountryCodes: (path, codes) => {
        return updateAction(UPDATE_ALL_COUNTRY_CODES, path, codes);
      },

      updateSelectableCountryCodes: (path, codes) => {
        return updateAction(UPDATE_SELECTABLE_CODES, path, codes);
      },

      updateExtension: (path, extension) => {
        return updateAction(UPDATE_EXTENSION, path, extension);
      },

      updateExtensionSearch: (path, query) => {
        return updateAction(UPDATE_EXTENSION_SEARCH, path, query);
      },

      updateNumber: (path, phone) => {
        return updateAction(UPDATE_NUMBER, path, phone);
      },
    };
  };
}

export namespace Reducer {
  /**
   * Create default phone input reducer for a dispatch store.
   * @returns {DispatchReducer<any>} A DispatchReducer instance.
   */
  export let createDefault = (): DispatchReducer<any> => {
    return (state: S.Self<any>, action: ActionType): S.Self<any> => {
      if (Action.isInstance(action)) {
        return state.updatingValue(action.fullValuePath, action.payload);
      } else {
        return state;
      }
    };
  };
}

export namespace Provider {
  /**
   * Provide the necessary dependencies for a dispatch store-based view model.
   * @extends {Base.Provider.Type} Base provider extension.
   * @extends {ErrorDisplay.Dispatch.Provider.Type} Error display provider
   * extension.
   */
  export interface Type extends Base.Provider.Type, ErrorDisplay.Dispatch.Provider.Type {
    action: Readonly<Action.ProviderType>;
    store: Store.Dispatch.Type;
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
    private readonly baseModel: Base.Model.Type;
    private readonly errorModel: ErrorDisplay.Base.Model.Type;

    /// Store these as instance variables to prevent multiple inits.
    private readonly allCCObserver: Try<Observer<Nullable<CC[]>>>;
    private readonly extensionObserver: Try<Observer<Nullable<CC>>>;
    private readonly extSearchObserver: Try<Observer<Nullable<string>>>;
    private readonly numberObserver: Try<Observer<Nullable<string>>>;
    private readonly selectableObserver: Try<Observer<Nullable<CC[]>>>;

    public get id(): Readonly<string> {
      return this.baseModel.id;
    }

    public get substatePath(): Readonly<Try<string>> {
      return this.baseModel.substatePath;
    }

    public get fullExtensionPath(): Readonly<Try<string>> {
      return this.baseModel.fullExtensionPath;
    }

    public get fullNumberPath(): Readonly<Try<string>> {
      return this.baseModel.fullNumberPath;
    }

    public get fullExtSearchValuePath(): Readonly<Try<string>> {
      return this.baseModel.fullExtSearchValuePath;
    }

    public get fullSelectableCodesPath(): Readonly<Try<string>> {
      return this.baseModel.fullSelectableCodesPath;
    }

    public get fullAllCountryCodesPath(): Readonly<Try<string>> {
      return this.baseModel.fullAllCountryCodesPath;
    }

    public constructor(provider: Provider.Type, id: string) {
      let model = new Base.Model.Self(provider, id);
      this.baseModel = model;
      this.errorModel = new ErrorDisplay.Dispatch.Model.Self(provider);

      /// Initialize all action triggers.
      let actionTrigger = provider.store.actionTrigger();
      let actionProvider = provider.action.phoneInput;

      this.allCCObserver = model.fullAllCountryCodesPath
        .map(path => actionTrigger.mapObserver<Nullable<CC[]>>(v => {
          return actionProvider.updateAllCountryCodes(path, v);
        }));

      this.selectableObserver = model.fullSelectableCodesPath
        .map(path => actionTrigger.mapObserver<Nullable<CC[]>>(v => {
          return actionProvider.updateSelectableCountryCodes(path, v);
        }));

      this.extensionObserver = model.fullExtensionPath
        .map(path => actionTrigger.mapObserver<Nullable<CC>>(v => {
          return actionProvider.updateExtension(path, v);
        }));

      this.extSearchObserver = model.fullExtSearchValuePath
        .map(path => actionTrigger.mapObserver<Nullable<string>>(v => {
          return actionProvider.updateExtensionSearch(path, v);
        }));

      this.numberObserver = model.fullNumberPath
        .map(path => actionTrigger.mapObserver<Nullable<string>>(v => {
          return actionProvider.updateNumber(path, v);
        }));
    }

    public fetchCodes<Prev>(prev: Try<Prev>): Observable<Try<CC[]>> {
      return this.baseModel.fetchCodes(prev);
    }

    public allCountryCodesTrigger(): Try<Observer<Nullable<CC[]>>> {
      return this.allCCObserver;
    }

    public numberTrigger = (): Try<Observer<Nullable<string>>> => {
      return this.numberObserver;
    }

    public extensionTrigger(): Try<Observer<Nullable<CC>>> {
      return this.extensionObserver;
    }

    public extSearchTrigger = (): Try<Observer<Nullable<string>>> => {
      return this.extSearchObserver;
    }

    public selectableCodesTrigger(): Try<Observer<Nullable<CC[]>>> {
      return this.selectableObserver;
    }

    public operationErrorTrigger = (): Observer<Nullable<Error>> => {
      return this.errorModel.operationErrorTrigger();
    }

    public operationErrorStream = (): Observable<Try<Error>> => {
      return this.errorModel.operationErrorStream();
    }

    public allCountryCodesStream(): Observable<Try<CC[]>> {
      return this.baseModel.allCountryCodesStream();
    }

    public extensionStream(): Observable<Try<CC>> {
      return this.baseModel.extensionStream();
    }

    public numberStream = (): Observable<Try<string>> => {
      return this.baseModel.numberStream();
    }

    public extSearchStream = (): Observable<Try<string>> => {
      return this.baseModel.extSearchStream();
    }

    public selectableCodesStream(): Observable<Try<CC[]>> {
      return this.baseModel.selectableCodesStream();
    }

    public extensionForState(state: ReadonlyState): Try<CC> {
      return this.baseModel.extensionForState(state);
    }

    public numberForState(state: ReadonlyState): Try<string> {
      return this.baseModel.numberForState(state);
    }

    public extensionQueryForState(state: ReadonlyState): Try<string> {
      return this.baseModel.extensionQueryForState(state);
    }

    public selectableCodesForState(state: ReadonlyState): Try<CC[]> {
      return this.baseModel.selectableCodesForState(state);
    }

    public filterCodes(options: CC[], query: string): CC[] {
      return this.baseModel.filterCodes(options, query);
    }
  }
}