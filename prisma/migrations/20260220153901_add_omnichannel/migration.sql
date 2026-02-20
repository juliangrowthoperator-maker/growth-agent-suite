/*
  Warnings:

  - The `channel` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `channel` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `channel` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('INSTAGRAM', 'WHATSAPP');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "externalThreadId" TEXT,
DROP COLUMN "channel",
ADD COLUMN     "channel" "Channel" NOT NULL DEFAULT 'INSTAGRAM';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "phoneE164" TEXT,
ADD COLUMN     "waUserId" TEXT,
DROP COLUMN "channel",
ADD COLUMN     "channel" "Channel" NOT NULL DEFAULT 'INSTAGRAM';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "direction" TEXT NOT NULL DEFAULT 'in',
ADD COLUMN     "externalMessageId" TEXT,
DROP COLUMN "channel",
ADD COLUMN     "channel" "Channel" NOT NULL DEFAULT 'INSTAGRAM';

-- CreateTable
CREATE TABLE "WebhookSubscription" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_clientId_channel_externalThreadId_idx" ON "Conversation"("clientId", "channel", "externalThreadId");

-- CreateIndex
CREATE INDEX "Lead_clientId_igUserId_idx" ON "Lead"("clientId", "igUserId");

-- CreateIndex
CREATE INDEX "Lead_clientId_phoneE164_idx" ON "Lead"("clientId", "phoneE164");

-- CreateIndex
CREATE INDEX "Message_clientId_channel_externalMessageId_idx" ON "Message"("clientId", "channel", "externalMessageId");

-- AddForeignKey
ALTER TABLE "WebhookSubscription" ADD CONSTRAINT "WebhookSubscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
