/**
 * 画像読み込みモジュール
 * ローカルファイルから画像を読み込み、Canvasサイズを決定する
 */

import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { resizeCanvas, showCanvas } from './canvas';
import { drawGrid, resizeGridCanvas, showGrid } from './grid';

// 最大Canvasサイズ (タブレット対応: 1200x1200px)
const MAX_CANVAS_SIZE = 1200;

/**
 * 画像ファイルを読み込む
 * @param file - 読み込む画像ファイル
 * @returns Promise<HTMLImageElement>
 */
export function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}

/**
 * 画像サイズから適切なCanvasサイズを計算する
 * 仕様: 800x800pxを上限とし、縦横比を保って縮小
 * @param imgWidth - 画像の幅
 * @param imgHeight - 画像の高さ
 * @returns Canvas用のサイズ { width, height }
 */
export function calculateCanvasSize(
  imgWidth: number,
  imgHeight: number
): { width: number; height: number } {
  let width = imgWidth;
  let height = imgHeight;

  // 上限を超える場合は縮小
  if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
    const ratio = Math.min(MAX_CANVAS_SIZE / width, MAX_CANVAS_SIZE / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  return { width, height };
}

/**
 * 参照Canvasに画像を配置する
 * @param canvas - 参照用Canvas
 * @param img - 読み込んだ画像
 * @param canvasWidth - Canvasの幅
 * @param canvasHeight - Canvasの高さ
 */
export async function displayImageOnCanvas(
  canvas: FabricCanvas,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
): Promise<void> {
  // Canvasをクリア
  canvas.clear();

  // 画像をFabric.jsオブジェクトに変換
  const fabricImage = await FabricImage.fromURL(img.src);

  // 画像をCanvasサイズに合わせてスケーリング
  const scaleX = canvasWidth / img.width;
  const scaleY = canvasHeight / img.height;

  fabricImage.set({
    scaleX,
    scaleY,
    selectable: false,
    evented: false,
  });

  canvas.add(fabricImage);

  // 画像を背面に送る（グリッドが前面に表示されるように）
  canvas.sendObjectToBack(fabricImage);

  canvas.renderAll();
}

/**
 * 画像読み込みとCanvas初期化を行う
 * @param file - 読み込む画像ファイル
 * @param referenceCanvas - 参照用Canvas
 * @param drawingCanvas - 描画用Canvas
 * @param referenceGrid - 参照用グリッドCanvas
 * @param drawingGrid - 描画用グリッドCanvas
 * @param gridCellSize - グリッドセルサイズ (px)
 * @returns 読み込んだ画像とCanvasサイズ
 */
export async function loadAndSetupImage(
  file: File,
  referenceCanvas: FabricCanvas,
  drawingCanvas: FabricCanvas,
  referenceGrid: HTMLCanvasElement,
  drawingGrid: HTMLCanvasElement,
  gridCellSize: number
): Promise<{ image: HTMLImageElement; size: { width: number; height: number } }> {
  // 画像を読み込む
  const img = await loadImageFile(file);

  // Canvasサイズを計算
  const canvasSize = calculateCanvasSize(img.width, img.height);

  // 両方のFabric Canvasをリサイズ
  resizeCanvas(referenceCanvas, canvasSize.width, canvasSize.height);
  resizeCanvas(drawingCanvas, canvasSize.width, canvasSize.height);

  // グリッドCanvasをリサイズ
  resizeGridCanvas(referenceGrid, canvasSize.width, canvasSize.height);
  resizeGridCanvas(drawingGrid, canvasSize.width, canvasSize.height);

  // 参照Canvasに画像を配置
  await displayImageOnCanvas(referenceCanvas, img, canvasSize.width, canvasSize.height);

  // 描画Canvasをクリア
  drawingCanvas.clear();

  // グリッドを描画
  drawGrid(referenceGrid, gridCellSize);
  drawGrid(drawingGrid, gridCellSize);

  // Canvasとグリッドを表示
  showCanvas(referenceCanvas);
  showCanvas(drawingCanvas);
  showGrid(referenceGrid);
  showGrid(drawingGrid);

  return { image: img, size: canvasSize };
}
