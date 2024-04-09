const path = require('path');

module.exports = {
    entry: './src/index.js', // Your entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js' // Output file
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Transform both .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'] // Presets for both modern JavaScript and React
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // A regex to match image files
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images', // Where to put images, relative to the output path
                            name: '[name].[ext]', // Keep the original file name and extension
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'] // Automatically resolve these file extensions
    },
    mode: 'development' // Set to 'production' when you're ready to deploy
};
