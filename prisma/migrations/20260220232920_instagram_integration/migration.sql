-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageType" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'received';
