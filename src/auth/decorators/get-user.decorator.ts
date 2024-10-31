import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "./../entities/user.entity";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";


export const GetUser  = createParamDecorator( (data, ctx: ExecutionContext) =>{
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
      
        if( !user )
                throw new InternalServerErrorException('User not found (request)');
       
        
        return !data ? user : user[data]; 
    }
);  
