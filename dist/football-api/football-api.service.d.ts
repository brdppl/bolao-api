import { ConfigService } from '@nestjs/config';
export declare class FootballApiService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private get headers();
    getFixtures(season?: number): Promise<any[]>;
    getFixtureById(fixtureId: number): Promise<any | null>;
    getLiveFixtures(): Promise<any[]>;
}
