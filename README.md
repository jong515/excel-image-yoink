# Excel Image Extractor

A web application built with Next.js that extracts embedded images from Excel spreadsheets and labels them based on their location (sheet name, column, row) for easy identification and download.

## Features

- **File Upload**: Drag-and-drop or click to upload Excel files (.xlsx, .xlsm)
- **Image Extraction**: Extracts all images from all worksheets in the workbook
- **Smart Labeling**: Images are named using the format `SheetName_Column_Row_Index.extension`
- **Image Preview**: Grid display with image previews, dimensions, and file sizes
- **Click to Enlarge**: Full-size image viewing in a modal
- **Individual Downloads**: Download any image separately
- **Bulk Download**: Download all images as a ZIP file
- **Progress Tracking**: Real-time progress indicators during extraction
- **Error Handling**: Graceful error handling with detailed warnings

## Naming Convention

Images are automatically named based on their position in the Excel file:

```
{SheetName}_{Column}_{Row}_{ImageIndex}.{extension}
```

**Examples:**
- `Sheet1_A_5_1.png` - First image in cell A5 of Sheet1
- `Summary_C_10_2.jpg` - Second image in cell C10 of Summary sheet
- `Data_B_3_1.gif` - First image in cell B3 of Data sheet

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Excel Parsing**: ExcelJS
- **ZIP Creation**: JSZip
- **File Downloads**: file-saver

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd excel-image-yoink
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload an Excel File**
   - Drag and drop your Excel file (.xlsx or .xlsm) onto the upload area
   - Or click to browse and select a file

2. **Wait for Extraction**
   - The app will process all worksheets
   - Progress is shown in real-time

3. **Preview Images**
   - View all extracted images in a grid
   - See filename, sheet name, position, dimensions, and file size
   - Click any image to view it full-size

4. **Download Images**
   - Click "Download" on any image card to save it individually
   - Click "Download All as ZIP" to get all images in one file
   - Click "Clear" to start over with a new file

## Project Structure

```
excel-image-yoink/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with upload and extraction
│   └── globals.css         # Global styles
├── components/
│   ├── FileUpload.tsx      # File upload with drag-drop
│   ├── ImageCard.tsx       # Individual image preview card
│   └── ImageGrid.tsx       # Grid display with bulk actions
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── imageNamer.ts       # Naming convention logic
│   └── excelExtractor.ts   # Core extraction logic
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies
```

## How It Works

1. **Client-Side Processing**: All Excel processing happens in the browser - no server uploads required
2. **ExcelJS Parsing**: The library reads the Excel file structure and extracts embedded images
3. **Position Detection**: Each image's location is determined from its cell range
4. **Smart Naming**: Filenames are generated based on sheet name, column letter, and row number
5. **Multiple Images**: If multiple images exist in the same cell, they're numbered sequentially

## Troubleshooting

### Windows EPERM Errors

If you encounter permission errors on Windows:

```bash
# Kill all Node processes
taskkill //F //IM node.exe

# Remove build directory
rmdir /S /Q .next

# Restart dev server
npm run dev
```

### No Images Found

- Ensure your Excel file actually contains embedded images
- Images must be inserted into the worksheet (not in headers/footers)
- Supported formats: PNG, JPG, GIF, BMP, WebP

### Build Errors

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
