import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStore(queryParams: Record<string, string>): any[];
    postStore(body: Record<string, string>): void;
}
