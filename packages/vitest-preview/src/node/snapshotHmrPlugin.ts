import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

// Virtual module ID for the snapshot HTML
export const SNAPSHOT_VIRTUAL_MODULE_ID = 'virtual:vitest-preview-snapshot';
export const RESOLVED_SNAPSHOT_VIRTUAL_MODULE_ID =
  '\0' + SNAPSHOT_VIRTUAL_MODULE_ID;

// Client-side HMR handler module ID
export const HMR_CLIENT_VIRTUAL_MODULE_ID = 'virtual:vitest-preview-hmr-client';
export const RESOLVED_HMR_CLIENT_VIRTUAL_MODULE_ID =
  '\0' + HMR_CLIENT_VIRTUAL_MODULE_ID;

/**
 * Creates a Vite plugin that handles the snapshot HTML as a virtual module
 * and provides HMR support for it
 */
export function snapshotHmrPlugin(snapshotHtmlFile: string): Plugin {
  let snapshotContent = '';

  // Read initial snapshot content
  try {
    snapshotContent = fs.existsSync(snapshotHtmlFile)
      ? fs.readFileSync(snapshotHtmlFile, 'utf-8')
      : '';
  } catch (error) {
    console.error('Failed to read initial snapshot content:', error);
  }

  return {
    name: 'vitest-preview:snapshot-hmr',

    resolveId(id) {
      if (id === SNAPSHOT_VIRTUAL_MODULE_ID) {
        return RESOLVED_SNAPSHOT_VIRTUAL_MODULE_ID;
      }
      if (id === HMR_CLIENT_VIRTUAL_MODULE_ID) {
        return RESOLVED_HMR_CLIENT_VIRTUAL_MODULE_ID;
      }
      return null;
    },

    load(id) {
      // Serve the snapshot HTML content as a module
      if (id === RESOLVED_SNAPSHOT_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(snapshotContent)};`;
      }

      // Serve the client-side HMR handler
      if (id === RESOLVED_HMR_CLIENT_VIRTUAL_MODULE_ID) {
        return `
          import snapshotHtml from '${SNAPSHOT_VIRTUAL_MODULE_ID}';
          if (window.count) window.count++
          else window.count = 0
          // Initial render
          updateDOM(snapshotHtml);
          
          // HMR handling
          if (import.meta.hot) {
            import.meta.hot.accept('${SNAPSHOT_VIRTUAL_MODULE_ID}', (newModule) => {
              if (newModule) {
                updateDOM(newModule.default);
              }
            });
          }
          
          function updateDOM(html) {
          count++
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract the body content
            const bodyContent = doc.body.innerHTML;
            
            // Update the current document's body
            document.body.innerHTML = bodyContent;
            
            // Extract and apply styles from the head
            const styles = doc.head.querySelectorAll('style');
            
            // Remove existing vitest-preview styles
            document.head.querySelectorAll('style').forEach(el => {
              el.remove();
            });
            
            // Add the new styles
            // TODO: Cache this if possible.
            // Idea: add data-vitest-preview-hash to the style tag, by adding a new plugin to process css
            styles.forEach(style => {
              const newStyle = document.createElement('style');
              // Preserve all attributes
              style.attributes.forEach(attr => {
                newStyle.setAttribute(attr.name, attr.value);
              });
              newStyle.textContent = style.textContent;
              document.head.appendChild(newStyle);
            });
            
            console.log('[vitest-preview] HMR update applied');
            console.log('count', window.count)
          }
        `;
      }

      return null;
    },

    // Method to update the snapshot content
    handleHotUpdate({ file, server }) {
      if (path.resolve(file) === path.resolve(snapshotHtmlFile)) {
        try {
          // Read the updated content
          snapshotContent = fs.readFileSync(snapshotHtmlFile, 'utf-8');

          // Notify clients that the virtual module has been updated
          server.moduleGraph
            .getModuleById(RESOLVED_SNAPSHOT_VIRTUAL_MODULE_ID)
            ?.importers.forEach((importer) => {
              server.moduleGraph.invalidateModule(importer);
            });

          // Return the modules that should be invalidated
          const module = server.moduleGraph.getModuleById(
            RESOLVED_SNAPSHOT_VIRTUAL_MODULE_ID,
          );
          if (module) {
            return [module];
          }
        } catch (error) {
          console.error('Failed to update snapshot content:', error);
        }
      }
      return null;
    },
  };
}
