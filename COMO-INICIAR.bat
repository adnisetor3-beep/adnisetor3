@echo off
chcp 65001 >nul
REM Script de informações - não faz nada, apenas exibe informações

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        EventFlow - Como Iniciar o Sistema                 ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Opção 1: SIMPLES (Recomendado para primeira vez)
echo ─────────────────────────────────────────────────
echo Duplo clique em: iniciar-completo.bat
echo.
echo O que faz:
echo   ✓ Verifica Node.js instalado
echo   ✓ Instala dependências automaticamente
echo   ✓ Abre servidor em uma janela
echo   ✓ Abre aplicação em outra janela
echo   ✓ Abre navegador automaticamente
echo.
echo.
echo Opção 2: ÚNICA JANELA (Para desenvolvimento)
echo ──────────────────────────────────────────────
echo Duplo clique em: iniciar.bat
echo.
echo O que faz:
echo   ✓ Inicia tudo em uma única janela
echo   ✓ Mostra todos os logs
echo   ✓ Press Ctrl+C para parar
echo.
echo.
echo ═════════════════════════════════════════════════════════════
echo.
echo CREDENCIAIS DE TESTE:
echo.
echo  Admin:   admin@demo.com / 123
echo  Usuário: user@demo.com / 123
echo  Viewer:  viewer@demo.com / 123
echo.
echo ═════════════════════════════════════════════════════════════
echo.
echo PORTAS:
echo.
echo  Frontend:  http://localhost:3000/
echo  Servidor:  http://localhost:3001/
echo.
echo ═════════════════════════════════════════════════════════════
echo.
pause
