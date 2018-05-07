import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import merge from 'webpack-merge';
import path from 'path';
import paths from './config';

const extractSass = new ExtractTextPlugin({
    filename: "./css/[name].css"
});

const common = {
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.sass', 'scss'],
        modules: [
            'node_modules'
        ]
    },
    devtool: "cheap-inline-module-source-map",
    module: {
        rules: [{
                    test: /\.jsx?$/,
                    use: [{
                        loader: "babel-loader"
                    }],
                    exclude: /node_modules/
                }, {
                    test: /\.(scss|sass|css)$/i,
                    use: extractSass.extract({
                        use: [{
                            loader: "css-loader" // translates CSS into CommonJS
                        },
                        'resolve-url-loader',
                        {
                            loader: "sass-loader" // compiles Sass to CSS
                        }],
                        fallback: "style-loader" // creates style nodes from JS strings
                    }),
                    exclude: /node_modules/
                },  {
                    test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                    use: [{
                        loader: "file-loader?name=./icons/[name].[ext]"
                    }],
                    exclude: /node_modules/
                }
        ]
    }
}
module.exports = {};
module.exports = (env) => {
    if (env) {
        console.log('build');
        return merge({
            entry: {
                'index': `${paths.src}/index.js`,
            },
            output: {
                path: paths.public,
                filename: '[name].js'
            },
            plugins: [
                extractSass,
                new HtmlWebpackPlugin({
                    template: path.join(paths.src, 'index.html'),
                    name: 'index.html',
                    chunks: ['index'],
                    inject: 'body'
                }),
                new CopyWebpackPlugin([
                    { from: path.join(paths.src, 'css'), to: path.join(paths.public, 'css') }
                ])
            ]
        }, common);
    }
}
