export default fn;
declare namespace fn {
    function corsIsNotSupported(): boolean;
    function corsIsNotEnabled(jqXhr: any): boolean;
    function localStorageIsNotSupported(): boolean;
    function supportsPushState(win: any): boolean;
    function isIE(): boolean;
    function isFirefox(): boolean;
    function isEdge(): boolean;
    function isSafari(): boolean;
    function isMac(): boolean;
    function isAndroid(): boolean;
    function isIOS(): boolean;
    function getUserLanguages(): any[] | readonly string[];
}
