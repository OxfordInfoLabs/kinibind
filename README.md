# kinibind

Kinibind is....


## Install

```bash
npm install @oxfordinfolabs/kinibind
```

Use in a script tag...

```html
<script src="../dist/kinibind.js"></script>
```

## Usage

```html
<div kb-source="https://jsonplaceholder.typicode.com/users" model="users">
    <ul>
        <li kb-each-user="users">
            <span class="label">User ID: {user.id}</span>&nbsp;<b>Name: </b>{user.name}
        </li>
    </ul>
</div>
```

```javascript
kinibind.bind(document.getElementById('my-element'));
```

## Contributing

#### Bug Reporting

1. Ensure the bug can be reproduced on the latest master.
2. Open an issue on GitHub and include an isolated [JSFiddle](http://jsfiddle.net/) demonstration of the bug. The more information you provide, the easier it will be to validate and fix.
