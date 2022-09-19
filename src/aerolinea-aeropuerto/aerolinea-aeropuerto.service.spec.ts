/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: "325",
        pais: faker.address.country(),
        ciudad: faker.address.city()
      })
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.name.firstName(),
      aeropuertos: aeropuertosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: "325",
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.name.firstName(),
      aeropuertos: aeropuertosList
    })

    const result: AerolineaEntity = await service.addAirportToAirline(newAerolinea.id, newAeropuerto.id);

    expect(result.aeropuertos.length).toBe(6);
  });

  it('addAirportToAirline should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.name.firstName(),
    })

    await expect(() => service.addAirportToAirline(newAerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('addAirportToAirline should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: "325",
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    await expect(() => service.addAirportToAirline("0", newAeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('findAirportFromAirline should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id,)
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toBe(aeropuerto.codigo);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAirportFromAirline should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('findAirportFromAirline should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.findAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('findAirportFromAirline should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: "325",
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    await expect(() => service.findAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea");
  });

  it('findAirportsFromAirline should return aeropuertos by aerolinea', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('updateAirportsFromAirline should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: "325",
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    const updatedAerolinea: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);

    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: "325",
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    await expect(() => service.updateAirportsFromAirline("0", [newAeropuerto])).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('updateAirportsFromAirline should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";

    await expect(() => service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('deleteAirportFromAirline should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];

    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({ where: { id: aerolinea.id }, relations: ["aeropuertos"] });
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();

  });

  it('deleteAirportFromAirline should thrown an exception for an invalid aeropuerto', async () => {
    await expect(() => service.deleteAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.deleteAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: "325",
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    await expect(() => service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea");
  });

});