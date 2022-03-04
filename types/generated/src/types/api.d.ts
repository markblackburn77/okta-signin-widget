import { OktaAuth, OktaAuthOptions, Tokens } from '@okta/okta-auth-js';
import { EventCallback, EventCallbackWithError, WidgetOptions } from './WidgetOptions';
export interface HooksAPI {
    before(eventName: any, hookFn: any): void;
    after(eventName: any, hookFn: any): void;
}
export interface RouterEventsAPI {
    on(event: 'ready', callback: EventCallback): void;
    on(event: 'afterError', callback: EventCallbackWithError): void;
    on(event: 'afterRender', callback: EventCallback): void;
    off(event?: 'ready', callback?: EventCallback): void;
    off(event?: 'afterError', callback?: EventCallbackWithError): void;
    off(event?: 'afterRender', callback?: EventCallback): void;
}
export interface OktaSignInAPI extends HooksAPI, RouterEventsAPI {
    authClient: OktaAuth;
    show(): void;
    hide(): void;
    remove(): void;
    showSignIn(options: any): Promise<unknown>;
    showSignInToGetTokens(options: ShowSignInToGetTokensOptions): Promise<Tokens>;
    showSignInAndRedirect(options: ShowSignInAndRedirectOptions): Promise<void>;
    renderEl(options: RenderElOptions, success?: (res: RenderResult) => void, error?: (err: RenderError) => void): Promise<RenderResult>;
    getUser(): void;
}
export interface OktaSignInConstructor {
    new (options: WidgetOptions): OktaSignInAPI;
}
export declare type SimpleCallback = () => void;
export interface AuthParams extends OktaAuthOptions {
    display?: Display;
    responseType?: ResponseType | Array<ResponseType>;
    responseMode?: ResponseMode;
    scopes?: Array<Scope>;
    state?: string;
    nonce?: string;
    authScheme?: string;
}
declare type Display = 'popup' | 'page';
declare type ResponseMode = 'okta_post_message' | 'fragment' | 'query' | 'form_post';
declare type ResponseType = 'code' | 'token' | 'id_token';
declare type Scope = 'openid' | 'email' | 'profile' | 'address' | 'phone';
export interface ShowSignInToGetTokensOptions {
    el?: string;
    clientId?: string;
    redirectUri?: string;
    scopes?: Array<Scope>;
}
export interface ShowSignInAndRedirectOptions {
    el?: string;
    clientId?: string;
    redirectUri?: string;
}
export interface RenderElOptions {
    el?: string;
}
declare type RenderStatus = 'FORGOT_PASSWORD_EMAIL_SENT' | 'ACTIVATION_EMAIL_SENT' | 'REGISTRATION_COMPLETE' | 'UNLOCK_ACCOUNT_EMAIL_SENT' | 'SUCCESS';
declare type RenderType = 'SESSION_STEP_UP' | 'SESSION_SSO';
export interface RenderResultBasic {
    status: RenderStatus;
}
export interface RenderResultRegistration extends RenderResultBasic {
    status: 'REGISTRATION_COMPLETE';
    activationToken: string;
}
export interface RenderResultEmailSent extends RenderResultBasic {
    status: 'FORGOT_PASSWORD_EMAIL_SENT' | 'ACTIVATION_EMAIL_SENT' | 'UNLOCK_ACCOUNT_EMAIL_SENT';
    username: string;
}
export interface RenderResultSuccessBasic extends RenderResultBasic {
    status: 'SUCCESS';
}
export interface RenderResultSuccessOIDC extends RenderResultSuccessBasic {
    tokens?: Tokens;
    code?: string;
    state?: string;
}
export interface RenderResultSuccessNonOIDCBasic extends RenderResultSuccessBasic {
    type?: RenderType;
    user?: User;
}
export interface RenderResultSuccessNonOIDCStepUp extends RenderResultSuccessNonOIDCBasic {
    stepUp?: {
        url: string;
        finish: SimpleCallback;
    };
}
export interface RenderResultSuccessNonOIDCRedirect extends RenderResultSuccessNonOIDCBasic {
    next?: SimpleCallback;
}
export interface RenderResultSuccessNonOIDCSession extends RenderResultSuccessNonOIDCBasic {
    session?: {
        token: string;
        setCookieAndRedirect: (redirectUrl: string) => void;
    };
}
export declare type RenderResultSuccessNonIDC = RenderResultSuccessNonOIDCStepUp & RenderResultSuccessNonOIDCRedirect & RenderResultSuccessNonOIDCSession;
export declare type RenderResultSuccess = RenderResultSuccessOIDC & RenderResultSuccessNonIDC;
export declare type RenderResult = RenderResultSuccess | RenderResultEmailSent | RenderResultRegistration;
interface User {
    id: string;
    passwordChanged: string;
    profile: Profile;
}
interface Profile {
    firstName: string;
    lastName: string;
    locale: string;
    login: string;
    timeZone: string;
}
export interface RenderError {
    name: 'CONFIG_ERROR' | 'UNSUPPORTED_BROWSER_ERROR' | string;
    message: string;
}
export {};
