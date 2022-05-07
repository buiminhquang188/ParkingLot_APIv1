import httpStatus from 'http-status';
import { HttpException } from '@exceptions/HttpException';
import { Controller, Get, ContentType } from 'routing-controllers';
import { NextFunction } from 'express';

@Controller()
export class IndexController {
  @Get('/')
  @ContentType('application/json')
  async getIndex(): Promise<any> {
    return 'Ok';
  }

  // @Get('/favicon.ico')
  // @ContentType('application/json')
  // async getIcon(): Promise<any> {
  //   return 'Ok';
  // }
}
