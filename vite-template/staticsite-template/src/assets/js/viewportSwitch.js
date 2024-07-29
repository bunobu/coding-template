/**
 * デバイス幅〇〇以下の場合はviewportを固定
 * flagSize 固定を始めるデバイス幅
 */
export const viewportSwitch = (flagSize = 375) => {
  // viewport属性の取得
  const viewport = document.querySelector('meta[name="viewport"]');
  // 固定するデバイス幅
  const staticWidth = flagSize;

  // viewportの切り替え関数
  function switchViewport() {
    const value =
      // window.screen.widthはデバイスの幅を取得
      window.screen.width > staticWidth
        ? // デバイス幅が条件より大きい場合はデバイス幅に合わせる
          "width=device-width,initial-scale=1"
        : // デバイス幅が条件より小さい場合は固定の幅に合わせる
          `width=${staticWidth}`;

    // viewportの値がvalueと異なる場合はvalueをセット
    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  }
  // リサイズ時にviewportを切り替え
  addEventListener("resize", switchViewport, false);
  // 初期読み込み時にviewportを切り替え
  switchViewport();
};
