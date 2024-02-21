-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "roomId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "id", "roomId", "updatedAt", "userId") SELECT "content", "createdAt", "id", "roomId", "updatedAt", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
