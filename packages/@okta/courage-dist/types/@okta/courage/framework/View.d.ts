import Backbone from 'backbone';
export interface ViewOptions {
    el?: any;
    state?: any;
    settings?: any;
    model?: any;
    collection?: any;
    selector?: string;
    bubble?: boolean;
    prepend?: boolean;
    options?: Record<string, any>;
}
export declare class ViewClass extends Backbone.View {
    static isCourageView: boolean;
    constructor(options?: Record<string, any>);
    add(template: string, selector?: string): any;
    add(view: any, selector?: string): any;
    add(view: any, options: Record<string, any>): any;
    className(): string;
    options: any;
    state: any;
    settings: any;
    notify(level: string, message: string, options: Record<string, any>): void;
    events(): Record<string, unknown>;
    getTemplateData(): Record<string, string>;
    compileTemplate(template: string): _.CompiledTemplate;
}
declare var View: typeof ViewClass;
export default View;
