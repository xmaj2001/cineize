import { ApiProperty } from "@nestjs/swagger";
import { LocationDto } from "./location.dto";

export class RoomDto {
  @ApiProperty({ example: "39a03c09-..." })
  id: string;

  @ApiProperty({ example: "Sala 1 Normal" })
  name: string;

  @ApiProperty({ example: 120 })
  capacity: number;

  @ApiProperty({ example: "D2", enum: ["D2", "D3", "D4X", "IMAX", "VIP"] })
  format: string;
}

export class LocationDetailDto extends LocationDto {
  @ApiProperty({ type: () => [RoomDto], description: "List of rooms available in this location" })
  rooms: RoomDto[];
}
