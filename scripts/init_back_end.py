import json

def main():
    back_end_path = "./back-end"
    write_justfile(back_end_path)
    update_package_json(back_end_path)

def write_justfile(back_end_path: str) -> None:
    justfile_content = (
        "default:\n"
        "    @just --list\n"
        "\n"
        "# Set-up local dev\n"
        "set-up-local-dev:\n"
        "    @bun run dev\n"
    )
    with open(f"{back_end_path}/justfile", "w") as f:
        f.write(justfile_content)

def update_package_json(back_end_path: str) -> None:
    package_json_path = f"{back_end_path}/package.json"
    with open(package_json_path, "r+") as file:
        package_content = json.load(file)
        package_content["scripts"] = {}
        package_content["scripts"]["dev"] = "bun --bun --hot index.ts"

        """Bring to the start of the file delete everything before rewrite"""
        file.seek(0)
        file.truncate()
        json.dump(package_content, file, indent=2)

if __name__ == "__main__":
    main()
