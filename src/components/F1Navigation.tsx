import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Trophy, Calendar, User } from 'lucide-react';
import { f1Api, DriverStanding, Race } from '../services/f1Api';

interface F1NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const F1Navigation = ({ activeSection, setActiveSection }: F1NavigationProps) => {
  const [standings, setStandings] = useState<DriverStanding[]>([]);
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [standingsData, nextRaceData] = await Promise.all([
        f1Api.getCurrentDriverStandings(),
        f1Api.getNextRace()
      ]);
      setStandings(standingsData.slice(0, 5));
      setNextRace(nextRaceData);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Car },
    { id: 'standings', label: 'Standings', icon: Trophy },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'drivers', label: 'Drivers', icon: User }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 pt-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.4
        }}
        className="bg-black/80 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl w-full max-w-[1600px] mx-auto"
      >
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl sm:text-3xl font-bold italic text-gradient cursor-pointer font-f1 whitespace-nowrap md:mr-auto"
              onClick={() => setActiveSection('home')}
            >
              F1 WORLD
            </motion.div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-4">
              <div className="flex items-center space-x-1 lg:space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center space-x-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-xl transition-all font-racing overflow-hidden relative ${
                        activeSection === item.id
                          ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{item.label}</span>
                      {/* Improved left-to-right fill effect */}
                      <motion.div 
                        className="absolute inset-0 bg-red-600/20 z-0 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ transformOrigin: 'left center' }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Live Data Panel */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="hidden lg:flex items-center bg-black/70 rounded-xl px-3 xl:px-4 py-2 min-w-[180px] xl:min-w-[220px] border border-gray-800 ml-auto"
            >
              {nextRace && (
                <div className="text-xs">
                  <div className="text-red-500 font-semibold">NEXT RACE</div>
                  <div className="text-white font-medium truncate">{nextRace.raceName}</div>
                  <div className="text-gray-400">
                    {new Date(nextRace.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 ml-4"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1.5">
                <div className={`h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
                <div className={`h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 space-y-1 pb-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-red-600/20 text-red-500'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
              {nextRace && (
                <div className="px-4 py-3 text-xs bg-black/50 rounded-lg mt-2">
                  <div className="text-red-500 font-semibold">NEXT RACE</div>
                  <div className="text-white font-medium truncate">{nextRace.raceName}</div>
                  <div className="text-gray-400">
                    {new Date(nextRace.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.nav>
    </div>
  );
};