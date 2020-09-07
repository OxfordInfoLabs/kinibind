const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, 'ts');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
    context: ROOT,

    entry: {
        'Kinibind': 'kinibind.ts'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        "allowTsInNodeModules": true,
                        'configFile': 'tsconfig.webpack.json'
                    }

                },
                    'uglify-template-string-loader']
            }
        ]
    },

    output: {
        library: 'Kinibind',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: 'kinibind.js',
        path: DESTINATION
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },
    mode: "production"
};

