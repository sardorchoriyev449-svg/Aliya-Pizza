import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class OrderItemDto {
    @IsMongoId()
    product_id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    price: number;

    @IsNumber()
    @Min(1)
    qty: number;
}

export class OrderAddressDto {
    @IsString()
    @IsNotEmpty()
    label: string;

    @IsString()
    @IsNotEmpty()
    address_text: string;

    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsNumber()
    @IsNotEmpty()
    lng: number;
}

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ValidateNested()
    @Type(() => OrderAddressDto)
    address: OrderAddressDto;
}