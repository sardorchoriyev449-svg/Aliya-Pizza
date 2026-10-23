import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../users/model/user.model";
import { Model } from "mongoose";
import { RegisterDtos } from "./dtos/register-dtos";
import { LoginDtos } from "./dtos/login-dtos"
import bcrypt from 'bcrypt'
import type { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "../../common/helper/role.types";
import { getAccessTime, getAccessToken, getRefreshTime, getRefreshToken } from "../../common/config/tokens.config";
import { getAdminPassword, getAdminPhone } from "../../common/config/admin.config";


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly method: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async register(dto: RegisterDtos, res: Response) {
        try {
            const admin = await this.method.findOne({ role: UserRole.admin });
            if (!admin) await this.adminSeed();

            console.log(dto);

            const phone = `+998${dto.phone}`;
            const user = await this.method.findOne({ phone:phone });

            if (user) {
                return {
                    success:false,
                    message:`${dto.phone} nomer ro\'yxatan o\'tgan`
                }
            }

            const hassPass = await this.heshPass(dto.password);
            const newUser = await this.method.create({ ...dto, phone: phone, password: hassPass });

            console.log(newUser);

            const accessToken = await this.accessGenerateToken({ id: newUser._id, role: newUser.role });
            res.cookie('accessToken', accessToken, {
                signed: true,
                httpOnly: true,
                maxAge: 15 * 60 * 1000, 
            });

            const refreshToken = await this.refreshGenerateToken({ id: newUser._id, role: newUser.role });
            res.cookie('refreshToken', refreshToken, {
                signed: true,
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
            });

            return {
                success:true,
                message:`Ro\'yxatan Mufaqayatli O\'tildi`
            };

        } catch (error: any) {
            throw new Error(`Error: ${error?.message}`)
        }
    }

    async login(dto: LoginDtos, res: Response) {

        const admin = await this.method.findOne({ role: UserRole.admin })
        if (!admin) await this.adminSeed();
        console.log(dto);

        const phone = `+998${dto.phone}`
        const user = await this.method.findOne({ phone: phone })

        if (!user) return {success:false, message:`Nomer ro\'yxatan o\'tmagan!`}

        const isSame = await this.compare(dto.password, user.password)

        if (!isSame) return {success:false, message:`Parol notogri..!`}

        const accessToken = await this.accessGenerateToken({ id: user._id, role: user.role });
        res.cookie('accessToken', accessToken, {
            signed: true,
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });

        const refreshToken = await this.refreshGenerateToken({ id: user._id, role: user.role });
        res.cookie('refreshToken', refreshToken, {
            signed: true,
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });
        res.redirect('/')
    }

    private async adminSeed() {
        const pass = getAdminPassword();
        const phone = getAdminPhone();

        if (!pass) {
            throw new Error("Kritik xato: SECRET_ADMIN_PASS topilmadi! .env faylini tekshiring.");
        }

        const heshPass = await this.heshPass(pass);
        await this.method.create({
            name: 'ADMIN',
            age: 20,
            phone: phone,
            password: heshPass,
            role: UserRole.admin,
        });
    }
    async logout(res: Response) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return ;
    }
    async getMe(userId: string) {
        const user = await this.method.findById(userId).select('-password');
        if (!user) return { success:false, message: 'Foydalanuvchi topilmadi' };
        return { success:true, data: user };
    }
    async getAdminContact() {
        const admin = await this.method.findOne({ role: UserRole.admin });
        if (!admin) return { success:false, message: 'Admin topilmadi' };
        return { success:true, phone: admin.phone };
    }
    private async heshPass(pass: string) {
        const hassPass = await bcrypt.hash(pass, 10)
        return hassPass
    }
    private async compare(orgPass: string, hashPass: string) {
        const isSame = await bcrypt.compare(orgPass, hashPass)
        return isSame
    }

    private async accessGenerateToken(payload: any): Promise<string> {
        const token = await this.jwtService.signAsync(payload, {
            secret: getAccessToken(),
            expiresIn: getAccessTime(),
        })
        return token
    }
    private async refreshGenerateToken(payload: any): Promise<string> {
        const token = await this.jwtService.signAsync(payload, {
            secret: getRefreshToken(),
            expiresIn: getRefreshTime() as any,
        })
        return token
    }

}