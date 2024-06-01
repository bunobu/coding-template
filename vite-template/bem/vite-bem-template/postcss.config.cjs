/**
 * postcssの設定
 * CSSに関する設定を記述
 */

module.exports = {
  plugins: {
    autoprefixer: {}, // ベンタープレフィックスをつける

    // メディアクエリをソートしてまとめる
    "postcss-sort-media-queries": {
      sort: "mobile-first", // default value
    },

    "css-declaration-sorter": { order: "smacss" },
  },
};
