import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCatDto: CreateCatDto) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return this.catsService.create(createCatDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('Getting cat with ID:', id);
    return { id, message: 'Cat endpoint working!' };
  }
}
