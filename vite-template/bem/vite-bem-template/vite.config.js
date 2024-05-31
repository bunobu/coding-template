import { defineConfig } from "vite";
import { resolve } from "path";
import { join } from "path";

import handlebars from "vite-plugin-handlebars";
import sassGlobImports from "vite-plugin-sass-glob-import";

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
  root: "./src", // 開発ディレクトリの設定
  base: "./", // 出力されるファイルのパスを相対パスにする

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

    /**
     * ファイルの出力設定
     */
    rollupOptions: {
      output: {
        // assetsファイルの設定
        assetFileNames: (assetInfo) => {
          if (`\.css$`) {
            console.log(assetInfo.name);
            return `assets/css/[name][extname]`;
          }

          return `assets/[name][extname]`;
        },

        // jsファイルの設定
        chunkFileNames: "assets/js/[name].js",
        entryFileNames: "assets/js/[name].js",
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
    // htmlをバンドル出来るようにする
    handlebars({
      // コンポーネント化するディレクトリを指定
      partialDirectory: resolve(__dirname, "./src/components"),

      // 各ページ毎の変数を読み込む
      context(pagePath) {
        return pageDate[pagePath];
      },
    }),

    sassGlobImports(),
  ],
  /**
   * <<< pluginの設定
   */
});
