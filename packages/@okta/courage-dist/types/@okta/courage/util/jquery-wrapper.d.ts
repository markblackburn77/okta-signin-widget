/// <reference types="jquery" />
/// <reference types="jqueryui" />
/// <reference types="selectize" />
export interface OktaJQuery extends JQuery<HTMLElement> {
    scrollParent: (includeHidden?: boolean) => JQuery<HTMLElement>;
}
export interface OktaJQueryStatic extends JQueryStatic {
    <TElement extends Element = HTMLElement>(selector: JQuery.Selector, context?: Element | Document | JQuery | JQuery.Selector): OktaJQuery;
    fn: OktaJQuery;
}
declare const oktaJQueryStatic: OktaJQueryStatic;
export default oktaJQueryStatic;
//# sourceMappingURL=jquery-wrapper.d.ts.map