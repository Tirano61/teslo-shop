import { IsString, MinLength } from 'class-validator';



export class NewMessageDTo {

    @IsString()
    @MinLength(1)
    message: string;
}