FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y \
    ffmpeg python3 curl git \
 && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
         -o /usr/local/bin/yt-dlp \
 && chmod +x /usr/local/bin/yt-dlp \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone --depth=1 https://github.com/lisalepardeany-coder/maowcore.git .

RUN npm ci --omit=dev

RUN mkdir -p data && chown -R node:node /app

ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV YTDLP_DIR=/usr/local/bin
ENV YTDLP_FILENAME=yt-dlp
ENV CONTROL_HOST=0.0.0.0
ENV CONTROL_PORT=8765
ENV NODE_ENV=production

USER node
EXPOSE 8765
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "require('http').get('http://127.0.0.1:8765/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "index.js"]
