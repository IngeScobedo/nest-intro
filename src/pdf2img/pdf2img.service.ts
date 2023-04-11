import { Injectable } from '@nestjs/common';
import { UpdatePdf2imgDto } from './dto/update-pdf2img.dto';
import { convert } from 'pdf-img-convert';
import { PNG } from 'pngjs/browser';
import { readFile, writeFile } from 'fs';
import jsQR from 'jsqr';
import { InjectContext } from 'nestjs-playwright';
import { BrowserContext } from 'playwright';
import {
  dict,
  options,
  personaFisicaCampos,
  personaMoralCampos,
} from './constants';
import { findBestMatch } from 'string-similarity/browser';

interface pdf2imgResponse {
  error: boolean;
  isConverted: boolean;
}

interface qrCodeResponse {
  error: boolean;
  qrCodeText: string;
}

@Injectable()
export class Pdf2imgService {
  constructor(
    @InjectContext() private readonly browserContext: BrowserContext,
  ) {}

  async pdf2img(file: ArrayBuffer): Promise<pdf2imgResponse> {
    // ArrayBuffer to Buffer
    const buffer = Buffer.from(file);
    // Convert PDF Buffer to images
    const outputImages = await convert(buffer);

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
  }

  async extractQrLink() {
    return new Promise<qrCodeResponse>((resolve, reject) => {
      // Read file and if exists extract url
      readFile('src/pdf/image.png', (err, data) => {
        if (err) {
          console.error(err);
          const error: qrCodeResponse = { error: true, qrCodeText: null };
          reject(error);
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
          const response: qrCodeResponse = { error: false, qrCodeText };
          resolve(response);
        }
      });
    });
  }

  async getUserInfo(link: string) {
    const page = await this.browserContext.newPage();
    await page.goto(link);

    const user = {
      nombre: '',
      cp: '',
      regimen: '',
      situacion: '',
    };

    const rows = page.getByRole('gridcell');
    const count = await rows.count();
    for (let j = 0; j < count; ++j) {
      const row = await rows.nth(j).textContent();
      const nextRow =
        j < count - 1 ? await rows.nth(j + 1).textContent() : null;

      // Buscar la fila en `fieldsToGet`
      const matchingField = personaFisicaCampos.find(
        ([fieldText]) => fieldText === row,
      );
      if (matchingField && nextRow) {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const [_, propertyName] = matchingField;
        user[propertyName] = nextRow;
        console.log(propertyName, nextRow);
      }

      const matchingFieldM = personaMoralCampos.find(
        ([fieldText]) => fieldText === row,
      );
      if (matchingFieldM && nextRow) {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const [_, propertyName] = matchingFieldM;
        user[propertyName] = nextRow;
        console.log(propertyName, nextRow);
      }
    }

    // Obtener el valor de "regimen" del objeto "user" del archivo JSON
    const regimen = user.regimen;

    // Buscar el código correspondiente en el diccionario
    let codigo = dict[regimen];

    if (!codigo) {
      // string similarity
      const mejorOpcion = findBestMatch(regimen, options);
      const regimenMatch = mejorOpcion.bestMatch.target;
      codigo = dict[regimenMatch];
    }

    // Reemplazar el valor de "regimen" con el código correspondiente
    user.regimen = codigo;

    return user;
  }

  update(id: number, updatePdf2imgDto: UpdatePdf2imgDto) {
    return `This action updates a #${id} pdf2img`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdf2img`;
  }
}
