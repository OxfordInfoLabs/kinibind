const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, 'ts');
const DESTINATION = path.resolve(__dirname, 'dist');
const LowerCaseNamePlugin = require('webpack-lowercase-name');

module.exports = {
    context: ROOT,

    entry: {
        'Kinibind': 'kinibind.ts',
        'KinibindStatic': 'kinibind-static.ts'
    },


    plugins: [
        new LowerCaseNamePlugin()
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        "allowTsInNodeModules": true,
                        'configFile': 'tsconfig.webpack.json'
                    },

                },
                    'uglify-template-string-loader']
            }
        ]
    },

    output: {
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: '[lc-name].js',
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

