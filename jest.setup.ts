import "@testing-library/jest-dom";
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from "util";

// Polyfill TextEncoder and TextDecoder for jsdom environment ensuring realm compatibility
class CustomTextEncoder extends NodeTextEncoder {
  encode(input?: string): Uint8Array {
    const u8 = super.encode(input);
    return new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength);
  }
}

global.TextEncoder = CustomTextEncoder;
global.TextDecoder = NodeTextDecoder as unknown as typeof global.TextDecoder;
if (typeof window !== "undefined") {
  window.TextEncoder = CustomTextEncoder;
  window.TextDecoder = NodeTextDecoder as unknown as typeof window.TextDecoder;
}

// Polyfill Web API Request/Response/Headers in jsdom if missing
if (typeof globalThis.Request !== "undefined" && typeof global.Request === "undefined") {
  global.Request = globalThis.Request;
  global.Response = globalThis.Response;
  global.Headers = globalThis.Headers;
}

if (typeof window !== "undefined") {
  // Mock matchMedia for jsdom environment (used in ThemeProvider, VantaBackground)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock window.scrollTo
  window.scrollTo = jest.fn();
}

// Mock ResizeObserver for components using ResponsiveContainer / Radix UI
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock next/dynamic to prevent async loadable act warnings in unit tests
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = "LoadableComponent";
  return DynamicComponent;
});
