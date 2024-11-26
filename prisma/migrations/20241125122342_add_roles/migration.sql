-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Customer', 'Admin', 'Organizer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role"[];

-- DropEnum
DROP TYPE "RoleName";
