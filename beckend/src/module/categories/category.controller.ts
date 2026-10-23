import { Controller, Post, Body, Res, Param, Get, Delete, Patch } from "@nestjs/common";
import { CategoryService } from "./category.service";
import type { Response } from "express";
import { CreateCategoryDto } from "./dto/category.dto";
import { UpdateCategoryDto } from "./dto/category.update";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get('all')
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  // 3. Bitta kategoriyani ko'rish
  @Get(':id')
  async getOneCategory(@Param('id') id: string, @Res() res: Response) {
    const category = await this.categoryService.getOne(id, res);
    if (category) return res.json(category);
  }

  // 4. Kategoriyani yangilash
  @Patch('update/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Res() res: Response) {
    return this.categoryService.update(id, dto, res);
  }

  // 5. Kategoriyani o'chirish
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    return this.categoryService.delete(id, res);
  }
}