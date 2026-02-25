import { motion } from 'framer-motion';
import { Palette, Code2, BookOpen, Lightbulb } from 'lucide-react';
import ServiceCard from './ServiceCard';

const services = [
  {
    number: '01',
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive and visually stunning interfaces that delight users and drive engagement through thoughtful design principles.',
  },
  {
    number: '02',
    icon: Code2,
    title: 'Frontend Development',
    description: 'Building responsive, performant web applications with modern frameworks and best practices for optimal user experience.',
  },
  {
    number: '03',
    icon: BookOpen,
    title: 'Technical Writing',
    description: 'Crafting clear, comprehensive documentation and guides that make complex technical concepts accessible to all audiences.',
  },
  {
    number: '04',
    icon: Lightbulb,
    title: 'Consulting',
    description: 'Providing strategic guidance on architecture, design systems, and development workflows to elevate your digital products.',
  },
];

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
            How Can I{' '}
            <span className="text-teal">Assist You?</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            I offer a range of services to help bring your digital vision to life
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
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
