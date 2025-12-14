/**
 * グリッド描画モジュール（Canvas API版）
 * グリッド専用Canvas要素に描画することで、
 * 消しゴムの影響を受けない独立したレイヤーとして機能する
 */

/**
 * グリッドCanvasに描画する
 * @param gridCanvas - グリッド用のHTMLCanvasElement
 * @param divisions - グリッド分割数（縦横それぞれN等分）
 */
export function drawGrid(gridCanvas: HTMLCanvasElement, divisions: number): void {
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  const width = gridCanvas.width;
  const height = gridCanvas.height;

  // キャンバスをクリア
  ctx.clearRect(0, 0, width, height);

  // グリッド線のスタイル設定
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;

  ctx.beginPath();

  // 縦線を描画
  for (let i = 1; i < divisions; i++) {
    const x = (width / divisions) * i;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // 横線を描画
  for (let i = 1; i < divisions; i++) {
    const y = (height / divisions) * i;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
}

/**
 * グリッドCanvasのサイズを設定
 * @param gridCanvas - グリッド用Canvas
 * @param width - 幅
 * @param height - 高さ
 */
export function resizeGridCanvas(
  gridCanvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  gridCanvas.width = width;
  gridCanvas.height = height;
}

/**
 * グリッドを非表示にする
 * @param gridCanvas - グリッド用Canvas
 */
export function hideGrid(gridCanvas: HTMLCanvasElement): void {
  gridCanvas.style.display = 'none';
}

/**
 * グリッドを表示する
 * @param gridCanvas - グリッド用Canvas
 */
export function showGrid(gridCanvas: HTMLCanvasElement): void {
  gridCanvas.style.display = 'block';
}

/**
 * グリッド分割数を更新する（両方のCanvasに適用）
 * @param referenceGrid - 参照用グリッドCanvas
 * @param drawingGrid - 描画用グリッドCanvas
 * @param divisions - 新しいグリッド分割数
 */
export function updateGrid(
  referenceGrid: HTMLCanvasElement,
  drawingGrid: HTMLCanvasElement,
  divisions: number
): void {
  drawGrid(referenceGrid, divisions);
  drawGrid(drawingGrid, divisions);
}
