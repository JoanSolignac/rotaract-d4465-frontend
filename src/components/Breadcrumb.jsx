import { Link } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function Breadcrumb({ items, dashboardPath = '/' }) {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm mb-6"
        >
            <Link
                to={dashboardPath}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <HiHome className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <HiChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 dark:text-white font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </motion.nav>
    );
}

