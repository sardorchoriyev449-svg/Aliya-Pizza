import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from '../users/model/user.model'
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name, schema:UserSchema}]),
    ],
    controllers:[AuthController],
    providers:[AuthService, JwtModule],
})
export class AuthModule{}