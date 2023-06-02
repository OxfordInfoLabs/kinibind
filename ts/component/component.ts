/**
 * Component class
 */

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
     * Specific model for this component - isolated from other components on the page
     *
     * @private
     */
    private _componentModel: any;


    /**
     * Parent model for outer context at the point the component was added
     *
     * @private
     */
    private _parentModel: any;


    /**
     * Construct with an element and a componentModel
     *
     * @param element
     * @param componentModel
     */
    constructor(element: HTMLElement, componentModel: any, parentModel: any = null, document: Document) {
        this._element = element;
        this._componentModel = componentModel;
        this._parentModel = parentModel;
        this._document = document;
        this.initialise(element, this._componentModel, this._parentModel, document);
    }


    /**
     * Convenience getter for element
     */
    get element(): HTMLElement {
        return this._element;
    }

    /**
     * Convenience getter for component model
     */
    get componentModel(): any {
        return this._componentModel;
    }

    /**
     * Getter for parent model
     */
    get parentModel(): any {
        return this._parentModel;
    }

    /**
     * Initialise method
     *
     * @param element
     * @param componentModel
     * @param parentModel
     * @param document
     */
    public abstract initialise(element: HTMLElement, componentModel: any, parentModel: any, document: Document);


}