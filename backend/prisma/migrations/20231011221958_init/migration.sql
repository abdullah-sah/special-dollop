-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomMembers" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "roomId"),
    CONSTRAINT "RoomMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoomMembers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoomMembers" ("joinedAt", "roomId", "userId") SELECT "joinedAt", "roomId", "userId" FROM "RoomMembers";
DROP TABLE "RoomMembers";
ALTER TABLE "new_RoomMembers" RENAME TO "RoomMembers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
