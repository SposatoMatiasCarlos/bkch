# Usa Node per far girare il server di sviluppo
FROM node:20-alpine
WORKDIR /app

# Copia i file di configurazione ed installa le dipendenze
COPY package.json package-lock.js[o]n ./
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Esponi la porta tipica di Vite
EXPOSE 5173

# Avvia in modalità sviluppo dicendo a Vite di ascoltare su tutte le interfacce
CMD ["npm", "run", "dev", "--", "--host"]