@echo off
echo Updating .env file to fix Clerk warnings...

REM Create a backup
copy .env .env.backup

REM Update the deprecated prop
powershell -Command "(Get-Content .env) -replace 'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/', 'NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL=/' | Set-Content .env"

echo .env file updated successfully!
echo Please restart your development server for changes to take effect.
pause
