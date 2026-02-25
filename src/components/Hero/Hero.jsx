import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Always call useTransform hooks (rules of hooks requirement)
  const gradientTopX = useTransform(x, [0, 1], [0, 50]);
  const gradientTopY = useTransform(y, [0, 1], [0, 50]);
  const gradientBottomX = useTransform(x, [0, 1], [0, -30]);
  const gradientBottomY = useTransform(y, [0, 1], [0, -30]);
  const profileCardX = useTransform(x, [0, 1], [0, -20]);
  const profileCardY = useTransform(y, [0, 1], [0, -20]);
  const socialCardX = useTransform(x, [0, 1], [0, 15]);
  const socialCardY = useTransform(y, [0, 1], [0, 15]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / 50);
      mouseY.set(e.clientY / 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  return (
    <section
      id="home"
      className="min-h-screen relative overflow-hidden bg-cream pt-32 pb-20 px-6 md:px-12 lg:px-20"
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={prefersReducedMotion ? {
            background: 'radial-gradient(circle, rgba(92,181,181,0.3) 0%, transparent 70%)',
          } : {
            background: 'radial-gradient(circle, rgba(92,181,181,0.3) 0%, transparent 70%)',
            x: gradientTopX,
            y: gradientTopY,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full"
          style={prefersReducedMotion ? {
            background: 'radial-gradient(circle, rgba(233,213,255,0.4) 0%, transparent 70%)',
          } : {
            background: 'radial-gradient(circle, rgba(233,213,255,0.4) 0%, transparent 70%)',
            x: gradientBottomX,
            y: gradientBottomY,
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Main Content */}
          <div className="lg:col-span-7 space-y-8">

            {/* Available Badge with sparkle animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal to-teal-dark text-white font-medium text-sm rounded-full shadow-soft cursor-default group relative overflow-hidden"
              >
                <motion.span
                  animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
                  transition={prefersReducedMotion ? {} : { duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                AVAILABLE FOR WORK

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={prefersReducedMotion ? {} : { x: ['-100%', '200%'] }}
                  transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.span>
            </motion.div>

            {/* Main Heading with gradient text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] text-black">
                Hi, I'm a{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-teal via-teal-dark to-teal bg-clip-text text-transparent">
                    Creative
                  </span>
                  {/* Decorative underline */}
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                  >
                    <motion.path
                      d="M0,6 Q150,0 300,6"
                      stroke="#5CB5B5"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal via-teal-dark to-teal bg-clip-text text-transparent">
                  Developer
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-body max-w-2xl leading-relaxed">
                Crafting exceptional digital experiences with{' '}
                <span className="font-semibold text-black relative inline-block group">
                  5+ years
                  <span className="absolute inset-x-0 bottom-0 h-2 bg-teal-light/30 -z-10 group-hover:h-full transition-all duration-300" />
                </span>
                {' '}of expertise in modern web development and user interface design.
              </p>
            </motion.div>

            {/* CTA Button with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-display font-semibold text-base rounded-full hover:bg-gray-800 transition-all duration-300 shadow-card group relative overflow-hidden"
              >
                {/* Gradient shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={prefersReducedMotion ? {} : { x: ['-100%', '200%'] }}
                  transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />

                <Mail className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Contact Me</span>
              </motion.a>
            </motion.div>

            {/* Brand Logos Pill with hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-lavender-light to-lavender/50 rounded-full shadow-soft backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-gray-700">Trusted by</span>
              <div className="flex items-center gap-3">
                {['A', 'B', 'C'].map((letter) => (
                  <motion.div
                    key={letter}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm cursor-pointer"
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Floating Cards with parallax */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[600px]">

            {/* Profile Card with 3D tilt */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={prefersReducedMotion ? {} : {
                x: profileCardX,
                y: profileCardY,
              }}
              className="absolute top-0 right-0 w-64 md:w-80 bg-white rounded-3xl shadow-float p-6 cursor-pointer"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-teal via-teal-dark to-teal rounded-2xl overflow-hidden mb-4 relative group">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                  alt="Profile"
                  width="400"
                  height="500"
                  loading="eager"
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-teal" />
                <span className="text-sm font-medium">San Francisco, CA</span>
              </div>
            </motion.div>

            {/* Social Links Card with stagger animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={prefersReducedMotion ? {} : {
                x: socialCardX,
                y: socialCardY,
              }}
              className="absolute bottom-12 left-0 bg-white/90 backdrop-blur-md rounded-2xl shadow-card p-4 space-y-3"
            >
              {[
                { Icon: Github, href: 'https://github.com', delay: 0, label: 'GitHub Profile' },
                { Icon: Linkedin, href: 'https://linkedin.com', delay: 0.1, label: 'LinkedIn Profile' },
                { Icon: Mail, href: 'mailto:hello@example.com', delay: 0.2, label: 'Send Email' },
              ].map(({ Icon, href, delay, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + delay }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-teal hover:to-teal-dark hover:text-white transition-all duration-300 shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>

            {/* Floating Decorations with organic motion */}
            <motion.div
              animate={prefersReducedMotion ? {} : {
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={prefersReducedMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-12 w-16 h-16 bg-gradient-to-br from-teal-light to-teal/30 rounded-full opacity-40 blur-sm"
            />
            <motion.div
              animate={prefersReducedMotion ? {} : {
                y: [0, 20, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={prefersReducedMotion ? {} : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-32 right-12 w-24 h-24 bg-gradient-to-br from-lavender to-lavender-dark/30 rounded-full opacity-40 blur-sm"
            />
            <motion.div
              animate={prefersReducedMotion ? {} : {
                rotate: 360,
              }}
              transition={prefersReducedMotion ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/4 w-2 h-2 bg-teal rounded-full opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
