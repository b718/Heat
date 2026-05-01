with open("./scripts/project.txt") as f:
    PROJECT_NAME = f.read().strip().split("PROJECT_NAME=")[1]

def main():
    local_dev = (
        "### Local Development\n\n"
        "To get this running locally do the following.\n\n"
        "1. Make sure you have Docker desktop installed.\n"
        "2. Make sure you have mprocs installed.\n"
        "3. To start both the front and back end(s), type `mprocs` in the terminal."
    )

    sections = [
        f"## {PROJECT_NAME.capitalize()}",
        "## Demo Video",
        "## Architecture",
        "## Tech Stack",
        "### Front-End",
        "### Back-End",
        "### Database",
        local_dev,
    ]

    README = "\n\n".join(sections) + "\n"

    with open("./README.md", "w") as f:
        f.write(README)

    print(f"README.md initialized for '{PROJECT_NAME}'")

if __name__ == "__main__":
    main()
