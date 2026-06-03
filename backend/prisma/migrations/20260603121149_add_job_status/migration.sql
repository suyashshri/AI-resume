-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Saved', 'Applied', 'Interview', 'Offer', 'Rejected');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'Saved';
