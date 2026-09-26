// import { Test, TestingModule } from '@nestjs/testing';
// import { SessionsService } from './sessions.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { NotFoundException, BadRequestException } from '@nestjs/common';

// const mockPrisma = {
//   hall: { findUnique: jest.fn() },
//   movie: { findUnique: jest.fn() },
//   session: {
//     create: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   },
//   seat: { findMany: jest.fn() },
//   ticket: { findMany: jest.fn() },
// };

// describe('SessionsService', () => {
//   let service: SessionsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SessionsService,
//         { provide: PrismaService, useValue: mockPrisma },
//       ],
//     }).compile();

//     service = module.get<SessionsService>(SessionsService);
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should reject past dates', async () => {
//       mockPrisma.hall.findUnique.mockResolvedValue({ id: 1, capacity: 100 });
//       mockPrisma.movie.findUnique.mockResolvedValue({ id: 1, basePrice: 500 });
//       await expect(
//         service.create({
//           movieId: 1,
//           hallId: 1,
//           startDateTime: '2020-01-01T10:00:00Z',
//         }),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe('findOne', () => {
//     it('should throw NotFoundException', async () => {
//       mockPrisma.session.findUnique.mockResolvedValue(null);
//       await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
