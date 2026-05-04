-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artists" TEXT[],

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skip" (
    "id" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "currentTime" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Skip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skip" ADD CONSTRAINT "Skip_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
