import {
    Controller,
    Param,
    Get,
    ParseIntPipe
} from '@nestjs/common';

@Controller()
export class DefaultController {
    
    constructor() {}
    
    @Get('/')
    async index() {
        return 'OK';
    }

}
