/*
  Warnings:

  - Made the column `instructions` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "instructions" SET NOT NULL;
