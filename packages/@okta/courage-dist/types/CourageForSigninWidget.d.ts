import BaseModel from '@okta/courage/src/models/BaseModel';
import Model from '@okta/courage/src/models/Model';
import Handlebars from '@okta/courage/src/util/handlebars-wrapper';
import $ from '@okta/courage/src/util/jquery-wrapper';
import _ from '@okta/courage/src/util/underscore-wrapper';
import ListView from '@okta/courage/src/views/Backbone.ListView';
import Backbone from 'backbone';
import FrameworkView from '@okta/courage/src/framework/View';
import './util/scrollParent';
declare const Form: any;
declare const loc: (key: any, bundleName?: any, params?: any) => any;
declare const createButton: (options: any) => any;
declare const createCallout: (options: any) => any;
declare const registerInput: (type: any, input: import("@okta/courage/src/views/forms/BaseInput").BaseInput) => void;
declare const Collection: any;
declare const View: any;
declare const Router: any;
declare const Controller: any;
export interface Internal {
    util: any;
    views: {
        components: any;
        forms: {
            helpers: any;
            components: any;
            inputs: any;
        };
    };
    models: any;
}
declare const internal: Internal;
export { Backbone, $, _, Handlebars, loc, createButton, createCallout, registerInput, Model, BaseModel, Collection, FrameworkView, View, ListView, Router, Controller, Form, internal, };
//# sourceMappingURL=CourageForSigninWidget.d.ts.map