import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import f1CarImage from '../assets/f1-car.png';
import backgroundImage from '../assets/f1-hero.jpg'; // Add this import for your background image

export const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const carX = useTransform(scrollYProgress, [0, 1], ["-20%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax - now using an image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-transparent"
      >
        <img 
          src={backgroundImage} 
          alt="F1 Track Background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.8 }} // Adjust opacity as needed
        />
      </motion.div>
      
      {/* Grid Pattern - kept as before */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* F1 Car Image with Parallax - kept exactly the same */}
      <motion.div
        style={{ x: carX }}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-full max-w-4xl z-0"
      >
        {/* <img 
          src={f1CarImage} 
          alt="Formula 1 Racing Car" 
          className="w-full h-auto object-contain opacity-70"
        /> */}
      </motion.div>

      {/* Main Content - kept exactly the same */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center max-w-6xl mx-auto px-6"
      >
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 font-f1"
        >
          <span className="text-gradient">F1</span>
          <span className="text-foreground ml-4">WORLD</span>
        </motion.h1>
        
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl text-slate-400 font-bold mb-8 max-w-3xl mx-auto font-racing px-6 py-4"
>


          Experience the thrill of Formula 1 racing with real-time data, 
          driver standings, and race schedules updated every 30 seconds.
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all font-racing shadow-lg"
          >
            Explore Live Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all font-racing"
          >
            View Calendar
          </motion.button> */}
    <motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
  whileTap={{ scale: 0.95 }}
  className="text-neutral-600 hover:text-red-500 px-8 py-4 rounded-sm font-bold text-lg font-racing bg-black shadow-xl"
>
  Explore Live Data
</motion.button>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="text-neutral-600 hover:text-red-500 px-8 py-4 rounded-sm font-bold text-lg font-racing border-2 border-transparent bg-black/30 backdrop-blur-md shadow-xl">

  View Calendar
</motion.button>

        </motion.div>
      </motion.div>

      {/* Scroll Indicator - kept exactly the same */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-muted-foreground"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>

      {/* Racing Lines - kept exactly the same */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%" }}
            animate={{ x: "100vw" }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            className="absolute w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"
            style={{ top: `${20 + i * 15}%` }}
          />
        ))}
      </div>
    </section>
  );
};