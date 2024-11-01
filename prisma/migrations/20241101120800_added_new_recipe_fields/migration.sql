/*
  Warnings:

  - Added the required column `author` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yield` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe"
ADD COLUMN "author" TEXT NOT NULL DEFAULT '', 
ADD COLUMN "time" TEXT NOT NULL DEFAULT '', 
ADD COLUMN "yield" TEXT NOT NULL DEFAULT '';