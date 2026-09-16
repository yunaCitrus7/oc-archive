const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: string) {
  // A versioned URL avoids an old permanent /gallery/ redirect cached by browsers.
  return `${basePath}${path === "/gallery" && !basePath ? "/gallery?view=all" : path}`;
}
