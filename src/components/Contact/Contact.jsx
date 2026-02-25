import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Send, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { PERSONAL_INFO } from '../../data/personalInfo';

const Contact = () => {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  // Always call useTransform hooks (rules of hooks requirement)
  const gradientX = useTransform(mouseX, [0, 1], [0, 100]);
  const gradientY = useTransform(mouseY, [0, 1], [0, 100]);

  const gradientBackground = useTransform(
    [gradientX, gradientY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, #F3E8FF 0%, #E9D5FF 50%, #F3E8FF 100%)`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success!
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
      // Don't clear form data on error - preserve user input
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? {
          background: '#F3E8FF'
        } : {
          background: gradientBackground,
        }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={prefersReducedMotion ? {} : {
            rotate: 360,
          }}
          transition={prefersReducedMotion ? {} : { duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : {
            rotate: -360,
          }}
          transition={prefersReducedMotion ? {} : { duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-teal/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-black mb-6"
            whileInView={{ scale: [0.9, 1] }}
            transition={{ duration: 0.5 }}
          >
            Let's Create{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
                Together
              </span>
              {/* Decorative underline */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-3 bg-teal/20 -z-10"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </span>
          </motion.h2>
          <p className="text-lg lg:text-xl text-gray-700">
            Have a project in mind? Get in touch and let's make it happen.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-float space-y-6 border border-white/50 relative overflow-hidden"
        >
          {/* Success overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isSuccess ? 1 : 0,
              scale: isSuccess ? 1 : 0.8,
            }}
            className="absolute inset-0 bg-teal/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl"
            style={{ pointerEvents: isSuccess ? 'auto' : 'none' }}
          >
            <div className="text-center text-white space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isSuccess ? 1 : 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-20 h-20 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold">Message Sent!</h3>
              <p>I'll get back to you soon.</p>
            </div>
          </motion.div>

          {/* Error notification */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3"
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal/10 to-transparent transform rotate-45 translate-x-10 -translate-y-10" />
          </div>

          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300"
                placeholder="John Doe"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300"
                placeholder="john@example.com"
              />
            </motion.div>
          </div>

          {/* Message Field */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 placeholder:text-gray-400 resize-none hover:border-gray-300"
              placeholder="Tell me about your project..."
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || isSuccess}
            whileHover={{ scale: isSubmitting || isSuccess ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting || isSuccess ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-black to-gray-800 text-white font-display font-semibold text-lg rounded-2xl hover:from-gray-800 hover:to-black disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 shadow-card disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={prefersReducedMotion ? {} : {
                x: isSubmitting ? ['-100%', '200%'] : '0%',
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 1,
                repeat: isSubmitting ? Infinity : 0,
              }}
            />

            {isSubmitting ? (
              <>
                <motion.div
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={prefersReducedMotion ? {} : { duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="relative z-10">Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                <span className="relative z-10">Send Message</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 space-y-6"
        >
          <p className="text-center text-gray-600 font-medium">Or reach out directly</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                Icon: Mail,
                label: 'Email',
                value: PERSONAL_INFO.email,
                href: `mailto:${PERSONAL_INFO.email}`,
                ariaLabel: `Send email to ${PERSONAL_INFO.email}`
              },
              {
                Icon: Phone,
                label: 'Phone',
                value: PERSONAL_INFO.phone,
                href: `tel:${PERSONAL_INFO.phone.replace(/[^0-9+]/g, '')}`,
                ariaLabel: `Call ${PERSONAL_INFO.phone}`
              },
              {
                Icon: MapPin,
                label: 'Location',
                value: PERSONAL_INFO.location,
                href: null,
                ariaLabel: null
              },
            ].map((item, i) => {
              const Element = item.href ? 'a' : 'div';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-white/50"
                >
                  <Element
                    {...(item.href ? { href: item.href } : {})}
                    {...(item.ariaLabel ? { 'aria-label': item.ariaLabel } : {})}
                    className={`flex items-center gap-3 flex-1 ${item.href ? 'cursor-pointer' : ''}`}
                  >
                    <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center">
                      <item.Icon className="w-5 h-5 text-teal" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-black">{item.value}</p>
                    </div>
                  </Element>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
