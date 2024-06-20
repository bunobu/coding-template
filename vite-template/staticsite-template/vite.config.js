/**
 * 構築で参考にさせてもらったサイト
 * 構築全般：https://coding-memo.work/development/1274/
 * markuplintに関して：https://designsupply-web.com/media/programming/7648/
 * */

import { defineConfig } from "vite";
import { resolve, join } from "path";

import handlebars from "vite-plugin-handlebars";

import sassGlobImports from "vite-plugin-sass-glob-import";

import viteImagemin from "vite-plugin-imagemin";
import imageminPlugin from "@macropygia/vite-plugin-imagemin-cache";

// HTMLで出し分ける情報
const pageDate = {
  "/index.html": {
    isHome: true,
    title: "indexページだよ",
    description: "indexページの説明文だよ",
  },
  "/hoge.html": {
    isHome: false,
    title: "hogeページだよ",
    description: "hogeページの説明文だよ",
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
      output: {
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

        chunkFileNames: "assets/js/[name].js",
        entryFileNames: "assets/js/[name].js",
      },
      input: {
        // htmlファイルを複数出力する場合はここに記載
        index: resolve(__dirname, "./src/index.html"),
        hoge: resolve(__dirname, "./src/hoge.html"),
      },
    },
  },

  plugins: [
    handlebars({
      // コンポーネント化するディレクトリを指定
      partialDirectory: resolve(__dirname, "./src/components"),

      // 各ページ毎の変数を読み込む
      context(pagePath) {
        return pageDate[pagePath];
      },
    }),

    sassGlobImports(),

    // キャッシュの対応画像フォーマットはPNG/JPEG/SVGのみ
    imageminPlugin({
      exclude: [
        // "**/old_*.jpg", // 除外パターン
      ],
      plugins: {
        // imageminプラグインの設定
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
      },
    }),

    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
    }),
  ],
  /**
   * <<< pluginの設定
   */
});
