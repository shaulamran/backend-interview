import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/store')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getStore(@Query() queryParams: Record<string, string>): any[] {
    const query = queryParams.query;
    return this.appService.getStore(query);
  }

  @Post('/')
  postStore(@Body() body: Record<string, string>) {
    this.appService.postStore(body);
  }
}
