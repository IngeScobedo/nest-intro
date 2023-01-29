import { IsString, MinLength } from 'class-validator';
// import { PartialType } from '@nestjs/mapped-types';
// import { IsUUID } from 'class-validator';
// import { CreateBrandDto } from './create-brand.dto';

// export class UpdateBrandDto extends PartialType(CreateBrandDto) {
//   @IsUUID()
//   readonly id: number;
// }

export class UpdateBrandDto {
  @IsString()
  @MinLength(1)
  name: string;
}
