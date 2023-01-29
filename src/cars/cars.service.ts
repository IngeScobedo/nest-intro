import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './interfaces/car.interface';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: uuid(),
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: uuid(),
      brand: 'Honda',
      model: 'Civic',
    },
    {
      id: uuid(),
      brand: 'Jeep',
      model: 'Wrangler',
    },
  ];

  findAll(): Car[] {
    return this.cars;
  }

  findOneById(id: string): Car {
    const car = this.cars.find((c) => c.id === id);
    if (!car) throw new NotFoundException(`Car with id ${id} not found`);
    return car;
  }

  create(createCarDto: CreateCarDto): Car {
    const car: Car = {
      id: uuid(),
      ...createCarDto,
    };
    this.cars.push(car);
    return car;
  }

  update(id: string, updateCarDto: UpdateCarDto): Car {
    let carDB = this.findOneById(id);

    if (updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException('Car is is not valid inside body');

    this.cars = this.cars.map((car: Car) => {
      if (car.id === id) {
        carDB = { ...car, ...updateCarDto, id };
        return carDB;
      }
      return car;
    });
    return carDB;
  }

  delete(id: string): void {
    const car = this.findOneById(id);
    this.cars = this.cars.filter((c) => c.id !== car.id);
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
