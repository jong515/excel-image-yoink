'use client';

import { ExtractedImage } from '@/lib/types';
import ImageCard from './ImageCard';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ImageGridProps {
  images: ExtractedImage[];
  onClear: () => void;
}

export default function ImageGrid({ images, onClear }: ImageGridProps) {
  const handleDownloadImage = (image: ExtractedImage) => {
    saveAs(image.blob, image.name);
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;

    try {
      const zip = new JSZip();

      // Add all images to the zip
      images.forEach((image) => {
        zip.file(image.name, image.blob);
      });

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });

      // Save the zip file
      saveAs(content, 'extracted-images.zip');
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try downloading images individually.');
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images found in the Excel file.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Summary and Actions */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="text-lg font-semibold text-gray-900">
          Found {images.length} image{images.length !== 1 ? 's' : ''}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownloadAll}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Download All as ZIP
          </button>
          <button
            onClick={onClear}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onDownload={handleDownloadImage} />
        ))}
      </div>
    </div>
  );
}
