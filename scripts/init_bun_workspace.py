import json
import subprocess

def main():
    project_name = input("Please enter your project name: ")
    subprocess.run(["touch", "./scripts/project.txt"])
    with open("./scripts/project.txt", "w") as f:
        f.write(f"PROJECT_NAME={project_name}\n")
    subprocess.run(["bun", "init", "--yes"])
    subprocess.run(["rm", "-rf", "tsconfig.json", "CLAUDE.md", ".cursor"])

    with open("package.json", "r+") as file:
        package_content = json.load(file)
        package_content["scripts"] = {}
        package_content["scripts"]["format"] = "prettier --write \"**/*.{ts,tsx,js,mjs}\" --ignore-path .prettierignore"
        package_content["type"] = "module"
        package_content["workspaces"] = ["front-end", "back-end", "packages/*"]
        package_content["name"] = project_name
 
        """Bring to the start of the file delete everything before rewrite"""
        file.seek(0)
        file.truncate()
        json.dump(package_content, file, indent=2)
    
if __name__ == "__main__":
    main()