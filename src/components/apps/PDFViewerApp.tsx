import React from 'react';
import { FileText, Download } from 'lucide-react';

interface PDFViewerProps {
  windowId: string;
  pdfSrc?: string;
  fileName?: string;
}

export const PDFViewerApp: React.FC<PDFViewerProps> = ({ pdfSrc, fileName }) => {
  const handleDownload = () => {
    if (pdfSrc) {
      const link = document.createElement('a');
      link.href = pdfSrc;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // If no PDF source provided, show default message
  if (!pdfSrc) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No PDF Selected</h2>
          <p className="text-gray-500">Please select a PDF file to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with file name and download button */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-500" />
          <span className="font-medium">{fileName || 'PDF Document'}</span>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* PDF Embed */}
      <div className="flex-1">
        <embed
          src={pdfSrc}
          type="application/pdf"
          width="100%"
          height="100%"
          className="border-0"
        />
      </div>
    </div>
  );
};