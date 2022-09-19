import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

@Module({
  providers: [AerolineaAeropuertoService],
  controllers: [AerolineaAeropuertoController],
  imports: [
    TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity]),
  ],
})
export class AerolineaAeropuertoModule {}
