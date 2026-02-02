@echo off
REM Script para iniciar o EventFlow Agenda - Versão Completa
REM Este script abre o servidor e a aplicação em janelas separadas
REM Autor: Sistema EventFlow
REM Data: 2026

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           EventFlow - Sistema de Agenda                   ║
echo ║                                                            ║
echo ║           Iniciando sistema completo...                   ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verifica se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Node.js não foi encontrado no sistema!
    echo Por favor, instale o Node.js a partir de: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verifica se estamos no diretório correto
if not exist "package.json" (
    echo.
    echo [ERRO] O arquivo package.json não foi encontrado.
    echo Certifique-se de executar este script na pasta do projeto.
    echo.
    pause
    exit /b 1
)

REM Instala dependências se necessário
if not exist "node_modules" (
    echo.
    echo [INFO] Instalando dependências do projeto...
    echo Isso pode levar alguns minutos na primeira vez...
    echo.
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo.
        echo [ERRO] Falha ao instalar as dependências.
        echo.
        pause
        exit /b 1
    )
)

REM Cria pasta de dados se não existir
if not exist "data" (
    echo [INFO] Criando pasta de armazenamento de dados...
    mkdir data
)

REM Inicia o sistema em duas janelas
echo.
echo [INFO] Abrindo servidor em nova janela...
start "EventFlow - Servidor (3001)" cmd /k "npm run server"

REM Aguarda um pouco para o servidor iniciar
timeout /t 3 /nobreak

echo [INFO] Abrindo aplicação em nova janela...
start "EventFlow - Aplicação (3000)" cmd /k "npm run dev"

REM Aguarda um pouco
timeout /t 2 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║  Sistema iniciado com sucesso!                            ║
echo ║                                                            ║
echo ║  Servidor de Dados:                                       ║
echo ║  → http://localhost:3001/                                 ║
echo ║                                                            ║
echo ║  Aplicação Web:                                           ║
echo ║  → http://localhost:3000/                                 ║
echo ║                                                            ║
echo ║  Banco de Dados: /data/                                   ║
echo ║  - events.json   (Eventos salvos)                         ║
echo ║  - users.json    (Usuários registrados)                   ║
echo ║                                                            ║
echo ║  Credenciais de teste:                                    ║
echo ║  Admin: admin@demo.com / 123                              ║
echo ║  User:  user@demo.com / 123                               ║
echo ║  Viewer: viewer@demo.com / 123                            ║
echo ║                                                            ║
echo ║  Para parar: Feche as duas janelas de terminal            ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Tenta abrir o navegador automaticamente
timeout /t 2 /nobreak
echo [INFO] Abrindo navegador...
start http://localhost:3000/

echo.
echo [OK] Sistema está rodando! Você pode fechar esta janela.
echo Duas novas janelas foram abertas com o servidor e a aplicação.
echo.
pause
