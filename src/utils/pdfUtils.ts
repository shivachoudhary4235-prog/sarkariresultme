/**
 * PDF Helper Utilities
 * Converts base64 Data URLs to proper Blob Object URLs.
 * Chrome and modern browsers block top-level navigation to data: URLs (resulting in a blank dark screen).
 * Blob URLs (blob:http://...) allow native PDF rendering, printing, and downloading.
 */

export function createPdfBlob(dataUrl: string): Blob | null {
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const cleanBase64 = parts[1].replace(/\s/g, '');
    const binaryStr = atob(cleanBase64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  } catch (err) {
    console.error('Failed to create PDF blob from data URL:', err);
    return null;
  }
}

export function openPdfInBrowser(dataUrlOrUrl: string, fileName = 'Official_Notice.pdf'): void {
  if (!dataUrlOrUrl) return;

  if (dataUrlOrUrl.startsWith('data:')) {
    const blob = createPdfBlob(dataUrlOrUrl);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        // Fallback if popup blocked
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 180000);
      return;
    }
  }

  // Regular HTTP/HTTPS URL
  window.open(dataUrlOrUrl, '_blank', 'noopener,noreferrer');
}

export function downloadPdfFile(dataUrlOrUrl: string, fileName = 'Official_Notification.pdf'): void {
  if (!dataUrlOrUrl) return;
  const safeName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  if (dataUrlOrUrl.startsWith('data:')) {
    const blob = createPdfBlob(dataUrlOrUrl);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    }
  }

  // External URL download
  const link = document.createElement('a');
  link.href = dataUrlOrUrl;
  link.target = '_blank';
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
