@echo off
TITLE AdaptiveCloud Endpoint Agent (AWS Cloud)
cls
echo ======================================================================
echo       ADAPTIVECLOUD - ENDPOINT FLEET AGENT CONNECTED TO AWS
echo ======================================================================
echo  AWS Cloud Hub URL : http://13.126.201.190
echo.
python "%~dp0agent\src\main.py"
pause
