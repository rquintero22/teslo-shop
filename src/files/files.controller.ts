import { Response } from 'express';
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
              private readonly configSrv: ConfigService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string) 
  {
    const path = this.filesService.getStaticProductImage(imageName);

    res.status(403).json({
      ok: false,
      path
    });

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 }
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      })
    })
  )
  uploadProductFile(
    @UploadedFile()
    file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException(`Make sure that file is an image`);
      }

      // const secureUrl = `${file.filename}`;
      const secureUrl = `${this.configSrv.get('HOST_API')}/files/product/${ file.filename }`;
    return {
      secureUrl
    };
  }
  
}
