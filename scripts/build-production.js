const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// List of directories and files to exclude from production build
const excludePaths = [
  "app/settings",
  "components/settings-layout.tsx",
  "components/supabase-config.tsx",
  "app/api/test-supabase-connection",
]

// Function to temporarily rename files/directories
function renameForBuild() {
  excludePaths.forEach((p) => {
    const fullPath = path.join(process.cwd(), p)
    if (fs.existsSync(fullPath)) {
      fs.renameSync(fullPath, `${fullPath}.excluded`)
      console.log(`Excluded: ${p}`)
    }
  })
}

// Function to restore original names
function restoreAfterBuild() {
  excludePaths.forEach((p) => {
    const excludedPath = path.join(process.cwd(), `${p}.excluded`)
    if (fs.existsSync(excludedPath)) {
      fs.renameSync(excludedPath, path.join(process.cwd(), p))
      console.log(`Restored: ${p}`)
    }
  })
}

// Main build process
try {
  console.log("Preparing production build without settings...")
  renameForBuild()
  console.log("Running build...")
  execSync("next build", { stdio: "inherit" })
  console.log("Build completed successfully!")
} catch (error) {
  console.error("Build failed:", error)
} finally {
  console.log("Restoring development files...")
  restoreAfterBuild()
}
