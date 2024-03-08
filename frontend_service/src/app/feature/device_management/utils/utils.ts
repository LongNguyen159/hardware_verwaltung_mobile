import { DeviceService } from "../service/device.service";

export async function generateQRCodeFromJSON(deviceService: DeviceService,jsonData: any): Promise<string> {
    let qrCodeDataUrl = ''
    try {
      const jsonString = JSON.stringify(jsonData);
      qrCodeDataUrl = await deviceService.generateQRCode(jsonString);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
    return qrCodeDataUrl
}