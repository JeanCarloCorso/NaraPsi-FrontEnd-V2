import { Construction, Sparkles } from 'lucide-react';

export default function PacienteHome() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 max-w-lg w-full text-center border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-[0.02] pointer-events-none">
                    <Sparkles className="w-48 h-48 rotate-12" />
                </div>

                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Construction className="w-10 h-10" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                    Em Desenvolvimento
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                    Nossa equipe está trabalhando duro para construir um ambiente exclusivo e seguro para você. Em breve, você terá acesso total aos seus registros, consultas e materiais terapêuticos.
                </p>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-primary-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500 font-medium uppercase tracking-widest">
                    Construindo a Área do Paciente
                </span>
            </div>
        </div>
    );
}
