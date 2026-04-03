import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

const alertVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.8, y: -20 }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((message, type = 'info', title = '', onConfirm) => {
        setAlert({ message, type, title, onConfirm });
    }, []);

    const closeAlert = useCallback(() => {
        setAlert(null);
    }, []);

    const renderMessage = () => {
        if (typeof alert.message !== 'string') {
            return alert.message;
        }
        const lines = alert.message.split('\n');
        return lines.map((line, index) => (
            <span key={index}>
                {line}
                {index < lines.length - 1 && <br />}
            </span>
        ));
    };

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <AnimatePresence>
                {alert && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={overlayVariants}
                        onClick={closeAlert}
                    >
                        <motion.div
                            className="relative w-full max-w-[320px] sm:max-w-md mx-auto"
                            variants={alertVariants}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-slate-900 via-slate-950 to-black rounded-full blur-3xl opacity-80" />
                            <div className="relative bg-white rounded-[22px] shadow-[0_14px_35px_rgba(0,0,0,0.45)] overflow-hidden">
                                <div className={`h-1.5 w-full ${
                                    alert.type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                    alert.type === 'error' ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600' :
                                    alert.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                }`} />

                                <div className="px-4 pt-5 pb-4 sm:px-8 sm:pt-7 sm:pb-6 text-center">
                                    <div className="mb-3 sm:mb-4 flex justify-center">
                                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md ${
                                            alert.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            alert.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
                                            alert.type === 'warning' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                            {alert.type === 'success' && <CheckCircle size={30} />}
                                            {alert.type === 'error' && <XCircle size={30} />}
                                            {alert.type === 'warning' && <AlertCircle size={30} />}
                                            {alert.type === 'info' && <Info size={30} />}
                                        </div>
                                    </div>

                                    <div className="mb-2 sm:mb-3">
                                        <h3 className="text-[11px] tracking-[0.28em] font-semibold text-gray-400 uppercase mb-1">
                                            {alert.type === 'success' && 'SUCCESS / 成功'}
                                            {alert.type === 'error' && 'ERROR / エラー'}
                                            {alert.type === 'warning' && 'WARNING / 警告'}
                                            {alert.type === 'info' && 'INFO / 情報'}
                                        </h3>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            {alert.title || (
                                                alert.type === 'success' ? 'Berhasil!' :
                                                alert.type === 'error' ? 'Akses Ditolak' :
                                                alert.type === 'warning' ? 'Perhatian!' : 'Informasi'
                                            )}
                                        </h2>
                                    </div>

                                    <p className="text-[11px] sm:text-sm text-gray-600 mb-5 leading-relaxed">
                                        {renderMessage()}
                                    </p>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => {
                                            if (alert.onConfirm) {
                                                alert.onConfirm();
                                            }
                                            closeAlert();
                                        }}
                                        className={`w-full py-2.5 sm:py-3 rounded-full font-semibold text-white shadow-lg transition-all text-sm sm:text-base ${
                                            alert.type === 'success'
                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-600 shadow-emerald-200/60'
                                                : alert.type === 'error'
                                                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-600 shadow-red-300/60'
                                                : alert.type === 'warning'
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-600 shadow-amber-200/70'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-600 shadow-blue-200/70'
                                        }`}
                                    >
                                        {alert.type === 'success' && alert.onConfirm
                                            ? 'Salin Nomor & OK / 確認'
                                            : 'OK / 確認'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AlertContext.Provider>
    );
};
