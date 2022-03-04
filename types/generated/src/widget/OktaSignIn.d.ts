import V1Router from 'LoginRouter';
import V2Router from 'v2/WidgetRouter';
import Hooks from 'models/Hooks';
import { WidgetOptions, OktaSignInAPI } from '../types';
import { OktaAuth } from '@okta/okta-auth-js';
declare type AbstractRouter = typeof V1Router | typeof V2Router;
declare class OktaSignIn implements OktaSignInAPI {
    Router: AbstractRouter;
    options: WidgetOptions;
    hooks: typeof Hooks;
    router: AbstractRouter;
    authClient: OktaAuth;
    constructor(options: WidgetOptions);
    /**
     * Render the sign in widget to an element. Returns a promise that will resolve on success or reject on error.
     * @param options - options for the signin widget.
     *        Must have an el or $el property to render the widget to.
     * @param success - success callback function
     * @param error - error callback function
     */
    renderEl(renderOptions: any, successFn?: any, errorFn?: any): Promise<any>;
    hide(): void;
    show(): void;
    remove(): void;
    /**
     * Renders the Widget and returns a promise that resolves to OAuth tokens
     * @param options - options for the signin widget
     */
    showSignInToGetTokens(options?: {}): Promise<any>;
    /**
     * Renders the widget and redirects to the OAuth callback
     * @param options - options for the signin widget
     */
    showSignInAndRedirect(options?: {}): Promise<any>;
    /**
     * Renders the widget. Either resolves the returned promise, or redirects.
     * @param options - options for the signin widget
     */
    showSignIn(options?: {}): Promise<any>;
    before(formName: any, callbackFn: any): void;
    after(formName: any, callbackFn: any): void;
    getUser(): any;
    on(...args: any[]): void;
    off(...args: any[]): void;
    once(...args: any[]): void;
    stopListening(...args: any[]): void;
    listenTo(...args: any[]): void;
    trigger(...args: any[]): void;
}
export default OktaSignIn;
