/**
 * Component class
 */
import Kinibind from "../kinibind";

export default abstract class Component{


    /**
     *
     * @private
     */
    private _document: Document;

    /**
     *
     * @private
     */
    private _element: HTMLElement;

    /**
     *
     * @private
     */
    private _model: any;

    /**
     * Construct with an element and a model
     *
     * @param element
     * @param model
     */
    constructor(element: HTMLElement, model: Kinibind, document: Document) {
        this._element = element;
        this._model = model;
        this._document = document;
        this.initialise(element, model, document);
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
    get model(): any {
        return this._model;
    }

    /**
     * Only required method, receives the element and kinibind instance as arguments
     *
     * @param element
     * @param kinibind
     */
    public abstract initialise(element: HTMLElement, model: any, document: Document);


}