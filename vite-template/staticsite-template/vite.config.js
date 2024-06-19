import { defineConfig } from "vite";
import { resolve } from "path";
import { join } from "path";

import sassGlobImports from "vite-plugin-sass-glob-import";
import viteImagemin from "vite-plugin-imagemin";

// HTMLで出し分ける情報
const pageDate = {
  "/index.html": {
    isHome: true,
    title: "indexページだよ",
  },
  "/hoge.html": {
    isHome: false,
    title: "hogeページだよ",
  },
};

export default defineConfig({
  base: "./", // 出力されるファイルのパスを相対パスにする
  server: {
    port: 8888,
  },
  root: "./src", // 開発ディレクトリの設定

  // sassで全体で使用したい変数ディレクトリをエイリアスで使えるようにする
  resolve: {
    alias: { "@global/": join(__dirname, "./src/scss/global/") },
  },

  /**
   * >>> ビルド設定
   */
  build: {
    // ファイルの出力先の設定
    outDir: "../dist",
    emptyOutDir: true,

    rollupOptions: {
      /**
       * ファイルの出力設定
       */
      output: {
        // // jsファイルの設定
        chunkFileNames: "assets/js/[name].js",
        entryFileNames: "assets/js/main.js",

        // assetsファイルの設定
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".")[1];
          //Webフォントファイルの振り分け
          if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
            extType = "fonts";
          }
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
            return `assets/${extType}/[name][extname]`;
          }
          //ビルド時のCSS名を明記してコントロールする
          if (extType === "css") {
            return `assets/css/style.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
      },

      input: {
        index: resolve(__dirname, "./src/index.html"),
        // htmlファイルを複数出力する場合はここに記載
        hoge: resolve(__dirname, "./src/hoge.html"),
      },
    },
  },
  /**
   * <<< ビルド設定
   */

  /**
   * >>> pluginの設定
   */
  plugins: [
    // プラグイン - sassバンドル
    sassGlobImports(),

    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
  ],
  /**
   * <<< pluginの設定
   */
});
