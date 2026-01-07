import { ImagePosition } from './types';

/**
 * Sanitizes a sheet name to make it safe for filenames
 * Removes or replaces characters that are invalid in filenames
 */
export function sanitizeSheetName(sheetName: string): string {
  // Replace invalid filename characters with underscore
  return sheetName
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .trim();
}

/**
 * Generates a filename based on image position and index
 * Format: {SheetName}_{Column}_{Row}_{ImageIndex}.{extension}
 * Example: Sheet1_A_5_1.png
 */
export function generateImageName(
  position: ImagePosition,
  extension: string
): string {
  const sanitizedSheet = sanitizeSheetName(position.sheetName);
  return `${sanitizedSheet}_${position.column}_${position.row}_${position.imageIndex}.${extension}`;
}

/**
 * Converts a column number (0-based) to Excel column letter(s)
 * 0 -> A, 1 -> B, 25 -> Z, 26 -> AA, etc.
 */
export function columnNumberToLetter(colNum: number): string {
  let column = '';
  let num = colNum;

  while (num >= 0) {
    column = String.fromCharCode((num % 26) + 65) + column;
    num = Math.floor(num / 26) - 1;
  }

  return column;
}

/**
 * Gets the MIME type extension from a buffer
 */
export function getImageExtension(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer).subarray(0, 4);
  let header = '';
  for (let i = 0; i < arr.length; i++) {
    header += arr[i].toString(16);
  }

  // Check file signature
  if (header.startsWith('89504e47')) return 'png';
  if (header.startsWith('ffd8ff')) return 'jpg';
  if (header.startsWith('47494638')) return 'gif';
  if (header.startsWith('424d')) return 'bmp';
  if (header.startsWith('52494646')) return 'webp';

  return 'png'; // Default to PNG
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
