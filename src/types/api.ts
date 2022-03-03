import { OktaAuth, OktaAuthOptions, Tokens } from '@okta/okta-auth-js';
import { EventCallback, EventCallbackWithError } from './WidgetOptions';
export interface HooksAPI {
  before(eventName, hookFn): void;
  after(eventName, hookFn): void;
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
  showSignIn(options): Promise<unknown>;
  showSignInToGetTokens(options: ShowSignInToGetTokensOptions): Promise<Tokens>;
  showSignInAndRedirect(options: ShowSignInAndRedirectOptions): Promise<void>;
  renderEl(
    options: RenderElOptions,
    success?: (res: RenderResult) => void,
    error?: (err: RenderError) => void
  ): Promise<RenderResult>;

  getUser(): void
}
export type SimpleCallback = () => void;

// Auth params

export interface AuthParams extends OktaAuthOptions {
  display?: Display;
  responseType?: ResponseType | Array<ResponseType>;
  responseMode?: ResponseMode;
  scopes?: Array<Scope>;
  state?: string;
  nonce?: string;
  authScheme?: string;
}
type Display =
  'popup' |
  'page';
type ResponseMode =
  'okta_post_message' |
  'fragment' |
  'query' |
  'form_post';
type ResponseType =
  'code' |
  'token' |
  'id_token';
type Scope =
  'openid' |
  'email' |
  'profile' |
  'address' |
  'phone';

// Render options
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

// Render result
type RenderStatus =
  'FORGOT_PASSWORD_EMAIL_SENT' |
    'ACTIVATION_EMAIL_SENT' |
    'REGISTRATION_COMPLETE' |
    'UNLOCK_ACCOUNT_EMAIL_SENT' |
    'SUCCESS';
type RenderType =
  'SESSION_STEP_UP' |
  'SESSION_SSO';
interface RenderResultBasic {
  status: RenderStatus;
}
interface RenderResultRegistration extends RenderResultBasic {
  status: 'REGISTRATION_COMPLETE';
  activationToken: string;
}
interface RenderResultEmailSent extends RenderResultBasic {
  status:
    'FORGOT_PASSWORD_EMAIL_SENT' |
    'ACTIVATION_EMAIL_SENT' |
    'UNLOCK_ACCOUNT_EMAIL_SENT';
  username: string;
}
interface RenderResultSuccessBasic extends RenderResultBasic {
  status: 'SUCCESS';
}
interface RenderResultSuccessOIDC extends RenderResultSuccessBasic {
  tokens?: Tokens;
  code?: string;
  state?: string;
}
interface RenderResultSuccessNonOIDCBasic extends RenderResultSuccessBasic {
  type?: RenderType;
  user?: User;
}
interface RenderResultSuccessNonOIDCStepUp extends RenderResultSuccessNonOIDCBasic {
  // type: 'SESSION_STEP_UP'
  stepUp?: {
    url: string;
    finish: SimpleCallback;
  };
}
interface RenderResultSuccessNonOIDCRedirect extends RenderResultSuccessNonOIDCBasic {
  next?: SimpleCallback;
}
interface RenderResultSuccessNonOIDCSession extends RenderResultSuccessNonOIDCBasic {
  // type: 'SESSION_SSO';
  session?: {
    token: string;
    setCookieAndRedirect: (redirectUrl: string) => void;
  };
}
type RenderResultSuccessNonIDC =
  RenderResultSuccessNonOIDCStepUp &
  RenderResultSuccessNonOIDCRedirect &
  RenderResultSuccessNonOIDCSession;

type RenderResultSuccess =
  RenderResultSuccessOIDC &
  RenderResultSuccessNonIDC;
  
export type RenderResult =
  RenderResultSuccess |
  RenderResultEmailSent |
  RenderResultRegistration;
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
