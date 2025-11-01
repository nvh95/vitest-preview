# Vitest Preview HMR Implementation

This document explains the Hot Module Replacement (HMR) implementation for Vitest Preview's snapshot HTML file.

## Overview

Instead of using a full page reload when the snapshot HTML file changes, we've implemented a custom HMR solution using Vite's plugin system. This allows for a smoother development experience as only the necessary parts of the DOM are updated without reloading the entire page.

## Implementation Details

### 1. Virtual Module for Snapshot HTML

We create a virtual module (`virtual:vitest-preview-snapshot`) that represents the snapshot HTML content. This module is updated whenever the snapshot file changes.

### 2. HMR Client Script

We inject a client-side script (`virtual:vitest-preview-hmr-client`) that:
- Imports the snapshot HTML virtual module
- Registers an HMR handler to update the DOM when the module changes
- Handles updating the DOM without a full page reload

### 3. Vite Plugin

The `snapshotHmrPlugin` handles:
- Creating and serving the virtual modules
- Watching for changes to the snapshot HTML file
- Updating the virtual module and notifying clients when changes occur

## How It Works

1. When the server starts, it reads the initial snapshot HTML content
2. The plugin creates a virtual module that exports this content
3. The client-side script imports this module and renders it
4. When the snapshot file changes:
   - The plugin reads the updated content
   - Updates the virtual module
   - Notifies connected clients via HMR
5. The client-side HMR handler:
   - Receives the updated module
   - Updates the DOM with the new content without reloading the page

## Benefits

- Smoother development experience
- Preserves client-side state between updates
- Faster updates compared to full page reloads
- Maintains scroll position and other UI state

## Limitations

- Complex DOM changes might still require manual handling
- Scripts in the snapshot HTML need special handling (currently disabled for safety)
