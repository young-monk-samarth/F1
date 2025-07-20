const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export interface Driver {
  driverId: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time?: string;
}

export const f1Api = {
  async getCurrentDriverStandings(): Promise<DriverStanding[]> {
    try {
      const response = await fetch(`${BASE_URL}/current/driverStandings.json`);
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      return [];
    }
  },

  async getCurrentRaceSchedule(): Promise<Race[]> {
    try {
      const response = await fetch(`${BASE_URL}/current.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races || [];
    } catch (error) {
      console.error('Error fetching race schedule:', error);
      return [];
    }
  },

  async getNextRace(): Promise<Race | null> {
    try {
      const races = await this.getCurrentRaceSchedule();
      const now = new Date();
      const nextRace = races.find(race => new Date(race.date) > now);
      return nextRace || null;
    } catch (error) {
      console.error('Error fetching next race:', error);
      return null;
    }
  },

  async getDriverImage(driverId: string): Promise<string> {
    // Using a fallback image service for driver photos
    return `https://ui-avatars.com/api/?name=${driverId}&background=dc2626&color=ffffff&size=200&font-size=0.6`;
  }
};