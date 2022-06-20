"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const store_module_1 = require("./store.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(store_module_1.StoreModule);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map