import { Brand } from 'src/brands/entities/brand.entity';
import { v4 as uuid } from 'uuid';

export const BRANDS_SEED: Brand[] = [
  {
    id: uuid(),
    name: 'Toyota',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'Nissan',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'Volvo',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'Lamborghini',
    createdAt: new Date().getTime(),
  },
];
