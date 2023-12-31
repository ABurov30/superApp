const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const mode = process.env.NODE_ENV
const isDev = mode === 'development'

module.exports = {
	entry: path.resolve(__dirname, 'src', 'entry.js'),
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src/')
		}
	},
	devServer: {
		port: 3001,
		open: true,
		hot: true,
		static: {
			directory: path.join(__dirname, 'public')
		},
		historyApiFallback: true
	},
	mode: 'development',
	devtool: isDev ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript'
						]
					}
				}
			},
			{
				test: /\.s(a|c)ss$/i,
				exclude: /node_modules/,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ['file-loader']
			},
			{
				test: /\.json$/i,
				exclude: /node_modules/,
				type: 'asset/resource'
			},
			{
				test: /\.html$/i,
				exclude: /node_modules/,
				loader: 'html-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				exclude: /node_modules/,
				type: 'asset'
			}
		]
	},
	plugins: [
		new DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.PORT': JSON.stringify(process.env.PORT)
		}),
		new MiniCssExtractPlugin({
			filename: isDev ? '[name].css' : '[name].[contenthash].css',
			chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css'
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './public/index.html'),
			favicon: path.resolve(__dirname, './public/img/favicon.ico'),
			minify: {
				collapseWhitespace: !isDev,
				removeComments: !isDev
			}
		}),
		new ModuleFederationPlugin({
			name: 'nirvanaApp',
			filename: 'remoteEntry.js',
			exposes: {
				'./nirvanaAppInit': './src/entry'
			},
		})
	],
	optimization: {
		minimize: !isDev,
		minimizer: [
			new CssMinimizerPlugin(),
			new HtmlMinimizerPlugin(),
			new JsonMinimizerPlugin(),
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					format: {
						comments: false
					}
				}
			}),
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							['gifsicle', { interlaced: true }],
							['jpegtran', { progressive: true }],
							['optipng', { optimizationLevel: 5 }],

							[
								'svgo',
								{
									plugins: [
										{
											name: 'preset-default',
											params: {
												overrides: {
													removeViewBox: false,
													addAttributesToSVGElement: {
														params: {
															attributes: [
																{
																	xmlns: 'http://www.w3.org/2000/svg'
																}
															]
														}
													}
												}
											}
										}
									]
								}
							]
						]
					}
				}
			})
		]
	},
	watchOptions: {
		ignored: /node_modules/,
		poll: 1000
	}
	// output: {
	// 	filename: isDev ? '[name]123.js' : '[name].[contenthash]123.js',
	// 	path: path.resolve(__dirname, 'dist'),
	// 	assetModuleFilename: 'public/[name].[contenthash][ext][query]',
	// 	clean: true
	// }
}
