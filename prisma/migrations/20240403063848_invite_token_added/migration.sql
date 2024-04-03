/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `ProjectMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProjectMembership" ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembership_inviteToken_key" ON "ProjectMembership"("inviteToken");
