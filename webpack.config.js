var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
    entry: {
        vendor: [
            'babel-polyfill'
        ],
        main: './src/index.js'
    },
    output: {
        path: './dist',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader?presets[]=es2015'
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.bundle.js"
        })
    ]
};