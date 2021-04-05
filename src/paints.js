const paints = [
    'Inc Sac', 'Red Dye', 'Green Dye', 'Cocoa Beans', 'Lapis Lazuli', 'Purple Dye', 'Cyan Dye', 'Light Gray Dye', 'Gray Dye', 'Pink Dye', 'Lime Dye', 'Yellow Dye', 'Light Blue Dye', 'Magenta Dye', 'Orange Dye', 'Bone Meal', 'Pumpkin Seed', 'Melon Seed',
    'Flint',
    'Gunpowder',
    'Nether Wart',
    'Prismarine Crystal',
    'Grass',
    'Gold Nugget',
    'Cobweb',
    'Ice',
    'Oak Leave',
    'Snow',
    'Ghast Tear',
    'Lapis Block',
    'Oak Wood',
    'Brick',
    'Lapis Ore',
    'Emerald',
    'Birch Wood',
    'Egg',
    'Magma Cream',
    'Beetroot',
    'Mycelium',
    'Glowstone Dust',
    'Slime Ball',
    'Spider Eye',
    'Soul Sand',
    'Brown Mushroom',
    'Iron Nugget',
    'Chorus Fruit',
    'Purpur Block',
    'Podzol',
    'Poisonous Potato',
    'Apple',
    'Charcoal'
];
function chunk(arr, chunkSize) {
    var R = [];
    for (var i = 0; i < arr.length; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
}


export default paints;