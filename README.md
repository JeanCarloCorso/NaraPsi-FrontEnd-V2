# NaraPsi - FrontEnd V2 🧠

O **NaraPsi** é um sistema moderno e completo de Gestão para Clínicas de Psicologia, projetado para facilitar o dia a dia de psicólogos através da administração de prontuários eletrônicos, pacientes e sessões terapêuticas.

> 🎓 **Projeto Acadêmico (TCC)**: Este repositório é fruto de um Trabalho de Conclusão de Curso para a graduação no Bacharelado em **Ciência da Computação**.
> 
> ⚙️ **Atenção**: Este projeto representa **exclusivamente a camada Front-End**. Todas as operações de banco de dados, regras de negócio aprofundadas e gerenciamento de estados acontecem no Back-End via comunicação **REST API**.

Este repositório contém o código-fonte da aplicação User Interface (V2), reconstruída com foco em performance, experiência do usuário (UX), design responsivo e arquitetura escalável.

---

## 🚀 Tecnologias e Stack

O projeto utiliza tecnologias de ponta para garantir uma interface rápida e confiável:

- **[React 19](https://react.dev/)** - Biblioteca principal para construção de interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática oferecendo maior segurança e inteligência (IntelliSense).
- **[Vite](https://vitejs.dev/)** - Empacotador e servidor local ultra-rápido.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS Utility-first para estilização rápida e responsiva, com suporte nativo ao `Dark Mode`.
- **[React Router DOM v7](https://reactrouter.com/)** - Gerenciamento de rotas e navegação da SPA.
- **[Axios](https://axios-http.com/)** - Cliente HTTP para comunicação com a API backend (inclui Interceptors para Injeção de JWT/Tokens).
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones modernos e leves em SVG.
- **[React Quill](https://github.com/zenoamaro/react-quill) & [TinyMCE](https://www.tiny.cloud/)** - Editores de texto Rico (Rich Text) para anotações em prontuários.
- **[Recharts](https://recharts.org/)** - Renderização de gráficos administrativos gerenciais.

---

## ✨ Funcionalidades Principais

1. **Autenticação e Perfis de Acesso (RBAC)**
   - O sistema suporta múltiplas roles: `Administrador`, `Psicólogo` e `Paciente/Usuário`.
   - Redirecionamento dinâmico dependendo das permissões do usuário logado. Administradores visualizam dashboards de retenção; Psicólogos visualizam a lista de pacientes; Usuários comuns possuem uma área estrita em construção.

2. **Gestão do Prontuário Eletrônico**
   - **Informações do Paciente:** Visualização de Anamnese e dados vitais.
   - **Sessões Terapêuticas:** Registro cronológico das consultas do paciente.
   - **Documentos e Anexos:** Centralização de arquivos clínicos com componentes responsivos e em formato `Accordion`.

3. **Nara IA - Assistente Virtual Inteligente**
   - Um Chat Flutuante exclusivo dentro da tela de prontuário, conectado via API para auxiliar o psicólogo com dúvidas técnicas e análises de casos de forma contextualizada. Renderiza código complexo, tem auto-scroll e animações dinâmicas de digitação.

4. **Painel Administrativo**
   - Criação e Gestão de Usuários e Tipos de Perfis personalizados.
   - Fluxo especializado de onboard/cadastro para Novos Psicólogos (Validação de CRP, automação de endereço via ViaCEP, etc).

5. **Design System & Segurança**
   - `Dark Mode` e `Light Mode` perfeitamente integrados com memória em LocalStorage.
   - Mascaramento e formatação de inputs (CPF, CNPJ, RG, CEP, Telefones).
   - Telas de configuração e Segurança de Perfil (Atualização de senhas via endpoint).

---

## 📂 Visão Geral da Arquitetura

O projeto segue a abordagem arquitetural orientada a **Features** (Feature-Sliced Design simplificado), mantendo cada módulo de negócio contido com seus respectivos arquivos de visualização, estado e integração.

```text
src/
├── assets/         # Imagens estáticas e recursos visuais padrão
├── features/       # Módulos principais separados por Regra de Negócio
│   ├── admin/      # Todo o escopo de gestão, rotas e páginas de administrador
│   ├── auth/       # Serviços e Hooks para lidar com login, tokens e sessões
│   ├── profile/    # Edição de Conta local e redefinição de Senhas
│   └── prontuario/ # Tratamento complexo de anamnese e sessões de terapia
├── pages/          # Algumas páginas raiz (Home, Login, Erros)
├── shared/         # Itens compartilhados globalmente no app
│   ├── api/        # Configuração do Axios base (ApiClient)
│   ├── components/ # Componentes genéricos e comuns de UI (Chats, Modais, Inputs)
│   ├── layouts/    # Estruturas da tela (Topbars e Sidebars Base)
│   └── utils/      # Mascaramentos, Formatadores, Conversores de Datas, etc..
├── App.tsx         # Declaração do BrowserRouter (React Router) e Árvore de Rotas
└── main.tsx        # Ponto de entrada ("Root") para montagem da árvore React
```

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- `npm` ou `yarn` instalados.
- Um Back-End NaraPsi rodando e configurado.

### Passos

1. **Clone o Repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd NaraPsi-FrontEnd-V2
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie ou renomeie na raiz um arquivo com o nome `.env` seguindo a estrutura de exemplo apresentada no .env.example:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_API_TINY_KEY=minha_chave
   ```

4. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação subirá através do Vite. Um link, tipicamente `http://localhost:5173`, será impresso no terminal.

5. **(Opcional) Gere um Build de Produção:**
   ```bash
   npm run build
   ```
   Isso verificará as restrições estáticas do Typescript (`tsc -b`) e usará o compilar nativo produzindo o pacote otimizado na pasta `/dist/`.

---
