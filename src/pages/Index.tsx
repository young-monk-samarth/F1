import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { F1Navigation } from '../components/F1Navigation';
import { HeroSection } from '../components/HeroSection';
import { DriverStandings } from '../components/DriverStandings';
import { DriverProfiles } from '../components/DriverProfiles';
import { RaceCalendar } from '../components/RaceCalendar';
import { Footer } from '../components/Footer';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'standings', 'calendar', 'drivers'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (activeSection !== 'home') {
      scrollToSection(activeSection);
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-background">
      <F1Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
        <section id="home">
          <HeroSection />
        </section>
        
        <DriverStandings />
        
        <RaceCalendar />
        
        <DriverProfiles />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
