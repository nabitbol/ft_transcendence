-- CreateTable
CREATE TABLE "_mute" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_mute_AB_unique" ON "_mute"("A", "B");

-- CreateIndex
CREATE INDEX "_mute_B_index" ON "_mute"("B");

-- AddForeignKey
ALTER TABLE "_mute" ADD CONSTRAINT "_mute_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mute" ADD CONSTRAINT "_mute_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
