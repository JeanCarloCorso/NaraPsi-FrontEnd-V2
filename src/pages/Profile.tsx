import { UserCircle, Save, Phone, MapPin, Briefcase, Loader2, Plus, Trash2, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';
import { maskCPF, maskRG, cleanDigits } from '@shared/utils/masks';
import { useProfileForm } from '@features/profile/hooks/useProfileForm';

export default function Profile() {
    const {
        isLoading,
        isSaving,
        message,
        errors,
        formData,
        handleFieldChange,
        handleTelefoneChange,
        addTelefone,
        removeTelefone,
        handleEnderecoChange,
        addEndereco,
        removeEndereco,
        handleSaveProfile,
        isSavingSenha,
        senhaData,
        senhaErrors,
        handleSenhaFieldChange,
        handleUpdateSenha
    } = useProfileForm();

    const handleSubmit = handleSaveProfile;

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 relative">

            {/* Super Toast Message 10s */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-xl transition-all duration-300 animate-in slide-in-from-right bg-white dark:bg-slate-800 border-l-4 min-w-[300px]
                    ${message.type === 'success' ? 'border-green-500' : message.type === 'error' ? 'border-red-500' : 'border-blue-500'}`}>

                    {message.type === 'success' && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
                    {message.type === 'error' && <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />}
                    {message.type === 'info' && <Info className="w-6 h-6 text-blue-500 shrink-0" />}

                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm leading-tight pr-6">
                        {message.text}
                    </p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Editar Perfil</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie suas informações pessoais, profissionais, contato e localizações.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Dados Pessoais */}
                    <section>
                        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Dados Pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                                <input type="text" value={formData.nome} onChange={(e) => handleFieldChange('nome', e.target.value)} required
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.nome ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                                <input type="email" value={formData.email} onChange={(e) => handleFieldChange('email', e.target.value)} required
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CPF</label>
                                <input type="text" value={formData.cpf} onChange={(e) => handleFieldChange('cpf', maskCPF(e.target.value))} maxLength={14}
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.cpf ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} placeholder="000.000.000-00" />
                                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RG</label>
                                <input type="text" value={formData.rg} onChange={(e) => handleFieldChange('rg', maskRG(e.target.value))} maxLength={14} placeholder="RG ou CPF"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data Nascimento *</label>
                                <input type="date" value={formData.data_nascimento} onChange={(e) => handleFieldChange('data_nascimento', e.target.value)}
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.data_nascimento ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 [&::-webkit-calendar-picker-indicator]:dark:invert transition-all`} />
                                {errors.data_nascimento && <p className="text-red-500 text-xs mt-1">{errors.data_nascimento}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sexo</label>
                                <select value={formData.sexo} onChange={(e) => handleFieldChange('sexo', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200">
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Dados Profissionais */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Briefcase className="w-5 h-5 text-slate-400" />
                            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Profissional</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CRP</label>
                                <input type="text" value={formData.crp} onChange={(e) => handleFieldChange('crp', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Especialidade</label>
                                <input type="text" value={formData.especialidade} onChange={(e) => handleFieldChange('especialidade', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                            </div>
                        </div>
                    </section>

                    {/* Contato (Dinâmico) */}
                    <section>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Contatos Telefônicos</h2>
                            </div>
                            <button type="button" onClick={addTelefone} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.telefones.map((telefone, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                                    <div className="sm:col-span-5">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número</label>
                                        <input type="text" value={telefone.numero} onChange={(e) => handleTelefoneChange(index, 'numero', e.target.value)} placeholder="(00) 00000-0000" maxLength={15}
                                            className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${errors[`telefone_${index}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                        {errors[`telefone_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`telefone_${index}`]}</p>}
                                    </div>
                                    <div className="sm:col-span-6">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                                        <input type="text" value={telefone.descricao} onChange={(e) => handleTelefoneChange(index, 'descricao', e.target.value)} placeholder="Ex: Consultório, Pessoal..."
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                        <button type="button" onClick={() => removeTelefone(index)} disabled={formData.telefones.length === 1}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Endereços (Dinâmicos com viaCEP) */}
                    <section>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Endereços de Atendimento</h2>
                            </div>
                            <button type="button" onClick={addEndereco} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </div>
                        <div className="space-y-6">
                            {formData.enderecos.map((endereco, index) => (
                                <div key={index} className="p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/10 space-y-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{endereco.descricao || `Endereço ${index + 1}`}</h3>
                                        <button type="button" onClick={() => removeEndereco(index)} disabled={formData.enderecos.length === 1}
                                            className="p-1 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors disabled:opacity-30">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                                        <div className="col-span-6 sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CEP</label>
                                            <input type="text" value={endereco.cep} onChange={(e) => handleEnderecoChange(index, 'cep', e.target.value)} maxLength={9} placeholder="00000-000"
                                                className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${errors[`cep_${index}`] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                            {errors[`cep_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`cep_${index}`]}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-4">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rua / Logradouro</label>
                                            <input type="text" value={endereco.endereco} onChange={(e) => handleEnderecoChange(index, 'endereco', e.target.value)} placeholder="Av. Paulista..."
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número</label>
                                            <input type="text" value={endereco.numero} onChange={(e) => handleEnderecoChange(index, 'numero', cleanDigits(e.target.value))} placeholder="123"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Complemento</label>
                                            <input type="text" value={endereco.complemento} onChange={(e) => handleEnderecoChange(index, 'complemento', e.target.value)} placeholder="Apto 101"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bairro</label>
                                            <input type="text" value={endereco.bairro} onChange={(e) => handleEnderecoChange(index, 'bairro', e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                                            <input type="text" value={endereco.cidade} onChange={(e) => handleEnderecoChange(index, 'cidade', e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UF</label>
                                            <input type="text" value={endereco.estado} onChange={(e) => handleEnderecoChange(index, 'estado', e.target.value.toUpperCase())} maxLength={2} placeholder="SP"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">País</label>
                                            <input type="text" value={endereco.pais} onChange={(e) => handleEnderecoChange(index, 'pais', e.target.value)} placeholder="Brasil"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Apelido (ex: Clínica)</label>
                                            <input type="text" value={endereco.descricao} onChange={(e) => handleEnderecoChange(index, 'descricao', e.target.value)} placeholder="Matriz"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-500/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>

                <hr className="my-10 border-slate-200 dark:border-slate-800" />

                <form onSubmit={handleUpdateSenha} className="space-y-6">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Lock className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Segurança e Acesso</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Senha Atual *</label>
                            <input type="password" value={senhaData.senhaAntiga} onChange={(e) => handleSenhaFieldChange('senhaAntiga', e.target.value)} required
                                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${senhaErrors.senhaAntiga ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} placeholder="Sua senha atual" />
                            {senhaErrors.senhaAntiga && <p className="text-red-500 text-xs mt-1">{senhaErrors.senhaAntiga}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nova Senha *</label>
                            <input type="password" value={senhaData.novaSenha} onChange={(e) => handleSenhaFieldChange('novaSenha', e.target.value)} required
                                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${senhaErrors.novaSenha ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} placeholder="No mínimo 8 caracteres" />
                            {senhaErrors.novaSenha && <p className="text-red-500 text-xs mt-1">{senhaErrors.novaSenha}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Nova Senha *</label>
                            <input type="password" value={senhaData.confirmarSenha} onChange={(e) => handleSenhaFieldChange('confirmarSenha', e.target.value)} required
                                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${senhaErrors.confirmarSenha ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} placeholder="Repita a nova senha" />
                            {senhaErrors.confirmarSenha && <p className="text-red-500 text-xs mt-1">{senhaErrors.confirmarSenha}</p>}
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSavingSenha}
                            className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                        >
                            {isSavingSenha ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                            {isSavingSenha ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
