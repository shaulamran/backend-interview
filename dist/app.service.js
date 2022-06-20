"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const expressionToTree_1 = require("./expression-parser/expressionToTree");
let AppService = class AppService {
    constructor() {
        this.memoryStore = new Array({ shaul: 'dak' });
    }
    getStore(query) {
        const result = this.memoryStore.filter((obj) => (0, expressionToTree_1.default)(query, obj).calc());
        return result;
    }
    postStore(objToSave) {
        const existingObject = this.memoryStore.find(obj => parseInt(obj.id) == parseInt(objToSave.id));
        console.log(existingObject);
        if (existingObject) {
            this.memoryStore = this.memoryStore.filter(obj => obj.id !== objToSave.id);
        }
        this.memoryStore.push(objToSave);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map