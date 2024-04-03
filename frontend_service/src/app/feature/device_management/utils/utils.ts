import * as qr from 'qrcode'
import { saveAs } from 'file-saver';
import { DownloadFileName } from '../models/device-models';

export async function generateQRCodeFromJSON(jsonData: any): Promise<string> {
  let qrCodeDataUrl = ''
  try {
    const jsonString = JSON.stringify(jsonData);
    qrCodeDataUrl = await generateQRCode(jsonString);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  return qrCodeDataUrl
}


function generateQRCode(data: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    qr.toDataURL(data, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    })
  })
}


export function downloadQRCode(qrCodeDataUrl: string, objectMetaData: DownloadFileName) {
  // Check if qrCodeDataUrl is not available
  if (!qrCodeDataUrl) {
      console.error('QR code data URL is not available.')
      return
  }

  // Extract the data from the data URL
  const base64Image = qrCodeDataUrl.split(';base64,').pop()

  // Check if base64Image is not available
  if (!base64Image) {
      console.error('QR code data URL is invalid.')
      return
  }
  // Create a Blob object from the base64 data
  const blob = new Blob([base64ToArrayBuffer(base64Image)], { type: 'image/png' })

  // Use FileSaver.js to trigger the download. Get the metadata from object to display file name
  saveAs(blob, `${objectMetaData.id}_${objectMetaData.name.replace(/\s+/g, '_')}.png`)
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}