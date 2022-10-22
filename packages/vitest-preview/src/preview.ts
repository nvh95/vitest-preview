import fs from "fs";
import path from "path";
import { CACHE_FOLDER } from "./constants";
import { createCacheFolderIfNeeded } from "./utils";

export function debug(): void {
  createCacheFolderIfNeeded();

  fs.writeFileSync(
    path.join(CACHE_FOLDER, "index.html"),
    document.documentElement.outerHTML
  );
}
