import _ from 'underscore';
import Errors from 'util/Errors';
import Util from 'util/Util';
import Logger from 'util/Logger';
import getAuthClient from 'widget/getAuthClient';
import buildRenderOptions from 'widget/buildRenderOptions';
import createRouter from 'widget/createRouter';
import V1Router from 'LoginRouter';
import V2Router from 'v2/WidgetRouter';
import Hooks from 'models/Hooks';
import {
  WidgetOptions,
  OktaSignInAPI
} from '../types';
import { OktaAuth } from '@okta/okta-auth-js';

declare type AbstractRouter = typeof V1Router | typeof V2Router;

const EVENTS_LIST = ['ready', 'afterError', 'afterRender'];

class OktaSignIn implements OktaSignInAPI {
  Router: AbstractRouter;
  options: WidgetOptions;
  hooks: typeof Hooks;
  router: AbstractRouter;
  authClient: OktaAuth;

  constructor(options: WidgetOptions) {
    Util.debugMessage(`
        The Okta Sign-In Widget is running in development mode.
        When you are ready to publish your app, embed the minified version to turn on production mode.
        See: https://developer.okta.com/code/javascript/okta_sign-in_widget#cdn
      `);

    this.options = options;
    this.authClient = getAuthClient(options);

    // validate authClient configuration against widget options
    if (options.useInteractionCodeFlow  && this.authClient.isPKCE() === false) {
      throw new Errors.ConfigError(
        'The "useInteractionCodeFlow" option requires PKCE to be enabled on the authClient.'
      );
    }

    // Hooks can be modified before or after render
    this.hooks = new Hooks({
      hooks: options.hooks
    });

    var Router: AbstractRouter;
    if ((options.stateToken && !Util.isV1StateToken(options.stateToken)) 
        // Self hosted widget can use `useInteractionCodeFlow` to use V2Router
        || options.useInteractionCodeFlow 
        || options.proxyIdxResponse) {
      Router = V2Router;
    } else {
      Router = V1Router;
    }
    this.Router = Router;
    // _.extend(this, getProperties(authClient, hooks, Router, options));

    // Triggers the event up the chain so it is available to the consumers of the widget.
    this.listenTo(Router.prototype, 'all', this.trigger);

    // On the first afterRender event (usually when the Widget is ready) - emit a 'ready' event
    this.once('afterRender', function(context) {
      this.trigger('ready', context);
    });
  }

  /**
   * Render the sign in widget to an element. Returns a promise that will resolve on success or reject on error.
   * @param options - options for the signin widget.
   *        Must have an el or $el property to render the widget to.
   * @param success - success callback function
   * @param error - error callback function
   */
  renderEl(renderOptions, successFn?, errorFn?) {
    if (this.router) {
      throw new Error('An instance of the widget has already been rendered. Call remove() first.');
    }

    const res = createRouter(this.Router, this.options, renderOptions, this.authClient, successFn, errorFn, this.hooks);
    this.router = res.router;
    return res.promise;
  }

  
  hide() {
    if (this.router) {
      this.router.hide();
    }
  }

  show() {
    if (this.router) {
      this.router.show();
    }
  }

  remove() {
    if (this.router) {
      this.router.remove();
      this.router = undefined;
    }
  }

  /**
   * Renders the Widget and returns a promise that resolves to OAuth tokens
   * @param options - options for the signin widget
   */
  showSignInToGetTokens(options = {}) {
    const renderOptions = Object.assign(buildRenderOptions(this.options, options), {
      redirect: 'never'
    });
    const promise = this.renderEl(renderOptions).then(res => {
      return res.tokens;
    });
    const authClient = this.router.settings.getAuthClient();
    if (authClient.isAuthorizationCodeFlow() && !authClient.isPKCE()) {
      throw new Errors.ConfigError('"showSignInToGetTokens()" should not be used for authorization_code flow. ' + 
        'Use "showSignInAndRedirect()" instead');
    }
    return promise;
  }

  /**
   * Renders the widget and redirects to the OAuth callback
   * @param options - options for the signin widget
   */
  showSignInAndRedirect(options = {}) {
    const renderOptions = Object.assign(buildRenderOptions(this.options, options), {
      redirect: 'always'
    });
    return this.renderEl(renderOptions);
  }

  /**
   * Renders the widget. Either resolves the returned promise, or redirects.
   * @param options - options for the signin widget
   */
  showSignIn(options = {}) {
    const renderOptions = Object.assign(buildRenderOptions(this.options, options));
    return this.renderEl(renderOptions);
  }

  // Hook convenience functions
  before(formName, callbackFn) {
    this.hooks.mergeHook(formName, {
      before: [
        callbackFn
      ]
    });
  }

  after(formName, callbackFn) {
    this.hooks.mergeHook(formName, {
      after: [
        callbackFn
      ]
    });
  }

  getUser() {
    return this.router?.appState?.getUser();
  }
  
  // Events API

  on(...args) {
    // custom events listener on widget instance to trap third-party callback errors
    const [event, callback] = args;
    if (EVENTS_LIST.includes(event)) {
      args[1] = function(...callbackArgs) {
        try {
          callback.apply(this, callbackArgs);
        } catch (err) {
          Logger.error(`[okta-signin-widget] "${event}" event handler error:`, err);
        }
      };
    }
    this.Router.prototype.Events.on.apply(this, args);
  }

  off(...args) {
    this.Router.prototype.Events.off.apply(this, args);
  }

  once(...args) {
    this.Router.prototype.Events.once.apply(this, args);
  }

  stopListening(...args) {
    this.Router.prototype.Events.stopListening.apply(this, args);
  }

  listenTo(...args) {
    this.Router.prototype.Events.listenTo.apply(this, args);
  }

  trigger(...args) {
    this.Router.prototype.Events.trigger.apply(this, args);
  }
}

export default OktaSignIn;
