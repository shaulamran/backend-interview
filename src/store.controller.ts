import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/')
  getStore(@Query() queryParams: Record<string, string>): any[] {
    const query = queryParams.query;
    return this.storeService.getStore(query);
  }

  @Post('/')
  postStore(@Body() body: Record<string, string>) {
    this.storeService.postStore(body);
  }
}
