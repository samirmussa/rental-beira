# Rental Beira
A plataforma de aluguer de casas e apartamentos da Beira, Sofala – Moçambique
Next.js
Tailwind CSS
MongoDB
Rental Beira é uma aplicação web completa e moderna criada para facilitar a ligação direta entre arrendatários (pessoas à procura de casa) e proprietários na cidade da Beira e arredores.
Sem intermediários. Sem comissões exorbitantes. Apenas pessoas da Beira a alugar e a arrendar imóveis de forma simples, segura e transparente.
Live demo: https://rentalbeira.vercel.app/ (em produção)
Funcionalidades principais
Para Arrendatários

Pesquisa avançada por bairro, preço, quartos, WC, tipo de imóvel
Galeria de fotos com zoom e navegação
Mapa interativo com localização exata do imóvel
Sistema de avaliações e estrelas (1–5)
Chat direto com o proprietário (sem expor número de telefone)
Favoritos e histórico de visualizações
Avaliar o imóvel após aluguer

# Para Proprietários

Cadastro gratuito de imóveis (casa, apartamento, quarto, loja, etc.)
Upload de até 20 fotos por imóvel
Marcação de coordenadas no mapa (arrastar o pin)
Receber mensagens diretas dos interessados
Responder publicamente às avaliações
Dashboard com estatísticas de visualizações e curtidas
Badge de “Verificado” (em desenvolvimento)

# Funcionalidades gerais

Autenticação segura com NextAuth.js (Google + Credenciais)
Perfil de usuário com foto e telefone
Sistema de curtidas/favoritos
Registo automático de visualizações
Totalmente responsivo (funciona perfeitamente no telemóvel)
Otimizado para SEO (metadados dinâmicos)
100% em português (Moçambique)

# Tecnologias utilizadas

Camada,Tecnologia
Framework,Next.js 16 (App Router) + React Server Components
UI / Styling,Tailwind CSS + shadcn/ui
Banco de dados,MongoDB (Atlas) + Mongoose
Autenticação,NextAuth.js
Mapas,Leaflet + OpenStreetMap
Deploy,Vercel
Imagens,Upload direto para Cloudinary / Vercel Blob
Lint / Formatação,ESLint + Prettier

# Como rodar localmente
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/rental-beira.git
cd rental-beira

# 2. Instalar dependências
npm install
# ou
yarn
# ou
pnpm install

# 3. Criar ficheiro .env.local (veja .env.example)
cp .env.example .env.local

# 4. Preencher as variáveis de ambiente
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma_string_muito_forte_aqui
MONGODB_URI=sua_string_de_conexao_mongodb
CLOUDINARY_URL=opcional_para_upload_de_fotos

# 5. Rodar o projeto
npm run dev
# ou
yarn dev

# Abrir http://localhost:3000

# Contribuir
Toda a contribuição é super bem-vinda!
A Beira é a nossa cidade — quanto mais mãos, mais rápido a plataforma fica perfeita.

# Como ajudar:

Poder expandir para outras cidades de Moz
Corrigir bugs
Melhorar a UI/UX
Traduzir para macua/sena (futuro)
Criar versão PWA/offline
Basta abrir uma Issue ou mandar um Pull Request.

# Feito com muito orgulho na Beira
Por um filho da terra que quer ver a cidade crescer de forma organizada e digital.
#BeiraDigital #SofalaOnline #AluguerSemBurocracia
Qualquer dúvida:
Email: samirhussene646@gmail.com
WhatsApp: +258 87 0656702
# Juntos tornamos a procura de casa na Beira mais fácil!
