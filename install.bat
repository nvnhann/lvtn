@echo off

echo **********************INSTALL LIB**************************

call cd ./client

call npm i --legacy-peer-deps

call cd ../server

call npm i

pause