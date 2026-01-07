import ExcelJS from 'exceljs';
import { ExtractedImage, ExtractionResult, ImagePosition } from './types';
import {
  generateImageName,
  columnNumberToLetter,
  getImageExtension
} from './imageNamer';

/**
 * Extracts all images from an Excel file
 */
export async function extractImagesFromExcel(
  file: File,
  onProgress?: (sheetName: string, progress: number) => void
): Promise<ExtractionResult> {
  const workbook = new ExcelJS.Workbook();
  const images: ExtractedImage[] = [];
  const errors: string[] = [];
  let sheetsProcessed = 0;

  try {
    // Load the Excel file
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const totalSheets = workbook.worksheets.length;

    // Process each worksheet
    for (const worksheet of workbook.worksheets) {
      try {
        const sheetName = worksheet.name;

        if (onProgress) {
          onProgress(sheetName, (sheetsProcessed / totalSheets) * 100);
        }

        // Track images per cell to handle multiple images in same location
        const cellImageCount = new Map<string, number>();

        // Extract images from the worksheet
        const worksheetImages = worksheet.getImages();

        for (const imageData of worksheetImages) {
          try {
            // Get the image from the workbook's media
            const imageId = typeof imageData.imageId === 'string'
              ? parseInt(imageData.imageId, 10)
              : imageData.imageId;
            const image = workbook.getImage(imageId);

            if (!image || !image.buffer) {
              errors.push(`Image ${imageData.imageId} in sheet "${sheetName}" has no buffer`);
              continue;
            }

            // Determine image position
            let position: ImagePosition;

            if ('range' in imageData) {
              // Image has a specific cell range
              const range = imageData.range;
              const topLeft = range.tl;

              // Convert column number to letter
              const column = columnNumberToLetter(topLeft.col);
              const row = topLeft.row + 1; // ExcelJS uses 0-based rows

              // Track multiple images in same cell
              const cellKey = `${column}_${row}`;
              const imageIndex = (cellImageCount.get(cellKey) || 0) + 1;
              cellImageCount.set(cellKey, imageIndex);

              position = {
                sheetName,
                column,
                row,
                imageIndex,
              };
            } else {
              // Image doesn't have a specific position, use default
              const imageIndex = (cellImageCount.get('unknown') || 0) + 1;
              cellImageCount.set('unknown', imageIndex);

              position = {
                sheetName,
                column: 'Unknown',
                row: 0,
                imageIndex,
              };
            }

            // Get image extension
            const extension = getImageExtension(image.buffer);

            // Generate filename
            const name = generateImageName(position, extension);

            // Create blob from buffer
            const blob = new Blob([image.buffer], {
              type: `image/${extension}`
            });

            // Create data URL for preview
            const dataUrl = await blobToDataUrl(blob);

            // Get image dimensions if available
            let width = 0;
            let height = 0;
            if (image.extension === 'png' || image.extension === 'jpeg') {
              try {
                const dimensions = await getImageDimensions(dataUrl);
                width = dimensions.width;
                height = dimensions.height;
              } catch (err) {
                // Dimensions not critical, continue without them
              }
            }

            images.push({
              id: `${sheetName}_${position.column}_${position.row}_${position.imageIndex}`,
              name,
              blob,
              dataUrl,
              sheetName: position.sheetName,
              column: position.column,
              row: position.row,
              imageIndex: position.imageIndex,
              width,
              height,
              size: blob.size,
              extension,
            });
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            errors.push(`Error extracting image in sheet "${sheetName}": ${errorMsg}`);
          }
        }

        sheetsProcessed++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Error processing sheet "${worksheet.name}": ${errorMsg}`);
      }
    }

    if (onProgress) {
      onProgress('Complete', 100);
    }

    return {
      images,
      totalImages: images.length,
      sheetsProcessed,
      errors,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to process Excel file: ${errorMsg}`);
  }
}

/**
 * Converts a Blob to a data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Gets image dimensions from a data URL
 */
function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Validates if a file is a valid Excel file
 */
export function isValidExcelFile(file: File): boolean {
  const validExtensions = ['.xlsx', '.xlsm'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
}
