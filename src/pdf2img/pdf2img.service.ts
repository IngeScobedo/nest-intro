import { Injectable } from '@nestjs/common';
import { UpdatePdf2imgDto } from './dto/update-pdf2img.dto';
import { convert } from 'pdf-img-convert';
import { PNG } from 'pngjs/browser';
import { readFile, writeFile } from 'fs';
import jsQR from 'jsqr';

interface pdf2imgResponse {
  error: boolean;
  isConverted: boolean;
}

@Injectable()
export class Pdf2imgService {
  async pdf2img(file: ArrayBuffer): Promise<pdf2imgResponse> {
    // ArrayBuffer to Buffer
    const buffer = Buffer.from(file);
    // Convert PDF Buffer to images
    const outputImages = await convert(buffer);

    const res: pdf2imgResponse = {
      error: false,
      isConverted: false,
    };
    // save first image containing qr code
    const result = writeFile('src/pdf/image.png', outputImages[0], (err) => {
      if (err) {
        console.error('ERROOOR', { err });
        return { error: true, isConverted: false };
      } else {
        console.log('NO HAY ERROR');
        return { error: false, isConverted: true };
      }
    });

    return new Promise((resolve, reject) => {
      // save first image containing qr code
      writeFile('src/pdf/image.png', outputImages[0], (err) => {
        if (err) {
          console.error('ERROR', { err });
          reject({ error: true, isConverted: false });
        } else {
          console.log('NO HAY ERROR');
          resolve({ error: false, isConverted: true });
        }
      });
    });

    // (async function () {
    //   readFile('src/pdf/image.png', (error, data) => {
    //     if (error) {
    //       console.error(error);
    //     } else if (data) {
    //       // Read png metadata
    //       const png = PNG.sync.read(data);

    //       // Extract qr of the image
    //       const code = jsQR(
    //         Uint8ClampedArray.from(png.data),
    //         png.width,
    //         png.height,
    //       );
    //       const qrCodeText = code?.data;
    //       return qrCodeText;
    //     }
    //   });
    // })();
  }

  extractQr() {
    readFile('src/pdf/image.png', (error, data) => {
      if (error) {
        console.error(error);
        return { error, qrCodeText: null };
      } else if (data) {
        // Read png metadata
        const png = PNG.sync.read(data);

        // Extract qr of the image
        const code = jsQR(
          Uint8ClampedArray.from(png.data),
          png.width,
          png.height,
        );
        const qrCodeText = code?.data;
        return { error: null, qrCodeText };
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} pdf2img`;
  }

  update(id: number, updatePdf2imgDto: UpdatePdf2imgDto) {
    return `This action updates a #${id} pdf2img`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdf2img`;
  }
}
