const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'kinibind': 'export.js'
    },

    output: {
        library: 'kinibind',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: 'kinibind.js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    }
};

