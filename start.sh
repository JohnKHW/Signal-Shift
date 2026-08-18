#!/bin/bash
# Start Signal Shift — frontend (Vite) + backend (.NET API)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting .NET API (https://localhost:5124)..."
cd "$ROOT_DIR/Services"
dotnet run --project App.Api/App.Api.csproj &
API_PID=$!

echo "Starting React frontend (http://localhost:5173)..."
cd "$ROOT_DIR/react-app"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Frontend: http://localhost:5173"
echo "  API:      https://localhost:5124"
echo ""
echo "Press Ctrl+C to stop both services."

trap "echo 'Stopping...'; kill $API_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
