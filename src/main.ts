/**
 * メインエントリーポイント
 * アプリケーション全体の初期化と起動
 */

import './style.css';
import type { AppState } from './types';
import { initCanvas, hideCanvas } from './canvas';
import { hideGrid } from './grid';
import { setupUI } from './ui';
import { switchToPenMode } from './drawing';

/**
 * アプリケーション初期化
 */
function initApp(): void {
  console.log('模写アプリを起動します');

  // 初期状態を作成
  const state: AppState = {
    referenceCanvas: null,
    drawingCanvas: null,
    referenceGrid: null,
    drawingGrid: null,
    loadedImage: null,
    canvasSize: null,
    gridCellSize: 100, // デフォルト値 (px)
    penSize: 2, // デフォルト値
    eraserSize: 5, // デフォルト値
    mode: 'pen',
    layout: 'split',
    leftHandedMode: false,
    history: [],
  };

  // Fabric.js Canvasを初期化（初期サイズは仮、画像読み込み時に変更される）
  state.referenceCanvas = initCanvas('reference-canvas', { width: 100, height: 100 }, false);
  state.drawingCanvas = initCanvas('drawing-canvas', { width: 100, height: 100 }, true);

  // グリッドCanvas要素を取得
  state.referenceGrid = document.getElementById('reference-grid') as HTMLCanvasElement;
  state.drawingGrid = document.getElementById('drawing-grid') as HTMLCanvasElement;

  // 初期状態では非表示
  hideCanvas(state.referenceCanvas);
  hideCanvas(state.drawingCanvas);
  hideGrid(state.referenceGrid);
  hideGrid(state.drawingGrid);

  // ペンモードで開始
  switchToPenMode(state.drawingCanvas, state.penSize);

  // UIイベントを設定
  setupUI(state);

  // Service Workerを登録（PWA対応）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker登録成功:', registration.scope);
      },
      (error) => {
        console.log('Service Worker登録失敗:', error);
      }
    );
  }

  console.log('アプリケーション初期化完了');
}

// DOM読み込み完了後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
