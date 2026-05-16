# Mind Blog — Frontend

Interface desenvolvida com **React + TypeScript + Vite** para o case de estágio da Mind Group.

## Tecnologias
- React 18 + TypeScript
- Vite 5 + React Router DOM v6
- Axios + Lucide React

## Pré-requisitos
- Node.js 18+
- Backend rodando em `http://localhost:3333`

## Configuração

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5173`. As chamadas `/api/*` são redirecionadas ao backend via proxy Vite.

## Estrutura

```
src/
├── components/     # Navbar, Footer, ArticleCard, PrivateRoute
├── contexts/       # AuthContext (JWT global)
├── pages/          # Home, Login, Register, Articles, ArticleDetail, Dashboard, ArticleForm, Settings
├── services/       # api.ts (Axios + interceptors)
└── types/          # Interfaces TypeScript
```

## Rotas

| Rota | Descrição | Auth |
|------|-----------|------|
| `/` | Home | ❌ |
| `/login` | Login | ❌ |
| `/register` | Cadastro | ❌ |
| `/articles` | Listagem (busca + filtro + grid/lista) | ❌ |
| `/articles/:id` | Detalhe + comentários | ❌ |
| `/dashboard` | Painel do autor | ✅ |
| `/articles/new` | Criar artigo | ✅ |
| `/articles/edit/:id` | Editar artigo | ✅ |
| `/settings` | Configurações do perfil | ✅ |

## Extras implementados
- Toggle grid/lista, busca em tempo real, filtro por categoria
- Skeleton loading, dropdown de usuário, modal de exclusão
- Contador de palavras/tempo de leitura, tags dinâmicas, preview de imagem
