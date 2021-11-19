/**
 * Component class
 */
import Kinibind from "../kinibind";

export default abstract class Component{

    /**
     *
     * @private
     */
    private _element: HTMLElement;

    /**
     *
     * @private
     */
    private _kinibind: any;

    /**
     * Construct with an element and a kinibind
     *
     * @param element
     * @param kinibind
     */
    constructor(element: HTMLElement, kinibind: Kinibind) {
        this._element = element;
        this._kinibind = kinibind;
        this.initialise(element, kinibind);
    }


    /**
     * Convenience getter for element
     */
    get element(): HTMLElement {
        return this._element;
    }

    /**
     * Convenience getter for model
     */
    get kinibind(): Kinibind {
        return this._kinibind;
    }

    /**
     * Only required method, receives the element and kinibind instance as arguments
     *
     * @param element
     * @param kinibind
     */
    public abstract initialise(element: HTMLElement, kinibind: Kinibind);


}