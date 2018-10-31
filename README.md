# kinibind

Kinibind is built upon the [tinybind js](http://blikblum.github.io/tinybind/) framework, with the addition of AJAX loading binders.
These binders are designed to assist in rapid developing and prototyping when working with simple AJAX requests for listing on HTML pages.


## Usage

#### Install

```bash
npm install kinibind
```

Use in a script tag...

```html
<script src="path/to/kinibind.js"></script>
```
```javascript
kinibind.bind(document.getElementById('my-element'));
```
#### [kb-bind]
___

Load a simple http request and bind results to the specified model.

##### Properties
* source (string) - the url of the http request
* model (string) - the model property name to bind the results to
* method (? string) - the type of method make the request with (defaults to GET)
* reload-trigger (? string) - supply in the format of 'class-name:click'. When the element with class 'class-name' triggers a 'click' event, new data will be request from server, and bound to the same model
* loading-indicator (? string) - should be the class name of the element you wish to show during request, and hide after request finishes. eg. 'loading-spinner'

##### Events
The following events are raised by the kb-source element
* sourceLoaded - event fired when the request has finished
* sourceFailed - event fired when the request returns an error

##### Success v Failure
In the event that the http request returns successfully then the resulting data will be bound to the model property specified in `model` attribute.

If the http request fails, then the resulting error is caught and passed to a model property appended with `Error`. For example, if you want the results of an http request to be bound to `users` property of the model, the error would be bound to `usersError` model property.

##### Example

```html
<div kb-bind source="https://jsonplaceholder.typicode.com/users" model="users" reload-trigger="try-again:click"
        loading-indicator="loading-users">
    
    <ul>
        <li kb-each-user="users">
            <span class="label">User ID: {user.id}</span>&nbsp;<b>Name: </b>{user.name}
        </li>
    </ul>
    
    <p class="loading-users">Loading Users, Please Wait....</p>
    
    <h4 class="error" kb-show="usersError">There was a problem loading the users. Please try again.</h4>
    
    <button class="try-again" kb-show="usersError">Reload Users</button>
</div>
```

#### [kb-action]
___

Trigger an http request on the event of an element.

##### Properties
* source (string) - the url of the http request
* model (? string) - the model property name to bind the results to
* method (? string) - the type of method make the request with (defaults to GET)
* event (? string) - the event the action should be triggered on (defaults to `click`);
* loading-indicator (? string) - should be the class name of the element you wish to show during request, and hide after request finishes. eg. 'loading-spinner'

##### Events
The following events are raised by the kb-action element
* actionStarted - event fired when the request has started
* actionCompleted - event fired when the request has finished
* actionFailed - event fired when the request returns an error

##### Success v Failure
In the event that the http request returns successfully then the resulting data will be bound to the model property specified in `model` attribute (if supplied, this is optional).

If you have specified a `model` above, and the http request fails, then the resulting error is caught and passed to a model property appended with `Error`. For example, if you want the results of an http request to be bound to `actionUser` property of the model, the error would be bound to `actionUserError` model property.

##### Example
```html
<button kb-action source="https://jsonplaceholder.typicode.com/users/1" model="actionUser" loading-indicator="loading-action">
    Show Favourite
</button>

<p>My favourite user is: {actionUser.name}</p>

<p class="loading-action" style="display: none">Loading Action User, Please Wait....</p>

<h4 class="error" kb-show="actionUserError">There was a problem loading the user.</h4>

```

## Contributing

#### Bug Reporting

1. Ensure the bug can be reproduced on the latest master.
2. Open an issue on GitHub and include an isolated [JSFiddle](http://jsfiddle.net/) demonstration of the bug. The more information you provide, the easier it will be to validate and fix.
