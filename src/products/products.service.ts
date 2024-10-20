import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUuid } from 'uuid'
import { ProductImage } from './entities/product-image.entity';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ){}

  async create(createProductDto: CreateProductDto) {
    
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( (image) => this.productImageRepository.create({ url: image}))
      });
      await this.productRepository.save(product);
      return { ...product, images };

    } catch (error) {
      this.handlerDBException(error);
    }
  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let product: Product;
    if( isUuid(term) ){
      product = await this.productRepository.findOneBy({id: term})
    }else{
      //product = await this.productRepository.findOneBy({slug: term})
      const queryBuilder = this.productRepository.createQueryBuilder();

      product = await queryBuilder.where(' UPPER(title)=:title or slug=:slug ',{
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();
    }
    
    if(!product)
      throw new NotFoundException(`Product with id ${ term } not fount`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    });

    if( !product ) throw new NotFoundException(`Product with id ${ id } not found`)
    
    try {
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handlerDBException(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    
    await this.productRepository.remove( product );
  }

  private handlerDBException(error: any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
