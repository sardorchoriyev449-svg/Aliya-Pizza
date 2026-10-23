import { IsNotEmpty, IsString,} from "class-validator"

export class LoginDtos{
    
    @IsString()
    @IsNotEmpty()
    phone:string
    
    @IsString()
    @IsNotEmpty()
    password:string

}