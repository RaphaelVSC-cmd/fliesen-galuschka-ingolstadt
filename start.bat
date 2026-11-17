@echo off
echo Starting local server for Fliesen Theo Galuschka...
start "" http://localhost:8080
python -m http.server 8080
