export interface ExtractedImage {
  id: string;
  name: string;
  blob: Blob;
  dataUrl: string;
  sheetName: string;
  column: string;
  row: number;
  imageIndex: number;
  width: number;
  height: number;
  size: number;
  extension: string;
}

export interface ImagePosition {
  sheetName: string;
  column: string;
  row: number;
  imageIndex: number;
  totalImagesInCell: number;
}

export interface ExtractionResult {
  images: ExtractedImage[];
  totalImages: number;
  sheetsProcessed: number;
  errors: string[];
}

export interface ExtractionProgress {
  currentSheet: string;
  sheetsProcessed: number;
  totalSheets: number;
  imagesFound: number;
}
