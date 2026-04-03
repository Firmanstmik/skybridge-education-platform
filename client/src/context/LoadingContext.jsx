import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // Trigger loading on route change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Durasi loading yang pas (800ms)

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <LoadingContext.Provider value={{ setIsLoading }}>
            <div className="relative min-h-screen">
                {/* Main Content with Blur Effect */}
                <motion.div
                    animate={isLoading ? { 
                        filter: 'blur(8px)',
                        scale: 0.98,
                        opacity: 0.6
                    } : {
                        filter: 'none',
                        scale: 1,
                        opacity: 1
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>

                {/* Professional Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
                        >
                            <div className="relative flex items-center justify-center">
                                {/* Outer Rotating Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 border-4 border-transparent border-t-red-600 border-r-red-600 rounded-full"
                                />
                                
                                {/* Inner Reverse Rotating Ring */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-24 h-24 border-4 border-transparent border-b-slate-800 border-l-slate-800 rounded-full opacity-40"
                                />

                                {/* Logo with Pulse Animation */}
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute"
                                >
                                    <img src={Logo} alt="Logo" className="w-16 h-16 object-contain" />
                                </motion.div>

                                {/* Text Label */}
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 85, opacity: 1 }}
                                    className="absolute whitespace-nowrap"
                                >
                                    <span className="text-slate-900 font-bold tracking-[0.3em] uppercase text-[10px]">
                                        Loading / 読み込み中
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </LoadingContext.Provider>
    );
};
