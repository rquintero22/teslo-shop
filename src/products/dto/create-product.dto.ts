import { IsArray, IsIn, IsNumber, 
         IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @MinLength(1)
    title: string;
    
    @IsNumber()
    @IsOptional()
    @IsPositive()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;
}
