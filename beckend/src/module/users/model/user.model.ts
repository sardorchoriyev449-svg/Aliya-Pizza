import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { UserRole } from "../../../common/helper/role.types";

@Schema({collection:'user', timestamps:true, versionKey:false})
export class User {
    @Prop({type:SchemaTypes.String, required:true})
    name:string

    @Prop({type:SchemaTypes.Number, required:true})
    age:number
    
    @Prop({type:SchemaTypes.String, required:true})
    phone:string

    @Prop({type:SchemaTypes.String, required:true})
    password:string

    @Prop({type:SchemaTypes.String, enum:UserRole, default:UserRole.user})
    role:UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)