@echo off
cd /d "%~dp0"
echo.
echo  BabyRiiri - adding songs from the new-songs folder...
echo.
node scripts\add-songs.mjs
echo.
pause
