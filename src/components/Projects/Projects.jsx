import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '../../data/personalInfo';

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-20 bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12 lg:mb-16"
        >
          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-black">
              <span className="text-teal">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              Explore my recent projects and creative solutions
            </p>
          </div>
          <motion.button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ x: 5 }}
            className="hidden md:flex items-center gap-2 text-black font-semibold hover:text-teal transition-colors duration-300"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-8">

          {/* Featured Project */}
          <ProjectCard project={PROJECTS[0]} index={0} featured={true} />

          {/* Grid of Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {PROJECTS.slice(1).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        </div>

        {/* Mobile See All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 md:hidden flex justify-center"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-teal transition-all duration-300"
          >
            <span>See All Projects</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
