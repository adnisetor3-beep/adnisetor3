@echo off
REM Script simplificado para iniciar apenas o sistema Frontend
REM Use este script se o servidor já está rodando em outro terminal

cd /d "%~dp0"

if not exist "node_modules" (
    echo Instalando dependências...
    call npm install
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║   EventFlow - Iniciando Frontend          ║
echo ║   http://localhost:3000/                  ║
echo ║                                            ║
echo ║   Pressione Ctrl+C para parar              ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.

npm run dev
pause
