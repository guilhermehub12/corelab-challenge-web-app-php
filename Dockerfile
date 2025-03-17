FROM node:22-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Configurar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Camada de dependências
FROM base AS deps
RUN npm ci

# Camada de construção
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Camada de produção
FROM base AS runner
ENV NODE_ENV=production

# Configurar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copiar apenas os arquivos necessários
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Expor porta e iniciar aplicação
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]