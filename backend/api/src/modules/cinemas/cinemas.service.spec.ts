// import { Test, TestingModule } from '@nestjs/testing';
// import { CinemasService } from './cinemas.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { NotFoundException } from '@nestjs/common';

// const mockPrisma = {
//   cinema: {
//     create: jest.fn(),
//     findMany: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   },
//   hall: { findMany: jest.fn() },
//   session: { findMany: jest.fn() },
// };

// describe('CinemasService', () => {
//   let service: CinemasService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CinemasService,
//         { provide: PrismaService, useValue: mockPrisma },
//       ],
//     }).compile();

//     service = module.get<CinemasService>(CinemasService);
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('findOne', () => {
//     it('should throw NotFoundException when not found', async () => {
//       mockPrisma.cinema.findUnique.mockResolvedValue(null);
//       await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
