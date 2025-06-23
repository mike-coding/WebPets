@echo off
setlocal
set "SCRIPT_DIR=%~dp0"

echo.
echo Select an option:
echo 1. Run DB utility
echo 2. Run dev (frontend + backend)
echo 3. Build and run preview (frontend + backend)
echo 4. Run preview only (frontend + backend)
echo.

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%'; python dbUtility.py"
    goto :eof
)

if "%choice%"=="2" (
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%/backEnd/server'; python app.py"
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%/frontEnd'; npm run dev -- --host 0.0.0.0"
    goto :eof
)

if "%choice%"=="3" (
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%/backEnd/server'; python app.py"
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%/frontEnd'; npm run build; npm run preview -- --host 0.0.0.0"
    goto :eof
)

if "%choice%"=="4" (
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%/backEnd/server'; python app.py"
    start "" powershell.exe -NoExit -Command "Set-Location -LiteralPath '%SCRIPT_DIR%/frontEnd'; npm run preview -- --host 0.0.0.0"
    goto :eof
)

echo Invalid choice.
pause
exit /b 1