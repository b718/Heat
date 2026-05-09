-- CreateTable
CREATE TABLE "SongGenreLabel" (
    "id" TEXT NOT NULL,
    "labelledGenres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "songId" TEXT NOT NULL,

    CONSTRAINT "SongGenreLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistGenreLabel" (
    "id" TEXT NOT NULL,
    "labelledGenres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "ArtistGenreLabel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SongGenreLabel" ADD CONSTRAINT "SongGenreLabel_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistGenreLabel" ADD CONSTRAINT "ArtistGenreLabel_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
