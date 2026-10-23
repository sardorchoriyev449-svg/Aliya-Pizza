import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDtos } from "./dtos/product-create";
import { ProductUpdateDtos } from "./dtos/product-update.dtos";
import { AuthGuard } from "../../common/guards/auth.guard";
import { Protected } from "../../common/guards/protected.guard";
import type { RequestWithUser } from "../../common/helper/get-user-interface";

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController{
    constructor(
        private readonly service:ProductService,
    ){}

    // Menyuni har kim (login qilmagan mijoz ham) ko'ra olishi kerak — shuning
    // uchun bu ikki route'da @Protected() YO'Q.
    @Get()
    async getAll(){
        return await this.service.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id:string){
        return await this.service.getOne(id)
    }

    @Post()
    @Protected()
    async create(@Body() dtos:CreateProductDtos, @Req() req:RequestWithUser){
        return await this.service.create(dtos, req)
    }

    @Patch(':id')
    @Protected()
    async update(@Body() dtos:ProductUpdateDtos, @Param('id') id:string, @Req() req:RequestWithUser){
        return await this.service.update(id,dtos, req)
    }

    @Delete(':id')
    @Protected()
    async delete(@Param('id') id:string, @Req() req:RequestWithUser){
        return await this.service.delete(id, req)
    }

}