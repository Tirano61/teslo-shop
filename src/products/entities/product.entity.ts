import { text } from "stream/consumers";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '8ea45a22-f471-4825-987d-c1b71741146b',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 1200,
        description: 'Product price',
        uniqueItems: true
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Irure veniam veniam fugiat reprehenderit nostrud enim reprehenderit exercitation elit consequat.',
        description: 'Product desciption',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug - for SEO',
        default: null
    })
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes',
    })
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: ['women'],
        description: 'Product gender',
    })
    @Column( 'text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?:ProductImage[]

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug){
            this.slug = this.title;
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }    

    @BeforeUpdate()
    checkSlugUpdate(){
        
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
        
    }
}
