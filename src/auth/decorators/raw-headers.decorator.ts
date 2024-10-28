import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const RawHeaaders  = createParamDecorator( (data, ctx: ExecutionContext) =>{
        
    const req = ctx.switchToHttp().getRequest();
   
    
    return req.rawHeaders ; 
}
);  