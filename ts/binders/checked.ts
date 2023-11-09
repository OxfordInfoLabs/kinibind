/**
 * Checked binder - overrides the default one to allow for one way binding
 *
 * @param checkedBinder
 * @constructor
 */
export default function Checked(checkedBinder: any) {

    checkedBinder.coreBind = checkedBinder.bind;


    checkedBinder.bind = function (el: any) {

        if (el.hasAttribute('one-way')) {
            return;
        } else {
            checkedBinder.coreBind.call(this, el);
        }
    }


    return checkedBinder;

}
