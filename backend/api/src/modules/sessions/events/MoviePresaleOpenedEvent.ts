import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class MoviePresaleOpenedEvent {
    constructor(
        public readonly movieId: string,

        public readonly sessionId: string,

        public readonly saleOpensAt: Date,
    ) { }
}
