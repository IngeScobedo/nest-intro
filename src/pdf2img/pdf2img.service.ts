import { Injectable } from '@nestjs/common';
import { CreatePdf2imgDto } from './dto/create-pdf2img.dto';
import { UpdatePdf2imgDto } from './dto/update-pdf2img.dto';

@Injectable()
export class Pdf2imgService {
  create(createPdf2imgDto: string) {
    return 'This action adds a new pdf2img' + ' ' + createPdf2imgDto;
  }

  findAll() {
    return `This action returns all pdf2img`;
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
