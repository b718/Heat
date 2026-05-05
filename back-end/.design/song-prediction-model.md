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

