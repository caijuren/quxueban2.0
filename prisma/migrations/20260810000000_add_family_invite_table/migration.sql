-- CreateTable
CREATE TABLE "FamilyInvite" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "FamilyMemberRole" NOT NULL DEFAULT 'MEMBER',
    "email" TEXT,
    "phone" TEXT,
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "usedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyInvite_token_key" ON "FamilyInvite"("token");

-- CreateIndex
CREATE INDEX "FamilyInvite_familyId_idx" ON "FamilyInvite"("familyId");

-- CreateIndex
CREATE INDEX "FamilyInvite_token_idx" ON "FamilyInvite"("token");

-- CreateIndex
CREATE INDEX "FamilyInvite_email_idx" ON "FamilyInvite"("email");

-- CreateIndex
CREATE INDEX "FamilyInvite_phone_idx" ON "FamilyInvite"("phone");

-- AddForeignKey
ALTER TABLE "FamilyInvite" ADD CONSTRAINT "FamilyInvite_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
