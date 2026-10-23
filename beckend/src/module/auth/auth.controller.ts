import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDtos } from "./dtos/register-dtos";
import type { Response } from "express";
import { LoginDtos } from "./dtos/login-dtos";
import { Protected } from "../../common/guards/protected.guard";
import type { RequestWithUser } from "../../common/helper/get-user-interface";

@Controller()
export class AuthController{
    constructor(
        private readonly service:AuthService,
    ){}

    @Post('sign-up')
    async regiseter(@Body() dtos:RegisterDtos, @Res({ passthrough: true }) res:Response){
        return await this.service.register(dtos,res)
    }
    @Post('sign-in')
    async login(@Body() dtos:LoginDtos, @Res({ passthrough: true }) res:Response){
        return await this.service.login(dtos,res)
    }
    @Post('logout')
    async logout(@Res({ passthrough: true }) res:Response){
        return await this.service.logout(res)
    }
    // Frontend joriy foydalanuvchining ismi/rolini bilishi uchun (masalan,
    // Admin tugmasini faqat haqiqiy adminlarga ko'rsatish uchun)
    @Get('me')
    @Protected()
    async me(@Req() req: RequestWithUser){
        return await this.service.getMe(req.user.id)
    }
    // Mijozlar murojaat qilishi uchun admin telefon raqami — hech qanday
    // login talab qilinmaydi, chunki buyurtma tasdiqlash ekranida ham ko'rsatiladi.
    @Get('contact-phone')
    async contactPhone(){
        return await this.service.getAdminContact()
    }
}