import React from 'react';
import { motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

const Layout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-brand-black text-white">
            {/* Start: Global Language Switcher */}
            <div className="fixed top-6 left-6 z-50">
                <LanguageSwitcher />
            </div>
            {/* End: Global Language Switcher */}

            {/* Noise Texture */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Layout;
