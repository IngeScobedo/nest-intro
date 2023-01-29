import { Car } from 'src/cars/interfaces/car.interface';
import { v4 as uuid } from 'uuid';

export const CARS_SEED: Car[] = [
  {
    id: uuid(),
    brand: 'Toyota',
    model: 'Collora',
  },
  {
    id: uuid(),
    brand: 'Nissan',
    model: 'GTR',
  },
  {
    id: uuid(),
    brand: 'Toyota',
    model: 'Supra',
  },
];
