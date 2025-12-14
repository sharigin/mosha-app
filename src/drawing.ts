/**
 * 描画機能モジュール
 * ペン・消しゴムモードの切り替えとペンサイズ設定
 */

import { Canvas as FabricCanvas, PencilBrush } from 'fabric';

// 消しゴムの実装用フラグ
let isEraserMode = false;

/**
 * ペンモードに切り替える
 * @param canvas - 描画用Canvas
 * @param penSize - ペンサイズ
 */
export function switchToPenMode(canvas: FabricCanvas, penSize: number): void {
  isEraserMode = false;

  // 描画モードを有効化
  canvas.isDrawingMode = true;

  // ペンブラシを設定
  const brush = new PencilBrush(canvas);
  brush.width = penSize;
  brush.color = '#000000'; // 黒色固定

  canvas.freeDrawingBrush = brush;
}

/**
 * 消しゴムモードに切り替える
 * @param canvas - 描画用Canvas
 * @param eraserSize - 消しゴムサイズ
 */
export function switchToEraserMode(canvas: FabricCanvas, eraserSize: number): void {
  isEraserMode = true;

  // 描画モードを有効化
  canvas.isDrawingMode = true;

  // 白色のブラシで消しゴムをシミュレート
  const brush = new PencilBrush(canvas);
  brush.width = eraserSize;
  brush.color = '#FFFFFF'; // 白色で上書き

  canvas.freeDrawingBrush = brush;
}

/**
 * ペンサイズを変更する
 * @param canvas - 描画用Canvas
 * @param size - 新しいペンサイズ
 */
export function updatePenSize(canvas: FabricCanvas, size: number): void {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = size;
  }
}

/**
 * 現在のモードを取得する
 * @param canvas - 描画用Canvas
 * @returns 'pen' | 'eraser' | 'none'
 */
export function getCurrentMode(canvas: FabricCanvas): 'pen' | 'eraser' | 'none' {
  if (!canvas.isDrawingMode) {
    return 'none';
  }

  return isEraserMode ? 'eraser' : 'pen';
}
