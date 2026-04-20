#!/bin/bash
set -euo pipefail

# Install required Claude Code plugins for this project.
# Run once after cloning on a new machine.

PLUGINS=(
  "compound-engineering@compound-engineering-plugin"
  "expo@claude-plugins-official"
  "expo@expo-plugins"
  "github@claude-plugins-official"
)

echo "Installing Claude Code plugins..."
for plugin in "${PLUGINS[@]}"; do
  if claude plugin list 2>/dev/null | grep -q "${plugin%%@*}"; then
    echo "  already installed: $plugin"
  else
    echo "  installing: $plugin"
    claude plugin install "$plugin"
  fi
done

echo ""
echo "Syncing env vars from Doppler (stg)..."
ENV="${1:-stg}"
yarn sync-env-vars "$ENV"

echo ""
echo "Done. Claude Code is ready for this project."
echo "MCP servers in .mcp.json will pick up credentials from .env and Doppler at runtime."
