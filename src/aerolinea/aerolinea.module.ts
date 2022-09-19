import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';

@Module({
  providers: [AerolineaService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  controllers: [AerolineaController]
})
export class AerolineaModule { }
