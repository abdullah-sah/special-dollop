/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT,
    "roomId" TEXT,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "id", "roomId", "updatedAt") SELECT "content", "createdAt", "id", "roomId", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
