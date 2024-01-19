import os
import subprocess
import time
import shutil
import platform
#######################################################################################

# Check for Dependencies
if not shutil.which("node"):
    print("Node.js is not installed. Please install Node.js and npm.")
    exit(1)
if platform.system()=='Windows':
    os.chdir("..")
    if not shutil.which("python"):
        print("Python 3 is not installed. Please install Python 3.")
        exit(1)
elif platform.system()=='Darwin':
    os.chdir("..")
    if not shutil.which("python3"):
        print("Python 3 is not installed. Please install Python 3.")
        exit(1)
elif platform.system() == 'Linux':
    if not shutil.which("python3"):
        print("Python 3 is not installed. Please install Python 3.")
        exit(1)

#######################################################################################
## Running Javascript microservices

def run_javascript_microservice(service_name, service_alias):

    current_dir = os.getcwd()
    print(f"Running {service_name} microservice...")
    os.chdir(f"{current_dir}/{service_name}")
    print(os.getcwd())
    env_file = ".env"   
    if not os.path.isfile(env_file):
        file = ".env.example"
        if os.path.isfile(file):
            with open(file, 'r') as f:
                for line in f:
                    key, _ = line.strip().split('=')
                    if key=='DB_URL':
                        new_value = input(f"Enter value for {key}: ")
                    else:
                        new_value = input(f"Enter value for {key} (optional): ")
                    with open(env_file, 'a') as env:
                        env.write(f"{key}={new_value}\n")
        else:
            print(f"{file} not found.")
    if platform.system()=='Windows':
        subprocess.run(["powershell.exe", "-command", f"Start-Process powershell.exe -ArgumentList \"-NoExit\", \"-Command\", \"npm install;npm run {service_alias}\""])
    elif platform.system()=='Darwin':
        command = (
        f"osascript -e 'tell application \"Terminal\" to do script "
        f"\"cd '{current_dir}' && cd '{service_name}' && "
        f"npm install && npm run {service_alias}\"'"
        )
        subprocess.run(command, shell=True)
    elif platform.system()=='Linux':
        subprocess.run(["dbus-launch", "gnome-terminal", "--", "bash", "-c", f"npm install && npm run {service_alias}"])
    else:
        print('Unsupported os') 
    os.chdir(current_dir)
    time.sleep(2)
    print(f"{service_name} is running ...")
    print()
run_javascript_microservice("ui", "ui")
run_javascript_microservice("customer-auth", "auth")
run_javascript_microservice("atm-locator", "atm")

#######################################################################################
# Running Python microservices

def run_python_microservice(service_name, service_alias):
    current_dir = os.getcwd()

    print(f"Running {service_name} microservice ...")

    os.chdir(f"{current_dir}/{service_name}")

    env_file = ".env"
    if not os.path.isfile(env_file):
        file = ".env.example"
        if os.path.isfile(file):
            with open(file, 'r') as f:
                for line in f:
                    key, _ = line.strip().split('=')
                    if key=='DB_URL':
                        new_value = input(f"Enter value for {key}: ")
                    else:
                        new_value = input(f"Enter value for {key} (optional): ")
                    with open(env_file, 'a') as env:
                        env.write(f"{key}={new_value}\n")
        else:
            print(f"{file} not found.")
    if platform.system()=='Windows':
        subprocess.run(["powershell.exe", "-command", f"Start-Process powershell.exe -ArgumentList \"-NoExit\", \"-Command\", \"python -m venv venv_bankapp; venv_bankapp\\Scripts\\activate; pip install -r requirements.txt; python {service_alias}.py\""])
    elif platform.system()=='Darwin':
        command = (
    f"osascript -e 'tell application \"Terminal\" to do script "
    f"\"cd '{current_dir}' && cd '{service_name}' && "
    f"rm -rf venv_bankapp && python3 -m venv venv_bankapp && "
    f"source venv_bankapp/bin/activate && "
    f"pip3 install -r requirements.txt && python3 '{service_alias}.py'\"'"
    )
        subprocess.run(command, shell=True)
    elif platform.system()=='Linux':
        pass
        # subprocess.run(["dbus-launch","gnome-terminal", "--", "bash", "-c", f"python3 -m venv venv_bankapp && source venv_bankapp/bin/activate && pip install -r requirements.txt && python3 {service_alias}.py"])
    else:
        print('Unsupported os')
    os.chdir(current_dir)
    time.sleep(2)

    print(f"{service_name} is running ...")
    print()

run_python_microservice("dashboard", "dashboard")
run_python_microservice("accounts", "accounts")
run_python_microservice("transactions", "transaction")
run_python_microservice("loan", "loan")

print("Setup completed successfully!")
