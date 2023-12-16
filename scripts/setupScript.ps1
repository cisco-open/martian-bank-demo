# PowerShell script equivalent to the provided Bash script

# Setup

Set-Location ..

# Check for Dependencies
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "`n Node.js is not installed. Please install Node.js and npm."
    exit 1
}

if (-not (Get-Command "python3" -ErrorAction SilentlyContinue)) {
    Write-Host "`n Python 3 is not installed. Please install Python 3."
    exit 1
}

# Running JavaScript microservices

function Run-Javascript-Microservice {
    param (
        [string]$service_name,
        [string]$service_alias
    )

    $current_dir = Get-Location

    Write-Host "Running $service_name microservice..."

    Start-Process PowerShell -ArgumentList @"
        Set-Location '$current_dir\$service_name'
        npm install
        npm run $service_alias
"@

    Start-Sleep -Seconds 2

    Write-Host "$service_name is running...`n"
}

Run-Javascript-Microservice -service_name "ui" -service_alias "ui"
Run-Javascript-Microservice -service_name "customer-auth" -service_alias "auth"
Run-Javascript-Microservice -service_name "atm-locator" -service_alias "atm"

# Running Python microservices

function Run-Python-Microservice {
    param (
        [string]$service_name,
        [string]$service_alias
    )

    $current_dir = Get-Location

    Write-Host "Running $service_name microservice..."

    Start-Process PowerShell -ArgumentList @"
        Set-Location '$current_dir\$service_name'
        Remove-Item -Recurse venv_bankapp -ErrorAction SilentlyContinue
        python -m venv venv_bankapp
        .\venv_bankapp\Scripts\Activate
        pip install -r requirements.txt
        python '$service_alias.py'
"@

    Start-Sleep -Seconds 2

    Write-Host "$service_name is running...`n"
}

Run-Python-Microservice -service_name "dashboard" -service_alias "dashboard"
Run-Python-Microservice -service_name "accounts" -service_alias "accounts"
Run-Python-Microservice -service_name "transactions" -service_alias "transaction"
Run-Python-Microservice -service_name "loan" -service_alias "loan"

Write-Host "Setup completed successfully!"
