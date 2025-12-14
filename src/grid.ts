/**
 * グリッド描画モジュール（Canvas API版）
 * グリッド専用Canvas要素に描画することで、
 * 消しゴムの影響を受けない独立したレイヤーとして機能する
 */

/**
 * グリッドCanvasに正方形セルのグリッドを描画する
 * グリッドは画像（Canvas）の中心を基準に配置される
 * @param gridCanvas - グリッド用のHTMLCanvasElement
 * @param cellSize - グリッドセルのサイズ (px)
 */
export function drawGrid(gridCanvas: HTMLCanvasElement, cellSize: number): void {
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  const width = gridCanvas.width;
  const height = gridCanvas.height;

  // キャンバスをクリア
  ctx.clearRect(0, 0, width, height);

  // グリッド線のスタイル設定
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;

  // Canvas の中心座標
  const centerX = width / 2;
  const centerY = height / 2;

  // グリッド開始位置を計算（中心からの最も近いグリッド線）
  const startX = centerX % cellSize;
  const startY = centerY % cellSize;

  ctx.beginPath();

  // 縦線を描画（中心から左右に）
  // 中心より右側
  for (let x = startX; x < width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  // 中心より左側
  for (let x = startX - cellSize; x >= 0; x -= cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // 横線を描画（中心から上下に）
  // 中心より下側
  for (let y = startY; y < height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  // 中心より上側
  for (let y = startY - cellSize; y >= 0; y -= cellSize) {
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
 * グリッドセルサイズを更新する（両方のCanvasに適用）
 * @param referenceGrid - 参照用グリッドCanvas
 * @param drawingGrid - 描画用グリッドCanvas
 * @param cellSize - 新しいグリッドセルサイズ (px)
 */
export function updateGrid(
  referenceGrid: HTMLCanvasElement,
  drawingGrid: HTMLCanvasElement,
  cellSize: number
): void {
  drawGrid(referenceGrid, cellSize);
  drawGrid(drawingGrid, cellSize);
}
