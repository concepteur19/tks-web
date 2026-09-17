/**
 * jsdom expose des objets issus d'un autre « realm » que Node. Le compilateur
 * utilisé pour rendre les composants Astro vérifie que
 * `new TextEncoder().encode('') instanceof Uint8Array`, ce qui est faux dans
 * cet environnement mixte. On réaligne les deux globales sur celles de Node.
 */
import { TextDecoder, TextEncoder } from 'node:util';

Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder, writable: true });
Object.defineProperty(globalThis, 'TextDecoder', { value: TextDecoder, writable: true });

const encoded: unknown = new TextEncoder().encode('');
if (!(encoded instanceof Uint8Array)) {
  const nodeUint8Array = (encoded as { constructor: unknown }).constructor;
  Object.defineProperty(globalThis, 'Uint8Array', { value: nodeUint8Array, writable: true });
}
