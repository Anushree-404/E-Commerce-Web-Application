@echo off
echo ========================================
echo   TaskFlow - Task Manager Application
echo ========================================
echo.
echo Starting backend server...
start "TaskFlow Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend dev server...
start "TaskFlow Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ========================================
echo   Both servers are starting...
echo   Backend:  http://localhost:4000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
