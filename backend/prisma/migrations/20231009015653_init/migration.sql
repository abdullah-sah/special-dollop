/*
  Warnings:

  - You are about to drop the `_Blocked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isTyping` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `online` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_Blocked_B_index";

-- DropIndex
DROP INDEX "_Blocked_AB_unique";

-- DropIndex
DROP INDEX "_Friends_B_index";

-- DropIndex
DROP INDEX "_Friends_AB_unique";

-- DropIndex
DROP INDEX "_RoomToUser_B_index";

-- DropIndex
DROP INDEX "_RoomToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Blocked";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Friends";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_RoomToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Room" ("id") SELECT "id" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "displayname" TEXT NOT NULL
);
INSERT INTO "new_User" ("displayname", "id", "username") SELECT "displayname", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
