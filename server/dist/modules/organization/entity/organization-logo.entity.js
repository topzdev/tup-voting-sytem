"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationLogo = void 0;
const typeorm_1 = require("typeorm");
let OrganizationLogo = class OrganizationLogo extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrganizationLogo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrganizationLogo.prototype, "public_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrganizationLogo.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "cld",
    }),
    __metadata("design:type", String)
], OrganizationLogo.prototype, "service", void 0);
OrganizationLogo = __decorate([
    (0, typeorm_1.Entity)("organization_logo")
], OrganizationLogo);
exports.OrganizationLogo = OrganizationLogo;
//# sourceMappingURL=organization-logo.entity.js.map