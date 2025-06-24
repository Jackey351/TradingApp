// Vitest global setup file
// You can add custom matchers, global mocks, or import extensions here.
 
import '@testing-library/jest-dom'; 

// Mock Worker for JSDOM
(global as any).Worker = class {
  onmessage: any = null;
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
}; 