import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Get, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { strict } from 'assert';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';



@Controller('files')
export class FilesController {
  constructor(
    private readonly configServise: ConfigService,
    private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage( 
    @Res() res: Response, 
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage( imageName ); 

    res.sendFile( path );
    
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    limits: { fileSize: 100000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )

  uploadProductImage( @UploadedFile() file: Express.Multer.File){

    if( !file ){
      throw new BadRequestException('Make sure that file is an image')
    }

    const secureUrl = `${ this.configServise.get('HOST_API')}/files/product/${file.filename}`;

    return {secureUrl};
  }
 
}
