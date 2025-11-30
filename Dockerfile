# -----------------------------------------------------------------
# Estágio 1: Base e Instalação de Dependências do Sistema
# -----------------------------------------------------------------
# Usamos uma imagem base do Ubuntu, um sistema Linux estável e popular.
FROM ubuntu:22.04

# Define variáveis de ambiente para automatizar instalações e configurar caminhos
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_SDK_ROOT="/opt/android-sdk"
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"

# Adiciona os caminhos das ferramentas ao PATH do sistema
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools
ENV PATH=$PATH:/opt/node/bin

# Atualiza os pacotes do sistema e instala as dependências essenciais
# - wget e unzip: para baixar e extrair arquivos
# - git: para o controle de versão
# - openjdk-17-jdk: a versão do Java que sabemos que funciona
RUN apt-get update && \
    apt-get install -y wget unzip git openjdk-17-jdk && \
    rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------
# Estágio 2: Instalação do Node.js
# -----------------------------------------------------------------
# Baixa e instala uma versão LTS (Long Term Support) do Node.js
RUN wget https://nodejs.org/dist/v20.15.1/node-v20.15.1-linux-x64.tar.xz && \
    mkdir -p /opt/node && \
    tar -xf node-v20.15.1-linux-x64.tar.xz -C /opt/node --strip-components=1 && \
    rm node-v20.15.1-linux-x64.tar.xz

# -----------------------------------------------------------------
# Estágio 3: Instalação do Android SDK
# -----------------------------------------------------------------
# Baixa as ferramentas de linha de comando do Android SDK
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip && \
    mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    unzip /tmp/cmdline-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Usa o sdkmanager (a ferramenta do Android) para baixar as plataformas e build-tools necessárias
# O 'yes |' serve para aceitar todas as licenças automaticamente
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# -----------------------------------------------------------------
# Estágio 4: Configuração e Build do Projeto
# -----------------------------------------------------------------
# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia primeiro os arquivos de manifesto de dependências.
# Isso aproveita o cache do Docker: se esses arquivos não mudarem, o 'npm install' não roda de novo.
COPY package.json package-lock.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia todo o resto do código do seu projeto para dentro do container
COPY . .

# Comando principal que será executado ao rodar o container.
# Ele gera a pasta 'android' e depois compila o APK de release.
CMD ["sh", "-c", "npx expo prebuild --clean --platform android && cd android && ./gradlew assembleRelease"]