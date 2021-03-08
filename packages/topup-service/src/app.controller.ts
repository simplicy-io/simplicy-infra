import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return this.appService.getRoot();
  }

  @Get('info')
  async getInfo() {
    return await this.appService.getInfo();
  }

  // @All('webhook/*')
  // wildcardWebhook(@Req() req) {
  //   console.log({
  //     body: req.body,
  //     params: req.params,
  //     query: req.query,
  //     headers: req.headers,
  //     method: req.method,
  //   });
  //   return { success: true };
  // }
}
