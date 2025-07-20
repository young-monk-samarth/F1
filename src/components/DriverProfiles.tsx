import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Calendar, MapPin, Star, Medal, Award } from 'lucide-react';
import { f1Api, DriverStanding } from '../services/f1Api';
import { Card } from './ui/card';

export const DriverProfiles = () => {
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverStanding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      const data = await f1Api.getCurrentDriverStandings();
      setDrivers(data);
      setLoading(false);
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDriverStats = (driver: DriverStanding) => {
    const age = new Date().getFullYear() - new Date(driver.Driver.dateOfBirth).getFullYear();
    return {
      age,
      careerPoints: driver.points,
      wins: driver.wins,
      position: driver.position
    };
  };

  const getPositionBadge = (position: string) => {
    if (position === '1') return { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (position === '2') return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/20' };
    if (position === '3') return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/20' };
    return { icon: Star, color: 'text-muted-foreground', bg: 'bg-muted/20' };
  };

  if (loading) {
    return (
      <section id="drivers" className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient font-f1">Driver Profiles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="drivers" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 text-gradient font-f1"
        >
          Driver Profiles 2024
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {drivers.map((driver, index) => {
            const stats = getDriverStats(driver);
            const badge = getPositionBadge(driver.position);
            const IconComponent = badge.icon;

            return (
              <motion.div
                key={driver.Driver.driverId}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedDriver(driver)}
                className="cursor-pointer"
              >
                <Card className="p-6 h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
                  {/* Position Badge */}
                  <div className={`inline-flex items-center space-x-2 ${badge.bg} ${badge.color} px-3 py-1 rounded-full text-sm font-bold mb-4`}>
                    <IconComponent size={16} />
                    <span>P{driver.position}</span>
                  </div>

                  {/* Driver Image */}
                  <div className="relative mb-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${driver.Driver.givenName}+${driver.Driver.familyName}&background=dc2626&color=ffffff&size=120&font-size=0.6`}
                      alt={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                      className="w-20 h-20 mx-auto rounded-full border-3 border-primary shadow-lg"
                    />
                    {driver.Driver.code && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                        {driver.Driver.code}
                      </div>
                    )}
                  </div>

                  {/* Driver Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-foreground font-racing">
                      {driver.Driver.givenName}
                    </h3>
                    <h4 className="text-xl font-black text-foreground font-racing">
                      {driver.Driver.familyName}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {driver.Constructors[0]?.name}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-xl font-bold text-primary">{driver.points}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-xl font-bold text-primary">{driver.wins}</div>
                      <div className="text-xs text-muted-foreground">Wins</div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-xl font-bold text-primary">{stats.age}</div>
                      <div className="text-xs text-muted-foreground">Age</div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-sm font-bold text-primary">{driver.Driver.nationality}</div>
                      <div className="text-xs text-muted-foreground">Nation</div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    View Details
                  </motion.button>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Driver Detail Modal */}
        {selectedDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDriver(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${selectedDriver.Driver.givenName}+${selectedDriver.Driver.familyName}&background=dc2626&color=ffffff&size=80&font-size=0.6`}
                    alt={`${selectedDriver.Driver.givenName} ${selectedDriver.Driver.familyName}`}
                    className="w-20 h-20 rounded-full border-3 border-primary"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-foreground font-racing">
                      {selectedDriver.Driver.givenName} {selectedDriver.Driver.familyName}
                    </h2>
                    <p className="text-muted-foreground">{selectedDriver.Constructors[0]?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground font-racing">Career Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Position:</span>
                      <span className="font-bold text-primary">#{selectedDriver.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Points:</span>
                      <span className="font-bold text-primary">{selectedDriver.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Race Wins:</span>
                      <span className="font-bold text-primary">{selectedDriver.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nationality:</span>
                      <span className="font-bold text-primary">{selectedDriver.Driver.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span className="font-bold text-primary">
                        {new Date(selectedDriver.Driver.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground font-racing">Team Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Constructor:</span>
                      <span className="font-bold text-primary">{selectedDriver.Constructors[0]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team Nationality:</span>
                      <span className="font-bold text-primary">{selectedDriver.Constructors[0]?.nationality}</span>
                    </div>
                    {selectedDriver.Driver.code && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Driver Code:</span>
                        <span className="font-bold text-primary">{selectedDriver.Driver.code}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <motion.a
                  href={selectedDriver.Driver.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <User size={20} />
                  <span>View Full Profile</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};