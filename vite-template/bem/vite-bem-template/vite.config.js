import { defineConfig } from "vite";
import { resolve } from "path";
import { log } from "console";

export default defineConfig({
  root: "./src", //開発ディレクトリの設定
  build: {
    //ファイルの出力先の設定
    outDir: "../dist",
    emptyOutDir: true,

    // ファイルの出力設定
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
});
