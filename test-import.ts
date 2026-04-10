import { prisma } from './lib/db/index.ts';
console.log('typeof prisma:', typeof prisma);
if (prisma) {
  console.log('typeof prisma.userMetadata:', typeof prisma.userMetadata);
  // Using Object.getOwnPropertyNames because some properties might not be enumerable
  console.log('prisma keys (including non-enumerable):', Object.getOwnPropertyNames(prisma));
}
