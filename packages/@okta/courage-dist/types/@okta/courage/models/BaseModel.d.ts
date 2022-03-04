/**
 * @class module:Okta.BaseModel
 * @extends module:Okta.Model
 * @deprecated Use {@link module:Okta.Model|Okta.Model} instead
 * @example
 * var Model = BaseModel.extend({
 *   defaults: {
 *     name: BaseModel.ComputedProperty(['fname', 'lname'], function (fname, lname) {
 *       return fname + ' ' + lname;
 *     })
 *   }
 * });
 * var model = new Model({fname: 'Joe', lname: 'Doe'});
 * model.get('name'); //=> "Joe Doe"
 * model.toJSON(); //=> {fname: 'Joe', lname: 'Doe'}
 *
 * model.set('__private__', 'private property');
 * model.get('__private__'); //=> "private property"
 * model.toJSON(); //=> {fname: 'Joe', lname: 'Doe'}
 */
declare const BaseModelBaseModel: any;
export default BaseModelBaseModel;
//# sourceMappingURL=BaseModel.d.ts.map