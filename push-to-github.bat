@echo off
setlocal
echo ===================================================
echo   SAHER SEGURIDAD - SUBIR PROYECTO A GITHUB
echo ===================================================
echo.
set /p REPO_URL="Pega la URL de tu repositorio en GitHub (ej. https://github.com/tu-usuario/tu-repo.git): "
if "%REPO_URL%"=="" goto error

echo.
echo Conectando con GitHub y subiendo la rama main...
"C:\Users\ALIENWARE\.gemini\antigravity\MinGit\cmd\git.exe" remote remove origin 2>nul
"C:\Users\ALIENWARE\.gemini\antigravity\MinGit\cmd\git.exe" remote add origin %REPO_URL%
"C:\Users\ALIENWARE\.gemini\antigravity\MinGit\cmd\git.exe" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo  [EXITO] Proyecto subido correctamente a GitHub!
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo  [AVISO] Si GitHub te pidio credenciales o token,
    echo  asegurate de haber iniciado sesion en tu navegador.
    echo ===================================================
)
goto end

:error
echo Debes ingresar una URL valida.

:end
pause
