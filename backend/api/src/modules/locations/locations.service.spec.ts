// import { Test, TestingModule } from "@nestjs/testing";
// import { LocationsService } from "./locations.service";
// import { NotFoundException } from "@nestjs/common";
// import { PrismaService } from "src/shared/prisma/prisma.service";

// const mockPrisma = {
//   location: {
//     create: jest.fn(),
//     findMany: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   },
// };

// describe("LocationsService", () => {
//   let service: LocationsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LocationsService,
//         { provide: PrismaService, useValue: mockPrisma },
//       ],
//     }).compile();

//     service = module.get<LocationsService>(LocationsService);
//     jest.clearAllMocks();
//   });

//   it("should be defined", () => {
//     expect(service).toBeDefined();
//   });

//   describe("create", () => {
//     it("should create a location", async () => {
//       const dto = {
//         name: "Luanda",
//         province: "Luanda",
//         latitude: -8.83,
//         longitude: 13.23,
//       };
//       const expected = { id: 1, ...dto, country: "Angola", active: true };
//       mockPrisma.location.create.mockResolvedValue(expected);

//       const result = await service.create(dto);
//       expect(result).toEqual(expected);
//       expect(mockPrisma.location.create).toHaveBeenCalled();
//     });
//   });

//   describe("findOne", () => {
//     it("should return a location", async () => {
//       const location = { id: 1, name: "Luanda" };
//       mockPrisma.location.findUnique.mockResolvedValue(location);
//       expect(await service.findOne(1)).toEqual(location);
//     });

//     it("should throw NotFoundException", async () => {
//       mockPrisma.location.findUnique.mockResolvedValue(null);
//       await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe("remove", () => {
//     it("should soft delete", async () => {
//       mockPrisma.location.findUnique.mockResolvedValue({ id: 1 });
//       mockPrisma.location.update.mockResolvedValue({ id: 1, active: false });
//       const result = await service.remove(1);
//       expect(result.active).toBe(false);
//     });
//   });
// });
