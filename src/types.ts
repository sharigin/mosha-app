/**
 * 型定義ファイル
 * アプリケーション全体で使用する型を定義
 */

import { Canvas as FabricCanvas } from 'fabric';

/**
 * アプリケーションの状態を管理する型
 */
export interface AppState {
  /** 参照用Canvas (Fabric.js) */
  referenceCanvas: FabricCanvas | null;

  /** 描画用Canvas (Fabric.js) */
  drawingCanvas: FabricCanvas | null;

  /** 参照用グリッドCanvas (HTML Canvas) */
  referenceGrid: HTMLCanvasElement | null;

  /** 描画用グリッドCanvas (HTML Canvas) */
  drawingGrid: HTMLCanvasElement | null;

  /** 読み込んだ画像 */
  loadedImage: HTMLImageElement | null;

  /** 現在のCanvasサイズ (width, height) */
  canvasSize: { width: number; height: number } | null;

  /** グリッドセルサイズ (px) */
  gridCellSize: number;

  /** ペンサイズ */
  penSize: number;

  /** 消しゴムサイズ */
  eraserSize: number;

  /** 現在のモード ('pen' | 'eraser') */
  mode: 'pen' | 'eraser';

  /** 表示レイアウト ('split' | 'overlay') */
  layout: 'split' | 'overlay';

  /** Undo用の履歴 (JSON形式のCanvas状態) */
  history: string[];
}

/**
 * Canvas初期化時のオプション
 */
export interface CanvasOptions {
  width: number;
  height: number;
}
