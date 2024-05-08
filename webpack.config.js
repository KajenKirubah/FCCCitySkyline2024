const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const currentTask = process.env.npm_lifecycle_event;


const postCSSPlugins = [
    require('autoprefixer'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-import')
];

let cssConfig =  {
    test: /\.css$/i,
    use: ['css-loader']
};


let config = {
    entry: './app/assets/scripts/App.js',
    plugins: [new HtmlWebpackPlugin({filename: 'index.html', template:'./app/assets/index.html'})],
    module: {
        rules: [
           cssConfig
        ]
    }
}


if(currentTask == "dev") {
    config.mode = "development";
    config.output = {
        path: path.resolve(__dirname, './app/assets')
    }
    cssConfig.use.unshift('style-loader');
    cssConfig.use.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: postCSSPlugins
            }
        }
    })
    config.devServer = {
        watchFiles: ['./app/**/*.html'],
        static: {
            directory: path.resolve(__dirname, 'app/assets/')
        },
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    }
    
}

if(currentTask == "build") {
    config.mode = "production";
    config.output = {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, './dist'),
        clean: true,
    }
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.plugins.push(new MiniCssExtractPlugin({filename: 'styles.css'}))
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
}

module.exports = config;