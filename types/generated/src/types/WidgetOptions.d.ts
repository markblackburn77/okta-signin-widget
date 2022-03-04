import { OktaAuth, OktaAuthOptions } from '@okta/okta-auth-js';
import { SimpleCallback, RenderResult, RenderError } from './api';
import { Registration } from './registration';
export declare type HookFunction = () => Promise<void>;
export interface HookDefinition {
    before?: HookFunction[];
    after?: HookFunction[];
}
export interface HooksOptions {
    [name: string]: HookDefinition;
}
export interface WidgetOptions {
    baseUrl?: string;
    logo?: string;
    logoText?: string;
    helpSupportNumber?: string;
    brandName?: string;
    username?: string;
    transformUsername?: (username: string, operation: UserOperation) => string;
    processCreds?: (creds: Creds, callback?: SimpleCallback) => void;
    language?: LanguageCode | LanguageCallback;
    i18n?: any;
    assets?: {
        baseUrl?: string;
        rewrite?: (assetPath: string) => string;
    };
    colors?: any;
    helpLinks?: {
        help?: string;
        forgotPassword?: string;
        factorPage?: Link;
        unlock?: string;
        custom?: Array<Link>;
    };
    signOutLink?: string;
    customButtons?: Array<CustomButton>;
    registration?: Registration.Callbacks;
    policyId?: string;
    features?: any;
    clientId?: string;
    redirectUri?: string;
    authParams?: OktaAuthOptions;
    authClient?: OktaAuth;
    oAuthTimeout?: number;
    idps?: Array<SocialIdp | CustomIdp>;
    idpDisplay?: IdpDisplay;
    idpDiscovery?: {
        requestContext?: string;
    };
    piv?: Piv;
    recoveryToken?: string;
    stateToken?: string;
    relayState?: string;
    globalSuccessFn?: (res: RenderResult) => void;
    globalErrorFn?: (res: RenderError) => void;
    apiVersion?: string;
    consent?: {
        cancel?: SimpleCallback;
    };
    useInteractionCodeFlow?: boolean;
    hooks?: HooksOptions;
    proxyIdxResponse?: any;
}
interface SocialIdp {
    type: string;
    id: string;
}
interface CustomIdp {
    text: string;
    id: string;
    className?: string;
}
declare type IdpDisplay = 'PRIMARY' | 'SECONDARY';
interface Piv {
    certAuthUrl: string;
    text?: string;
    className?: string;
    isCustomDomain?: boolean;
}
declare type UserOperation = 'PRIMARY_AUTH' | 'FORGOT_PASSWORD' | 'UNLOCK_ACCOUNT';
interface Creds {
    username: string;
    password: string;
}
declare type LanguageCode = 'cs' | // Czech
'da' | // Danish
'de' | // German
'el' | // Greek
'en' | // English
'es' | // Spanish
'fi' | // Finnish
'fr' | // French
'hu' | // Hungarian
'id' | // Indonesian
'it' | // Italian
'ja' | // Japanese
'ko' | // Korean
'ms' | // Malaysian
'nb' | // Norwegian
'nl-NL' | // Dutch
'pl' | // Polish
'pt-BR' | // Portuguese (Brazil)
'ro' | // Romanian
'ru' | // Russian
'sv' | // Swedish
'th' | // Thai
'tr' | // Turkish
'uk' | // Ukrainian
'zh-CN' | // Chinese (PRC)
'zh-TW';
declare type LanguageCallback = (supportedLanguages: Array<LanguageCode>, userLanguages: Array<string>) => LanguageCode;
declare type LinkTarget = '_blank' | '_self' | '_parent' | '_top';
interface Link {
    text: string;
    href: string;
    target?: LinkTarget;
}
interface CustomButton {
    click: SimpleCallback;
    title?: string;
    i18nKey?: string;
    className?: string;
}
interface FieldError {
    errorSummary: string;
    reason?: string;
    location?: string;
    locationType?: string;
    domain?: string;
}
interface Error {
    errorSummary: string;
    errorCode?: string;
    errorId?: string;
    errorLink?: string;
    errorCauses?: Array<FieldError>;
}
interface EventContext {
    controller: string;
}
interface EventError {
    name: string;
    message: string;
    statusCode?: number;
    xhr?: ErrorXHR;
}
interface ErrorXHR {
    status: number;
    responseType: 'json';
    responseText: string;
    responseJSON: Error;
}
export declare type EventCallback = (context: EventContext) => void;
export declare type EventCallbackWithError = (context: EventContext, error: EventError) => void;
export {};
