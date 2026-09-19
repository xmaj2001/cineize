import { Module } from "@nestjs/common";
import { PublicLocationsController } from "./controllers/client.controller";
import { LocationClientService } from "./services/location-client.service";

@Module({
  imports: [],
  controllers: [PublicLocationsController],
  providers: [LocationClientService],
})
export class LocationsModule {}
