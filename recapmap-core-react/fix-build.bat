@echo off
echo === RecapMap Build Fix Script ===
echo.

echo 1. Cleaning npm cache...
npm cache clean --force

echo.
echo 2. Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules removed
) else (
    echo node_modules not found
)

echo.
echo 3. Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo package-lock.json removed
) else (
    echo package-lock.json not found
)

echo.
echo 4. Installing dependencies...
npm install

echo.
echo 5. Running TypeScript check...
npx tsc --noEmit --project tsconfig.app.json

echo.
echo 6. Attempting build...
npm run build

echo.
echo === Build Fix Complete ===
pause
