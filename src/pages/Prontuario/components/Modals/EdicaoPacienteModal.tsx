import React from 'react';
import { UserCircle2, Phone, Paperclip, Plus, Trash2, FileEdit, Loader2, CheckCircle } from 'lucide-react';
import type { PacienteFormData } from '../../types';

interface EdicaoPacienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: PacienteFormData;
    isSaving: boolean;
    onSave: () => void;
    onUpdateField: (field: keyof PacienteFormData, value: any) => void;
    onUpdateArrayField: (field: 'telefones' | 'enderecos' | 'familiares', index: number, subField: string, value: any) => void;
    onAddArrayItem: (field: 'telefones' | 'enderecos' | 'familiares') => void;
    onRemoveArrayItem: (field: 'telefones' | 'enderecos' | 'familiares', index: number) => void;
    fieldErrors: Record<string, string>;
}

export const EdicaoPacienteModal: React.FC<EdicaoPacienteModalProps> = ({
    isOpen,
    onClose,
    formData,
    isSaving,
    onSave,
    onUpdateField,
    onUpdateArrayField,
    onAddArrayItem,
    onRemoveArrayItem,
    fieldErrors
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isSaving && onClose()}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Editar Dados do Paciente</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Atualize as informações cadastrais</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Conteúdo do formulário */}
                <div className="overflow-y-auto flex-1 p-6 space-y-8">
                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <UserCircle2 className="w-4 h-4" /> Dados Pessoais
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.nome || ''}
                                    onChange={(e) => onUpdateField('nome', e.target.value)}
                                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.nome ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                    maxLength={100}
                                />
                                {fieldErrors.nome && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.nome}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Sexo</label>
                                <select
                                    value={formData.sexo || ''}
                                    onChange={(e) => onUpdateField('sexo', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                >
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">CPF</label>
                                <input
                                    type="text"
                                    value={formData.cpf || ''}
                                    onChange={(e) => onUpdateField('cpf', e.target.value)}
                                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.cpf ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                />
                                {fieldErrors.cpf && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.cpf}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">RG</label>
                                <input
                                    type="text"
                                    value={formData.rg || ''}
                                    onChange={(e) => onUpdateField('rg', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                    placeholder="Número do RG"
                                    maxLength={14}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Data de Nascimento *</label>
                                <input
                                    type="date"
                                    value={formData.data_nascimento || ''}
                                    onChange={(e) => onUpdateField('data_nascimento', e.target.value)}
                                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.data_nascimento ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                />
                                {fieldErrors.data_nascimento && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.data_nascimento}</p>}
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">E-mail</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => onUpdateField('email', e.target.value)}
                                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                    maxLength={255}
                                />
                                {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Telefones */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Telefones
                            </h4>
                            <button
                                type="button"
                                onClick={() => onAddArrayItem('telefones')}
                                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Adicionar Telefone
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(formData.telefones || []).map((tel, idx) => (
                                <div key={idx} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Número</label>
                                        <input
                                            type="text"
                                            value={tel.numero}
                                            onChange={(e) => onUpdateArrayField('telefones', idx, 'numero', e.target.value)}
                                            className={`w-full px-3 py-1.5 bg-white dark:bg-slate-800 border ${fieldErrors[`telefone_${idx}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg outline-none text-slate-900 dark:text-white text-sm`}
                                        />
                                        {fieldErrors[`telefone_${idx}`] && <p className="text-red-500 text-[10px] mt-1">{fieldErrors[`telefone_${idx}`]}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Descrição</label>
                                        <input
                                            type="text"
                                            value={tel.descricao}
                                            onChange={(e) => onUpdateArrayField('telefones', idx, 'descricao', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            placeholder="Ex: Celular, Casa"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveArrayItem('telefones', idx)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Endereços */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Paperclip className="w-4 h-4" /> Endereços
                            </h4>
                            <button
                                type="button"
                                onClick={() => onAddArrayItem('enderecos')}
                                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Adicionar Endereço
                            </button>
                        </div>
                        <div className="space-y-4">
                            {(formData.enderecos || []).map((end, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 -m-4 mb-3 rounded-t-xl px-4 border-b border-slate-200 dark:border-slate-700">
                                        <span className="text-xs font-bold text-slate-500">Endereço #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveArrayItem('enderecos', idx)}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">CEP</label>
                                            <input
                                                type="text"
                                                value={end.cep}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'cep', e.target.value)}
                                                className={`w-full px-3 py-1.5 bg-white dark:bg-slate-800 border ${fieldErrors[`cep_${idx}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg outline-none text-slate-900 dark:text-white text-sm`}
                                            />
                                            {fieldErrors[`cep_${idx}`] && <p className="text-red-500 text-[10px] mt-1">{fieldErrors[`cep_${idx}`]}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Endereço (Rua/Av)</label>
                                            <input
                                                type="text"
                                                value={end.endereco}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'endereco', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Número</label>
                                            <input
                                                type="text"
                                                value={end.numero}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'numero', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                maxLength={10}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Complemento</label>
                                            <input
                                                type="text"
                                                value={end.complemento}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'complemento', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                maxLength={100}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Bairro</label>
                                            <input
                                                type="text"
                                                value={end.bairro}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'bairro', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Cidade</label>
                                            <input
                                                type="text"
                                                value={end.cidade}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'cidade', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                                            <input
                                                type="text"
                                                value={end.estado}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'estado', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">País</label>
                                            <input
                                                type="text"
                                                value={end.pais}
                                                onChange={(e) => onUpdateArrayField('enderecos', idx, 'pais', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Familiares */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <UserCircle2 className="w-4 h-4" /> Familiares
                            </h4>
                            <button
                                type="button"
                                onClick={() => onAddArrayItem('familiares')}
                                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Adicionar Familiar
                            </button>
                        </div>
                        <div className="space-y-4">
                            {(formData.familiares || []).map((fam, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 -m-4 mb-3 rounded-t-xl px-4 border-b border-slate-200 dark:border-slate-700">
                                        <span className="text-xs font-bold text-slate-500">Familiar #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveArrayItem('familiares', idx)}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div className="lg:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Nome</label>
                                            <input
                                                type="text"
                                                value={fam.nome}
                                                onChange={(e) => onUpdateArrayField('familiares', idx, 'nome', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Parentesco</label>
                                            <input
                                                type="text"
                                                value={fam.parentesco}
                                                onChange={(e) => onUpdateArrayField('familiares', idx, 'parentesco', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Telefone</label>
                                            <input
                                                type="text"
                                                value={fam.telefone}
                                                onChange={(e) => onUpdateArrayField('familiares', idx, 'telefone', e.target.value)}
                                                className={`w-full px-3 py-1.5 bg-white dark:bg-slate-800 border ${fieldErrors[`familiar_telefone_${idx}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg outline-none text-slate-900 dark:text-white text-sm`}
                                                placeholder="(00) 00000-0000"
                                            />
                                            {fieldErrors[`familiar_telefone_${idx}`] && <p className="text-red-500 text-[10px] mt-1">{fieldErrors[`familiar_telefone_${idx}`]}</p>}
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Profissão</label>
                                            <input
                                                type="text"
                                                value={fam.profissao}
                                                onChange={(e) => onUpdateArrayField('familiares', idx, 'profissao', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Anotações */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FileEdit className="w-4 h-4" /> Anotações Adicionais
                        </h4>
                        <textarea
                            value={formData.anotacoes || ''}
                            onChange={(e) => onUpdateField('anotacoes', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                            placeholder="Anotações gerais sobre o paciente..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Salvar Alterações
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
