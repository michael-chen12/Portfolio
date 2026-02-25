import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';
import { SKILLS_EXPERIENCE } from '../../data/personalInfo';

const skillsWithNumbers = SKILLS_EXPERIENCE.map((skill, index) => ({
  ...skill,
  number: `0${index + 1}`,
}));

const About = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-black mb-6">
            What I{' '}
            <span className="text-teal">Bring</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Technical skills, professional experience, and continuous learning
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {skillsWithNumbers.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 lg:mt-20 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Interested in working together?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal text-white font-display font-semibold text-base rounded-full hover:bg-teal-dark transition-all duration-300 hover:scale-105 shadow-card"
          >
            Let's Talk
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
