import Class from '@okta/courage/src/util/Class';
import Handlebars from '@okta/courage/src/util/handlebars-wrapper';
import './util/scrollParent';
declare const Okta: {
    Backbone: any;
    $: import("@okta/courage/src/util/jquery-wrapper").OktaJQueryStatic;
    _: import("@okta/courage/src/util/underscore-wrapper").OktaUnderscore;
    Handlebars: typeof Handlebars;
    loc: (key: any, bundleName?: any, params?: any) => any;
    createButton: (options: any) => any;
    createCallout: any;
    registerInput: (type: string, input: BaseInput) => void;
    Model: any;
    BaseModel: any;
    Collection: any;
    FrameworkView: typeof import("@okta/courage/src/framework/View").ViewClass;
    View: any;
    ListView: any;
    Router: any;
    Controller: any;
    Form: any;
    internal: {
        util: {
            Util: {
                redirect: (url: any) => void;
                reloadPage: () => void;
                constantError: (errorMessage: any) => () => never;
                getUrlQueryString: (queries: any) => string;
                isABaseView(obj: any): boolean;
            };
            Cookie: {
                setCookie: (name: any, value: any, options: any) => void;
                getCookie: () => any;
                removeCookie: () => any;
            };
            Clipboard: {
                attach: (el: any, options: any) => any;
            };
            Logger: {
                trace: (...args: any[]) => void;
                dir: (...args: any[]) => void;
                time: (...args: any[]) => void;
                timeEnd: (...args: any[]) => void;
                group: (...args: any[]) => void;
                groupEnd: (...args: any[]) => void;
                assert: (...args: any[]) => void;
                log: (...args: any[]) => void;
                info: (...args: any[]) => void;
                warn: (...args: any[]) => void;
                error: (...args: any[]) => void;
            };
            Class: typeof Class;
            Keys: {
                UP: number;
                DOWN: number;
                DEL: number;
                TAB: number;
                RETURN: number;
                ENTER: number;
                ESC: number;
                COMMA: number;
                PAGEUP: number;
                PAGEDOWN: number;
                SPACE: number;
                BACKSPACE: number;
                __isKey: (e: any, key: any) => boolean;
                isEnter: (e: any) => any;
                isEsc: (e: any) => any;
                isSpaceBar: (e: any) => any;
            };
        };
        views: {
            components: {
                BaseDropDown: any;
                Notification: any;
            };
            forms: {
                helpers: {
                    FormUtil: {
                        LABEL_OPTIONS: string[];
                        CONTAINER_OPTIONS: string[];
                        WRAPPER_OPTIONS: string[];
                        INPUT_OPTIONS: string[];
                        generateInputOptions: (options: import("@okta/courage/src/views/forms/helpers/FormUtil").InputOptions, form: any, createFn: any) => import("@okta/courage/src/views/forms/helpers/FormUtil").InputOptions[];
                        changeEventString: (fieldNames: any) => string;
                        createReadFormButton: (options: import("@okta/courage/src/views/forms/helpers/FormUtil").CreateReadFormButtonOptions) => any;
                        createButton: (options: import("@okta/courage/src/views/forms/helpers/FormUtil").CreateButtonOptions) => any;
                        validateInput: (options: import("@okta/courage/src/views/forms/helpers/FormUtil").InputOptions, model: any) => void;
                        applyShowWhen: (view: any, showWhen: any) => void;
                        applyToggleWhen: (view: any, toggleWhen: any) => void;
                    };
                    SchemaFormFactory: any;
                };
                components: {
                    Toolbar: any;
                };
                inputs: {
                    TextBox: any;
                    PasswordBox: any;
                    CheckBox: any;
                    Radio: any;
                    Select: any;
                    InputGroup: any;
                };
            };
        };
        models: {
            BaseSchema: {
                parseProperties: (resp: any) => any[];
                Model: any;
                Collection: any;
            };
            SchemaProperty: {
                Model: any;
                Collection: any;
            };
        };
    };
};
export default Okta;
