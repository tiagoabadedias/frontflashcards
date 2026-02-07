# Frontend Flashcards

Frontend moderno desenvolvido em React + TypeScript para gerenciar campanhas e questões de flashcards.

## 🚀 Funcionalidades

### Dashboard
- Visão geral do sistema com estatísticas principais
- Campanhas recentes
- Resumo de questões por categoria e dificuldade

### Campanhas
- ✅ Criar novas campanhas
- ✅ Listar todas as campanhas
- ✅ Filtrar por status (ativas/inativas)
- ✅ Buscar por nome ou descrição
- ✅ Ativar/desativar campanhas
- ✅ Deletar campanhas
- ✅ Definir datas de início e fim
- ✅ Adicionar tags

### Questões
- ✅ Listar todas as questões
- ✅ Filtrar por categoria, tipo, dificuldade e status
- ✅ Buscar questões por texto
- ✅ Visualizar detalhes completos das questões
- ✅ Suporte a diferentes tipos: múltipla escolha, verdadeiro/falso, aberta
- ✅ Visualização de opções para questões de múltipla escolha

### Estatísticas
- ✅ Gráficos de distribuição por dificuldade
- ✅ Gráficos de distribuição por tipo
- ✅ Status das campanhas
- ✅ Lista de categorias disponíveis
- ✅ Métricas gerais do sistema

## 🛠️ Tecnologias Utilizadas

- **React 18** - Library principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Query (TanStack)** - Gerenciamento de estado do servidor
- **React Hook Form** - Gerenciamento de formulários
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações
- **Lucide React** - Ícones
- **Date-fns** - Manipulação de datas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. Navegue até o diretório do frontend:
```bash
cd frontend-flashcards
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:
   - O frontend está configurado para se conectar com a API em `http://localhost:3001`
   - Para alterar, edite o arquivo `src/services/api.ts`

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador em: `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

## 🔗 Integração com a API

O frontend consome a API de flashcards através dos seguintes endpoints:

### Campanhas (`/campaigns`)
- `GET /campaigns` - Listar campanhas
- `POST /campaigns` - Criar campanha
- `GET /campaigns/:id` - Obter campanha específica
- `PATCH /campaigns/:id` - Atualizar campanha
- `PATCH /campaigns/:id/activate` - Ativar campanha
- `PATCH /campaigns/:id/deactivate` - Desativar campanha
- `DELETE /campaigns/:id` - Deletar campanha

### Questões (`/questions`)
- `GET /questions` - Listar questões com filtros
- `GET /questions/:id` - Obter questão específica
- `GET /questions/stats` - Estatísticas
- `GET /questions/categories` - Categorias disponíveis
- `GET /questions/tags` - Tags disponíveis
- `GET /questions/random` - Questões aleatórias
- `GET /questions/category/:category` - Por categoria
- `GET /questions/difficulty/:difficulty` - Por dificuldade

## 📱 Interface de Usuário

### Design System
- **Cores primárias**: Tons de azul (#0ea5e9)
- **Tipografia**: System fonts com fallbacks
- **Espaçamento**: Sistema baseado em Tailwind (4px, 8px, 16px, etc.)
- **Componentes**: Design limpo e moderno com cards e botões estilizados

### Componentes Principais
- **Header**: Navegação principal
- **Layout**: Container principal com padding responsivo
- **LoadingSpinner**: Indicador de carregamento
- **Alert**: Mensagens de feedback
- **Cards**: Containers para conteúdo

### Responsividade
- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Layout adaptativo para diferentes tamanhos de tela

## 🔄 Estado da Aplicação

### React Query
- Cache automático de dados
- Invalidação inteligente
- Retry automático em caso de erro
- DevTools para debugging

### Gerenciamento de Estado
- Estado do servidor: React Query
- Estado local: useState/useReducer
- Formulários: React Hook Form

## 🎯 Próximas Funcionalidades

- [ ] Edição inline de campanhas
- [ ] Exportação de dados (PDF/Excel)
- [ ] Relatórios detalhados
- [ ] Sistema de filtros avançados
- [ ] Modo escuro
- [ ] Internacionalização (i18n)

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com a API**
   - Verifique se a API está rodando em `http://localhost:3001`
   - Confira as configurações de CORS na API

2. **Dados não carregam**
   - Abra o DevTools do navegador
   - Verifique a aba Network para erros de requisição
   - Verifique o console para erros JavaScript

3. **Build falha**
   - Execute `npm install` para garantir dependências atualizadas
   - Verifique se não há erros de TypeScript

## 📄 Estrutura de Pastas

```
src/
├── components/         # Componentes reutilizáveis
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
├── services/          # Configuração da API
├── types/             # Tipos TypeScript
├── App.tsx           # Componente principal
├── main.tsx          # Entry point
└── index.css         # Estilos globais
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request# frontflashcards
