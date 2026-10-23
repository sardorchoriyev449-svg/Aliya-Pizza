import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dtos/order-create.dtos";
import { AuthGuard } from "../../common/guards/auth.guard";
import { Protected } from "../../common/guards/protected.guard";
import type { RequestWithUser } from "../../common/helper/get-user-interface";

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
    constructor(private readonly service: OrderService) {}

    // Buyurtma berish uchun mijoz tizimga kirgan bo'lishi kifoya (admin shart emas)
    @Post()
    @Protected()
    async create(@Body() dto: CreateOrderDto, @Req() req: RequestWithUser) {
        return await this.service.create(dto, req);
    }

    // Statistika va buyurtmalar ro'yxati faqat admin uchun (service ichida tekshiriladi)
    @Get('stats')
    @Protected()
    async stats(@Req() req: RequestWithUser) {
        return await this.service.getStats(req);
    }

    // Foydalanuvchining o'z buyurtmalari ("Buyurtmalarim" sahifasi)
    @Get('mine')
    @Protected()
    async getMine(@Req() req: RequestWithUser) {
        return await this.service.getMine(req);
    }

    @Patch(':id/cancel')
    @Protected()
    async cancel(@Param('id') id: string, @Req() req: RequestWithUser) {
        return await this.service.cancel(id, req);
    }

    @Get()
    @Protected()
    async getAll(@Req() req: RequestWithUser) {
        return await this.service.getAll(req);
    }
}