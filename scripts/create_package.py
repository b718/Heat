import json
import subprocess

with open("./scripts/project.txt") as f:
    PROJECT_NAME = f.read().strip().split("PROJECT_NAME=")[1]

def main():
    if PROJECT_NAME == "": 
        return print("Please initialize a value for the 'PROJECT_NAME' key.")
    
    package_name = input("Please enter package name: ")
    create_package(package_name)
    update_package_jsons(package_name)

    print(f"Succesfully created '{package_name}' package!")

def create_package(package_name: str) -> None:
    package_path = f"../packages/{package_name}/src"
    package_json_content = create_package_json_content(package_name)

    subprocess.run(["mkdir", "-p", package_path])
    subprocess.run(["touch", package_path + f"/{package_name}.ts"])
    with open(f"{package_path}/../package.json", "w") as f:
        f.write(package_json_content)

def create_package_json_content(package_name: str) -> str:
    json_content = {
        "name": f"@{PROJECT_NAME}/{package_name}",
        "version": "1.0.0",
        "module": f"./src/{package_name}.ts",
        "types": f"./src/{package_name}.ts",
        "exports": {
            ".": f"./src/{package_name}.ts"
        }
    }
    return json.dumps(json_content, indent=2)

def update_package_jsons(package_name: str) -> None:
    paths = ["../front-end/package.json", "../back-end/package.json"]
    new_package = f"@{PROJECT_NAME}/{package_name}"

    for path in paths:
        with open(path, "r+") as file:
            package_content = json.load(file)
            if "dependencies" not in package_content:
                package_content["dependencies"] = {}
            package_content["dependencies"][new_package] = "workspace:*"

            """Bring to the start of the file delete everything before rewrite"""
            file.seek(0)
            file.truncate()
            json.dump(package_content, file, indent=2)

    workspaces = ["../front-end", "../back-end"]
    for workspace in workspaces:
        subprocess.run(["bun", "install"], cwd=workspace)

if __name__ == "__main__":
    main()