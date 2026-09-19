import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LocationDto {
  @ApiProperty({
    title: "Location ID",
    description: "The unique identifier of the location",
    type: String,
    readOnly: true,
    example: "benguela",
  })
  id: string;

  @ApiProperty({
    title: "Location Name",
    description: "The name of the location",
    type: String,
    example: "cineize Benguela",
  })
  name: string;

  @ApiProperty({
    title: "Location Province",
    description: "The province of the location",
    type: String,
    example: "Benguela",
  })
  province: string;

  @ApiProperty({
    title: "Location City",
    description: "The city of the location",
    type: String,
    example: "Benguela",
  })
  city: string;

  @ApiProperty({
    title: "Latitude",
    description: "Latitude coordinate",
    type: Number,
    example: -12.5763,
  })
  latitude: number;

  @ApiProperty({
    title: "Longitude",
    description: "Longitude coordinate",
    type: Number,
    example: 13.4055,
  })
  longitude: number;

  @ApiPropertyOptional({
    title: "Location Address",
    description: "The address of the location",
    type: String,
    example: "Shopping Xyami Benguela",
  })
  address?: string | null;

  @ApiPropertyOptional({
    title: "Phone",
    description: "The phone number of the location",
    type: String,
    example: "+244 900 000 000",
  })
  phone?: string | null;
}
