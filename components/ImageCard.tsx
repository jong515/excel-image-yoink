'use client';

import { ExtractedImage } from '@/lib/types';
import { formatFileSize } from '@/lib/imageNamer';
import { useState } from 'react';

interface ImageCardProps {
  image: ExtractedImage;
  onDownload: (image: ExtractedImage) => void;
}

export default function ImageCard({ image, onDownload }: ImageCardProps) {
  const [showFullSize, setShowFullSize] = useState(false);

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Image Preview */}
        <div
          className="relative h-48 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setShowFullSize(true)}
        >
          <img
            src={image.dataUrl}
            alt={image.name}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Click to enlarge
          </div>
        </div>

        {/* Image Info */}
        <div className="p-4">
          <div className="mb-2">
            <p className="text-sm font-semibold text-gray-900 truncate" title={image.name}>
              {image.name}
            </p>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Sheet:</span>
              <span className="font-medium">{image.sheetName}</span>
            </div>
            <div className="flex justify-between">
              <span>Position:</span>
              <span className="font-medium">
                {image.column}{image.row > 0 ? image.row : ''}
              </span>
            </div>
            {image.width > 0 && image.height > 0 && (
              <div className="flex justify-between">
                <span>Dimensions:</span>
                <span className="font-medium">
                  {image.width} × {image.height}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{formatFileSize(image.size)}</span>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={() => onDownload(image)}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* Full Size Modal */}
      {showFullSize && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullSize(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowFullSize(false)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            >
              ×
            </button>
            <img
              src={image.dataUrl}
              alt={image.name}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded">
              <p className="text-sm font-medium">{image.name}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
