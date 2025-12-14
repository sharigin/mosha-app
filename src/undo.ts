/**
 * Undo機能モジュール
 * 仕様: 描画完了ごとにcanvas.toJSON()で履歴を保存し、
 *       Undo時にloadFromJSON()で復元する
 */

import { Canvas as FabricCanvas } from 'fabric';

/**
 * Canvas状態を履歴に保存する
 * @param canvas - 描画用Canvas
 * @param history - 履歴配列
 */
export function saveToHistory(canvas: FabricCanvas, history: string[]): void {
  const json = JSON.stringify(canvas.toJSON());
  history.push(json);
}

/**
 * Undo操作を実行する
 * @param canvas - 描画用Canvas
 * @param history - 履歴配列
 */
export async function performUndo(canvas: FabricCanvas, history: string[]): Promise<void> {
  // 履歴が空の場合は何もしない（エラーにしない）
  if (history.length === 0) {
    return;
  }

  // 最後の履歴を削除
  history.pop();

  // 履歴が残っている場合は最後の状態に復元
  if (history.length > 0) {
    const lastState = history[history.length - 1];
    await canvas.loadFromJSON(lastState);
    canvas.renderAll();
  } else {
    // 履歴が空になった場合はCanvasをクリア
    canvas.clear();
    canvas.renderAll();
  }
}

/**
 * 履歴をクリアする（新しい画像読み込み時などに使用）
 * @param history - 履歴配列
 */
export function clearHistory(history: string[]): void {
  history.length = 0;
}

/**
 * 現在のCanvas状態を初期状態として履歴に保存する
 * @param canvas - 描画用Canvas
 * @param history - 履歴配列
 */
export function initializeHistory(canvas: FabricCanvas, history: string[]): void {
  clearHistory(history);
  saveToHistory(canvas, history);
}
