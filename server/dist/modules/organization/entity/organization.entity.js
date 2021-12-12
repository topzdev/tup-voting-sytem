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
exports.Organization = void 0;
const typeorm_1 = require("typeorm");
const timestamp_inherit_1 = require("../../../entity/timestamp.inherit");
const organization_logo_entity_1 = require("./organization-logo.entity");
let Organization = class Organization extends timestamp_inherit_1.Timestamp {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Organization.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
    }),
    __metadata("design:type", String)
], Organization.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organization.prototype, "ticker", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organization.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], Organization.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Organization.prototype, "archive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "blue",
    }),
    __metadata("design:type", String)
], Organization.prototype, "themePrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "pink",
    }),
    __metadata("design:type", String)
], Organization.prototype, "themeSecondary", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => organization_logo_entity_1.OrganizationLogo),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", organization_logo_entity_1.OrganizationLogo)
], Organization.prototype, "logo", void 0);
Organization = __decorate([
    (0, typeorm_1.Entity)("organization")
], Organization);
exports.Organization = Organization;
//# sourceMappingURL=organization.entity.js.map