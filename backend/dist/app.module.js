"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const korisnik_module_1 = require("./korisnik/korisnik.module");
const jwt_1 = require("@nestjs/jwt");
const auth_guard_1 = require("./common/guards/auth.guard");
const sport_module_1 = require("./sport/sport.module");
const dogadjaj_module_1 = require("./dogadjaj/dogadjaj.module");
const ucesnicidogadjaja_entity_1 = require("./ucesnicidogadjaja/ucesnicidogadjaja.entity");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const ocene_module_1 = require("./ocene/ocene.module");
const schedule_1 = require("@nestjs/schedule");
const tereni_module_1 = require("./tereni/tereni.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([ucesnicidogadjaja_entity_1.Ucesnicidogadjaja]),
            jwt_1.JwtModule.register({
                secret: 'tajna',
                signOptions: { expiresIn: '1d' },
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: 'projekat',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                })
            }),
            korisnik_module_1.KorisnikModule,
            ocene_module_1.OceneModule,
            tereni_module_1.TereniModule,
            passport_1.PassportModule,
            sport_module_1.SportModule,
            dogadjaj_module_1.DogadjajiModule,
            config_1.ConfigModule.forRoot({ isGlobal: true })
        ],
        providers: [auth_guard_1.AuthGuard, jwt_strategy_1.JwtStrategy],
        exports: [jwt_1.JwtModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map