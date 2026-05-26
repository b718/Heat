### How will do predict songs?

I think the core of this project is to understand how we can predict better songs for users so that their average duration on a song is extended. This ties back to the bigger picture of the project, "can we recommend better songs for users who like to skip, so that we can better serve their tastes."

I don't really have any prior machine learning experience but after some research it turns out that before we can really get into the machine learning models, we have to first model the data properly.

Our data currently follows this shape.

> The data below is a Prisma Schema.

```
model Song {
  id String @id
  name String
  artists String[]

  skips Skip[]
}

model Skip {
  id String @id @default(uuid())
  direction String
  currentTime Int
  duration Int

  songId String
  song   Song @relation(fields: [songId], references: [id])
}
```

With this current data shape, we are able to figure out what the "average" amount of time an user spent on a song by joining `Song` with `Skip` and then tallying the `currentTime` values, and averaging it. This is an important feature to help us understand which songs have the lowest amount of time spent on it before a skip. However, our goal is to recommend songs similar to the ones with low amount of time spent before a skip which have higher amount of time spent before a skip; the goal is to ease the user into songs which often have longer time spent on it so that they can have a more enjoyable listening experience.

What I need to figure out now is how do we properly model the data to allow for this to happen. For now don't worry about where we will get the data, we can generate it if needed. Right now what we have is this:

1. Genres.
2. Average time spent on a song.

---

It is also important to think about the perfect condition, ideally what would we want for the data-model representing the song? Let's just start with these two things for now and see where it leads us. We can use this amount of data for now and just get started.

1. Genres.
2. Related artists.

```
model Song {
  id             String @id
  name           String
  genres         String[]
  artists        Artist[]
}

model Artist {
  id             String   @id
  name           String
  genres         String[]
  relatedArtists Artist[] @relation("ArtistRelations", references: [id])
  relatedTo      Artist[] @relation("ArtistRelations", references: [id])
  songs          Song[]
}
```

---

It's also important to think about how I recommend songs to people. When I recommend songs, I always try to ask what they like in advance and then add my own little trick to it. For now, we will only focus on hip-hop. When I recommend songs, I tend to do it in two parts. The first part is to ask the person what they listen to daily; using this is information I will then try to recommend them music that is similar in some manner. The second part is I try to add my own flair to it. I know music well and I know what songs will have people excited.

To make this experiment a bit simpler, I will constrain the system to me; I know what I like so therefore if the system recommends me something I don't like I can inform it. It would also be cool to sprinkle in some flair manually (?).
