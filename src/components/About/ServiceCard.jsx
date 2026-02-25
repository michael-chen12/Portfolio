import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Code2, Database, Briefcase, GraduationCap } from 'lucide-react';

const iconMap = {
  Code2,
  Database,
  Briefcase,
  GraduationCap,
};

const ServiceCard = ({ service, index }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const IconComponent = iconMap[service.icon];

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? {} : {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-soft hover:shadow-float transition-all duration-500 overflow-hidden cursor-pointer"
    >
      {/* Animated gradient background on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${isHovered ? '50%' : '100%'} ${isHovered ? '50%' : '100%'}, rgba(92,181,181,0.05), transparent)`,
        }}
      />

      {/* Number Badge with counter animation */}
      <div className="absolute top-8 right-8 overflow-hidden">
        <motion.div
          className="text-6xl lg:text-7xl font-display font-bold text-gray-100 group-hover:text-teal/10 transition-colors duration-500"
          initial={{ y: 0 }}
          whileHover={{ y: -10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {service.number}
        </motion.div>

        {/* Decorative dot pattern */}
        <motion.div
          className="absolute -bottom-4 -right-4 w-16 h-16"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-teal rounded-full"
              style={{
                left: `${(i % 3) * 33}%`,
                top: `${Math.floor(i / 3) * 33}%`,
              }}
              animate={{
                scale: isHovered ? [0, 1, 0.8] : 0,
              }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Icon with 3D transform */}
      <div className="relative z-10 mb-6">
        <motion.div
          className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-teal/10 to-teal/5 rounded-2xl flex items-center justify-center group-hover:from-teal group-hover:to-teal-dark transition-all duration-500 relative overflow-hidden"
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {/* Icon glow effect */}
          <motion.div
            className="absolute inset-0 bg-teal opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
          />

          {IconComponent && (
            <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-teal group-hover:text-white transition-colors duration-500 relative z-10" />
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <motion.h3
          className="text-2xl lg:text-3xl font-display font-bold text-black group-hover:text-teal transition-colors duration-300"
          style={{
            transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
          }}
        >
          {service.title}
        </motion.h3>
        <motion.p
          className="text-gray-600 leading-relaxed"
          style={{
            transform: isHovered ? 'translateZ(5px)' : 'translateZ(0px)',
          }}
        >
          {service.description}
        </motion.p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 border-2 border-teal/0 group-hover:border-teal/20 rounded-3xl transition-all duration-500"
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          animate={prefersReducedMotion ? {} : {
            background: isHovered
              ? [
                  'linear-gradient(90deg, transparent, rgba(92,181,181,0.1), transparent)',
                  'linear-gradient(90deg, transparent, rgba(92,181,181,0.1), transparent)',
                ]
              : 'transparent',
            x: isHovered ? ['-100%', '200%'] : '0%',
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute bottom-0 left-0 w-12 h-12 overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-6 -left-6 w-12 h-12 bg-teal/10 rounded-full"
        />
      </div>
    </motion.article>
  );
};

export default ServiceCard;
