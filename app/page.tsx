'use client';

import { useState, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import ImageGrid from '@/components/ImageGrid';
import { ExtractedImage } from '@/lib/types';
import { extractImagesFromExcel } from '@/lib/excelExtractor';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: '', percent: 0 });
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setImages([]);
    setError(null);
    setWarnings([]);
    setIsProcessing(true);
    setProgress({ current: 'Starting extraction...', percent: 0 });

    try {
      const result = await extractImagesFromExcel(
        file,
        (sheetName, percent) => {
          setProgress({
            current: `Processing: ${sheetName}`,
            percent: Math.round(percent),
          });
        }
      );

      setImages(result.images);

      if (result.errors.length > 0) {
        setWarnings(result.errors);
      }

      if (result.totalImages === 0) {
        setError('No images found in the Excel file.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
      setProgress({ current: '', percent: 0 });
    }
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setImages([]);
    setError(null);
    setWarnings([]);
    setProgress({ current: '', percent: 0 });
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Excel Image Extractor
          </h1>
          <p className="text-lg text-gray-600">
            Extract all images from Excel spreadsheets with proper labeling
          </p>
        </div>

        {/* File Upload or File Info */}
        {!selectedFile && !isProcessing && images.length === 0 ? (
          <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />
        ) : (
          <div className="mb-8">
            {/* File Info Bar */}
            {selectedFile && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-600">File:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={handleClear}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Upload Different File
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                  <p className="text-lg font-medium text-gray-900">
                    Extracting images...
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-2">{progress.current}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress.percent}% complete</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-red-800 mb-1">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  Warnings ({warnings.length})
                </p>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="list-disc list-inside space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-700">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Image Grid */}
            {!isProcessing && images.length > 0 && (
              <ImageGrid images={images} onClear={handleClear} />
            )}
          </div>
        )}

        {/* Instructions */}
        {!selectedFile && !isProcessing && images.length === 0 && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Upload your Excel file (.xlsx or .xlsm)</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Wait for images to be extracted and processed</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Preview images with their sheet name, column, and row location</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">4.</span>
                <span>Download individual images or all images as a ZIP file</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Naming Format:</span> Images are named as{' '}
                <code className="bg-blue-100 px-1 rounded">
                  SheetName_Column_Row_Index.extension
                </code>
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Example: <code className="bg-blue-100 px-1 rounded">Sheet1_A_5_1.png</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
