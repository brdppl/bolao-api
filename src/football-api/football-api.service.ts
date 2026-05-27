import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const WORLD_CUP_2026_ID = 1; // FIFA World Cup 2026 league ID on API-Football

@Injectable()
export class FootballApiService {
  private readonly logger = new Logger(FootballApiService.name);

  constructor(private configService: ConfigService) {}

  private get headers() {
    return {
      'x-apisports-key': this.configService.get<string>('FOOTBALL_API_KEY'),
      'x-apisports-host': this.configService.get<string>('FOOTBALL_API_HOST'),
    };
  }

  async getFixtures(season = 2026): Promise<any[]> {
    try {
      const { data } = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: this.headers,
        params: { league: WORLD_CUP_2026_ID, season },
      });
      return data.response ?? [];
    } catch (err) {
      this.logger.error('Failed to fetch fixtures', err.message);
      return [];
    }
  }

  async getFixtureById(fixtureId: number): Promise<any | null> {
    try {
      const { data } = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: this.headers,
        params: { id: fixtureId },
      });
      return data.response?.[0] ?? null;
    } catch (err) {
      this.logger.error(`Failed to fetch fixture ${fixtureId}`, err.message);
      return null;
    }
  }

  async getLiveFixtures(): Promise<any[]> {
    try {
      const { data } = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: this.headers,
        params: { league: WORLD_CUP_2026_ID, live: 'all' },
      });
      return data.response ?? [];
    } catch (err) {
      this.logger.error('Failed to fetch live fixtures', err.message);
      return [];
    }
  }
}
