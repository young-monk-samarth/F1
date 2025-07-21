import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { f1Api, DriverStanding } from '../services/f1Api';
import { Card } from './ui/card';
import { useLocation } from 'react-router-dom';

interface DriverInfo {
  driver_number: number;
  headshot_url: string;
  full_name: string;
  session_key?: number;
  meeting_key?: number;
}

interface ExtendedDriverStanding extends DriverStanding {
  Driver: DriverStanding['Driver'] & {
    permanentNumber?: string;
    code?: string;
  };
}

export const DriverStandings = () => {
  const location = useLocation();
  const [standings, setStandings] = useState<ExtendedDriverStanding[]>([]);
  const [driverImages, setDriverImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const standingsData = await f1Api.getCurrentDriverStandings();
        setStandings(standingsData as ExtendedDriverStanding[]);

        const driversResponse = await fetch('https://api.openf1.org/v1/drivers?session_key=latest');
        const driversData: DriverInfo[] = await driversResponse.json();
        
        const imagesMap = driversData.reduce((acc, driver) => {
          if (driver.headshot_url) {
            acc[driver.driver_number] = driver.headshot_url;
          }
          return acc;
        }, {} as Record<number, string>);
        
        setDriverImages(imagesMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDriverImage = (driverId: string, driverCode?: string, driverNumber?: string) => {
    if (driverNumber && driverImages[parseInt(driverNumber)]) {
      return driverImages[parseInt(driverNumber)];
    }
    
    if (driverCode) {
      const driverEntry = Object.entries(driverImages).find(([_, url]) => 
        url.includes(driverCode.toLowerCase())
      );
      if (driverEntry) {
        return driverEntry[1];
      }
    }
    
    const driver = standings.find(d => d.Driver.driverId === driverId)?.Driver;
    if (driver) {
      return `https://ui-avatars.com/api/?name=${driver.givenName}+${driver.familyName}&background=dc2626&color=ffffff&size=128&font-size=0.6`;
    }
    return '';
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case '1': return <Trophy className="text-yellow-400" size={24} />;
      case '2': return <Medal className="text-gray-400" size={24} />;
      case '3': return <Award className="text-amber-600" size={24} />;
      default: return <span className="text-muted-foreground font-bold text-lg">#{position}</span>;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case '1': return 'border-yellow-400 bg-yellow-400/10';
      case '2': return 'border-gray-400 bg-gray-400/10';
      case '3': return 'border-amber-600 bg-amber-600/10';
      default: return 'border-border bg-card';
    }
  };

  if (loading) {
    return (
      <section id="standings" className="py-24 px-4">
        <div className="container mx-auto px-0">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-red-600">DRIVER</span>
            <span className="text-white"> STANDINGS</span>
          </h2>
          <div className="grid gap-6 max-w-6xl mx-auto">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-28 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="standings" className={`py-24 px-0 sm:px-6 ${location.pathname === '/standings' ? 'pt-32' : ''}`}>
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            stiffness: 60,
            damping: 12,
            duration: 0.8
          }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          <span className="text-red-600 italic">DRIVER STANDINGS</span>
          <span className="text-white"> 🚥</span>
          <span className="text-white"> 2025</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 w-full">
          {standings.map((standing, index) => {
            const driverNumber = standing.Driver.permanentNumber;
            const driverCode = standing.Driver.code;
            const imageUrl = getDriverImage(standing.Driver.driverId, driverCode, driverNumber);
            
            return (
              <motion.div
                key={standing.Driver.driverId}
                initial={{ 
                  x: index % 2 === 0 ? -80 : 80,
                  y: 50,
                  opacity: 0 
                }}
                whileInView={{ 
                  x: 0,
                  y: 0,
                  opacity: 1 
                }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ 
                  type: "spring",
                  stiffness: 80,
                  damping: 12,
                  delay: index * 0.1,
                  duration: 0.8
                }}
                whileHover={{ scale: 1.03 }}
                className="w-full"
              >
                <Card className={`p-3 sm:p-6 transition-all duration-300 ${getPositionColor(standing.position)} min-h-[110px] sm:min-h-[140px] flex items-center`}>
                  <div className="flex items-center justify-between w-full gap-2 sm:gap-4 overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-6 min-w-0 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0">
                        {getPositionIcon(standing.position)}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 min-w-0 flex-1">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={`${standing.Driver.givenName} ${standing.Driver.familyName}`}
                            className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 border-primary object-cover flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${standing.Driver.givenName}+${standing.Driver.familyName}&background=dc2626&color=ffffff&size=128&font-size=0.6`;
                            }}
                          />
                        )}
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-2xl font-bold text-foreground truncate">
                            {standing.Driver.givenName} <span className="whitespace-nowrap">{standing.Driver.familyName}</span>
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <p className="text-xs text-muted-foreground truncate">
                              {standing.Constructors[0]?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              • {standing.Driver.nationality}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0 pl-2">
                      <div className="text-lg sm:text-3xl font-bold text-primary whitespace-nowrap">{standing.points}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {standing.wins} {standing.wins === '1' ? 'win' : 'wins'}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
