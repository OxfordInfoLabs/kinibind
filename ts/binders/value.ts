/**
 * Value binder - overrides the default one to allow for one way binding
 *
 * @param valueBinder
 * @constructor
 */
export default function Value(valueBinder) {

    valueBinder.coreBind = valueBinder.bind;


    valueBinder.bind = function (el) {

        if (el.hasAttribute('one-way')) {
            return;
        } else {
            valueBinder.coreBind.call(this, el);
        }
    }


    return valueBinder;

}
