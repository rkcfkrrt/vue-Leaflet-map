// /* eslint-disable global-require, @typescript-eslint/no-var-requires, no-param-reassign */ // TypeScript
/* eslint-disable global-require, no-param-reassign */

const os = require('os')
const path = require('path')
// const glob = require('glob-all')

// @vue/cli-service 相依於 webpack-bundle-analyzer
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // eslint-disable-line import/no-extraneous-dependencies
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const PurgecssPlugin = require('purgecss-webpack-plugin')
// eslint-disable-next-line no-unused-vars
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = (dir) => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

// 新增 Stylus 規則
// const addStylusResource = rule => {
//   rule
//     .use('style-resouce')
//     .loader('style-resources-loader')
//     .options({
//       patterns: [resolve('src/assets/stylus/variable.styl')]
//     })
// }

// 配置参考 | Vue CLI
// https://next.cli.vuejs.org/zh/config/#vue-config-js
module.exports = {
  // { Type: string, Default: '/' }
  // 部署應用程式套件時的基底 URL。
  // 預設情況下，Vue CLI 會假設你的應用程式程式是被部署在一個域名的根路徑上，例如 https://www.my-app.com/。
  // 如果應用程式被部署在一個子路徑上，你就需要用這個選項指定這個子路徑。例如，如果你的應用程式被部署在 https://www.my-app.com/my-app/，則設置 publicPath為/my-app/。
  publicPath: IS_PROD ? process.env.VUE_APP_SRC || '/' : '/',

  // { Type: string, Default: 'dist' }
  // 生產環境建構（vue-cli-service build）目錄。
  // ※ 注意：目標目錄的內容在建構之前會被清除。（建構時傳入 --no-clean 參數可關閉該行為）
  outputDir: process.env.outputDir || 'dist',

  // { Type: string, Default: '' }
  // 放置產生的靜態資源（js、css、img、fonts）的目錄。
  // 相對於 outputDir。
  assetsDir: '',

  // { Type: string, Default: 'index.html' }
  // 指定產生的 index.html 的輸出路徑。
  // 相對於 outputDir，也可以是一個絕對路徑。
  indexPath: 'index.html',

  // { Type: boolean, Default: true }
  // 預設情況下，產生的靜態資源在它們的檔案名中包含了 hash 以便更好的控制緩存。
  // 然而，這也要求 index 的 HTML 是被 Vue CLI 自動產生的。如果你無法使用 Vue CLI 產生的 index HTML，你可以通過將這個選項設為 false 來關閉檔名雜湊。
  filenameHashing: true,

  // { Type: Object, Default: undefined }
  // 在 multi-page 模式下建構應用程式。
  // 每個 page 應該有一個對應的 JavaScript 入口檔案。其值應為物件。
  // key 是入口的名字；value 是指定其 entry 的字串，或一個指定了 entry, template, filename, title 和 chunks 的物件（除了 entry 之外都是可選的）
  pages: undefined,

  // { Type: boolean | 'warning'| 'default' | 'error', Default: 'default' }
  // 是否在開發環境下通過 eslint-loader 在每次存檔時 lint 代碼。
  // 這個值會在 @vue/cli-plugin-eslint 被安裝之後生效。
  // 設置為 true 或 'warning' 時，eslint-loader 會將 lint 錯誤輸出為編譯警告。預設情況下，警告僅僅會被輸出到命令行，且不會使得編譯失敗。
  // 設置為 'default' 或 'error' 時，eslint-loader 會將 lint 警告也輸出為編譯錯誤，這意味著 lint 警告將會導致編譯失敗。
  // lintOnSave: IS_PROD ? 'warning' : 'error',    // 允許生產環境中包含 lint 警告的問題
  lintOnSave: 'error',

  // { Type: boolean, Default: false }
  // 是否使用包含 runtime 編譯器的 Vue 建構版本。
  // 設置為 true 後你就可以在 Vue 元件中使用 template 選項了，但是這會讓你的應用程式額外增加 10KB 左右。
  runtimeCompiler: true,

  // { Type: Array<string | RegExp>, Default: [] }
  // 預設情況下 babel-loader 會忽略所有 node_modules 中的檔案。如果你想要通過 Babel 顯式轉譯一個依賴，可以在這個選項中列出來。
  transpileDependencies: [],

  // { Type: boolean, Default: true }
  // 生產環境的 source map
  // 如果不需要，可以設置為 false 以加速生產環境建構。
  productionSourceMap: !IS_PROD,

  // { Type: string, Default: undefined }
  // 設置產生的 HTML 中 <link rel="stylesheet"> 和 <script> 標籤的 crossorigin 屬性。
  // 需要注意的是該選項僅影響由 html-webpack-plugin 在建構時注入的標籤-直接寫在模版（public/index.html）中的標籤不受影響。
  crossorigin: undefined,

  // { Type: boolean, Default: false }
  // 設置產生的 HTML 中 <link rel="stylesheet"> 和 <script> 標籤的 crossorigin 屬性。
  // 需要注意的是該選項僅影響由 html-webpack-plugin 在建構時注入的標籤-直接寫在模版（public/index.html）中的標籤不受影響。
  integrity: false,

  // { Type: Object | Function, Default: undefined }
  // 如果這個值是一個物件，則會通過 webpack-merge 合併到最終的設定中。
  // 如果這個值是一個函數，則會接收被解析的設定作為參數。該函數既可以修改設定並不返回任何東西，也可以返回一個被複製或合併過的設定版本。
  configureWebpack: (config) => {
    // cdn引用時設定externals
    // config.externals = {
    //     'vue': 'Vue',
    //     'element-ui': 'ELEMENT',
    //     'vue-router': 'VueRouter',
    //     'vuex': 'Vuex',
    //     'axios': 'axios'
    // }

    if (IS_PROD) {
      const plugins = []

      // 去除多餘 CSS
      // plugins.push(
      //   new PurgecssPlugin({
      //     paths: glob.sync([path.join(__dirname, "./**/*.vue")]),
      //     extractors: [
      //       {
      //         extractor: class Extractor {
      //           static extract(content) {
      //             const validSection = content.replace(
      //               /<style([\s\S]*?)<\/style>+/gim,
      //               ""
      //             );
      //             return validSection.match(/[A-Za-z0-9-_:/]+/g) || [];
      //           }
      //         },
      //         extensions: ["vue"]
      //       }
      //     ],
      //     whitelist: ["html", "body"]
      //   })
      // );

      // 去除 console
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: true,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: [
                'console.log',
                'console.debug',
                'console.error',
                'console.warn',
                'console.info',
                'console.clear',
                'console.trace',
                'console.group',
                'console.groupCollapsed'
              ] // 移除 console
            }
          },
          sourceMap: false,
          parallel: true
        })
      )

      // 壓縮 CSS 為 gzip
      // plugins.push(
      //   new CompressionWebpackPlugin({
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: productionGzipExtensions,
      //     threshold: 10240,
      //     minRatio: 0.8
      //   })
      // )

      // 上傳檔案到 OSS
      // if (process.env.ACCESS_KEY_ID || process.env.ACCESS_KEY_SECRET || process.env.REGION || process.env.BUCKET || process.env.PREFIX) {
      //  plugins.push(
      //    new AliOssPlugin({
      //      accessKeyId: process.env.ACCESS_KEY_ID,
      //      accessKeySecret: process.env.ACCESS_KEY_SECRET,
      //      region: process.env.REGION,
      //      bucket: process.env.BUCKET,
      //      prefix: process.env.PREFIX,
      //      exclude: /.*\.html$/,
      //      deleteAll: false
      //    })
      //  );
      // }

      // Zopfli 壓縮 (https://webpack.js.org/plugins/compression-webpack-plugin/#using-zopfli)
      // plugins.push(
      //   new CompressionWebpackPlugin({
      //     algorithm(input, compressionOptions, callback) {
      //       return zopfli.gzip(input, compressionOptions, callback);
      //     },
      //     compressionOptions: {
      //       numiterations: 15
      //     },
      //     minRatio: 0.99,
      //     test: productionGzipExtensions
      //   })
      // );

      // Brotli 壓縮 (https://webpack.js.org/plugins/compression-webpack-plugin/#using-brotli)
      // plugins.push(
      //   new BrotliPlugin({
      //     test: productionGzipExtensions,
      //     minRatio: 0.99
      //   })
      // );

      config.plugins = [...config.plugins, ...plugins]
    }
  },

  // { Type: Function }
  // 是一個函數，會接收一個基於 webpack-chain 的 ChainableConfig 實例。
  // 允許對內部的 webpack 設定進行更細粒度的修改。
  chainWebpack: (config) => {
    // 修正 HMR 符號連結問題
    config.resolve.symlinks(true)

    // 修正 CSS 順序問題 (Lazy loading routes Error: Cyclic dependency [https://github.com/vuejs/vue-cli/issues/1669])
    config.plugin('html').tap((args) => {
      args[0].chunksSortMode = 'none'
      return args
    })

    // 新增路徑別名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))

    // 建構分析
    if (process.env.BUNDLE_ANALYZE) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }

    // 壓縮圖片
    // config.module
    //   .rule("images")
    //   .use("image-webpack-loader")
    //   .loader("image-webpack-loader")
    //   .options({
    //     mozjpeg: { progressive: true, quality: 65 },
    //     optipng: { enabled: false },
    //     pngquant: { quality: "65-90", speed: 4 },
    //     gifsicle: { interlaced: false },
    //     webp: { quality: 75 }
    //   });

    // Stylus
    // const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    // types.forEach(type =>
    //   addStylusResource(config.module.rule('stylus').oneOf(type))
    // )

    // 多頁面設定，為 JS 檔名加入 hash 後綴
    // config.output.chunkFilename(`js/[name].[chunkhash:8].js`)

    // 修改圖片輸出路徑
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .options({
    //       name: path.join('../assets/', 'img/[name].[ext]')
    //   })

    // disable cache for prod only, remove the if to disable it everywhere
    // if (process.env.NODE_ENV === 'production') {
    //  config.module.rule('js').uses.delete('cache-loader');
    //  config.module.rule('jsx').uses.delete('cache-loader');
    //  config.module.rule('ts').uses.delete('cache-loader');
    //  config.module.rule('tsx').uses.delete('cache-loader');
    //  config.module.rule('vue').uses.delete('cache-loader');
    // }
  },

  // { Type: Function }
  // 是一個函數，會接收一個基於 webpack-chain 的 ChainableConfig 實例。
  // 允許對內部的 webpack 設定進行更細粒度的修改。
  css: {
    // 從 v4 起已棄用，請使用 css.requireModuleExtension。
    // 在 v3 中，這個選項含義與 css.requireModuleExtension 相反。
    requireModuleExtension: true,

    // 預設情況下，只有 *.module.[ext] 結尾的檔案才會被視作 CSS Modules 模組。
    // 設置為 false 後你就可以去掉檔案名中的 .module 並將所有的 *.(css|scss|sass|less|styl(us)?) 檔案視為 CSS Modules 模組。
    // requireModuleExtension: true,

    // { Type: boolean | Object, Default: 生產環境下是 true，開發環境下是 false }
    // 是否將元件中的 CSS 提取至一個獨立的 CSS 檔案中。（而不是動態注入到JavaScript 中的inline 代碼）
    extract: IS_PROD,

    // 為 CSS 檔名加入 hash 後綴
    // extract: {
    //   filename: 'css/[name].[hash:8].css',
    //   chunkFilename: 'css/[name].[hash:8].css'
    // },

    // { Type: boolean, Default: false }
    // 是否為 CSS 開啟 source map。
    // 設置為 true 之後可能會影響建構的性能。
    sourceMap: !IS_PROD,

    // { Type: Object, Default: {} }
    // 向 CSS 相關的 loader 傳遞選項。
    loaderOptions: {
      /*
      css: {
        // 這裡的選項會傳遞給 css-loader
      },

      postcss: {
        // 這裡的選項會傳遞給 postcss-loader
      },
      */

      // 單位 px 轉換為 rem
      // postcss: {
      //   plugins: [
      //     require('postcss-pxtorem')({
      //       rootValue: 1, // 換算基數
      //       selectorBlackList: ['weui', 'el'], // 以字串或 RegExp 指定欲忽略轉換的選擇器
      //       propList: ['*']
      //     })
      //   ]
      // }

      sass: {
        // 這裡的選項會傳遞給 sass-loader
        // 向全域 SASS 樣式傳入共享的全域變數
        // data: `@import "~assets/scss/variables.scss";$src: "${process.env.VUE_APP_SRC}";`
        additionalData: `$src: "${process.env.VUE_APP_SRC}";`
      }

      /*
      less: {
        // 這裡的選項會傳遞給 less-loader
      },

      stylus: {
        // 這裡的選項會傳遞給 stylus-loader
      }
      */
    }
  },

  pluginOptions: {
    // 安裝 vue-cli-plugin-style-resources-loader 外掛
    // 加入全域樣式表 global.scss
    // "style-resources-loader": {
    //   preProcessor: "scss",
    //   patterns: [
    //     resolve(__dirname, "./src/scss/scss/variables.scss")
    //   ]
    // }
  },

  // { Type: Object }
  // 所有 webpack-dev-server 的選項都支援。
  // ※ 注意：
  // 有些值像 host、port 和 https 可能會被命令行參數覆寫。
  // 有些值像 publicPath 和 historyApiFallback 不應該被修改，因為它們需要和開發伺服器的 publicPath 同步以確保正常運作。
  devServer: {
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    open: IS_PROD,
    host: '0.0.0.0',
    // host: 'localhost',
    port: 8000,
    https: false,
    hotOnly: false,

    // { Type: string | Object }
    // 如果你的前端應用程式和後端API伺服器沒有運行在同一個主機上，你需要在開發環境下將 API 請求代理到 API 伺服器。
    // 這個問題可以通過 vue.config.js 中的 devServer.proxy 選項來設定。
    // devServer.proxy 可以是一個指向開發環境API 伺服器的字串。
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API || 'http://127.0.0.1',
        changeOrigin: true
      }
    }
  },

  // { Type: boolean, Default: require('os').cpus().length > 1 }
  // 是否為 Babel 或 TypeScript 使用 thread-loader。
  // 該選項在系統的 CPU 有多於一個核心時自動啟用，僅作用於生產建構。
  parallel: os.cpus().length > 1,

  // { Type: Object }
  // 向 PWA 外掛傳遞選項。
  pwa: {
    // some code...
  }

  // # Babel 可以通過 babel.config.js 進行設定。
  // Vue CLI使用了Babel 7 中的新設定格式babel.config.js。和 .babelrc 或 package.json 中的 babel 欄位不同，這個設定檔案不會使用基於檔案位置的方案，而是會一致地運用到項目根目錄以下的所有檔案，包括node_modules內部的依賴。我們推薦在Vue CLI項目中始終使用babel.config.js取代其它格式。

  // # ESLint 可以通過 .eslintrc 或 package.json 中的 eslintConfig 欄位來設定。
  // 更多細節可查閱 @vue/cli-plugin-eslint。

  // # TypeScript 可以通過tsconfig.json來設定。
  // 更多細節可查閱 @vue/cli-plugin-typescript。

  // # 單元測試 - Jest
  // 更多細節可查閱 @vue/cli-plugin-unit-jest。

  // # 單元測試 - Mocha（配合 mocha-webpack）
  // 更多細節可查閱 @vue/cli-plugin-unit-mocha。

  // # E2E 測試 - Cypress
  // 更多細節可查閱 @vue/cli-plugin-e2e-cypress。

  // # E2E 測試 - Nightwatch
  // 更多細節可查閱 @vue/cli-plugin-e2e-nightwatch。
}

// 解決打包後頁面空白問題
// module.exports = {
//   // webpack配置
//   configureWebpack: {
//     // 警告 webpack 的性能提示
//     performance: {
//       hints: 'warning',
//       // 入口起點的最大體積
//       maxEntrypointSize: 50000000,
//       // 生成文件的最大體積
//       maxAssetSize: 30000000,
//       // 只給出 js 文件的性能提示
//       assetFilter: function (assetFilename) {
//         return assetFilename.endsWith('.js')
//       }
//     }
//   }
// }

module.exports = {
  // 解決打包後頁面空白問題
  publicPath: './',

  // 解決 webpack generates source maps
  // 待刪，上面也有一個
  productionSourceMap: false
}
