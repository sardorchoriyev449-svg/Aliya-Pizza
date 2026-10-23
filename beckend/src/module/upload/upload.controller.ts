import { Controller, Post, Req, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { randomUUID } from "crypto";
import type { Request } from "express";
import { Protected } from "../../common/guards/protected.guard";

@Controller('upload')
@Protected()
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new BadRequestException('Faqat rasm fayllari qabul qilinadi'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        if (!file) {
            throw new BadRequestException('Fayl yuborilmadi');
        }
        // To'liq (absolute) URL qaytaramiz — frontend boshqa portda (masalan 5173)
        // ishlagani uchun nisbiy yo'l ("/uploads/...") noto'g'ri manzilga ishora qilardi.
        const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        return {
            success: true,
            url: fullUrl,
        };
    }
}
