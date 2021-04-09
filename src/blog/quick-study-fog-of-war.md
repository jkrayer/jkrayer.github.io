---
title: "A study on rendering fog of war"
description:
date: 2021-03-25
tags:
  - posts
  - Javascript
  - Games
footnotes:
---

I've been running a bit of Dungeons and Dragons during lock down with the help of my favorite <abbr title="Virtual Table Top">VTT</abbr> and encountering some frustrations. The first being the resource load on my old computer and the second being the need to manually clear the fog of war as my players explore the world. The simple solution would be to invest in a new computer but I've decided to take this as an opportunity to buld a small map project and learn some new programming techniques along the way.

1. [Project Outline](#parameters)
2. [Fog of War](#fog)

<div id="parameters"></div>

## Parameters

I've set some rules for how to build my little map project in order to keep myself focused on producing results and splitting up the learning of new and newish concepts into manageable chunks.

### I. The Project will be built in three phases

The phases are meant to create a project feedback loop with friends who'll help me test. I'm also attempting to constrain complexity at any given point in the project.

#### A. Local, single-player

This is a no brainer I'm just trying to build something that works so I have something to show users in the first place. I haven't been too precious with features at this phase except I've put a hard requirement on having a decently rendered fog of war since that was a major factor in deciding to build this in the first place.

At this time I'm only trying to build a "binary" fog which is to say explored and unexplored. At a future time I'd like a "tertiary" fog of explored, unexplored and visible.

#### B. Networked, multi-player

Here I'll get feedback from users, fix up UI, add features and implement a proper pathing algorithm. I'll be using web sockets and I'm considering [Feathers](https://feathersjs.com/).

#### C. Networked, players and game master

Hopefully a short phase where a GM view will be slightly different and allow for the movement of monsters.

### II. The map will be tile based.

I decided to make the game tile based for a few reasons. Firstly most maps are drawn on a grid so overlaying an existing battle map with an invisible grid is easy. We also play the game on physical grids when in person so the concept would be consistent for players. Secondly I though a grid would be easier to deal with than canvas and vectors though I'm open to the fact that I may feel differently at the end. Lastly I've been majorly inspired by the game [WarBarons](http://www.warbarons.com/).

### III. The map will not use a framework

I'm probably making my life more difficult than is strictly necessary here. I acknowledge that using React or a competitor would probably make my life easier but this is an opportunity to learn patterns that I wouldn't if I used a framework. It also gives me the opporunity to freely expermiment with game techniques that I'll learn along the way without having to translate them into the framework way of doing things.

<div id="fog"></div>

## Simple Fog Of War

Rendering a simple fog is deceptively simple. If you have a given player at known coordinates and sight range on a map of a known size you can "draw" a box around the player and simply change the tiles from hidden to explored. Let's explore the idea in detail using a specifics.

When we begin the game we'll have certain data about the board at our disposal because we'll have built the map data earlier. To begin with we'll know the height and width of the board in pixels and the size of a tile also in pixels. From that data we derive the size of the board in rows and columns by dividing the height by tile size and the width by tile size respectively. We can then build a two dimensional array reprensenting the fog where 1's represent the unexplored state and 0's represent the explored state.

```js
const fog = [
  [1,1,1,1,1,...]
  [1,1,1,1,1,...]
  ...
]
```

For convenience sake we'll also store a bounds object which simply holds the lowest possible and highest possible coordinates for a fog tile. Coordinates are the row and columns array keys from the fog array. We know the lowest x and y values are 0 simply because arrays begin numbering at 0 and we can find the highest x and y coordinates the same way we find the last index of any other array. So if we have a fog map 50 tiles by 50 tiles wide then our bounds object would contain the values top = 0, left = 0, right = 49 and bottom = 49. Or we could just derive these values from our initial data like so.

```js
const rows = height / tileSize;
const cols = width / tileSize;
const bounds = {
  top: 0,
  right: rows - 1,
  bottom: cols - 1,
  left: 0,
};
```

Now if we have a given player at coordinates `[20, 27]` and we know the player has a sight range of 6 tiles we can do a little math to find the top, right, bottom and left boundaries of the player's vision. Since the player can be anywhere on the map we'll want to limit the range of the reveal to be within the boundaries which is where the bounds object comes in.

```js
const visionRadius = 6;
const [playerX, playerY] = player.coordinates; // [20, 27] or whatever
const visionBounds = {
  top: Math.max(playerY - visionRadius, bounds.top),
  right: Math.min(playerX + visionRadius, bounds.right),
  bottom: Math.min(playerY + visionRadius, bounds.bottom),
  left: Math.max(playerX - visionRadius, bounds.left),
};
```

From here it's a simple matter to run a nested for loop over the bounds and change some 1's to 0's in the `fog` array.

```js
for (let y = visionBounds.top; y <= visionBounds.bottom; y++) {
  for (let x = visionBounds.left; y <= visionBounds.right; x++) {
    fog[y][x] = 0;
  }
}
```

At this point we have a decent working model for revealing map parts for the typical strategy game where the map is visible or not if it's with the sight radius of a given player. We could of course make some enhancements like not directly mutating the fog data or looping over the whole fog array to hide and show tiles as a player moves but this is a fair <abbr title="Proof of Concept">POC</abbr>.

But of course I haven't made my life so easy as to have wide open spaces easily viewable by any passing players. This is a dungeon. And dungeons have walls. And walls block line of sight.

## Walls, First Idea

My first idea for dealing with walls was to adapt the first solution. I got the vision boundaray as above. Used that data to create a queue of coordinates for all the tiles at the boundry. And then found a path from the player's position to each boundary tile. If the path encountered a wall along the way then it would stop.

Importantly I didn't bother with writing a true path finding algorithm here since it seemed like overkill. Instead I just reduced the start coordinates until they matched the end coordinates using [`Math.sign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign)

```js
while (queue.length) {
  let [cX, cY] = start;
  let [endX, endY] = queue.shift();

  while (cX !== endX || cY !== endY) {
    cX = cX + -Math.sign(cX - endX);
    cY = cY + -Math.sign(cY - endY);
    const key = makeId([cX, cY]);
    fogOfWar[key].visibility = 0;
    if (this.walls[key]) break;
  }
}
```

Not a terrible solution and I'm happy to have found `Math.sign` but the visible area this method produces can make odd shapes and check certain tiles many times. It occured to me here that the solution could be improved if when a wall is encountered the solution could have a look at adjacent tiles but I was stubbornly trying to avoid looking around.

## Small Circle

Hoping to find something simpler with fewer loops I decided to go back to bounds. This time I would run four loops one for each cardinal direction (North, South, East and West) and end early if I found a wall. With this new possibly smaller set of bounds I could clear a smaller area of fog as above.

A somewhat predicatable problem arises here. If the path along a cardinal direction is clear but the walls are oriented in such a way as they'd reasoanably block vision then womp womp the map is revealed.

```text
   OOOOOOOOO
   ___ ___
  |OOOPOOOOO
  |OOOOOOOOO
  |OOOOOOOOO
```

In this interpretation you can see the area North of player "P" is clear but there are Northerly walls both to the right and to left of the player's position. These woud reasonably block vision this solution wasn't smart enough to find them so the entire northen portion of the map would be revealed except for the left mot three colums since thee is a wall directly to the west of the player.

## Four Cones

The result of the experiments so far had taught me a few lessons. I knew I didn't want to check tiles twice. I knew I didn't want to build expensive queues and draw paths. I knew that when I encoutered a wall I'd want to look at nearby tiles and decide whether to stop or continue. And I had learned that diffirent wall orientations could mean different types of looking around.

I was also getting close to that point where I knew I had to ship or noodle forever so I decided to try an idea that had been knocking around in my head and hopefully get to done, if not perfect.

![Example of North East Cone](/images/player_cone.gif)

The idea is that I would start at the player position (the blue square) and move in a cardinal direction,North in this example. As I searched along this path I'd also loop over tiles along the diagonal path, North East in this case. Along the way I'd make some decisions about whethere to proceed or not.

I created 4 functions named for the diagonal paths they search, North East, North West, South East and South West. Each takes two check functions that can look for nearby walls to determine whether to continue along the path or stop.

```js
function NE(
  [startX, startY],
  max,
  fogOfWar,
  walls,
  checkID,
  check = () => true
) {
  // NE, when travelling eastthe the prev wall segment is x-1, y and N x, y+1
  for (let x = startX, y = startY; x <= max.right && y >= max.top; x++, y--) {
    const tileID = makeId([x, y]);
    fogOfWar[tileID].visibility = "";

    if (walls[tileID] && (walls[checkID(x, y)] || walls[check(x, y)])) break;
  }
}
```

The main function runs a loop for each cardinal direction wich also runs the functions for their cones: North West and North East for North, North East and South East for East and so on clock wise. Which allow each tile to be checked once and for reasonably good clearing of complex areas.

![What the player can see when the game begins](/images/map_reveal.jpg)

## Final Thoughts

While I'm fairly happy to have a solution that reveals areas reasonably well I'm not super thrilled to be running 12 loops to check for visible tiles. However this is one of those cases where done is better than perfect and moving on to a working multi-player solution and putting this little project in front of people is more important than having the perfect fog solution. I'll have to come back to this later and see how I can improve it.
