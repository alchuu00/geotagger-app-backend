/*
  Warnings:

  - You are about to drop the column `latitiude` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `latitiude` on the `Location` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guess" DROP COLUMN "latitiude",
ADD COLUMN     "latitude" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "latitiude",
ADD COLUMN     "latitude" TEXT NOT NULL;
