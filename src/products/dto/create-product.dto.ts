import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNumber, 
         IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        default: '001',
        description: 'Product Type'
    })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiProperty({
        description: 'Product Title',
        nullable: false,
        minLength: 3
    })
    @IsString()
    @MinLength(1)
    title: string;
    
    @ApiProperty({
        description: 'Product Price',
        nullable: false
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    price?: number;

    @ApiProperty({
        description: 'Product Description',
        nullable: true
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product Slug',
        nullable: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Product Stock',
        nullable: false
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @ApiProperty({
        description: 'Product Sizes',
        nullable: false        
    })
    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product Gender',
        nullable: false
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Product Tags',
        nullable: true
    })
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags: string[];
    
    @ApiProperty({
        description: 'Product Images',
        nullable: true
    })
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];

}
