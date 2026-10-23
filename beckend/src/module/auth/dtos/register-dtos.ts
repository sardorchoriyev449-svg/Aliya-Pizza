import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator"

export class RegisterDtos{
    
    @IsString()
    @MinLength(3)
    name:string
    
    @IsNumber()
    @IsNotEmpty()
    @Min(16)
    age:number
    
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(9)
    phone:string
    
    @IsString()
    @IsNotEmpty()
    password:string

}