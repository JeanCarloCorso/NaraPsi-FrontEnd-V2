import React from 'react';
import { CheckCircle, AlertCircle, Plus } from 'lucide-react';
import type { NotificationState } from '../../types';

interface ToastProps {
    notification: NotificationState;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
    if (!notification.visible) return null;

    return (
        <div className={`fixed top-20 right-6 z-[100] min-w-[300px] p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 flex items-center gap-3
            ${notification.type === 'success'
                ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-500/20'
            }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${notification.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
            >
                {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {notification.type === 'success' ? 'Sucesso!' : 'Ocorreu um erro'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {notification.message}
                </p>
            </div>
            <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                <Plus className="w-4 h-4 rotate-45" />
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden rounded-b-2xl">
                <div className={`h-full animate-toast-progress
                    ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
            </div>
        </div>
    );
};
