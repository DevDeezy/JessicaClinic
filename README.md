# Jessica Fisioterapia - Sistema de Gestão de Consultas

Uma aplicação moderna para gestão de consultas de uma clínica de fisioterapia.

## 🏗️ Arquitetura

Esta aplicação está dividida em três partes independentes:

| Componente | Tecnologia | Hospedagem |
|------------|------------|------------|
| **Frontend** | React + Vite | GitHub Pages |
| **Backend** | Netlify Functions | Netlify |
| **Base de Dados** | PostgreSQL | Neon |

## 🌟 Funcionalidades

### Landing Page Pública
- Design moderno e responsivo
- Informações sobre serviços
- Formulário de contacto

### Área do Fisioterapeuta
- **Dashboard**: Estatísticas e próximas consultas
- **Gestão de Consultas**: Marcar, alterar, cancelar
- **Gestão de Clientes**: Ficha completa com histórico
- **Agenda**: Calendário visual mensal
- **Ficheiros**: Guardar links do Google Drive

## 🚀 Deploy

### 1. Configurar Base de Dados (Neon)

1. Criar conta em [neon.tech](https://neon.tech)
2. Criar um novo projeto
3. Copiar a connection string

### 2. Configurar Backend (Netlify)

1. Criar conta em [netlify.com](https://netlify.com)
2. Criar novo site a partir do repositório Git
3. Configurar variáveis de ambiente:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=sua-chave-secreta-muito-segura
```

4. Após o deploy, executar migração:
```bash
npx prisma db push
npm run db:seed
```

5. Anotar o URL do Netlify (ex: `https://seu-site.netlify.app`)

### 3. Configurar Frontend (GitHub Pages)

1. No GitHub, ir a Settings > Secrets and Variables > Actions
2. Adicionar secret:
   - Nome: `VITE_API_URL`
   - Valor: `https://seu-site.netlify.app/.netlify/functions`

3. Ir a Settings > Pages
4. Selecionar "GitHub Actions" como source
5. O workflow irá fazer deploy automaticamente

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- Conta Neon (ou PostgreSQL local)

### Setup

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**

Criar ficheiro `.env`:
```env
DATABASE_URL=postgresql://user:pass@host/db
DIRECT_URL=postgresql://user:pass@host/db
JWT_SECRET=development-secret-key
```

3. **Criar base de dados**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. **Iniciar desenvolvimento**

Terminal 1 - Backend (Netlify Dev):
```bash
npx netlify dev
```

Terminal 2 - Frontend (Vite):
```bash
npm run dev
```

Abrir:
- Frontend: http://localhost:5173
- Backend: http://localhost:8888


## 📁 Estrutura

```
├── src/                    # Frontend React
│   ├── components/
│   ├── pages/
│   ├── store/
│   └── lib/
├── netlify/
│   └── functions/          # Backend Netlify Functions
│       ├── lib/
│       ├── auth-login.ts
│       ├── clients.ts
│       ├── appointments.ts
│       └── ...
├── prisma/
│   ├── schema.prisma       # Schema PostgreSQL
│   └── seed.ts
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD para GitHub Pages
```

## 🔐 Autenticação

A autenticação usa JWT (JSON Web Tokens):
1. Login retorna um token
2. Token é guardado no localStorage
3. Cada request à API inclui o token no header
4. Backend valida o token e extrai o utilizador

## 📝 Ficheiros via Google Drive

Os ficheiros são guardados como URLs:
1. Upload para Google Drive
2. Obter link de partilha
3. Colar link na aplicação

## 🛠️ Tecnologias

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router (navegação)
- Zustand (estado global)
- Tailwind CSS (estilos)
- Framer Motion (animações)
- date-fns (datas)
- Lucide React (ícones)

### Backend
- Netlify Functions (serverless)
- Prisma ORM
- JWT (autenticação)
- bcrypt (hash passwords)

### Base de Dados
- PostgreSQL (Neon)

---

Desenvolvido com ❤️ para clínicas de fisioterapia
