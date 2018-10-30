// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8087,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/api':{
            target:'http://jsonplaceholder.typicode.com',
            changeOrigin:true,
            pathRewrite:{
                '/api':''
            }
        },
        '/ms':{
            target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
            changeOrigin: true
        },
        '/UAMS': {
            /*target: 'http://openplatform.weilian.cn',*/
            target: 'http://172.19.6.104:8086',
            changeOrigin: true,
            pathRewrite: {
              '^/UAMS': '/UAMS'
            }
        },
        '/basic-platform': {
            /*target: 'http://openplatform.weilian.cn',*/
            target: 'http://172.19.4.232:3333',
            changeOrigin: true,
            pathRewrite: {
                '^/basic-platform': '/basic-platform'
            }
        },
        '/file-service': {
            target: 'http://10.0.0.97:8081',
            changeOrigin: true,
            pathRewrite: {
                '^/file-service': '/file-service'
            }
        },
        '/vr-qrcode': {
            target: 'http://xpomg.weilian.cn',
            changeOrigin: true,
            pathRewrite: {
                '^/vr-qrcode': '/vr-qrcode'
            }
        },
        '/account_auth_admin': {
            // target: 'http://uc.weilian.cn',
            target: 'http://vr12.weilian.cn',
            // target: 'http://172.19.4.170:8083',//阿劲后台
            changeOrigin: true,
            pathRewrite: {
                '^/account_auth_admin': '/account_auth_admin'
            }
        },
        '/vr-content' : {
            target: 'http://xpomg.weilian.cn',    
            changeOrigin: true,
            pathRewrite: {
                '^/vr-content': '/vr-content'
            }
        },
        '/vr-push' : {
            // target: 'http://openplatform.weilian.cn',    
            // target: 'http://xpomgtest.weilian.cn',    
            target: 'http://172.19.4.232:4444',    
            changeOrigin: true,
            pathRewrite: {
                '^/vr-push': '/vr-push'
            }
        },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
