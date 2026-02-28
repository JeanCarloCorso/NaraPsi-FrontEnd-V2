import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertTriangle } from 'lucide-react';
import api from '../../../services/api';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'nara';
    timestamp: Date;
}

interface ChatNaraIAProps {
    pacienteId: string;
}

export const ChatNaraIA: React.FC<ChatNaraIAProps> = ({ pacienteId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Olá! Sou a Nara, sua assistente de IA. Como posso ajudar com este paciente hoje?',
            sender: 'nara',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            if (!hasOpenedBefore) setHasOpenedBefore(true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, hasOpenedBefore]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            inputRef.current?.focus();
        }
    }, [isOpen, messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(`/chat/chat/paciente/${pacienteId}`, {
                question: userMessage.text
            });

            const naraMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.answer,
                sender: 'nara',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, naraMessage]);
        } catch (err) {
            console.error('Erro no chat Nara IA:', err);
            setError('Ops… A Nara teve um lapso freudiano e o sistema travou. 🛋️ Tente novamente em instantes!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
            {/* Janela do Chat */}
            {isOpen && (
                <div
                    ref={chatRef}
                    className="w-[340px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
                >
                    {/* Header */}
                    <div className="bg-primary-600 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">Nara IA</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="Fechar chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Alerta */}
                    <div className="bg-amber-50 dark:bg-amber-500/10 px-4 py-2 flex items-center gap-2 border-b border-amber-100 dark:border-amber-500/20 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                            Especializada no paciente, mas sujeita a falhas.
                        </p>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${idx === 0 && isOpen && hasOpenedBefore ? 'animate-intro-message' : 'animate-in fade-in slide-in-from-bottom-2 duration-300'
                                    }`}
                            >
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 animate-in shake duration-500">
                                {error}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSendMessage}
                        className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pergunte sobre o paciente..."
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 outline-none text-slate-700 dark:text-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="w-10 h-10 flex items-center justify-center bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl transition-all shadow-lg shadow-primary-500/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Bubble Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-primary-600 text-white hover:bg-primary-700 glow-primary"
                >
                    <MessageCircle className="w-7 h-7" />
                </button>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .glow-primary:hover {
                    box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes introMessage {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-intro-message {
                    animation: introMessage 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};
