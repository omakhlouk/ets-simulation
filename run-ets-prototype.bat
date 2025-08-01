@echo off
echo Starting ETS Simulation Prototype...
echo.

:: Navigate to the project folder
cd /d %~dp0

:: Install dependencies
echo Installing dependencies...
call npm install

:: Start the development server
echo Starting development server...
call npm run dev
