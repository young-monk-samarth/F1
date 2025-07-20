import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Flag } from 'lucide-react';
import { f1Api, Race } from '../services/f1Api';
import { Card } from './ui/card';

export const RaceCalendar = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      try {
        const data = await f1Api.getCurrentRaceSchedule();
        setRaces(data);
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
    const interval = setInterval(fetchRaces, 60000);
    return () => clearInterval(interval);
  }, []);

  const isRaceUpcoming = (raceDate: string) => {
    return new Date(raceDate) > new Date();
  };

  const isRaceToday = (raceDate: string) => {
    const today = new Date().toDateString();
    return new Date(raceDate).toDateString() === today;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section 
        id="calendar" 
        className="pt-32 pb-20 px-4 md:px-6 bg-secondary/50"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Race Calendar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 md:h-64 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="calendar" 
      className="pt-32 pb-20 px-4 md:px-6 bg-secondary/50"
    >
      <div className="container mx-auto">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-f1"
        >
          Race Calendar
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {races.map((race, index) => (
            <motion.div
              key={race.round}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className={`p-4 md:p-6 h-full transition-all duration-300 border-2 ${
                isRaceToday(race.date) 
                  ? 'border-red-500 bg-primary/10 shadow-lg shadow-primary/20' 
                  : isRaceUpcoming(race.date)
                  ? 'border-red-400 hover:border-red-600'
                  : 'border-white opacity-60'
              }`}>
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="text-xs md:text-sm text-muted-foreground">Round {race.round}</span>
                  </div>
                  {isRaceToday(race.date) && (
                    <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded-full">
                      <Flag className="w-3 h-3" />
                      <span className="text-xs font-bold">TODAY</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">
                  {race.raceName}
                </h3>

                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatDate(race.date)}</span>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground mb-1">
                    {race.Circuit.circuitName}
                  </div>
                  {race.time && (
                    <div className="text-xs">
                      Race Time: {race.time}
                    </div>
                  )}
                </div>

                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
                  <div className={`text-xs font-semibold ${
                    isRaceToday(race.date) 
                      ? 'text-red-500' 
                      : isRaceUpcoming(race.date)
                      ? 'text-red-400'
                      : 'text-white'
                  }`}>
                    {isRaceToday(race.date) 
                      ? 'Race Day!' 
                      : isRaceUpcoming(race.date)
                      ? 'Upcoming'
                      : 'Completed'}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};