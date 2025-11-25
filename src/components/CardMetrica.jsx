import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * CardMetrica Component
 * Reusable metric card with animations
 */
export default function CardMetrica({ title, value, icon, color = 'primary' }) {
    const colorClasses = {
        primary: 'bg-primary-600 shadow-primary-600/20',
        yellow: 'bg-yellow-500 shadow-yellow-500/20',
        blue: 'bg-blue-500 shadow-blue-500/20',
        green: 'bg-green-500 shadow-green-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="text-center bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800 hover:shadow-xl hover:shadow-black/30 transition-shadow"
        >
            <div className="flex justify-center mb-3">
                <div className={`w-16 h-16 ${colorClasses[color]} rounded-full flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-2">{value}</h3>
            <p className="text-base font-medium text-gray-400">{title}</p>
        </motion.div>
    );
}

CardMetrica.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.oneOf(['primary', 'yellow', 'blue', 'green']),
};
