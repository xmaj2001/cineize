import { ApiProperty } from "@nestjs/swagger";
import { MovieCardDto } from "./movie-card.dto";

export class HomeFeedDto {
  @ApiProperty({ type: () => [MovieCardDto] })
  featured: MovieCardDto[];

  @ApiProperty({ type: () => [MovieCardDto] })
  nowShowing: MovieCardDto[];

  @ApiProperty({ type: () => [MovieCardDto] })
  presale: MovieCardDto[];

  @ApiProperty({ type: () => [MovieCardDto] })
  comingSoon: MovieCardDto[];
}
