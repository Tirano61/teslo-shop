import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
        nullable: false,
    })
    email: string;

    @Column('text', {nullable: false})
    password: string;

    @Column('text',{nullable: false})
    fullName: string;

    @Column('bool', {default: true})
    isActive: boolean;

    @Column('text',{
        //nullable:false, 
        array: true,
        default: ['user']
    })
    roles: string[];


}
