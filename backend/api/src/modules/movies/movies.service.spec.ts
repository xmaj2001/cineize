// import { Test, TestingModule } from '@nestjs/testing';
// import { MoviesService } from './movies.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { NotFoundException } from '@nestjs/common';

// const mockPrisma = {
//   movie: {
//     create: jest.fn(),
//     findMany: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   },
//   exhibition: { findMany: jest.fn() },
//   session: { findMany: jest.fn() },
// };

// describe('MoviesService', () => {
//   let service: MoviesService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MoviesService,
//         { provide: PrismaService, useValue: mockPrisma },
//       ],
//     }).compile();

//     service = module.get<MoviesService>(MoviesService);
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('findOne', () => {
//     it('should return a movie', async () => {
//       const movie = { id: 1, title: 'Avatar' };
//       mockPrisma.movie.findUnique.mockResolvedValue(movie);
//       expect(await service.findOne(1)).toEqual(movie);
//     });

//     it('should throw NotFoundException', async () => {
//       mockPrisma.movie.findUnique.mockResolvedValue(null);
//       await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('remove', () => {
//     it('should soft delete', async () => {
//       mockPrisma.movie.findUnique.mockResolvedValue({ id: 1 });
//       mockPrisma.movie.update.mockResolvedValue({ id: 1, active: false });
//       const result = await service.remove(1);
//       expect(result.active).toBe(false);
//     });
//   });
// });
