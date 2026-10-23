import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./model/category.model";
import type { Response } from "express";
import { CreateCategoryDto } from "./dto/category.dto";
import { UpdateCategoryDto } from "./dto/category.update";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existingCategory = await this.categoryModel.findOne({ name: dto.name });
    if (existingCategory) return {success:false, message:`Bunday nomda categorya bor!`}

    const newCategory = new this.categoryModel(dto);
    return await newCategory.save(); 
  }
  async getAll() {
    return await this.categoryModel.find().lean().exec();
  }

  async getOne(id: string, res: Response) {
    try {
      const category = await this.categoryModel.findById(id).lean().exec();

      if (!category) return {success:false, message:`Topilmadi!`}

      return {success:true, date:category};
    } catch (error) {
      return res.redirect(`/?message=Kategoriyani qidirishda xatolik yuz berdi.`);
    }
  }

  async update(id: string, dto: UpdateCategoryDto, res: Response) {
    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();

      if (!updatedCategory) return {success:false, message:`Topilmadi!`}

        return {success:true, messeage:`Mufaqayatli Yangilandi!`}
    } catch (error:any) {
      throw new Error(error?.message);
    }
  }

  async delete(id: string, res: Response) {
    try {
      const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();

      if (!deletedCategory) return {success:false, message:`Topilmadi!`}

      return {success:true, messeage:`Mufaqayatli Tozalandi!`}

    } catch (error:any) {
      throw new Error(error?.message)
    }
  }
}