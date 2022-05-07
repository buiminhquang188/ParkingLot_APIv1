import { Request, Response } from 'express';
import { ContentType, Controller, Get, Req, Res } from 'routing-controllers';

@Controller()
export class IndexController {
  @Get('/')
  @ContentType('application/json')
  async getIndex(): Promise<any> {
    return 'Ok';
  }

  @Get('/favicon.ico')
  @ContentType('application/json')
  async getIcon(@Req() req: Request, @Res() res: Response): Promise<any> {
    return res.sendStatus(204);
  }
}
