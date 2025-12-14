/**
 * Canvas初期化・管理モジュール
 * Fabric.jsを使用してCanvasを初期化し、基本設定を行う
 */

import { Canvas as FabricCanvas } from 'fabric';
import type { CanvasOptions } from './types';

/**
 * Fabric.js Canvasを初期化する
 * @param elementId - Canvas要素のID
 * @param options - Canvas初期化オプション
 * @param isDrawable - 描画可能かどうか（false=参照面、true=描画面）
 * @returns 初期化されたFabric Canvas
 */
export function initCanvas(
  elementId: string,
  options: CanvasOptions,
  isDrawable: boolean
): FabricCanvas {
  const canvas = new FabricCanvas(elementId, {
    width: options.width,
    height: options.height,
    selection: false, // オブジェクト選択を無効化
    isDrawingMode: isDrawable, // 描画モードの初期値
  });

  // 参照面は完全に読み取り専用にする
  if (!isDrawable) {
    canvas.isDrawingMode = false;
    canvas.selection = false;
  }

  return canvas;
}

/**
 * Canvasのサイズを変更する
 * @param canvas - 対象のCanvas
 * @param width - 新しい幅
 * @param height - 新しい高さ
 */
export function resizeCanvas(
  canvas: FabricCanvas,
  width: number,
  height: number
): void {
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.renderAll();
}

/**
 * Canvasを表示する
 * @param canvas - 対象のCanvas
 */
export function showCanvas(canvas: FabricCanvas): void {
  const element = canvas.getElement().parentElement;
  if (element) {
    element.style.display = 'block';
  }
}

/**
 * Canvasを非表示にする
 * @param canvas - 対象のCanvas
 */
export function hideCanvas(canvas: FabricCanvas): void {
  const element = canvas.getElement().parentElement;
  if (element) {
    element.style.display = 'none';
  }
}
