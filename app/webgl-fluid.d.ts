declare module "webgl-fluid" {
  type Options = Record<string, unknown>;
  export default function WebGLFluid(canvas: HTMLCanvasElement, options?: Options): void;
}
declare module "./vendor/webgl-fluid.mjs" {
  const WebGLFluid: (canvas: HTMLCanvasElement, options?: Record<string, unknown>) => void;
  export default WebGLFluid;
}
