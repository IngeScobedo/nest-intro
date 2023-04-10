import { PartialType } from '@nestjs/mapped-types';
import { CreatePdf2imgDto } from './create-pdf2img.dto';

export class UpdatePdf2imgDto extends PartialType(CreatePdf2imgDto) {
  id: number;
}
