import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './interfaces/car.interface';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}
  @Get()
  getAllCars(): Car[] {
    return this.carsService.findAll();
  }

  @Get(':id')
  getCarById(@Param('id', ParseUUIDPipe) id: string): Car {
    return this.carsService.findOneById(id);
  }

  @Post()
  createCar(@Body() createCarDto: CreateCarDto): Car {
    return this.carsService.create(createCarDto);
  }

  @Patch(':id')
  updateCar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Car {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  deleteCar(@Param('id') id: string): void {
    return this.carsService.delete(id);
  }
}
