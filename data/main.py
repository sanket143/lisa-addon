from eyed3 import id3
import os
import json

song_home = "/home/sanket143/Music/Songs"
ls = os.listdir(song_home)

tag = id3.Tag()
arr = []
for music in ls:
  track_path = os.path.join(song_home, music)

  if ".mp3" in track_path:
    tag.parse(track_path)
    if tag.title != None:
      data = {
        "title": tag.title,
        "artist": tag.artist,
        "album": tag.album,
        "src": track_path
      }
      arr.append(data)

f = open("mp3data.json", "w")
f.write(json.dumps(arr))
f.close()
"""
  print tag.getArtist()
  print tag.getAlbum()
  print tag.getTitle()
"""
