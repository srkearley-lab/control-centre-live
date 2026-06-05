# Paths
$source = "C:\Users\ai-bot\.openclaw\workspace\control-centre"
$destination = "C:\Users\ai-bot\OneDrive\ClawBackup"

# Ensure destination exists
if (-not (Test-Path $destination)) {
    New-Item -ItemType Directory -Path $destination -Force
}

# Copy folder contents recursively
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force