import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ProjectCard = ({ project, index, featured = false }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!featured || prefersReducedMotion) return;

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
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion || !featured ? {} : {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-float transition-all duration-500 hover:-translate-y-2 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
        <motion.div
          initial={{ rotate: 45, scale: 0 }}
          animate={{ rotate: 45, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-teal to-teal-dark opacity-20"
        />
      </div>

      {/* Project Image */}
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: project.isPlaceholder ? 1 : 1.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: project.isPlaceholder
              ? 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)'
              : project.image
              ? `linear-gradient(135deg, rgba(92,181,181,0.1) 0%, rgba(92,181,181,0.05) 100%)`
              : 'linear-gradient(135deg, #5CB5B5 0%, #4A9999 100%)',
          }}
        >
          {project.image && !project.isPlaceholder && (
            <img
              src={project.image}
              alt={project.title}
              width="800"
              height="600"
              loading="lazy"
              className="w-full h-full object-cover mix-blend-overlay opacity-60"
            />
          )}

          {project.isPlaceholder && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl font-display font-bold opacity-30">
              ?
            </div>
          )}

          {/* Grid overlay pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </motion.div>

        {/* Hover Overlay with gradient */}
        {!project.isPlaceholder && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <a
                href={project.demoUrl || project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg group/button"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-4 h-4 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>
        )}

        {/* Placeholder hover overlay */}
        {project.isPlaceholder && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg group/button"
              >
                <span>View GitHub</span>
                <ArrowUpRight className="w-4 h-4 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6 lg:p-8 space-y-4 relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-black group-hover:text-teal transition-colors duration-300">
              {project.title}
            </h3>
            {!project.isPlaceholder && (
              <p className="text-sm text-gray-500 font-medium mt-1">
                {project.technologies?.slice(0, 3).join(' • ')}
              </p>
            )}
          </div>

          {!project.isPlaceholder && (
            <motion.div
              whileHover={{ rotate: 45, scale: 1.1 }}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        {featured && project.description && (
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        )}

        {/* Tech Tags with stagger animation */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tag, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="px-4 py-1.5 bg-gradient-to-r from-teal-light/30 to-teal-light/20 text-teal-dark text-xs font-semibold rounded-full cursor-default border border-teal-light/20 pointer-events-none"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.article>
  );
};

export default ProjectCard;
