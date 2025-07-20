import { motion } from 'framer-motion';
import { Car, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/young-monk-samarth', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/samarthmuktamath', label: 'LinkedIn' }
  ];

  const footerLinks = [
    {
      title: 'Formula 1',
      links: [
        { label: 'Official Site', href: 'https://formula1.com' },
        { label: 'FIA', href: 'https://fia.com' },
        { label: 'Teams', href: '#' },
        { label: 'Drivers', href: '#' }
      ]
    },
    {
      title: 'Data',
      links: [
        { label: 'Live Timing', href: 'https://www.formula1.com/en/timing/f1-live' },
        { label: 'Calender', href: '#calender' },

        { label: 'Results', href: '#' },
        { label: 'API', href: 'https://ergast.com/mrd/' }
      ]
    },
    {
      title: 'About',
      links: [
        { label: 'About F1', href: 'https://www.formula1.com/en/latest?page=1' },
        { label: 'Contact', href: 'https://corp.formula1.com/contact-f1/' },
        { label: 'Privacy', href: 'https://privacy.formula1.com/' },
        { label: 'Terms', href: 'https://www.formulaonehistory.com/f1-glossary/' }
      ]
    }
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Car className="text-primary" size={32} />
                <span className="text-2xl font-bold text-gradient font-f1">F1 WORLD</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Your ultimate destination for Formula 1 data, standings, and race information. 
                Stay updated with real-time statistics and never miss a race.
              </p>
            </motion.div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-foreground font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          {/* <div className="text-sm text-muted-foreground">
            © {currentYear}  F1 World · All rights reserved · Designed & Developed by <span class="font-bold text-white">Samarth Muktamath</span>.
          </div>
           */}
           <div className="text-sm text-muted-foreground">
  © {currentYear} F1 World · All rights reserved · Designed & Developed by <span className="font-bold text-white">SAMARTH MUKTAMATH</span>.
</div>

          <div className="text-sm text-muted-foreground">
            <span className="text-primary">Live Data</span> • Updated every 30 seconds
          </div>
        </motion.div>
      </div>

      {/* Racing Lines Animation */}
      <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%" }}
            animate={{ x: "100vw" }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
            className="absolute bottom-0 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: `${i * 2}px` }}
          />
        ))}
      </div>
    </footer>
  );
};