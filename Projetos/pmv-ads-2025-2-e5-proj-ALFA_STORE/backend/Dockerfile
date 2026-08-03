FROM node:18-alpine

WORKDIR /app

# Copia dos Arquivos de Dependência:
COPY package.json ./
COPY package-lock.json ./

# Instalação das Dependências (incluindo devDependencies para testes)
RUN npm ci

# Cópia do Código-Fonte
# Copia todo o resto do código do nosso projeto para o diretório /app no contêiner
COPY . .

# Build da Aplicação
# Nota: Testes são executados via GitHub Actions antes do merge para main
RUN npm run build

# Remove devDependencies para imagem de produção menor
RUN npm prune --production

# Exposição da Porta
EXPOSE 3000

# Comando de Execução
CMD ["node", "dist/server.js"]