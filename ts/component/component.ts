/**
 * Component class
 */
import Kinibind from "../kinibind";

export default abstract class Component {


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
        this.initialise(element, this._model, document);
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
     * Wait for a model property in case this has been loaded asynchronously
     *
     * @param propertyName
     */
    async waitForModelProperty(propertyName, maxTimeoutSeconds = 1) {
        let attempts = 0;
        while ((attempts < maxTimeoutSeconds * 20) && this._model[propertyName] === undefined) {
            await this.wait(50);
            attempts++;
        }
        return this._model[propertyName];
    }

    /**
     * Only required method, receives the element and kinibind instance as arguments
     *
     * @param element
     * @param kinibind
     */
    public abstract initialise(element: HTMLElement, model: any, document: Document);


    /**
     * Wait a mumber of ms
     *
     * @param ms
     * @private
     */
    private wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms)
            }, ms)
        })
    }

}