import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./model/user.model";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Address, AddressSchema } from "../addres/model/address.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }, 
            { name: Address.name, schema: AddressSchema 
        }]),
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }