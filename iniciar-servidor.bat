@echo off
REM Script simplificado para iniciar apenas o servidor de dados
REM Use este script se o frontend já está rodando em outro terminal

cd /d "%~dp0"

if not exist "node_modules" (
    echo Instalando dependências...
    call npm install
)

if not exist "data" (
    mkdir data
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║   EventFlow - Servidor de Dados           ║
echo ║   http://localhost:3001/                  ║
echo ║   Banco de Dados: /data/                  ║
echo ║                                            ║
echo ║   Pressione Ctrl+C para parar              ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.

npm run server
pause
