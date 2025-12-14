/**
 * UI制御モジュール
 * ツールバーのボタンやコントロールのイベントハンドリング
 */

import type { AppState } from './types';
import { loadAndSetupImage } from './image';
import { switchToPenMode, switchToEraserMode, updatePenSize } from './drawing';
import { updateGrid } from './grid';
import { performUndo, saveToHistory, initializeHistory } from './undo';

/**
 * UI要素を取得する
 */
function getUIElements() {
  return {
    loadImageBtn: document.getElementById('load-image-btn') as HTMLButtonElement,
    imageInput: document.getElementById('image-input') as HTMLInputElement,
    penBtn: document.getElementById('pen-btn') as HTMLButtonElement,
    eraserBtn: document.getElementById('eraser-btn') as HTMLButtonElement,
    penSizeInput: document.getElementById('pen-size') as HTMLInputElement,
    penSizeValue: document.getElementById('pen-size-value') as HTMLSpanElement,
    eraserSizeInput: document.getElementById('eraser-size') as HTMLInputElement,
    eraserSizeValue: document.getElementById('eraser-size-value') as HTMLSpanElement,
    gridSizeInput: document.getElementById('grid-size') as HTMLInputElement,
    gridSizeValue: document.getElementById('grid-size-value') as HTMLSpanElement,
    layoutToggleBtn: document.getElementById('layout-toggle') as HTMLButtonElement,
    leftHandedToggleBtn: document.getElementById('left-handed-toggle') as HTMLButtonElement,
    undoBtn: document.getElementById('undo-btn') as HTMLButtonElement,
    canvasContainer: document.getElementById('canvas-container') as HTMLDivElement,
  };
}

/**
 * UI要素にイベントリスナーを設定する
 * @param state - アプリケーション状態
 */
export function setupUI(state: AppState): void {
  const ui = getUIElements();

  // 画像読み込みボタン
  ui.loadImageBtn.addEventListener('click', () => {
    ui.imageInput.click();
  });

  // 画像ファイル選択
  ui.imageInput.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!state.referenceCanvas || !state.drawingCanvas || !state.referenceGrid || !state.drawingGrid) {
      console.error('Canvas elements not initialized');
      return;
    }

    try {
      const { image, size } = await loadAndSetupImage(
        file,
        state.referenceCanvas,
        state.drawingCanvas,
        state.referenceGrid,
        state.drawingGrid,
        state.gridCellSize
      );

      state.loadedImage = image;
      state.canvasSize = size;

      // 履歴を初期化
      initializeHistory(state.drawingCanvas, state.history);

      console.log('画像を読み込みました:', size);
    } catch (error) {
      console.error('画像読み込みエラー:', error);
      alert('画像の読み込みに失敗しました');
    }
  });

  // ペンボタン
  ui.penBtn.addEventListener('click', () => {
    if (!state.drawingCanvas) return;

    switchToPenMode(state.drawingCanvas, state.penSize);
    state.mode = 'pen';

    ui.penBtn.classList.add('active');
    ui.eraserBtn.classList.remove('active');
  });

  // 消しゴムボタン
  ui.eraserBtn.addEventListener('click', () => {
    if (!state.drawingCanvas) return;

    switchToEraserMode(state.drawingCanvas, state.eraserSize);
    state.mode = 'eraser';

    ui.eraserBtn.classList.add('active');
    ui.penBtn.classList.remove('active');
  });

  // ペンサイズ変更
  ui.penSizeInput.addEventListener('input', (e) => {
    const size = parseInt((e.target as HTMLInputElement).value, 10);
    state.penSize = size;
    ui.penSizeValue.textContent = size.toString();

    if (state.drawingCanvas && state.mode === 'pen') {
      updatePenSize(state.drawingCanvas, size);
    }
  });

  // 消しゴムサイズ変更
  ui.eraserSizeInput.addEventListener('input', (e) => {
    const size = parseInt((e.target as HTMLInputElement).value, 10);
    state.eraserSize = size;
    ui.eraserSizeValue.textContent = size.toString();

    if (state.drawingCanvas && state.mode === 'eraser') {
      updatePenSize(state.drawingCanvas, size);
    }
  });

  // グリッドセルサイズ変更
  ui.gridSizeInput.addEventListener('input', (e) => {
    const cellSize = parseInt((e.target as HTMLInputElement).value, 10);
    state.gridCellSize = cellSize;
    ui.gridSizeValue.textContent = cellSize.toString();

    // グリッドCanvasを更新
    if (state.referenceGrid && state.drawingGrid) {
      updateGrid(state.referenceGrid, state.drawingGrid, cellSize);
    }
  });

  // 分割/重ね表示切替
  ui.layoutToggleBtn.addEventListener('click', () => {
    if (state.layout === 'split') {
      state.layout = 'overlay';
      ui.canvasContainer.classList.add('overlay');
      ui.layoutToggleBtn.textContent = '分割表示';
    } else {
      state.layout = 'split';
      ui.canvasContainer.classList.remove('overlay');
      ui.layoutToggleBtn.textContent = '重ね表示';
    }
  });

  // 左利きモード切替
  ui.leftHandedToggleBtn.addEventListener('click', () => {
    state.leftHandedMode = !state.leftHandedMode;

    if (state.leftHandedMode) {
      ui.canvasContainer.classList.add('left-handed');
      ui.leftHandedToggleBtn.classList.add('active');
    } else {
      ui.canvasContainer.classList.remove('left-handed');
      ui.leftHandedToggleBtn.classList.remove('active');
    }
  });

  // Undoボタン
  ui.undoBtn.addEventListener('click', async () => {
    if (!state.drawingCanvas) return;

    await performUndo(state.drawingCanvas, state.history);
  });

  // 描画完了時に履歴を保存
  if (state.drawingCanvas) {
    state.drawingCanvas.on('path:created', () => {
      if (state.drawingCanvas) {
        saveToHistory(state.drawingCanvas, state.history);
        // グリッドは別レイヤーなので再描画不要
      }
    });

    // 消しゴム使用後も履歴を保存
    // 注: 白ブラシ実装のため erasing:end イベントは発火しないが、念のため残す
    state.drawingCanvas.on('erasing:end', () => {
      if (state.drawingCanvas) {
        saveToHistory(state.drawingCanvas, state.history);
      }
    });
  }
}
