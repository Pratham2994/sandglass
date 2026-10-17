# Sandglass master list

Generated from the game code by `npm run master-list`. Do not edit by hand: change the element data in `src/sim/elements.ts` (or the rules in `src/sim/chem.ts`) and run the script again.

165 elements. Every pair of elements is listed below, in both directions, with what happens and why.

## World rules

- Room temperature is 20 °C. Empty cells are air; air slowly drifts back to room temperature, which is how hot things cool and steam condenses.
- Air feeds fire with oxygen strength 0.21. Burning turns touching air into smoke, which feeds nothing, so a sealed space runs out of air.
- The bottom and side edges are walls. Gases that vent (smoke) leave through the top edge; others stay.
- Gravity is per element: each falling element has its own acceleration and top speed.
- Heat flows between touching cells by conduction (each element has a conductivity and heat capacity). Burning cells also push radiant heat into their neighbours.
- Movement only swaps cells, so nothing is created or lost by moving. Reactions and burning change cells into other elements.

## Rule families

The chemistry compiler applies these general rules to every pair of elements; nobody writes pairs by hand. Hand-written overrides, if any, win.

| Rule | Happens when | Result |
| --- | --- | --- |
| Density | A heavier powder or liquid touches a lighter liquid or gas | It sinks through, swapping places; the bigger the gap, the faster |
| Melting, boiling | A cell gets hotter than its melting or boiling point | It becomes its melted or boiled form and absorbs a little heat |
| Freezing, condensing | A cell gets colder than the point of whatever melts or boils into it | It becomes that element and releases a little heat |
| Rubble | A solid would form (freeze) with nothing solid under it | It forms as its loose rubble instead (lava → gravel) |
| Combustion | A flammable cell is at its ignition point and touches an oxidiser, or a loose flame touches it | It becomes fire that remembers its fuel, burns for its fuel time, then leaves its residue |
| Corrosion | An acid touches metal, rock or wood softer than its acidity | Both cells are used up; metal gives off hydrogen |
| Neutralisation | An acid touches a base | Both become water and warm up; a carbonate base fizzes into carbon dioxide |
| Quenching | Water touches a flame or a burning cell | The fire goes out; the water may flash into steam |
| Setting | Water touches a powder that sets (cement, quicklime) | The powder takes in the water and hardens, sometimes getting hot |
| Thawing | Salt or sugar touches ice | The ice melts into water |
| Acid gas | Sulfur dioxide or chlorine touches water | The water turns into acid |
| Toxic gas | A toxic gas touches a living thing | It withers |
| Rusting | Water or oxygen touches a metal that rusts | It slowly turns into rust |
| Rotting | Water touches dead organic matter | It slowly rots into dirt |
| Baking | A cell passes its baking point | A one-way change (clay to brick), sometimes giving off a gas |

## Summary

| Element | Group | State | Density kg/m³ | Starts at | Heating | Cooling | Burns |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Wall | solids | solid | 2,500 | 20 °C |  |  |  |
| Sand | powders | powder | 1,600 | 20 °C |  |  |  |
| Water | liquids | liquid | 1,000 | 20 °C | boils at 100 °C → steam | freezes below 0 °C → ice |  |
| Oil | liquids | liquid | 900 | 20 °C |  |  | from 250 °C |
| Ice | solids | solid | 917 | -20 °C | melts at 0 °C → water |  |  |
| Steam | gases | gas | 0.6 | 150 °C |  | condenses below 100 °C → water |  |
| Lava | liquids | liquid | 2,600 | 1,200 °C |  | freezes below 1,000 °C → stone |  |
| Stone | solids | solid | 2,600 | 20 °C | melts at 1,000 °C → lava |  |  |
| Gravel | powders | powder | 2,000 | 20 °C | melts at 1,000 °C → lava |  |  |
| Fire | energy | energy | 0.3 | 850 °C |  |  |  |
| Smoke | gases | gas | 0.7 | 150 °C |  |  |  |
| Wood | solids | solid | 700 | 20 °C |  |  | from 300 °C |
| Ash | powders | powder | 600 | 20 °C |  |  |  |
| Acid | liquids | liquid | 1,100 | 20 °C |  |  |  |
| Iron | metals | solid | 7,870 | 20 °C | melts at 1,538 °C → molten iron |  |  |
| Hydrogen | gases | gas | 0.09 | 20 °C |  |  | from 500 °C |
| Oxygen | gases | gas | 1.43 | 20 °C |  | condenses below -183 °C → liquid oxygen |  |
| Methane | gases | gas | 0.66 | 20 °C |  |  | from 540 °C |
| Alcohol | liquids | liquid | 789 | 20 °C |  |  | from 365 °C |
| Sawdust | powders | powder | 250 | 20 °C |  |  | from 260 °C |
| Salt | powders | powder | 2,160 | 20 °C |  |  |  |
| Sugar | powders | powder | 1,590 | 20 °C |  |  | from 350 °C |
| Dirt | powders | powder | 1,500 | 20 °C |  |  |  |
| Snow | powders | powder | 300 | -5 °C | melts at 0 °C → water |  |  |
| TNT | explosives | solid | 1,650 | 20 °C |  |  | from 300 °C |
| Gunpowder | explosives | powder | 1,700 | 20 °C |  |  | from 250 °C |
| Nitro | explosives | liquid | 1,600 | 20 °C |  |  | from 200 °C |
| Glass | solids | solid | 2,500 | 20 °C | melts at 1,400 °C → molten glass |  |  |
| Shards | powders | powder | 2,500 | 20 °C |  |  |  |
| Spark | energy | energy | 0.1 | 300 °C |  |  |  |
| Wire | electronics | solid | 8,960 | 20 °C | melts at 1,085 °C → molten copper |  |  |
| Battery | electronics | solid | 2,500 | 20 °C |  |  |  |
| Mercury | metals | liquid | 13,534 | 20 °C |  |  |  |
| Seed | life | powder | 1,100 | 20 °C |  |  | from 250 °C |
| Plant | life | solid | 900 | 20 °C |  |  | from 250 °C |
| Molten copper | metals | liquid | 8,020 | 1,200 °C |  | freezes below 1,085 °C → wire |  |
| Dry plant | life | solid | 300 | 20 °C |  |  | from 200 °C |
| Clay | building | powder | 1,700 | 20 °C |  |  |  |
| Brick | building | solid | 1,900 | 20 °C |  |  |  |
| Cement | building | powder | 1,440 | 20 °C |  |  |  |
| Concrete | building | solid | 2,400 | 20 °C |  |  |  |
| Limestone | building | solid | 2,700 | 20 °C |  |  |  |
| Quicklime | building | powder | 1,200 | 20 °C |  |  |  |
| Slaked lime | building | powder | 1,100 | 20 °C |  |  |  |
| Gold | metals | solid | 19,300 | 20 °C | melts at 1,064 °C → molten gold |  |  |
| Molten gold | metals | liquid | 17,300 | 1,150 °C |  | freezes below 1,064 °C → gold |  |
| Aluminium | metals | solid | 2,700 | 20 °C | melts at 660 °C → molten aluminium |  |  |
| Molten aluminium | metals | liquid | 2,375 | 750 °C |  | freezes below 660 °C → aluminium |  |
| Lead | metals | solid | 11,340 | 20 °C | melts at 327 °C → molten lead |  |  |
| Molten lead | metals | liquid | 10,660 | 400 °C |  | freezes below 327 °C → lead |  |
| Rust | metals | powder | 2,000 | 20 °C |  |  |  |
| Sodium | metals | solid | 968 | 20 °C |  |  |  |
| Coal | fuels | powder | 1,350 | 20 °C |  |  | from 450 °C |
| Charcoal | fuels | powder | 400 | 20 °C |  |  | from 350 °C |
| Sulfur | fuels | powder | 2,000 | 20 °C |  |  | from 232 °C |
| Petrol | fuels | liquid | 740 | 20 °C |  |  | from 280 °C |
| Wax | fuels | solid | 900 | 20 °C | melts at 60 °C → molten wax |  | from 300 °C |
| Molten wax | fuels | liquid | 800 | 80 °C |  | freezes below 60 °C → wax | from 300 °C |
| Paper | fuels | solid | 700 | 20 °C |  |  | from 233 °C |
| Rubber | fuels | solid | 1,100 | 20 °C |  |  | from 400 °C |
| Flour | food | powder | 600 | 20 °C |  |  | from 380 °C |
| Thermite | fuels | powder | 1,500 | 20 °C |  |  | from 900 °C |
| Honey | food | liquid | 1,420 | 20 °C |  |  |  |
| Vinegar | liquids | liquid | 1,010 | 20 °C |  |  |  |
| Bleach | liquids | liquid | 1,100 | 20 °C |  |  |  |
| Lye | liquids | liquid | 1,100 | 20 °C |  |  |  |
| Liquid nitrogen | liquids | liquid | 808 | -196 °C | boils at -196 °C → nitrogen |  |  |
| Nitrogen | gases | gas | 1.17 | 20 °C |  | condenses below -196 °C → liquid nitrogen |  |
| Carbon dioxide | gases | gas | 1.98 | 20 °C |  | condenses below -78 °C → dry ice |  |
| Helium | gases | gas | 0.18 | 20 °C |  |  |  |
| Propane | gases | gas | 1.88 | 20 °C |  |  | from 470 °C |
| Chlorine | gases | gas | 3.2 | 20 °C |  |  |  |
| Sulfur dioxide | gases | gas | 2.6 | 20 °C |  |  |  |
| Dry ice | solids | solid | 1,560 | -79 °C | sublimes at -78 °C → carbon dioxide |  |  |
| Baking soda | powders | powder | 1,100 | 20 °C |  |  |  |
| C4 | explosives | solid | 1,600 | 20 °C |  |  | from 900 °C |
| Grass seed | life | powder | 1,100 | 20 °C |  |  | from 250 °C |
| Grass | life | solid | 600 | 20 °C |  |  | from 220 °C |
| Acorn | life | powder | 1,100 | 20 °C |  |  | from 260 °C |
| Tree | life | solid | 750 | 20 °C |  |  | from 300 °C |
| Leaves | life | solid | 500 | 20 °C |  |  | from 230 °C |
| Flower | life | solid | 400 | 20 °C |  |  | from 220 °C |
| Cloud | gases | gas | 1.1 | 20 °C |  |  |  |
| Heater | devices | solid | 3,000 | 20 °C |  |  |  |
| Cooler | devices | solid | 3,000 | 20 °C |  |  |  |
| Clone | devices | solid | 3,000 | 20 °C |  |  |  |
| Void | devices | solid | 3,000 | 20 °C |  |  |  |
| Fan | devices | solid | 3,000 | 20 °C |  |  |  |
| Bulb | electronics | solid | 3,000 | 20 °C |  |  |  |
| Magnesium | metals | solid | 1,740 | 20 °C |  |  | from 650 °C |
| Potassium | metals | solid | 862 | 20 °C |  |  |  |
| Caramel | food | liquid | 1,300 | 190 °C |  |  | from 400 °C |
| Marble | building | solid | 2,700 | 20 °C |  |  |  |
| Chalk | powders | powder | 1,500 | 20 °C |  |  |  |
| Liquid oxygen | liquids | liquid | 1,141 | -183 °C | boils at -183 °C → oxygen |  |  |
| Molten iron | metals | liquid | 6,980 | 1,600 °C |  | freezes below 1,538 °C → iron |  |
| Molten glass | liquids | liquid | 2,400 | 1,450 °C |  | freezes below 1,400 °C → glass |  |
| Silver | metals | solid | 10,490 | 20 °C | melts at 962 °C → molten silver |  |  |
| Molten silver | metals | liquid | 9,320 | 1,000 °C |  | freezes below 962 °C → silver |  |
| Meat | food | solid | 1,050 | 20 °C |  |  |  |
| Cooked meat | food | solid | 1,000 | 20 °C |  |  | from 300 °C |
| Popcorn kernel | food | powder | 1,200 | 20 °C |  |  |  |
| Popcorn | food | powder | 50 | 20 °C |  |  | from 300 °C |
| Tar | fuels | liquid | 1,150 | 20 °C |  |  | from 320 °C |
| Plastic | solids | solid | 950 | 20 °C | melts at 160 °C → molten plastic |  | from 350 °C |
| Molten plastic | liquids | liquid | 900 | 200 °C |  | freezes below 160 °C → plastic | from 350 °C |
| Pumice | powders | powder | 640 | 20 °C |  |  |  |
| Obsidian | solids | solid | 2,400 | 20 °C | melts at 1,000 °C → lava |  |  |
| Diamond | solids | solid | 3,510 | 20 °C |  |  | from 900 °C |
| Napalm | fuels | liquid | 900 | 20 °C |  |  | from 250 °C |
| Hydrogen peroxide | liquids | liquid | 1,450 | 20 °C |  |  |  |
| Fish | life | solid | 1,000 | 20 °C |  |  | from 300 °C |
| Ant | life | solid | 1,000 | 20 °C |  |  | from 200 °C |
| Worm | life | solid | 1,050 | 20 °C |  |  |  |
| Bird | life | solid | 1,000 | 20 °C |  |  | from 300 °C |
| Lightning | energy | energy | 0.1 | 3,000 °C |  |  |  |
| Plasma | energy | energy | 0.1 | 3,000 °C |  |  |  |
| Firework | explosives | powder | 1,400 | 20 °C |  |  | from 250 °C |
| Rocket | energy | energy | 0.5 | 900 °C |  |  |  |
| Ember | energy | energy | 0.3 | 700 °C |  |  |  |
| Saltpeter | powders | powder | 2,100 | 20 °C |  |  |  |
| Tin | metals | solid | 7,300 | 20 °C | melts at 232 °C → molten tin |  |  |
| Molten tin | metals | liquid | 6,990 | 260 °C |  | freezes below 232 °C → tin |  |
| Steel | metals | solid | 7,850 | 20 °C | melts at 1,500 °C → molten iron |  |  |
| Zinc | metals | solid | 7,140 | 20 °C |  |  |  |
| Kerosene | fuels | liquid | 800 | 20 °C |  |  | from 220 °C |
| Acetone | liquids | liquid | 784 | 20 °C |  |  | from 465 °C |
| Hail | powders | powder | 900 | -5 °C | melts at 0 °C → water |  |  |
| Uranium | metals | solid | 19,050 | 20 °C |  |  |  |
| Bee | life | solid | 1,000 | 20 °C |  |  | from 200 °C |
| Spider | life | solid | 1,000 | 20 °C |  |  | from 200 °C |
| Termite | life | solid | 1,000 | 20 °C |  |  | from 200 °C |
| Snail | life | solid | 1,100 | 20 °C |  |  |  |
| Frog | life | solid | 1,000 | 20 °C |  |  | from 300 °C |
| Mouse | life | solid | 1,000 | 20 °C |  |  | from 300 °C |
| Snake | life | solid | 1,000 | 20 °C |  |  | from 300 °C |
| Ammonia | gases | gas | 0.73 | 20 °C |  |  |  |
| Ozone | gases | gas | 2.14 | 20 °C |  |  |  |
| Cotton | fuels | powder | 150 | 20 °C |  |  | from 255 °C |
| Chocolate | food | solid | 1,300 | 20 °C | melts at 35 °C → molten chocolate |  |  |
| Molten chocolate | food | liquid | 1,250 | 45 °C |  | freezes below 35 °C → chocolate |  |
| Egg | food | solid | 1,030 | 20 °C |  |  |  |
| Cooked egg | food | solid | 1,000 | 20 °C |  |  |  |
| Phosphorus | fuels | solid | 1,820 | 20 °C |  |  | from 30 °C |
| Lithium | metals | solid | 534 | 20 °C |  |  |  |
| Calcium carbide | fuels | powder | 2,220 | 20 °C |  |  |  |
| Acetylene | gases | gas | 1.1 | 20 °C |  |  | from 305 °C |
| Iodine | powders | powder | 4,930 | 20 °C | sublimes at 114 °C → iodine vapour |  |  |
| Iodine vapour | gases | gas | 11 | 130 °C |  | condenses below 114 °C → iodine |  |
| Titanium | metals | solid | 4,500 | 20 °C |  |  |  |
| Platinum | metals | solid | 21,450 | 20 °C |  |  |  |
| Argon | gases | gas | 1.66 | 20 °C |  |  |  |
| Bromine | liquids | liquid | 3,100 | 20 °C | boils at 59 °C → bromine vapour |  |  |
| Bromine vapour | gases | gas | 7.6 | 70 °C |  | condenses below 59 °C → bromine |  |
| Gallium | metals | solid | 5,910 | 20 °C | melts at 30 °C → liquid gallium |  |  |
| Liquid gallium | metals | liquid | 6,095 | 35 °C |  | freezes below 30 °C → gallium |  |
| Cactus seed | life | powder | 1,100 | 20 °C |  |  | from 250 °C |
| Cactus | life | solid | 950 | 20 °C |  |  | from 300 °C |
| Smoke bomb | explosives | powder | 1,200 | 20 °C |  |  | from 200 °C |
| Peat | fuels | powder | 900 | 20 °C |  |  | from 300 °C |
| Basalt | solids | solid | 3,000 | 20 °C | melts at 1,100 °C → lava |  |  |
| Granite | solids | solid | 2,750 | 20 °C | melts at 1,250 °C → lava |  |  |
| Sandstone | solids | solid | 2,300 | 20 °C |  |  |  |
| Soda | food | liquid | 1,010 | 20 °C |  |  |  |
| Fuse | explosives | solid | 900 | 20 °C |  |  | from 150 °C |

## Elements

### Wall

An indestructible solid. Never moves. Nothing melts, burns or eats it; use it for containers and floors.

- **State:** Solid, 2,500 kg/m³
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sand

A fine, heavy powder. Falls, piles into slopes and sinks through lighter liquids. Very hard to melt or eat away.

- **State:** Powder, 1,600 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,600 kg/m³, rests on heavier ones
- **Falls:** up to 165 cells/s
- **Bakes:** at 1,450 °C into molten glass; there is no way back
- **Soaks up:** water, up to 30% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (45 interact):

- **Water:** Sand soaks up water: it is porous and holds up to 30% water. Sand sinks through water (1,600 vs 1,000 kg/m³).
- **Oil:** Sand sinks through oil (1,600 vs 900 kg/m³).
- **Steam:** Sand falls through steam.
- **Fire:** Sand falls through fire.
- **Smoke:** Sand falls through smoke.
- **Acid:** Sand sinks through acid (1,600 vs 1,100 kg/m³).
- **Hydrogen:** Sand falls through hydrogen.
- **Oxygen:** Sand falls through oxygen.
- **Methane:** Sand falls through methane.
- **Alcohol:** Sand sinks through alcohol (1,600 vs 789 kg/m³).
- **Spark:** Sand falls through spark.
- **Petrol:** Sand sinks through petrol (1,600 vs 740 kg/m³).
- **Molten wax:** Sand sinks through molten wax (1,600 vs 800 kg/m³).
- **Honey:** Sand sinks through honey (1,600 vs 1,420 kg/m³).
- **Vinegar:** Sand sinks through vinegar (1,600 vs 1,010 kg/m³).
- **Bleach:** Sand sinks through bleach (1,600 vs 1,100 kg/m³).
- **Lye:** Sand sinks through lye (1,600 vs 1,100 kg/m³).
- **Liquid nitrogen:** Sand sinks through liquid nitrogen (1,600 vs 808 kg/m³).
- **Nitrogen:** Sand falls through nitrogen.
- **Carbon dioxide:** Sand falls through carbon dioxide.
- **Helium:** Sand falls through helium.
- **Propane:** Sand falls through propane.
- **Chlorine:** Sand falls through chlorine.
- **Sulfur dioxide:** Sand falls through sulfur dioxide.
- **Cloud:** Sand falls through cloud.
- **Caramel:** Sand sinks through caramel (1,600 vs 1,300 kg/m³).
- **Liquid oxygen:** Sand sinks through liquid oxygen (1,600 vs 1,141 kg/m³).
- **Tar:** Sand sinks through tar (1,600 vs 1,150 kg/m³).
- **Molten plastic:** Sand sinks through molten plastic (1,600 vs 900 kg/m³).
- **Napalm:** Sand sinks through napalm (1,600 vs 900 kg/m³).
- **Hydrogen peroxide:** Sand sinks through hydrogen peroxide (1,600 vs 1,450 kg/m³).
- **Lightning:** Sand falls through lightning.
- **Plasma:** Sand falls through plasma.
- **Rocket:** Sand falls through rocket.
- **Ember:** Sand falls through ember.
- **Kerosene:** Sand sinks through kerosene (1,600 vs 800 kg/m³).
- **Acetone:** Sand sinks through acetone (1,600 vs 784 kg/m³).
- **Ammonia:** Sand falls through ammonia.
- **Ozone:** Sand falls through ozone.
- **Molten chocolate:** Sand sinks through molten chocolate (1,600 vs 1,250 kg/m³).
- **Acetylene:** Sand falls through acetylene.
- **Iodine vapour:** Sand falls through iodine vapour.
- **Argon:** Sand falls through argon.
- **Bromine vapour:** Sand falls through bromine vapour.
- **Soda:** Sand sinks through soda (1,600 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Water

A runny liquid. Flows and settles flat. Boils into steam when hot, freezes into ice when cold, and cools what it touches.

- **State:** Liquid, 1,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,000 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Boils:** at 100 °C, into steam
- **Freezes:** below 0 °C, into ice
- **Conducts:** only when it carries salt; current then splits it into hydrogen and oxygen
- **Dissolves:** soluble powders (salt, sugar), up to each one’s limit; saltier is heavier

With other elements (104 interact):

- **Sand:** Sand soaks up water: it is porous and holds up to 30% water. Sand sinks through water (1,600 vs 1,000 kg/m³).
- **Oil:** Water sinks through oil (1,000 vs 900 kg/m³).
- **Ice:** Ice (-20 °C) is cold enough to freeze water into ice.
- **Steam:** Water falls through steam. Steam (150 °C) is hot enough to boil water into steam.
- **Lava:** Water chills the lava so fast that it sets into glassy obsidian, flashing into steam. Water chills the lava so fast that it sets into glassy obsidian. Lava sinks through water (2,600 vs 1,000 kg/m³). Lava (1,200 °C) is hot enough to boil water into steam.
- **Gravel:** Gravel sinks through water (2,000 vs 1,000 kg/m³).
- **Fire:** Water puts out the fire, flashing into steam. Water falls through fire. Fire (850 °C) is hot enough to boil water into steam.
- **Smoke:** Water falls through smoke. Smoke (150 °C) is hot enough to boil water into steam.
- **Acid:** Acid sinks through water (1,100 vs 1,000 kg/m³).
- **Iron:** Iron slowly rusts into rust where water touches it.
- **Hydrogen:** Water falls through hydrogen.
- **Oxygen:** Water falls through oxygen.
- **Methane:** Water falls through methane.
- **Alcohol:** Water sinks through alcohol (1,000 vs 789 kg/m³).
- **Sawdust:** Sawdust soaks up water: it is porous and holds up to 60% water.
- **Salt:** Salt dissolves into water: water is a solvent and each cell holds up to 40% salt. Salt sinks through water (2,160 vs 1,000 kg/m³).
- **Sugar:** Sugar dissolves into water: water is a solvent and each cell holds up to 70% sugar. Sugar sinks through water (1,590 vs 1,000 kg/m³).
- **Dirt:** Dirt soaks up water: it is porous and holds up to 50% water. Dirt sinks through water (1,500 vs 1,000 kg/m³).
- **Snow:** Snow (-5 °C) is cold enough to freeze water into ice.
- **Gunpowder:** Gunpowder sinks through water (1,700 vs 1,000 kg/m³).
- **Nitro:** Nitro sinks through water (1,600 vs 1,000 kg/m³).
- **Shards:** Shards sinks through water (2,500 vs 1,000 kg/m³).
- **Spark:** Water falls through spark. Spark (300 °C) is hot enough to boil water into steam.
- **Mercury:** Mercury sinks through water (13,534 vs 1,000 kg/m³).
- **Seed:** Seed sinks through water (1,100 vs 1,000 kg/m³).
- **Molten copper:** Molten copper sinks through water (8,020 vs 1,000 kg/m³). Molten copper (1,200 °C) is hot enough to boil water into steam.
- **Dry plant:** Dry plant slowly rots into dirt where water touches it.
- **Clay:** Clay soaks up water: it is porous and holds up to 40% water. Clay sinks through water (1,700 vs 1,000 kg/m³).
- **Cement:** Cement takes in the water and sets into concrete. Cement sinks through water (1,440 vs 1,000 kg/m³).
- **Quicklime:** Quicklime takes in the water and sets into slaked lime, getting very hot. Quicklime sinks through water (1,200 vs 1,000 kg/m³).
- **Slaked lime:** Slaked lime sinks through water (1,100 vs 1,000 kg/m³).
- **Molten gold:** Molten gold sinks through water (17,300 vs 1,000 kg/m³). Molten gold (1,150 °C) is hot enough to boil water into steam.
- **Molten aluminium:** Molten aluminium sinks through water (2,375 vs 1,000 kg/m³). Molten aluminium (750 °C) is hot enough to boil water into steam.
- **Molten lead:** Molten lead sinks through water (10,660 vs 1,000 kg/m³). Molten lead (400 °C) is hot enough to boil water into steam.
- **Rust:** Rust sinks through water (2,000 vs 1,000 kg/m³).
- **Sodium:** Sodium reacts violently with water: it becomes lye and hydrogen, hot enough to set the hydrogen alight.
- **Coal:** Coal sinks through water (1,350 vs 1,000 kg/m³).
- **Sulfur:** Sulfur sinks through water (2,000 vs 1,000 kg/m³).
- **Petrol:** Water sinks through petrol (1,000 vs 740 kg/m³).
- **Molten wax:** Water sinks through molten wax (1,000 vs 800 kg/m³).
- **Paper:** Paper slowly rots into dirt where water touches it.
- **Flour:** Flour soaks up water: it is porous and holds up to 30% water.
- **Thermite:** Thermite sinks through water (1,500 vs 1,000 kg/m³).
- **Honey:** Honey sinks through water (1,420 vs 1,000 kg/m³).
- **Vinegar:** Vinegar sinks through water (1,010 vs 1,000 kg/m³).
- **Bleach:** Bleach sinks through water (1,100 vs 1,000 kg/m³).
- **Lye:** Lye sinks through water (1,100 vs 1,000 kg/m³).
- **Liquid nitrogen:** Water sinks through liquid nitrogen (1,000 vs 808 kg/m³). Liquid nitrogen (-196 °C) is cold enough to freeze water into ice.
- **Nitrogen:** Water falls through nitrogen.
- **Carbon dioxide:** Water falls through carbon dioxide.
- **Helium:** Water falls through helium.
- **Propane:** Water falls through propane.
- **Chlorine:** Chlorine dissolves in water and turns it into acid. Water falls through chlorine.
- **Sulfur dioxide:** Sulfur dioxide dissolves in water and turns it into acid. Water falls through sulfur dioxide.
- **Dry ice:** Dry ice (-79 °C) is cold enough to freeze water into ice.
- **Baking soda:** Baking soda dissolves into water: water is a solvent and each cell holds up to 20% baking soda. Baking soda sinks through water (1,100 vs 1,000 kg/m³).
- **Grass seed:** Grass seed sinks through water (1,100 vs 1,000 kg/m³).
- **Acorn:** Acorn sinks through water (1,100 vs 1,000 kg/m³).
- **Cloud:** Water falls through cloud.
- **Potassium:** Potassium bursts in water: it becomes lye and hydrogen, hot enough to set the hydrogen alight.
- **Caramel:** Caramel sinks through water (1,300 vs 1,000 kg/m³). Caramel (190 °C) is hot enough to boil water into steam.
- **Chalk:** Chalk sinks through water (1,500 vs 1,000 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through water (1,141 vs 1,000 kg/m³). Liquid oxygen (-183 °C) is cold enough to freeze water into ice.
- **Molten iron:** Molten iron sinks through water (6,980 vs 1,000 kg/m³). Molten iron (1,600 °C) is hot enough to boil water into steam.
- **Molten glass:** Molten glass sinks through water (2,400 vs 1,000 kg/m³). Molten glass (1,450 °C) is hot enough to boil water into steam.
- **Molten silver:** Molten silver sinks through water (9,320 vs 1,000 kg/m³). Molten silver (1,000 °C) is hot enough to boil water into steam.
- **Meat:** Meat slowly rots into dirt where water touches it.
- **Cooked meat:** Cooked meat slowly rots into dirt where water touches it.
- **Popcorn kernel:** Popcorn kernel sinks through water (1,200 vs 1,000 kg/m³).
- **Tar:** Tar sinks through water (1,150 vs 1,000 kg/m³).
- **Molten plastic:** Water sinks through molten plastic (1,000 vs 900 kg/m³). Molten plastic (200 °C) is hot enough to boil water into steam.
- **Pumice:** Pumice soaks up water: it is porous and holds up to 30% water.
- **Napalm:** Water sinks through napalm (1,000 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through water (1,450 vs 1,000 kg/m³).
- **Lightning:** Water falls through lightning. Lightning (3,000 °C) is hot enough to boil water into steam.
- **Plasma:** Water falls through plasma. Plasma (3,000 °C) is hot enough to boil water into steam.
- **Firework:** Firework sinks through water (1,400 vs 1,000 kg/m³).
- **Rocket:** Water falls through rocket. Rocket (900 °C) is hot enough to boil water into steam.
- **Ember:** Water falls through ember. Ember (700 °C) is hot enough to boil water into steam.
- **Saltpeter:** Saltpeter dissolves into water: water is a solvent and each cell holds up to 30% saltpeter. Saltpeter sinks through water (2,100 vs 1,000 kg/m³).
- **Molten tin:** Molten tin sinks through water (6,990 vs 1,000 kg/m³). Molten tin (260 °C) is hot enough to boil water into steam.
- **Steel:** Steel slowly rusts into rust where water touches it.
- **Kerosene:** Water sinks through kerosene (1,000 vs 800 kg/m³).
- **Acetone:** Water sinks through acetone (1,000 vs 784 kg/m³).
- **Hail:** Hail (-5 °C) is cold enough to freeze water into ice.
- **Ammonia:** Water falls through ammonia.
- **Ozone:** Water falls through ozone.
- **Cotton:** Cotton soaks up water: it is porous and holds up to 60% water.
- **Molten chocolate:** Molten chocolate sinks through water (1,250 vs 1,000 kg/m³).
- **Egg:** Egg slowly rots into dirt where water touches it.
- **Cooked egg:** Cooked egg slowly rots into dirt where water touches it.
- **Lithium:** Lithium reacts steadily with water, making lye and hydrogen.
- **Calcium carbide:** Calcium carbide and water make acetylene gas, leaving slaked lime. Calcium carbide sinks through water (2,220 vs 1,000 kg/m³).
- **Acetylene:** Water falls through acetylene.
- **Iodine:** Iodine sinks through water (4,930 vs 1,000 kg/m³).
- **Iodine vapour:** Water falls through iodine vapour. Iodine vapour (130 °C) is hot enough to boil water into steam.
- **Argon:** Water falls through argon.
- **Bromine:** Bromine sinks through water (3,100 vs 1,000 kg/m³).
- **Bromine vapour:** Water falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through water (6,095 vs 1,000 kg/m³).
- **Cactus seed:** Cactus seed sinks through water (1,100 vs 1,000 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through water (1,200 vs 1,000 kg/m³).
- **Peat:** Peat soaks up water: it is porous and holds up to 50% water.
- **Soda:** Soda sinks through water (1,010 vs 1,000 kg/m³).

No direct interaction with: Air, Wall, Stone, Wood, Ash, TNT, Glass, Wire, Battery, Plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Charcoal, Wax, Rubber, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Marble, Silver, Popcorn, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Chocolate, Phosphorus, Titanium, Platinum, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Oil

A thick, slow liquid. Floats on water. Burns into smoke once hot enough.

- **State:** Liquid, 900 kg/m³
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, floats on heavier ones
- **Falls:** up to 120 cells/s
- **Burns:** from 250 °C in air, 4 s per cell, leaves smoke
- **Flash point:** 55 °C: above it, flames spread across it

With other elements (83 interact):

- **Air:** Oil burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through oil (1,600 vs 900 kg/m³).
- **Water:** Water sinks through oil (1,000 vs 900 kg/m³).
- **Steam:** Oil falls through steam.
- **Lava:** Lava sinks through oil (2,600 vs 900 kg/m³). Lava (1,200 °C) can set oil on fire (it ignites at 250 °C).
- **Gravel:** Gravel sinks through oil (2,000 vs 900 kg/m³).
- **Fire:** Oil catches from the flame touching it. Oil falls through fire.
- **Smoke:** Oil falls through smoke.
- **Acid:** Acid sinks through oil (1,100 vs 900 kg/m³).
- **Hydrogen:** Oil falls through hydrogen.
- **Oxygen:** Oil burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Oil falls through oxygen. Oxygen makes burning oil hotter and faster.
- **Methane:** Oil falls through methane.
- **Alcohol:** Oil sinks through alcohol (900 vs 789 kg/m³).
- **Salt:** Salt sinks through oil (2,160 vs 900 kg/m³).
- **Sugar:** Sugar sinks through oil (1,590 vs 900 kg/m³).
- **Dirt:** Dirt sinks through oil (1,500 vs 900 kg/m³).
- **Gunpowder:** Gunpowder sinks through oil (1,700 vs 900 kg/m³).
- **Nitro:** Nitro sinks through oil (1,600 vs 900 kg/m³).
- **Shards:** Shards sinks through oil (2,500 vs 900 kg/m³).
- **Spark:** Oil catches from the flame touching it. Oil falls through spark.
- **Mercury:** Mercury sinks through oil (13,534 vs 900 kg/m³).
- **Seed:** Seed sinks through oil (1,100 vs 900 kg/m³).
- **Molten copper:** Molten copper sinks through oil (8,020 vs 900 kg/m³). Molten copper (1,200 °C) can set oil on fire (it ignites at 250 °C).
- **Clay:** Clay sinks through oil (1,700 vs 900 kg/m³).
- **Cement:** Cement sinks through oil (1,440 vs 900 kg/m³).
- **Quicklime:** Quicklime sinks through oil (1,200 vs 900 kg/m³).
- **Slaked lime:** Slaked lime sinks through oil (1,100 vs 900 kg/m³).
- **Molten gold:** Molten gold sinks through oil (17,300 vs 900 kg/m³). Molten gold (1,150 °C) can set oil on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium sinks through oil (2,375 vs 900 kg/m³). Molten aluminium (750 °C) can set oil on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead sinks through oil (10,660 vs 900 kg/m³). Molten lead (400 °C) can set oil on fire (it ignites at 250 °C).
- **Rust:** Rust sinks through oil (2,000 vs 900 kg/m³).
- **Coal:** Coal sinks through oil (1,350 vs 900 kg/m³).
- **Sulfur:** Sulfur sinks through oil (2,000 vs 900 kg/m³).
- **Petrol:** Oil sinks through petrol (900 vs 740 kg/m³).
- **Molten wax:** Oil sinks through molten wax (900 vs 800 kg/m³).
- **Thermite:** Thermite sinks through oil (1,500 vs 900 kg/m³).
- **Honey:** Honey sinks through oil (1,420 vs 900 kg/m³).
- **Vinegar:** Vinegar sinks through oil (1,010 vs 900 kg/m³).
- **Bleach:** Bleach sinks through oil (1,100 vs 900 kg/m³).
- **Lye:** Lye sinks through oil (1,100 vs 900 kg/m³).
- **Liquid nitrogen:** Oil sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Nitrogen:** Oil falls through nitrogen.
- **Carbon dioxide:** Oil falls through carbon dioxide.
- **Helium:** Oil falls through helium.
- **Propane:** Oil falls through propane.
- **Chlorine:** Oil falls through chlorine.
- **Sulfur dioxide:** Oil falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through oil (1,100 vs 900 kg/m³).
- **Grass seed:** Grass seed sinks through oil (1,100 vs 900 kg/m³).
- **Acorn:** Acorn sinks through oil (1,100 vs 900 kg/m³).
- **Cloud:** Oil falls through cloud.
- **Caramel:** Caramel sinks through oil (1,300 vs 900 kg/m³).
- **Chalk:** Chalk sinks through oil (1,500 vs 900 kg/m³).
- **Liquid oxygen:** Oil burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1). Liquid oxygen sinks through oil (1,141 vs 900 kg/m³).
- **Molten iron:** Molten iron sinks through oil (6,980 vs 900 kg/m³). Molten iron (1,600 °C) can set oil on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass sinks through oil (2,400 vs 900 kg/m³). Molten glass (1,450 °C) can set oil on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver sinks through oil (9,320 vs 900 kg/m³). Molten silver (1,000 °C) can set oil on fire (it ignites at 250 °C).
- **Popcorn kernel:** Popcorn kernel sinks through oil (1,200 vs 900 kg/m³).
- **Tar:** Tar sinks through oil (1,150 vs 900 kg/m³).
- **Hydrogen peroxide:** Oil burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through oil (1,450 vs 900 kg/m³). Hydrogen peroxide makes burning oil hotter and faster.
- **Lightning:** Oil catches from the flame touching it. Oil falls through lightning.
- **Plasma:** Oil catches from the flame touching it. Oil falls through plasma.
- **Firework:** Firework sinks through oil (1,400 vs 900 kg/m³).
- **Rocket:** Oil catches from the flame touching it. Oil falls through rocket.
- **Ember:** Oil catches from the flame touching it. Oil falls through ember.
- **Saltpeter:** Oil burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through oil (2,100 vs 900 kg/m³). Saltpeter makes burning oil hotter and faster.
- **Molten tin:** Molten tin sinks through oil (6,990 vs 900 kg/m³). Molten tin (260 °C) can set oil on fire (it ignites at 250 °C).
- **Kerosene:** Oil sinks through kerosene (900 vs 800 kg/m³).
- **Acetone:** Oil sinks through acetone (900 vs 784 kg/m³).
- **Ammonia:** Oil falls through ammonia.
- **Ozone:** Oil burns: it catches fire at 250 °C next to ozone (oxidiser 1). Oil falls through ozone. Ozone makes burning oil hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through oil (1,250 vs 900 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through oil (2,220 vs 900 kg/m³).
- **Acetylene:** Oil falls through acetylene.
- **Iodine:** Iodine sinks through oil (4,930 vs 900 kg/m³).
- **Iodine vapour:** Oil falls through iodine vapour.
- **Argon:** Oil falls through argon.
- **Bromine:** Bromine sinks through oil (3,100 vs 900 kg/m³).
- **Bromine vapour:** Oil falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through oil (6,095 vs 900 kg/m³).
- **Cactus seed:** Cactus seed sinks through oil (1,100 vs 900 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through oil (1,200 vs 900 kg/m³).
- **Soda:** Soda sinks through oil (1,010 vs 900 kg/m³).

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ice

Frozen water, a cold solid. Stays put. Chills what it touches and melts back into water as it warms.

- **State:** Solid, 917 kg/m³
- **Starts at:** -20 °C
- **Melts:** at 0 °C, into water

With other elements (29 interact):

- **Water:** Ice (-20 °C) is cold enough to freeze water into ice.
- **Steam:** Ice (-20 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to melt ice into water.
- **Lava:** Ice (-20 °C) is cold enough to freeze lava into stone. Lava (1,200 °C) is hot enough to melt ice into water.
- **Fire:** Fire (850 °C) is hot enough to melt ice into water.
- **Smoke:** Smoke (150 °C) is hot enough to melt ice into water.
- **Salt:** Salt melts ice: dissolved, it lowers the freezing point.
- **Sugar:** Sugar melts ice: dissolved, it lowers the freezing point.
- **Spark:** Spark (300 °C) is hot enough to melt ice into water.
- **Molten copper:** Ice (-20 °C) is cold enough to freeze molten copper into wire. Molten copper (1,200 °C) is hot enough to melt ice into water.
- **Molten gold:** Ice (-20 °C) is cold enough to freeze molten gold into gold. Molten gold (1,150 °C) is hot enough to melt ice into water.
- **Molten aluminium:** Ice (-20 °C) is cold enough to freeze molten aluminium into aluminium. Molten aluminium (750 °C) is hot enough to melt ice into water.
- **Molten lead:** Ice (-20 °C) is cold enough to freeze molten lead into lead. Molten lead (400 °C) is hot enough to melt ice into water.
- **Molten wax:** Ice (-20 °C) is cold enough to freeze molten wax into wax. Molten wax (80 °C) is hot enough to melt ice into water.
- **Baking soda:** Baking soda melts ice: dissolved, it lowers the freezing point.
- **Caramel:** Caramel (190 °C) is hot enough to melt ice into water.
- **Molten iron:** Ice (-20 °C) is cold enough to freeze molten iron into iron. Molten iron (1,600 °C) is hot enough to melt ice into water.
- **Molten glass:** Ice (-20 °C) is cold enough to freeze molten glass into glass. Molten glass (1,450 °C) is hot enough to melt ice into water.
- **Molten silver:** Ice (-20 °C) is cold enough to freeze molten silver into silver. Molten silver (1,000 °C) is hot enough to melt ice into water.
- **Molten plastic:** Ice (-20 °C) is cold enough to freeze molten plastic into plastic. Molten plastic (200 °C) is hot enough to melt ice into water.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt ice into water.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt ice into water.
- **Rocket:** Rocket (900 °C) is hot enough to melt ice into water.
- **Ember:** Ember (700 °C) is hot enough to melt ice into water.
- **Saltpeter:** Saltpeter melts ice: dissolved, it lowers the freezing point.
- **Molten tin:** Ice (-20 °C) is cold enough to freeze molten tin into tin. Molten tin (260 °C) is hot enough to melt ice into water.
- **Molten chocolate:** Ice (-20 °C) is cold enough to freeze molten chocolate into chocolate. Molten chocolate (45 °C) is hot enough to melt ice into water.
- **Iodine vapour:** Ice (-20 °C) is cold enough to condense iodine vapour into iodine. Iodine vapour (130 °C) is hot enough to melt ice into water.
- **Bromine vapour:** Ice (-20 °C) is cold enough to condense bromine vapour into bromine. Bromine vapour (70 °C) is hot enough to melt ice into water.
- **Liquid gallium:** Ice (-20 °C) is cold enough to freeze liquid gallium into gallium. Liquid gallium (35 °C) is hot enough to melt ice into water.

No direct interaction with: Air, Wall, Sand, Oil, Stone, Gravel, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Titanium, Platinum, Argon, Bromine, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Steam

Hot water vapour. Rises and spreads. Turns back into water as it cools, so it rains.

- **State:** Gas, 0.6 kg/m³
- **Starts at:** 150 °C
- **In air:** Rises (lighter than air)
- **Condenses:** below 100 °C, into water

With other elements (78 interact):

- **Sand:** Sand falls through steam.
- **Water:** Steam (150 °C) is hot enough to boil water into steam. Water falls through steam.
- **Oil:** Oil falls through steam.
- **Ice:** Steam (150 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to condense steam into water.
- **Lava:** Lava falls through steam.
- **Gravel:** Gravel falls through steam.
- **Ash:** Ash falls through steam.
- **Acid:** Acid falls through steam.
- **Alcohol:** Alcohol falls through steam.
- **Sawdust:** Sawdust falls through steam.
- **Salt:** Salt falls through steam.
- **Sugar:** Sugar falls through steam.
- **Dirt:** Dirt falls through steam.
- **Snow:** Steam (150 °C) is hot enough to melt snow into water. Snow falls through steam. Snow (-5 °C) is cold enough to condense steam into water.
- **Gunpowder:** Gunpowder falls through steam.
- **Nitro:** Nitro falls through steam.
- **Shards:** Shards falls through steam.
- **Mercury:** Mercury falls through steam.
- **Seed:** Seed falls through steam.
- **Molten copper:** Molten copper falls through steam.
- **Clay:** Clay falls through steam.
- **Cement:** Cement falls through steam.
- **Quicklime:** Quicklime falls through steam.
- **Slaked lime:** Slaked lime falls through steam.
- **Molten gold:** Molten gold falls through steam.
- **Molten aluminium:** Molten aluminium falls through steam.
- **Molten lead:** Molten lead falls through steam.
- **Rust:** Rust falls through steam.
- **Coal:** Coal falls through steam.
- **Charcoal:** Charcoal falls through steam.
- **Sulfur:** Sulfur falls through steam.
- **Petrol:** Petrol falls through steam.
- **Wax:** Steam (150 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Molten wax falls through steam.
- **Flour:** Flour falls through steam.
- **Thermite:** Thermite falls through steam.
- **Honey:** Honey falls through steam.
- **Vinegar:** Vinegar falls through steam.
- **Bleach:** Bleach falls through steam.
- **Lye:** Lye falls through steam.
- **Liquid nitrogen:** Steam (150 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through steam. Liquid nitrogen (-196 °C) is cold enough to condense steam into water.
- **Dry ice:** Steam (150 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to condense steam into water.
- **Baking soda:** Baking soda falls through steam.
- **Grass seed:** Grass seed falls through steam.
- **Acorn:** Acorn falls through steam.
- **Caramel:** Caramel falls through steam.
- **Chalk:** Chalk falls through steam.
- **Liquid oxygen:** Steam (150 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through steam. Liquid oxygen (-183 °C) is cold enough to condense steam into water.
- **Molten iron:** Molten iron falls through steam.
- **Molten glass:** Molten glass falls through steam.
- **Molten silver:** Molten silver falls through steam.
- **Popcorn kernel:** Popcorn kernel falls through steam.
- **Popcorn:** Popcorn falls through steam.
- **Tar:** Tar falls through steam.
- **Molten plastic:** Molten plastic falls through steam.
- **Pumice:** Pumice falls through steam.
- **Napalm:** Napalm falls through steam.
- **Hydrogen peroxide:** Hydrogen peroxide falls through steam.
- **Firework:** Firework falls through steam.
- **Saltpeter:** Saltpeter falls through steam.
- **Molten tin:** Molten tin falls through steam.
- **Kerosene:** Kerosene falls through steam.
- **Acetone:** Acetone falls through steam.
- **Hail:** Steam (150 °C) is hot enough to melt hail into water. Hail falls through steam. Hail (-5 °C) is cold enough to condense steam into water.
- **Cotton:** Cotton falls through steam.
- **Chocolate:** Steam (150 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through steam.
- **Phosphorus:** Steam (150 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide falls through steam.
- **Iodine:** Steam (150 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through steam.
- **Bromine:** Steam (150 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through steam.
- **Gallium:** Steam (150 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through steam.
- **Cactus seed:** Cactus seed falls through steam.
- **Smoke bomb:** Smoke bomb falls through steam.
- **Peat:** Peat falls through steam.
- **Soda:** Soda falls through steam.
- **Fuse:** Steam (150 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Egg, Cooked egg, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Cactus, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lava

Molten rock, extremely hot. Flows slowly and glows. Sets fuel alight, boils water, and cools into stone (or gravel where nothing holds it up).

- **State:** Liquid, 2,600 kg/m³
- **Starts at:** 1,200 °C
- **In liquids:** Sinks through liquids lighter than 2,600 kg/m³, floats on heavier ones
- **Falls:** up to 90 cells/s
- **Freezes:** below 1,000 °C, into stone

With other elements (119 interact):

- **Water:** Water chills the lava so fast that it sets into glassy obsidian. Lava sinks through water (2,600 vs 1,000 kg/m³). Lava (1,200 °C) is hot enough to boil water into steam. Water chills the lava so fast that it sets into glassy obsidian, flashing into steam.
- **Oil:** Lava sinks through oil (2,600 vs 900 kg/m³). Lava (1,200 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Lava (1,200 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze lava into stone.
- **Steam:** Lava falls through steam.
- **Stone:** Lava (1,200 °C) is hot enough to melt stone into lava.
- **Gravel:** Lava (1,200 °C) is hot enough to melt gravel into lava.
- **Fire:** Lava falls through fire.
- **Smoke:** Lava falls through smoke.
- **Wood:** Lava (1,200 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Lava sinks through acid (2,600 vs 1,100 kg/m³).
- **Hydrogen:** Lava falls through hydrogen. Lava (1,200 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Lava falls through oxygen.
- **Methane:** Lava falls through methane. Lava (1,200 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Lava sinks through alcohol (2,600 vs 789 kg/m³). Lava (1,200 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Lava (1,200 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Lava (1,200 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Lava (1,200 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze lava into stone.
- **TNT:** Lava (1,200 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Lava (1,200 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Lava sinks through nitro (2,600 vs 1,600 kg/m³). Lava (1,200 °C) can set nitro on fire (it ignites at 200 °C).
- **Spark:** Lava falls through spark.
- **Wire:** Lava (1,200 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Mercury sinks through lava (13,534 vs 2,600 kg/m³).
- **Seed:** Lava (1,200 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Lava (1,200 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten copper sinks through lava (8,020 vs 2,600 kg/m³).
- **Dry plant:** Lava (1,200 °C) can set dry plant on fire (it ignites at 200 °C).
- **Gold:** Lava (1,200 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold sinks through lava (17,300 vs 2,600 kg/m³).
- **Aluminium:** Lava (1,200 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Lava sinks through molten aluminium (2,600 vs 2,375 kg/m³).
- **Lead:** Lava (1,200 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead sinks through lava (10,660 vs 2,600 kg/m³).
- **Coal:** Lava (1,200 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Lava (1,200 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Lava (1,200 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Lava sinks through petrol (2,600 vs 740 kg/m³). Lava (1,200 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Lava (1,200 °C) is hot enough to melt wax into molten wax. Lava (1,200 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Lava sinks through molten wax (2,600 vs 800 kg/m³). Lava (1,200 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Lava (1,200 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Lava (1,200 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Lava (1,200 °C) can set flour on fire (it ignites at 380 °C).
- **Thermite:** Lava (1,200 °C) can set thermite on fire (it ignites at 900 °C).
- **Honey:** Lava sinks through honey (2,600 vs 1,420 kg/m³).
- **Vinegar:** Lava sinks through vinegar (2,600 vs 1,010 kg/m³).
- **Bleach:** Lava sinks through bleach (2,600 vs 1,100 kg/m³).
- **Lye:** Lava sinks through lye (2,600 vs 1,100 kg/m³).
- **Liquid nitrogen:** Lava sinks through liquid nitrogen (2,600 vs 808 kg/m³). Lava (1,200 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze lava into stone.
- **Nitrogen:** Lava falls through nitrogen.
- **Carbon dioxide:** Lava falls through carbon dioxide.
- **Helium:** Lava falls through helium.
- **Propane:** Lava falls through propane. Lava (1,200 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Lava falls through chlorine.
- **Sulfur dioxide:** Lava falls through sulfur dioxide.
- **Dry ice:** Lava (1,200 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze lava into stone.
- **C4:** Lava (1,200 °C) can set c4 on fire (it ignites at 900 °C).
- **Grass seed:** Lava (1,200 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Lava (1,200 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Lava (1,200 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Lava (1,200 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Lava (1,200 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Lava (1,200 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Lava falls through cloud.
- **Magnesium:** Lava (1,200 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Lava sinks through caramel (2,600 vs 1,300 kg/m³). Lava (1,200 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Lava sinks through liquid oxygen (2,600 vs 1,141 kg/m³). Lava (1,200 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze lava into stone.
- **Molten iron:** Molten iron sinks through lava (6,980 vs 2,600 kg/m³).
- **Molten glass:** Lava sinks through molten glass (2,600 vs 2,400 kg/m³).
- **Silver:** Lava (1,200 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver sinks through lava (9,320 vs 2,600 kg/m³).
- **Cooked meat:** Lava (1,200 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Lava (1,200 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Lava sinks through tar (2,600 vs 1,150 kg/m³). Lava (1,200 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Lava (1,200 °C) is hot enough to melt plastic into molten plastic. Lava (1,200 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Lava sinks through molten plastic (2,600 vs 900 kg/m³). Lava (1,200 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Obsidian:** Lava (1,200 °C) is hot enough to melt obsidian into lava.
- **Diamond:** Lava (1,200 °C) can set diamond on fire (it ignites at 900 °C).
- **Napalm:** Lava sinks through napalm (2,600 vs 900 kg/m³). Lava (1,200 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Lava sinks through hydrogen peroxide (2,600 vs 1,450 kg/m³).
- **Fish:** Lava (1,200 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Lava (1,200 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Lava (1,200 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Lava falls through lightning.
- **Plasma:** Lava falls through plasma.
- **Firework:** Lava (1,200 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Lava falls through rocket.
- **Ember:** Lava falls through ember.
- **Tin:** Lava (1,200 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin sinks through lava (6,990 vs 2,600 kg/m³).
- **Kerosene:** Lava sinks through kerosene (2,600 vs 800 kg/m³). Lava (1,200 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Lava sinks through acetone (2,600 vs 784 kg/m³). Lava (1,200 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Lava (1,200 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze lava into stone.
- **Bee:** Lava (1,200 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Lava (1,200 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Lava (1,200 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Lava (1,200 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Lava (1,200 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Lava (1,200 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Lava falls through ammonia.
- **Ozone:** Lava falls through ozone.
- **Cotton:** Lava (1,200 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Lava (1,200 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Lava sinks through molten chocolate (2,600 vs 1,250 kg/m³).
- **Phosphorus:** Lava (1,200 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Lava falls through acetylene. Lava (1,200 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Lava (1,200 °C) is hot enough to turn iodine into iodine vapour. Iodine sinks through lava (4,930 vs 2,600 kg/m³).
- **Iodine vapour:** Lava falls through iodine vapour.
- **Argon:** Lava falls through argon.
- **Bromine:** Lava (1,200 °C) is hot enough to boil bromine into bromine vapour. Bromine sinks through lava (3,100 vs 2,600 kg/m³).
- **Bromine vapour:** Lava falls through bromine vapour.
- **Gallium:** Lava (1,200 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through lava (6,095 vs 2,600 kg/m³).
- **Cactus seed:** Lava (1,200 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Lava (1,200 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Lava (1,200 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Lava (1,200 °C) can set peat on fire (it ignites at 300 °C).
- **Basalt:** Lava (1,200 °C) is hot enough to melt basalt into lava.
- **Soda:** Lava sinks through soda (2,600 vs 1,010 kg/m³).
- **Fuse:** Lava (1,200 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Glass, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Meat, Popcorn kernel, Pumice, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Stone

Solid rock. Stays put. Glows as it heats and melts back into lava.

- **State:** Solid, 2,600 kg/m³
- **Melts:** at 1,000 °C, into lava
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (7 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt stone into lava.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt stone into lava.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt stone into lava.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt stone into lava.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt stone into lava.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt stone into lava.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt stone into lava.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gravel

Loose rock, a heavy powder. Falls and piles. Forms where lava sets with nothing under it, and melts back into lava.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 170 cells/s
- **Melts:** at 1,000 °C, into lava
- **Hardness:** 0.8 (acid stronger than this eats it)

With other elements (51 interact):

- **Water:** Gravel sinks through water (2,000 vs 1,000 kg/m³).
- **Oil:** Gravel sinks through oil (2,000 vs 900 kg/m³).
- **Steam:** Gravel falls through steam.
- **Lava:** Lava (1,200 °C) is hot enough to melt gravel into lava.
- **Fire:** Gravel falls through fire.
- **Smoke:** Gravel falls through smoke.
- **Acid:** Gravel sinks through acid (2,000 vs 1,100 kg/m³).
- **Hydrogen:** Gravel falls through hydrogen.
- **Oxygen:** Gravel falls through oxygen.
- **Methane:** Gravel falls through methane.
- **Alcohol:** Gravel sinks through alcohol (2,000 vs 789 kg/m³).
- **Nitro:** Gravel sinks through nitro (2,000 vs 1,600 kg/m³).
- **Spark:** Gravel falls through spark.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt gravel into lava.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt gravel into lava.
- **Petrol:** Gravel sinks through petrol (2,000 vs 740 kg/m³).
- **Molten wax:** Gravel sinks through molten wax (2,000 vs 800 kg/m³).
- **Honey:** Gravel sinks through honey (2,000 vs 1,420 kg/m³).
- **Vinegar:** Gravel sinks through vinegar (2,000 vs 1,010 kg/m³).
- **Bleach:** Gravel sinks through bleach (2,000 vs 1,100 kg/m³).
- **Lye:** Gravel sinks through lye (2,000 vs 1,100 kg/m³).
- **Liquid nitrogen:** Gravel sinks through liquid nitrogen (2,000 vs 808 kg/m³).
- **Nitrogen:** Gravel falls through nitrogen.
- **Carbon dioxide:** Gravel falls through carbon dioxide.
- **Helium:** Gravel falls through helium.
- **Propane:** Gravel falls through propane.
- **Chlorine:** Gravel falls through chlorine.
- **Sulfur dioxide:** Gravel falls through sulfur dioxide.
- **Cloud:** Gravel falls through cloud.
- **Caramel:** Gravel sinks through caramel (2,000 vs 1,300 kg/m³).
- **Liquid oxygen:** Gravel sinks through liquid oxygen (2,000 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt gravel into lava.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt gravel into lava.
- **Tar:** Gravel sinks through tar (2,000 vs 1,150 kg/m³).
- **Molten plastic:** Gravel sinks through molten plastic (2,000 vs 900 kg/m³).
- **Napalm:** Gravel sinks through napalm (2,000 vs 900 kg/m³).
- **Hydrogen peroxide:** Gravel sinks through hydrogen peroxide (2,000 vs 1,450 kg/m³).
- **Lightning:** Gravel falls through lightning. Lightning (3,000 °C) is hot enough to melt gravel into lava.
- **Plasma:** Gravel falls through plasma. Plasma (3,000 °C) is hot enough to melt gravel into lava.
- **Rocket:** Gravel falls through rocket.
- **Ember:** Gravel falls through ember.
- **Kerosene:** Gravel sinks through kerosene (2,000 vs 800 kg/m³).
- **Acetone:** Gravel sinks through acetone (2,000 vs 784 kg/m³).
- **Ammonia:** Gravel falls through ammonia.
- **Ozone:** Gravel falls through ozone.
- **Molten chocolate:** Gravel sinks through molten chocolate (2,000 vs 1,250 kg/m³).
- **Acetylene:** Gravel falls through acetylene.
- **Iodine vapour:** Gravel falls through iodine vapour.
- **Argon:** Gravel falls through argon.
- **Bromine vapour:** Gravel falls through bromine vapour.
- **Soda:** Gravel sinks through soda (2,000 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Stone, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fire

Loose flames. Rise and burn out quickly. Light anything flammable they touch; a lasting fire needs fuel and air.

- **State:** Energy, 0.3 kg/m³
- **Starts at:** 850 °C

With other elements (108 interact):

- **Sand:** Sand falls through fire.
- **Water:** Water puts out the fire, flashing into steam. Fire (850 °C) is hot enough to boil water into steam. Water falls through fire.
- **Oil:** Oil catches from the flame touching it. Oil falls through fire.
- **Ice:** Fire (850 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through fire.
- **Gravel:** Gravel falls through fire.
- **Wood:** Wood catches from the flame touching it.
- **Ash:** Ash falls through fire.
- **Acid:** Acid falls through fire.
- **Hydrogen:** Hydrogen catches from the flame touching it.
- **Methane:** Methane catches from the flame touching it.
- **Alcohol:** Alcohol catches from the flame touching it. Alcohol falls through fire.
- **Sawdust:** Sawdust catches from the flame touching it. Sawdust falls through fire.
- **Salt:** Salt falls through fire.
- **Sugar:** Sugar catches from the flame touching it. Sugar falls through fire.
- **Dirt:** Dirt falls through fire.
- **Snow:** Fire (850 °C) is hot enough to melt snow into water. Snow falls through fire.
- **TNT:** TNT explodes when a flame touches it.
- **Gunpowder:** Gunpowder explodes when a flame touches it. Gunpowder falls through fire.
- **Nitro:** Nitro explodes when a flame touches it. Nitro falls through fire.
- **Shards:** Shards falls through fire.
- **Mercury:** Mercury falls through fire.
- **Seed:** Seed catches from the flame touching it. Seed falls through fire.
- **Plant:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper falls through fire.
- **Dry plant:** Dry plant catches from the flame touching it.
- **Clay:** Clay falls through fire.
- **Cement:** Cement falls through fire.
- **Quicklime:** Quicklime falls through fire.
- **Slaked lime:** Slaked lime falls through fire.
- **Molten gold:** Molten gold falls through fire.
- **Aluminium:** Fire (850 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium falls through fire.
- **Lead:** Fire (850 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead falls through fire.
- **Rust:** Rust falls through fire.
- **Coal:** Coal catches from the flame touching it. Coal falls through fire.
- **Charcoal:** Charcoal catches from the flame touching it. Charcoal falls through fire.
- **Sulfur:** Sulfur catches from the flame touching it. Sulfur falls through fire.
- **Petrol:** Petrol catches from the flame touching it. Petrol falls through fire.
- **Wax:** Fire (850 °C) is hot enough to melt wax into molten wax. Wax catches from the flame touching it.
- **Molten wax:** Molten wax catches from the flame touching it. Molten wax falls through fire.
- **Paper:** Paper catches from the flame touching it.
- **Rubber:** Rubber catches from the flame touching it.
- **Flour:** Flour catches from the flame touching it. Flour falls through fire.
- **Thermite:** Thermite falls through fire.
- **Honey:** Honey falls through fire.
- **Vinegar:** Vinegar falls through fire.
- **Bleach:** Bleach falls through fire.
- **Lye:** Lye falls through fire.
- **Liquid nitrogen:** Liquid nitrogen puts out the fire, flashing into nitrogen. Fire (850 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through fire.
- **Propane:** Propane catches from the flame touching it.
- **Dry ice:** Fire (850 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through fire.
- **Grass seed:** Grass seed catches from the flame touching it. Grass seed falls through fire.
- **Grass:** Grass catches from the flame touching it.
- **Acorn:** Acorn catches from the flame touching it. Acorn falls through fire.
- **Tree:** Tree catches from the flame touching it.
- **Leaves:** Leaves catches from the flame touching it.
- **Flower:** Flower catches from the flame touching it.
- **Magnesium:** Magnesium catches from the flame touching it.
- **Caramel:** Caramel catches from the flame touching it. Caramel falls through fire.
- **Chalk:** Chalk falls through fire.
- **Liquid oxygen:** Liquid oxygen puts out the fire, flashing into oxygen. Fire (850 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through fire.
- **Molten iron:** Molten iron falls through fire.
- **Molten glass:** Molten glass falls through fire.
- **Molten silver:** Molten silver falls through fire.
- **Cooked meat:** Cooked meat catches from the flame touching it.
- **Popcorn kernel:** Popcorn kernel falls through fire.
- **Popcorn:** Popcorn catches from the flame touching it. Popcorn falls through fire.
- **Tar:** Tar catches from the flame touching it. Tar falls through fire.
- **Plastic:** Fire (850 °C) is hot enough to melt plastic into molten plastic. Plastic catches from the flame touching it.
- **Molten plastic:** Molten plastic catches from the flame touching it. Molten plastic falls through fire.
- **Pumice:** Pumice falls through fire.
- **Napalm:** Napalm catches from the flame touching it. Napalm falls through fire.
- **Hydrogen peroxide:** Hydrogen peroxide falls through fire.
- **Fish:** Fish catches from the flame touching it.
- **Ant:** Ant catches from the flame touching it.
- **Bird:** Bird catches from the flame touching it.
- **Firework:** Firework catches from the flame touching it. Firework falls through fire.
- **Saltpeter:** Saltpeter falls through fire.
- **Tin:** Fire (850 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin falls through fire.
- **Kerosene:** Kerosene catches from the flame touching it. Kerosene falls through fire.
- **Acetone:** Acetone catches from the flame touching it. Acetone falls through fire.
- **Hail:** Fire (850 °C) is hot enough to melt hail into water. Hail falls through fire.
- **Bee:** Bee catches from the flame touching it.
- **Spider:** Spider catches from the flame touching it.
- **Termite:** Termite catches from the flame touching it.
- **Frog:** Frog catches from the flame touching it.
- **Mouse:** Mouse catches from the flame touching it.
- **Snake:** Snake catches from the flame touching it.
- **Cotton:** Cotton catches from the flame touching it. Cotton falls through fire.
- **Chocolate:** Fire (850 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through fire.
- **Phosphorus:** Phosphorus catches from the flame touching it.
- **Calcium carbide:** Calcium carbide falls through fire.
- **Acetylene:** Acetylene catches from the flame touching it.
- **Iodine:** Fire (850 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through fire.
- **Bromine:** Bromine puts out the fire, flashing into bromine vapour. Fire (850 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through fire.
- **Gallium:** Fire (850 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through fire.
- **Cactus seed:** Cactus seed catches from the flame touching it. Cactus seed falls through fire.
- **Cactus:** Cactus catches from the flame touching it.
- **Smoke bomb:** Smoke bomb catches from the flame touching it. Smoke bomb falls through fire.
- **Peat:** Peat catches from the flame touching it. Peat falls through fire.
- **Soda:** Soda falls through fire.
- **Fuse:** Fuse catches from the flame touching it.

No direct interaction with: Air, Wall, Steam, Stone, Smoke, Iron, Oxygen, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Obsidian, Diamond, Worm, Lightning, Plasma, Rocket, Ember, Steel, Zinc, Uranium, Snail, Ammonia, Ozone, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Smoke

What burning leaves behind, a warm gas. Rises and drifts off the top. Does not feed fire, so it smothers flames in a closed space.

- **State:** Gas, 0.7 kg/m³
- **Starts at:** 150 °C
- **In air:** Rises (lighter than air)

With other elements (78 interact):

- **Sand:** Sand falls through smoke.
- **Water:** Smoke (150 °C) is hot enough to boil water into steam. Water falls through smoke.
- **Oil:** Oil falls through smoke.
- **Ice:** Smoke (150 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through smoke.
- **Gravel:** Gravel falls through smoke.
- **Ash:** Ash falls through smoke.
- **Acid:** Acid falls through smoke.
- **Alcohol:** Alcohol falls through smoke.
- **Sawdust:** Sawdust falls through smoke.
- **Salt:** Salt falls through smoke.
- **Sugar:** Sugar falls through smoke.
- **Dirt:** Dirt falls through smoke.
- **Snow:** Smoke (150 °C) is hot enough to melt snow into water. Snow falls through smoke.
- **Gunpowder:** Gunpowder falls through smoke.
- **Nitro:** Nitro falls through smoke.
- **Shards:** Shards falls through smoke.
- **Mercury:** Mercury falls through smoke.
- **Seed:** Seed falls through smoke.
- **Molten copper:** Molten copper falls through smoke.
- **Clay:** Clay falls through smoke.
- **Cement:** Cement falls through smoke.
- **Quicklime:** Quicklime falls through smoke.
- **Slaked lime:** Slaked lime falls through smoke.
- **Molten gold:** Molten gold falls through smoke.
- **Molten aluminium:** Molten aluminium falls through smoke.
- **Molten lead:** Molten lead falls through smoke.
- **Rust:** Rust falls through smoke.
- **Coal:** Coal falls through smoke.
- **Charcoal:** Charcoal falls through smoke.
- **Sulfur:** Sulfur falls through smoke.
- **Petrol:** Petrol falls through smoke.
- **Wax:** Smoke (150 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Molten wax falls through smoke.
- **Flour:** Flour falls through smoke.
- **Thermite:** Thermite falls through smoke.
- **Honey:** Honey falls through smoke.
- **Vinegar:** Vinegar falls through smoke.
- **Bleach:** Bleach falls through smoke.
- **Lye:** Lye falls through smoke.
- **Liquid nitrogen:** Smoke (150 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through smoke.
- **Dry ice:** Smoke (150 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through smoke.
- **Grass seed:** Grass seed falls through smoke.
- **Acorn:** Acorn falls through smoke.
- **Caramel:** Caramel falls through smoke.
- **Chalk:** Chalk falls through smoke.
- **Liquid oxygen:** Smoke (150 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through smoke.
- **Molten iron:** Molten iron falls through smoke.
- **Molten glass:** Molten glass falls through smoke.
- **Molten silver:** Molten silver falls through smoke.
- **Popcorn kernel:** Popcorn kernel falls through smoke.
- **Popcorn:** Popcorn falls through smoke.
- **Tar:** Tar falls through smoke.
- **Molten plastic:** Molten plastic falls through smoke.
- **Pumice:** Pumice falls through smoke.
- **Napalm:** Napalm falls through smoke.
- **Hydrogen peroxide:** Hydrogen peroxide falls through smoke.
- **Firework:** Firework falls through smoke.
- **Saltpeter:** Saltpeter falls through smoke.
- **Molten tin:** Molten tin falls through smoke.
- **Kerosene:** Kerosene falls through smoke.
- **Acetone:** Acetone falls through smoke.
- **Hail:** Smoke (150 °C) is hot enough to melt hail into water. Hail falls through smoke.
- **Cotton:** Cotton falls through smoke.
- **Chocolate:** Smoke (150 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through smoke.
- **Phosphorus:** Smoke (150 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide falls through smoke.
- **Iodine:** Smoke (150 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through smoke.
- **Bromine:** Smoke (150 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through smoke.
- **Gallium:** Smoke (150 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through smoke.
- **Cactus seed:** Cactus seed falls through smoke.
- **Smoke bomb:** Smoke bomb falls through smoke.
- **Peat:** Peat falls through smoke.
- **Soda:** Soda falls through smoke.
- **Fuse:** Smoke (150 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Steam, Stone, Fire, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Egg, Cooked egg, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Cactus, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wood

A solid fuel. Stays put. Catches fire where it touches air once hot enough, and burns down to a little ash.

- **State:** Solid, 700 kg/m³
- **Burns:** from 300 °C in air, 2.5 s per cell, leaves ash
- **Bakes:** at 400 °C into charcoal, giving off smoke; there is no way back
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Wood burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set wood on fire (it ignites at 300 °C).
- **Fire:** Wood catches from the flame touching it.
- **Acid:** Acid eats wood: acidity 0.8 beats hardness 0.3.
- **Oxygen:** Wood burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning wood hotter and faster.
- **Spark:** Wood catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set wood on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set wood on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set wood on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set wood on fire (it ignites at 300 °C).
- **Liquid oxygen:** Wood burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set wood on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set wood on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set wood on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Wood burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning wood hotter and faster.
- **Lightning:** Wood catches from the flame touching it.
- **Plasma:** Wood catches from the flame touching it.
- **Rocket:** Wood catches from the flame touching it.
- **Ember:** Wood catches from the flame touching it.
- **Saltpeter:** Wood burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning wood hotter and faster.
- **Ozone:** Wood burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning wood hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ash

A very light powder left by fire. Drifts as it falls. Floats on water.

- **State:** Powder, 600 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 45 cells/s
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (25 interact):

- **Steam:** Ash falls through steam.
- **Fire:** Ash falls through fire.
- **Smoke:** Ash falls through smoke.
- **Acid:** Acid eats ash: acidity 0.8 beats hardness 0.2.
- **Hydrogen:** Ash falls through hydrogen.
- **Oxygen:** Ash falls through oxygen.
- **Methane:** Ash falls through methane.
- **Spark:** Ash falls through spark.
- **Nitrogen:** Ash falls through nitrogen.
- **Carbon dioxide:** Ash falls through carbon dioxide.
- **Helium:** Ash falls through helium.
- **Propane:** Ash falls through propane.
- **Chlorine:** Ash falls through chlorine.
- **Sulfur dioxide:** Ash falls through sulfur dioxide.
- **Cloud:** Ash falls through cloud.
- **Lightning:** Ash falls through lightning.
- **Plasma:** Ash falls through plasma.
- **Rocket:** Ash falls through rocket.
- **Ember:** Ash falls through ember.
- **Ammonia:** Ash falls through ammonia.
- **Ozone:** Ash falls through ozone.
- **Acetylene:** Ash falls through acetylene.
- **Iodine vapour:** Ash falls through iodine vapour.
- **Argon:** Ash falls through argon.
- **Bromine vapour:** Ash falls through bromine vapour.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Lava, Stone, Gravel, Wood, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acid

A corrosive liquid. Flows like water. Eats metal, wood and soft rock and is used up as it does; metal gives off hydrogen.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Eats:** metal, rock and wood softer than 0.8, weakening as it fills

With other elements (135 interact):

- **Sand:** Sand sinks through acid (1,600 vs 1,100 kg/m³).
- **Water:** Acid sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Acid sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Acid falls through steam.
- **Lava:** Lava sinks through acid (2,600 vs 1,100 kg/m³).
- **Gravel:** Gravel sinks through acid (2,000 vs 1,100 kg/m³).
- **Fire:** Acid falls through fire.
- **Smoke:** Acid falls through smoke.
- **Wood:** Acid eats wood: acidity 0.8 beats hardness 0.3.
- **Ash:** Acid eats ash: acidity 0.8 beats hardness 0.2.
- **Iron:** Acid eats iron: acidity 0.8 beats hardness 0.55, giving off hydrogen.
- **Hydrogen:** Acid falls through hydrogen.
- **Oxygen:** Acid falls through oxygen.
- **Methane:** Acid falls through methane.
- **Alcohol:** Acid sinks through alcohol (1,100 vs 789 kg/m³).
- **Sawdust:** Acid eats sawdust: acidity 0.8 beats hardness 0.1.
- **Salt:** Salt sinks through acid (2,160 vs 1,100 kg/m³).
- **Sugar:** Acid eats sugar: acidity 0.8 beats hardness 0.2. Sugar sinks through acid (1,590 vs 1,100 kg/m³).
- **Dirt:** Acid eats dirt: acidity 0.8 beats hardness 0.3. Dirt sinks through acid (1,500 vs 1,100 kg/m³).
- **TNT:** Acid eats tnt: acidity 0.8 beats hardness 0.3.
- **Gunpowder:** Acid eats gunpowder: acidity 0.8 beats hardness 0.2. Gunpowder sinks through acid (1,700 vs 1,100 kg/m³).
- **Nitro:** Nitro sinks through acid (1,600 vs 1,100 kg/m³).
- **Shards:** Shards sinks through acid (2,500 vs 1,100 kg/m³).
- **Spark:** Acid falls through spark.
- **Wire:** Acid eats wire: acidity 0.8 beats hardness 0.45, giving off hydrogen.
- **Battery:** Acid eats battery: acidity 0.8 beats hardness 0.6, giving off hydrogen.
- **Mercury:** Mercury sinks through acid (13,534 vs 1,100 kg/m³).
- **Plant:** Acid eats plant: acidity 0.8 beats hardness 0.15.
- **Molten copper:** Molten copper sinks through acid (8,020 vs 1,100 kg/m³).
- **Dry plant:** Acid eats dry plant: acidity 0.8 beats hardness 0.1.
- **Clay:** Acid eats clay: acidity 0.8 beats hardness 0.3. Clay sinks through acid (1,700 vs 1,100 kg/m³).
- **Cement:** Acid eats cement: acidity 0.8 beats hardness 0.4. Cement sinks through acid (1,440 vs 1,100 kg/m³).
- **Concrete:** Acid eats concrete: acidity 0.8 beats hardness 0.6.
- **Limestone:** Acid eats limestone: acidity 0.8 beats hardness 0.4, fizzing out carbon dioxide.
- **Quicklime:** Acid eats quicklime: acidity 0.8 beats hardness 0.3. Quicklime sinks through acid (1,200 vs 1,100 kg/m³).
- **Slaked lime:** Acid eats slaked lime: acidity 0.8 beats hardness 0.25.
- **Molten gold:** Molten gold sinks through acid (17,300 vs 1,100 kg/m³).
- **Aluminium:** Acid eats aluminium: acidity 0.8 beats hardness 0.4, giving off hydrogen.
- **Molten aluminium:** Molten aluminium sinks through acid (2,375 vs 1,100 kg/m³).
- **Lead:** Acid eats lead: acidity 0.8 beats hardness 0.6, giving off hydrogen.
- **Molten lead:** Molten lead sinks through acid (10,660 vs 1,100 kg/m³).
- **Rust:** Acid eats rust: acidity 0.8 beats hardness 0.3. Rust sinks through acid (2,000 vs 1,100 kg/m³).
- **Sodium:** Acid eats sodium: acidity 0.8 beats hardness 0.1, giving off hydrogen.
- **Coal:** Coal sinks through acid (1,350 vs 1,100 kg/m³).
- **Sulfur:** Sulfur sinks through acid (2,000 vs 1,100 kg/m³).
- **Petrol:** Acid sinks through petrol (1,100 vs 740 kg/m³).
- **Wax:** Acid eats wax: acidity 0.8 beats hardness 0.2.
- **Molten wax:** Acid sinks through molten wax (1,100 vs 800 kg/m³).
- **Paper:** Acid eats paper: acidity 0.8 beats hardness 0.05.
- **Rubber:** Acid eats rubber: acidity 0.8 beats hardness 0.4.
- **Flour:** Acid eats flour: acidity 0.8 beats hardness 0.1.
- **Thermite:** Thermite sinks through acid (1,500 vs 1,100 kg/m³).
- **Honey:** Honey sinks through acid (1,420 vs 1,100 kg/m³).
- **Vinegar:** Acid sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Bleach:** Acid and bleach release poisonous chlorine gas. Bleach and acid release poisonous chlorine gas.
- **Lye:** Acid and lye neutralise each other into water, and warm up. Lye and acid neutralise each other into water, and warm up.
- **Liquid nitrogen:** Acid sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Acid falls through nitrogen.
- **Carbon dioxide:** Acid falls through carbon dioxide.
- **Helium:** Acid falls through helium.
- **Propane:** Acid falls through propane.
- **Chlorine:** Acid falls through chlorine.
- **Sulfur dioxide:** Acid falls through sulfur dioxide.
- **Baking soda:** Acid and baking soda neutralise each other into water, fizzing out carbon dioxide, and warm up. Baking soda and acid neutralise each other into water, fizzing out carbon dioxide, and warm up.
- **C4:** Acid eats c4: acidity 0.8 beats hardness 0.3.
- **Grass:** Acid eats grass: acidity 0.8 beats hardness 0.1.
- **Tree:** Acid eats tree: acidity 0.8 beats hardness 0.3.
- **Leaves:** Acid eats leaves: acidity 0.8 beats hardness 0.1.
- **Flower:** Acid eats flower: acidity 0.8 beats hardness 0.1.
- **Cloud:** Acid falls through cloud.
- **Magnesium:** Acid eats magnesium: acidity 0.8 beats hardness 0.35, giving off hydrogen.
- **Potassium:** Acid eats potassium: acidity 0.8 beats hardness 0.05, giving off hydrogen.
- **Caramel:** Caramel sinks through acid (1,300 vs 1,100 kg/m³).
- **Marble:** Acid eats marble: acidity 0.8 beats hardness 0.5, fizzing out carbon dioxide.
- **Chalk:** Acid eats chalk: acidity 0.8 beats hardness 0.2, fizzing out carbon dioxide. Chalk sinks through acid (1,500 vs 1,100 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through acid (1,141 vs 1,100 kg/m³).
- **Molten iron:** Molten iron sinks through acid (6,980 vs 1,100 kg/m³).
- **Molten glass:** Molten glass sinks through acid (2,400 vs 1,100 kg/m³).
- **Molten silver:** Molten silver sinks through acid (9,320 vs 1,100 kg/m³).
- **Meat:** Acid eats meat: acidity 0.8 beats hardness 0.2.
- **Cooked meat:** Acid eats cooked meat: acidity 0.8 beats hardness 0.2.
- **Popcorn kernel:** Acid eats popcorn kernel: acidity 0.8 beats hardness 0.3. Popcorn kernel sinks through acid (1,200 vs 1,100 kg/m³).
- **Popcorn:** Acid eats popcorn: acidity 0.8 beats hardness 0.05.
- **Tar:** Tar sinks through acid (1,150 vs 1,100 kg/m³).
- **Molten plastic:** Acid sinks through molten plastic (1,100 vs 900 kg/m³).
- **Pumice:** Acid eats pumice: acidity 0.8 beats hardness 0.6.
- **Napalm:** Acid sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through acid (1,450 vs 1,100 kg/m³).
- **Fish:** Acid eats fish: acidity 0.8 beats hardness 0.1.
- **Ant:** Acid eats ant: acidity 0.8 beats hardness 0.1.
- **Worm:** Acid eats worm: acidity 0.8 beats hardness 0.1.
- **Bird:** Acid eats bird: acidity 0.8 beats hardness 0.1.
- **Lightning:** Acid falls through lightning.
- **Plasma:** Acid falls through plasma.
- **Firework:** Acid eats firework: acidity 0.8 beats hardness 0.2. Firework sinks through acid (1,400 vs 1,100 kg/m³).
- **Rocket:** Acid falls through rocket.
- **Ember:** Acid falls through ember.
- **Saltpeter:** Saltpeter sinks through acid (2,100 vs 1,100 kg/m³).
- **Tin:** Acid eats tin: acidity 0.8 beats hardness 0.3, giving off hydrogen.
- **Molten tin:** Molten tin sinks through acid (6,990 vs 1,100 kg/m³).
- **Steel:** Acid eats steel: acidity 0.8 beats hardness 0.75, giving off hydrogen.
- **Zinc:** Acid eats zinc: acidity 0.8 beats hardness 0.3, giving off hydrogen.
- **Kerosene:** Acid sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Acid sinks through acetone (1,100 vs 784 kg/m³).
- **Uranium:** Acid eats uranium: acidity 0.8 beats hardness 0.6, giving off hydrogen.
- **Bee:** Acid eats bee: acidity 0.8 beats hardness 0.1.
- **Spider:** Acid eats spider: acidity 0.8 beats hardness 0.1.
- **Termite:** Acid eats termite: acidity 0.8 beats hardness 0.1.
- **Snail:** Acid eats snail: acidity 0.8 beats hardness 0.2.
- **Frog:** Acid eats frog: acidity 0.8 beats hardness 0.1.
- **Mouse:** Acid eats mouse: acidity 0.8 beats hardness 0.1.
- **Snake:** Acid eats snake: acidity 0.8 beats hardness 0.15.
- **Ammonia:** Acid and ammonia neutralise each other into water, and warm up. Acid falls through ammonia. Ammonia and acid neutralise each other into water, and warm up.
- **Ozone:** Acid falls through ozone.
- **Cotton:** Acid eats cotton: acidity 0.8 beats hardness 0.05.
- **Chocolate:** Acid eats chocolate: acidity 0.8 beats hardness 0.2.
- **Molten chocolate:** Molten chocolate sinks through acid (1,250 vs 1,100 kg/m³).
- **Egg:** Acid eats egg: acidity 0.8 beats hardness 0.2.
- **Cooked egg:** Acid eats cooked egg: acidity 0.8 beats hardness 0.2.
- **Lithium:** Acid eats lithium: acidity 0.8 beats hardness 0.1, giving off hydrogen.
- **Calcium carbide:** Calcium carbide sinks through acid (2,220 vs 1,100 kg/m³).
- **Acetylene:** Acid falls through acetylene.
- **Iodine:** Iodine sinks through acid (4,930 vs 1,100 kg/m³).
- **Iodine vapour:** Acid falls through iodine vapour.
- **Argon:** Acid falls through argon.
- **Bromine:** Bromine sinks through acid (3,100 vs 1,100 kg/m³).
- **Bromine vapour:** Acid falls through bromine vapour.
- **Gallium:** Acid eats gallium: acidity 0.8 beats hardness 0.3, giving off hydrogen.
- **Liquid gallium:** Liquid gallium sinks through acid (6,095 vs 1,100 kg/m³).
- **Cactus:** Acid eats cactus: acidity 0.8 beats hardness 0.2.
- **Smoke bomb:** Acid eats smoke bomb: acidity 0.8 beats hardness 0.2. Smoke bomb sinks through acid (1,200 vs 1,100 kg/m³).
- **Peat:** Acid eats peat: acidity 0.8 beats hardness 0.2.
- **Sandstone:** Acid eats sandstone: acidity 0.8 beats hardness 0.6.
- **Soda:** Acid sinks through soda (1,100 vs 1,010 kg/m³).
- **Fuse:** Acid eats fuse: acidity 0.8 beats hardness 0.2.

No direct interaction with: Air, Wall, Ice, Stone, Snow, Glass, Seed, Brick, Gold, Charcoal, Dry ice, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb, Silver, Plastic, Obsidian, Diamond, Hail, Phosphorus, Titanium, Platinum, Cactus seed, Basalt, Granite. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Iron

A dense metal. Stays put and moves heat quickly. Acid eats it, giving off hydrogen.

- **State:** Solid, 7,870 kg/m³
- **Melts:** at 1,538 °C, into molten iron
- **Conducts:** electric charge, warming as pulses pass
- **Rusts:** slowly into rust where water or oxygen touches it
- **Hardness:** 0.55 (acid stronger than this eats it)

With other elements (10 interact):

- **Water:** Iron slowly rusts into rust where water touches it.
- **Acid:** Acid eats iron: acidity 0.8 beats hardness 0.55, giving off hydrogen.
- **Oxygen:** Iron slowly rusts into rust where oxygen touches it.
- **Liquid oxygen:** Iron slowly rusts into rust where liquid oxygen touches it.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt iron into molten iron.
- **Hydrogen peroxide:** Iron slowly rusts into rust where hydrogen peroxide touches it.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt iron into molten iron.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt iron into molten iron.
- **Saltpeter:** Iron slowly rusts into rust where saltpeter touches it.
- **Ozone:** Iron slowly rusts into rust where ozone touches it.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Hydrogen

The lightest gas. Shoots upwards. Burns in a flash into steam when hot and touching air or oxygen.

- **State:** Gas, 0.09 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 500 °C in air, 0.1 s per cell, leaves steam

With other elements (81 interact):

- **Air:** Hydrogen burns: it catches fire at 500 °C next to air (oxidiser 0.21).
- **Sand:** Sand falls through hydrogen.
- **Water:** Water falls through hydrogen.
- **Oil:** Oil falls through hydrogen.
- **Lava:** Lava falls through hydrogen. Lava (1,200 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Gravel:** Gravel falls through hydrogen.
- **Fire:** Hydrogen catches from the flame touching it.
- **Ash:** Ash falls through hydrogen.
- **Acid:** Acid falls through hydrogen.
- **Oxygen:** Hydrogen burns: it catches fire at 500 °C next to oxygen (oxidiser 1). Oxygen makes burning hydrogen hotter and faster.
- **Alcohol:** Alcohol falls through hydrogen.
- **Sawdust:** Sawdust falls through hydrogen.
- **Salt:** Salt falls through hydrogen.
- **Sugar:** Sugar falls through hydrogen.
- **Dirt:** Dirt falls through hydrogen.
- **Snow:** Snow falls through hydrogen.
- **Gunpowder:** Gunpowder falls through hydrogen.
- **Nitro:** Nitro falls through hydrogen.
- **Shards:** Shards falls through hydrogen.
- **Spark:** Hydrogen catches from the flame touching it.
- **Mercury:** Mercury falls through hydrogen.
- **Seed:** Seed falls through hydrogen.
- **Molten copper:** Molten copper falls through hydrogen. Molten copper (1,200 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Clay:** Clay falls through hydrogen.
- **Cement:** Cement falls through hydrogen.
- **Quicklime:** Quicklime falls through hydrogen.
- **Slaked lime:** Slaked lime falls through hydrogen.
- **Molten gold:** Molten gold falls through hydrogen. Molten gold (1,150 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Molten aluminium:** Molten aluminium falls through hydrogen. Molten aluminium (750 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Molten lead:** Molten lead falls through hydrogen.
- **Rust:** Rust falls through hydrogen.
- **Coal:** Coal falls through hydrogen.
- **Charcoal:** Charcoal falls through hydrogen.
- **Sulfur:** Sulfur falls through hydrogen.
- **Petrol:** Petrol falls through hydrogen.
- **Molten wax:** Molten wax falls through hydrogen.
- **Flour:** Flour falls through hydrogen.
- **Thermite:** Thermite falls through hydrogen.
- **Honey:** Honey falls through hydrogen.
- **Vinegar:** Vinegar falls through hydrogen.
- **Bleach:** Bleach falls through hydrogen.
- **Lye:** Lye falls through hydrogen.
- **Liquid nitrogen:** Liquid nitrogen falls through hydrogen.
- **Baking soda:** Baking soda falls through hydrogen.
- **Grass seed:** Grass seed falls through hydrogen.
- **Acorn:** Acorn falls through hydrogen.
- **Caramel:** Caramel falls through hydrogen.
- **Chalk:** Chalk falls through hydrogen.
- **Liquid oxygen:** Hydrogen burns: it catches fire at 500 °C next to liquid oxygen (oxidiser 1). Liquid oxygen falls through hydrogen.
- **Molten iron:** Molten iron falls through hydrogen. Molten iron (1,600 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Molten glass:** Molten glass falls through hydrogen. Molten glass (1,450 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Molten silver:** Molten silver falls through hydrogen. Molten silver (1,000 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Popcorn kernel:** Popcorn kernel falls through hydrogen.
- **Popcorn:** Popcorn falls through hydrogen.
- **Tar:** Tar falls through hydrogen.
- **Molten plastic:** Molten plastic falls through hydrogen.
- **Pumice:** Pumice falls through hydrogen.
- **Napalm:** Napalm falls through hydrogen.
- **Hydrogen peroxide:** Hydrogen burns: it catches fire at 500 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide falls through hydrogen. Hydrogen peroxide makes burning hydrogen hotter and faster.
- **Lightning:** Hydrogen catches from the flame touching it.
- **Plasma:** Hydrogen catches from the flame touching it.
- **Firework:** Firework falls through hydrogen.
- **Rocket:** Hydrogen catches from the flame touching it.
- **Ember:** Hydrogen catches from the flame touching it.
- **Saltpeter:** Hydrogen burns: it catches fire at 500 °C next to saltpeter (oxidiser 0.9). Saltpeter falls through hydrogen. Saltpeter makes burning hydrogen hotter and faster.
- **Molten tin:** Molten tin falls through hydrogen.
- **Kerosene:** Kerosene falls through hydrogen.
- **Acetone:** Acetone falls through hydrogen.
- **Hail:** Hail falls through hydrogen.
- **Ozone:** Hydrogen burns: it catches fire at 500 °C next to ozone (oxidiser 1). Ozone makes burning hydrogen hotter and faster.
- **Cotton:** Cotton falls through hydrogen.
- **Molten chocolate:** Molten chocolate falls through hydrogen.
- **Calcium carbide:** Calcium carbide falls through hydrogen.
- **Iodine:** Iodine falls through hydrogen.
- **Platinum:** Platinum makes hydrogen catch and burn into steam on its surface.
- **Bromine:** Bromine falls through hydrogen.
- **Liquid gallium:** Liquid gallium falls through hydrogen.
- **Cactus seed:** Cactus seed falls through hydrogen.
- **Smoke bomb:** Smoke bomb falls through hydrogen.
- **Peat:** Peat falls through hydrogen.
- **Soda:** Soda falls through hydrogen.

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Methane, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Oxygen

A gas slightly heavier than air. Sinks and pools low. Makes fire burn hotter and use its fuel faster.

- **State:** Gas, 1.43 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Condenses:** below -183 °C, into liquid oxygen
- **Feeds fire:** strength 1 (air is 0.21)

With other elements (105 interact):

- **Sand:** Sand falls through oxygen.
- **Water:** Water falls through oxygen.
- **Oil:** Oxygen makes burning oil hotter and faster. Oil burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Oil falls through oxygen.
- **Lava:** Lava falls through oxygen.
- **Gravel:** Gravel falls through oxygen.
- **Wood:** Oxygen makes burning wood hotter and faster. Wood burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Ash:** Ash falls through oxygen.
- **Acid:** Acid falls through oxygen.
- **Iron:** Iron slowly rusts into rust where oxygen touches it.
- **Hydrogen:** Oxygen makes burning hydrogen hotter and faster. Hydrogen burns: it catches fire at 500 °C next to oxygen (oxidiser 1).
- **Methane:** Oxygen makes burning methane hotter and faster. Methane burns: it catches fire at 540 °C next to oxygen (oxidiser 1).
- **Alcohol:** Oxygen makes burning alcohol hotter and faster. Alcohol burns: it catches fire at 365 °C next to oxygen (oxidiser 1). Alcohol falls through oxygen.
- **Sawdust:** Oxygen makes burning sawdust hotter and faster. Sawdust burns: it catches fire at 260 °C next to oxygen (oxidiser 1). Sawdust falls through oxygen.
- **Salt:** Salt falls through oxygen.
- **Sugar:** Oxygen makes burning sugar hotter and faster. Sugar burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Sugar falls through oxygen.
- **Dirt:** Dirt falls through oxygen.
- **Snow:** Snow falls through oxygen.
- **TNT:** Oxygen makes burning tnt hotter and faster. TNT explodes at 300 °C; it needs no air.
- **Gunpowder:** Oxygen makes burning gunpowder hotter and faster. Gunpowder explodes at 250 °C; it needs no air. Gunpowder falls through oxygen.
- **Nitro:** Oxygen makes burning nitro hotter and faster. Nitro explodes at 200 °C; it needs no air. Nitro falls through oxygen.
- **Shards:** Shards falls through oxygen.
- **Mercury:** Mercury falls through oxygen.
- **Seed:** Oxygen makes burning seed hotter and faster. Seed burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Seed falls through oxygen.
- **Plant:** Oxygen makes burning plant hotter and faster. Plant burns: it catches fire at 250 °C next to oxygen (oxidiser 1).
- **Molten copper:** Molten copper falls through oxygen.
- **Dry plant:** Oxygen makes burning dry plant hotter and faster. Dry plant burns: it catches fire at 200 °C next to oxygen (oxidiser 1).
- **Clay:** Clay falls through oxygen.
- **Cement:** Cement falls through oxygen.
- **Quicklime:** Quicklime falls through oxygen.
- **Slaked lime:** Slaked lime falls through oxygen.
- **Molten gold:** Molten gold falls through oxygen.
- **Molten aluminium:** Molten aluminium falls through oxygen.
- **Molten lead:** Molten lead falls through oxygen.
- **Rust:** Rust falls through oxygen.
- **Coal:** Oxygen makes burning coal hotter and faster. Coal burns: it catches fire at 450 °C next to oxygen (oxidiser 1). Coal falls through oxygen.
- **Charcoal:** Oxygen makes burning charcoal hotter and faster. Charcoal burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Charcoal falls through oxygen.
- **Sulfur:** Oxygen makes burning sulfur hotter and faster. Sulfur burns: it catches fire at 232 °C next to oxygen (oxidiser 1). Sulfur falls through oxygen.
- **Petrol:** Oxygen makes burning petrol hotter and faster. Petrol burns: it catches fire at 280 °C next to oxygen (oxidiser 1). Petrol falls through oxygen.
- **Wax:** Oxygen makes burning wax hotter and faster. Wax burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Molten wax:** Oxygen makes burning molten wax hotter and faster. Molten wax burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Molten wax falls through oxygen.
- **Paper:** Oxygen makes burning paper hotter and faster. Paper burns: it catches fire at 233 °C next to oxygen (oxidiser 1).
- **Rubber:** Oxygen makes burning rubber hotter and faster. Rubber burns: it catches fire at 400 °C next to oxygen (oxidiser 1).
- **Flour:** Oxygen makes burning flour hotter and faster. Flour burns: it catches fire at 380 °C next to oxygen (oxidiser 1). Flour falls through oxygen.
- **Thermite:** Oxygen makes burning thermite hotter and faster. Thermite burns: it catches fire at 900 °C next to oxygen (oxidiser 1). Thermite falls through oxygen.
- **Honey:** Honey falls through oxygen.
- **Vinegar:** Vinegar falls through oxygen.
- **Bleach:** Bleach falls through oxygen.
- **Lye:** Lye falls through oxygen.
- **Liquid nitrogen:** Liquid nitrogen falls through oxygen. Liquid nitrogen (-196 °C) is cold enough to condense oxygen into liquid oxygen.
- **Propane:** Oxygen makes burning propane hotter and faster. Propane burns: it catches fire at 470 °C next to oxygen (oxidiser 1).
- **Baking soda:** Baking soda falls through oxygen.
- **C4:** Oxygen makes burning c4 hotter and faster. C4 explodes at 900 °C; it needs no air.
- **Grass seed:** Oxygen makes burning grass seed hotter and faster. Grass seed burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Grass seed falls through oxygen.
- **Grass:** Oxygen makes burning grass hotter and faster. Grass burns: it catches fire at 220 °C next to oxygen (oxidiser 1).
- **Acorn:** Oxygen makes burning acorn hotter and faster. Acorn burns: it catches fire at 260 °C next to oxygen (oxidiser 1). Acorn falls through oxygen.
- **Tree:** Oxygen makes burning tree hotter and faster. Tree burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Leaves:** Oxygen makes burning leaves hotter and faster. Leaves burns: it catches fire at 230 °C next to oxygen (oxidiser 1).
- **Flower:** Oxygen makes burning flower hotter and faster. Flower burns: it catches fire at 220 °C next to oxygen (oxidiser 1).
- **Magnesium:** Oxygen makes burning magnesium hotter and faster. Magnesium burns: it catches fire at 650 °C next to oxygen (oxidiser 1).
- **Caramel:** Oxygen makes burning caramel hotter and faster. Caramel burns: it catches fire at 400 °C next to oxygen (oxidiser 1). Caramel falls through oxygen.
- **Chalk:** Chalk falls through oxygen.
- **Liquid oxygen:** Liquid oxygen falls through oxygen.
- **Molten iron:** Molten iron falls through oxygen.
- **Molten glass:** Molten glass falls through oxygen.
- **Molten silver:** Molten silver falls through oxygen.
- **Cooked meat:** Oxygen makes burning cooked meat hotter and faster. Cooked meat burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Popcorn kernel:** Popcorn kernel falls through oxygen.
- **Popcorn:** Oxygen makes burning popcorn hotter and faster. Popcorn burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Popcorn falls through oxygen.
- **Tar:** Oxygen makes burning tar hotter and faster. Tar burns: it catches fire at 320 °C next to oxygen (oxidiser 1). Tar falls through oxygen.
- **Plastic:** Oxygen makes burning plastic hotter and faster. Plastic burns: it catches fire at 350 °C next to oxygen (oxidiser 1).
- **Molten plastic:** Oxygen makes burning molten plastic hotter and faster. Molten plastic burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Molten plastic falls through oxygen.
- **Pumice:** Pumice falls through oxygen.
- **Diamond:** Oxygen makes burning diamond hotter and faster. Diamond burns: it catches fire at 900 °C next to oxygen (oxidiser 1).
- **Napalm:** Oxygen makes burning napalm hotter and faster. Napalm burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Napalm falls through oxygen.
- **Hydrogen peroxide:** Hydrogen peroxide falls through oxygen.
- **Fish:** Oxygen makes burning fish hotter and faster. Fish burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Ant:** Oxygen makes burning ant hotter and faster. Ant burns: it catches fire at 200 °C next to oxygen (oxidiser 1).
- **Bird:** Oxygen makes burning bird hotter and faster. Bird burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Firework:** Oxygen makes burning firework hotter and faster. Firework burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Firework falls through oxygen.
- **Saltpeter:** Saltpeter falls through oxygen.
- **Molten tin:** Molten tin falls through oxygen.
- **Steel:** Steel slowly rusts into rust where oxygen touches it.
- **Kerosene:** Oxygen makes burning kerosene hotter and faster. Kerosene burns: it catches fire at 220 °C next to oxygen (oxidiser 1). Kerosene falls through oxygen.
- **Acetone:** Oxygen makes burning acetone hotter and faster. Acetone burns: it catches fire at 465 °C next to oxygen (oxidiser 1). Acetone falls through oxygen.
- **Hail:** Hail falls through oxygen.
- **Bee:** Oxygen makes burning bee hotter and faster. Bee burns: it catches fire at 200 °C next to oxygen (oxidiser 1).
- **Spider:** Oxygen makes burning spider hotter and faster. Spider burns: it catches fire at 200 °C next to oxygen (oxidiser 1).
- **Termite:** Oxygen makes burning termite hotter and faster. Termite burns: it catches fire at 200 °C next to oxygen (oxidiser 1).
- **Frog:** Oxygen makes burning frog hotter and faster. Frog burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Mouse:** Oxygen makes burning mouse hotter and faster. Mouse burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Snake:** Oxygen makes burning snake hotter and faster. Snake burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Cotton:** Oxygen makes burning cotton hotter and faster. Cotton burns: it catches fire at 255 °C next to oxygen (oxidiser 1). Cotton falls through oxygen.
- **Molten chocolate:** Molten chocolate falls through oxygen.
- **Phosphorus:** Oxygen makes burning phosphorus hotter and faster. Phosphorus burns: it catches fire at 30 °C next to oxygen (oxidiser 1).
- **Calcium carbide:** Calcium carbide falls through oxygen.
- **Acetylene:** Oxygen makes burning acetylene hotter and faster. Acetylene burns: it catches fire at 305 °C next to oxygen (oxidiser 1).
- **Iodine:** Iodine falls through oxygen.
- **Bromine:** Bromine falls through oxygen.
- **Liquid gallium:** Liquid gallium falls through oxygen.
- **Cactus seed:** Oxygen makes burning cactus seed hotter and faster. Cactus seed burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Cactus seed falls through oxygen.
- **Cactus:** Oxygen makes burning cactus hotter and faster. Cactus burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Smoke bomb:** Oxygen makes burning smoke bomb hotter and faster. Smoke bomb burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Smoke bomb falls through oxygen.
- **Peat:** Oxygen makes burning peat hotter and faster. Peat burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Peat falls through oxygen.
- **Soda:** Soda falls through oxygen.
- **Fuse:** Oxygen makes burning fuse hotter and faster. Fuse burns: it catches fire at 150 °C next to oxygen (oxidiser 1).

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, Dry ice, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Obsidian, Worm, Lightning, Plasma, Rocket, Ember, Tin, Zinc, Uranium, Snail, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Methane

Natural gas, lighter than air. Rises. Burns hot into steam when it meets heat and air.

- **State:** Gas, 0.66 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 540 °C in air, 0.17 s per cell, leaves steam

With other elements (80 interact):

- **Air:** Methane burns: it catches fire at 540 °C next to air (oxidiser 0.21).
- **Sand:** Sand falls through methane.
- **Water:** Water falls through methane.
- **Oil:** Oil falls through methane.
- **Lava:** Lava falls through methane. Lava (1,200 °C) can set methane on fire (it ignites at 540 °C).
- **Gravel:** Gravel falls through methane.
- **Fire:** Methane catches from the flame touching it.
- **Ash:** Ash falls through methane.
- **Acid:** Acid falls through methane.
- **Oxygen:** Methane burns: it catches fire at 540 °C next to oxygen (oxidiser 1). Oxygen makes burning methane hotter and faster.
- **Alcohol:** Alcohol falls through methane.
- **Sawdust:** Sawdust falls through methane.
- **Salt:** Salt falls through methane.
- **Sugar:** Sugar falls through methane.
- **Dirt:** Dirt falls through methane.
- **Snow:** Snow falls through methane.
- **Gunpowder:** Gunpowder falls through methane.
- **Nitro:** Nitro falls through methane.
- **Shards:** Shards falls through methane.
- **Spark:** Methane catches from the flame touching it.
- **Mercury:** Mercury falls through methane.
- **Seed:** Seed falls through methane.
- **Molten copper:** Molten copper falls through methane. Molten copper (1,200 °C) can set methane on fire (it ignites at 540 °C).
- **Clay:** Clay falls through methane.
- **Cement:** Cement falls through methane.
- **Quicklime:** Quicklime falls through methane.
- **Slaked lime:** Slaked lime falls through methane.
- **Molten gold:** Molten gold falls through methane. Molten gold (1,150 °C) can set methane on fire (it ignites at 540 °C).
- **Molten aluminium:** Molten aluminium falls through methane. Molten aluminium (750 °C) can set methane on fire (it ignites at 540 °C).
- **Molten lead:** Molten lead falls through methane.
- **Rust:** Rust falls through methane.
- **Coal:** Coal falls through methane.
- **Charcoal:** Charcoal falls through methane.
- **Sulfur:** Sulfur falls through methane.
- **Petrol:** Petrol falls through methane.
- **Molten wax:** Molten wax falls through methane.
- **Flour:** Flour falls through methane.
- **Thermite:** Thermite falls through methane.
- **Honey:** Honey falls through methane.
- **Vinegar:** Vinegar falls through methane.
- **Bleach:** Bleach falls through methane.
- **Lye:** Lye falls through methane.
- **Liquid nitrogen:** Liquid nitrogen falls through methane.
- **Baking soda:** Baking soda falls through methane.
- **Grass seed:** Grass seed falls through methane.
- **Acorn:** Acorn falls through methane.
- **Caramel:** Caramel falls through methane.
- **Chalk:** Chalk falls through methane.
- **Liquid oxygen:** Methane burns: it catches fire at 540 °C next to liquid oxygen (oxidiser 1). Liquid oxygen falls through methane.
- **Molten iron:** Molten iron falls through methane. Molten iron (1,600 °C) can set methane on fire (it ignites at 540 °C).
- **Molten glass:** Molten glass falls through methane. Molten glass (1,450 °C) can set methane on fire (it ignites at 540 °C).
- **Molten silver:** Molten silver falls through methane. Molten silver (1,000 °C) can set methane on fire (it ignites at 540 °C).
- **Popcorn kernel:** Popcorn kernel falls through methane.
- **Popcorn:** Popcorn falls through methane.
- **Tar:** Tar falls through methane.
- **Molten plastic:** Molten plastic falls through methane.
- **Pumice:** Pumice falls through methane.
- **Napalm:** Napalm falls through methane.
- **Hydrogen peroxide:** Methane burns: it catches fire at 540 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide falls through methane. Hydrogen peroxide makes burning methane hotter and faster.
- **Lightning:** Methane catches from the flame touching it.
- **Plasma:** Methane catches from the flame touching it.
- **Firework:** Firework falls through methane.
- **Rocket:** Methane catches from the flame touching it.
- **Ember:** Methane catches from the flame touching it.
- **Saltpeter:** Methane burns: it catches fire at 540 °C next to saltpeter (oxidiser 0.9). Saltpeter falls through methane. Saltpeter makes burning methane hotter and faster.
- **Molten tin:** Molten tin falls through methane.
- **Kerosene:** Kerosene falls through methane.
- **Acetone:** Acetone falls through methane.
- **Hail:** Hail falls through methane.
- **Ozone:** Methane burns: it catches fire at 540 °C next to ozone (oxidiser 1). Ozone makes burning methane hotter and faster.
- **Cotton:** Cotton falls through methane.
- **Molten chocolate:** Molten chocolate falls through methane.
- **Calcium carbide:** Calcium carbide falls through methane.
- **Iodine:** Iodine falls through methane.
- **Bromine:** Bromine falls through methane.
- **Liquid gallium:** Liquid gallium falls through methane.
- **Cactus seed:** Cactus seed falls through methane.
- **Smoke bomb:** Smoke bomb falls through methane.
- **Peat:** Peat falls through methane.
- **Soda:** Soda falls through methane.

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Hydrogen, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Alcohol

A thin, light liquid. Floats on water. Catches fire easily and burns clean into steam.

- **State:** Liquid, 789 kg/m³
- **In liquids:** Sinks through liquids lighter than 789 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 365 °C in air, 2 s per cell, leaves steam
- **Flash point:** 13 °C: above it, flames spread across it

With other elements (87 interact):

- **Air:** Alcohol burns: it catches fire at 365 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through alcohol (1,600 vs 789 kg/m³).
- **Water:** Water sinks through alcohol (1,000 vs 789 kg/m³).
- **Oil:** Oil sinks through alcohol (900 vs 789 kg/m³).
- **Steam:** Alcohol falls through steam.
- **Lava:** Lava sinks through alcohol (2,600 vs 789 kg/m³). Lava (1,200 °C) can set alcohol on fire (it ignites at 365 °C).
- **Gravel:** Gravel sinks through alcohol (2,000 vs 789 kg/m³).
- **Fire:** Alcohol catches from the flame touching it. Alcohol falls through fire.
- **Smoke:** Alcohol falls through smoke.
- **Acid:** Acid sinks through alcohol (1,100 vs 789 kg/m³).
- **Hydrogen:** Alcohol falls through hydrogen.
- **Oxygen:** Alcohol burns: it catches fire at 365 °C next to oxygen (oxidiser 1). Alcohol falls through oxygen. Oxygen makes burning alcohol hotter and faster.
- **Methane:** Alcohol falls through methane.
- **Salt:** Salt sinks through alcohol (2,160 vs 789 kg/m³).
- **Sugar:** Sugar sinks through alcohol (1,590 vs 789 kg/m³).
- **Dirt:** Dirt sinks through alcohol (1,500 vs 789 kg/m³).
- **Gunpowder:** Gunpowder sinks through alcohol (1,700 vs 789 kg/m³).
- **Nitro:** Nitro sinks through alcohol (1,600 vs 789 kg/m³).
- **Shards:** Shards sinks through alcohol (2,500 vs 789 kg/m³).
- **Spark:** Alcohol catches from the flame touching it. Alcohol falls through spark.
- **Mercury:** Mercury sinks through alcohol (13,534 vs 789 kg/m³).
- **Seed:** Seed sinks through alcohol (1,100 vs 789 kg/m³).
- **Molten copper:** Molten copper sinks through alcohol (8,020 vs 789 kg/m³). Molten copper (1,200 °C) can set alcohol on fire (it ignites at 365 °C).
- **Clay:** Clay sinks through alcohol (1,700 vs 789 kg/m³).
- **Cement:** Cement sinks through alcohol (1,440 vs 789 kg/m³).
- **Quicklime:** Quicklime sinks through alcohol (1,200 vs 789 kg/m³).
- **Slaked lime:** Slaked lime sinks through alcohol (1,100 vs 789 kg/m³).
- **Molten gold:** Molten gold sinks through alcohol (17,300 vs 789 kg/m³). Molten gold (1,150 °C) can set alcohol on fire (it ignites at 365 °C).
- **Molten aluminium:** Molten aluminium sinks through alcohol (2,375 vs 789 kg/m³). Molten aluminium (750 °C) can set alcohol on fire (it ignites at 365 °C).
- **Molten lead:** Molten lead sinks through alcohol (10,660 vs 789 kg/m³). Molten lead (400 °C) can set alcohol on fire (it ignites at 365 °C).
- **Rust:** Rust sinks through alcohol (2,000 vs 789 kg/m³).
- **Coal:** Coal sinks through alcohol (1,350 vs 789 kg/m³).
- **Sulfur:** Sulfur sinks through alcohol (2,000 vs 789 kg/m³).
- **Petrol:** Alcohol sinks through petrol (789 vs 740 kg/m³).
- **Molten wax:** Molten wax sinks through alcohol (800 vs 789 kg/m³).
- **Thermite:** Thermite sinks through alcohol (1,500 vs 789 kg/m³).
- **Honey:** Honey sinks through alcohol (1,420 vs 789 kg/m³).
- **Vinegar:** Vinegar sinks through alcohol (1,010 vs 789 kg/m³).
- **Bleach:** Bleach sinks through alcohol (1,100 vs 789 kg/m³).
- **Lye:** Lye sinks through alcohol (1,100 vs 789 kg/m³).
- **Liquid nitrogen:** Liquid nitrogen sinks through alcohol (808 vs 789 kg/m³).
- **Nitrogen:** Alcohol falls through nitrogen.
- **Carbon dioxide:** Alcohol falls through carbon dioxide.
- **Helium:** Alcohol falls through helium.
- **Propane:** Alcohol falls through propane.
- **Chlorine:** Alcohol falls through chlorine.
- **Sulfur dioxide:** Alcohol falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through alcohol (1,100 vs 789 kg/m³).
- **Grass seed:** Grass seed sinks through alcohol (1,100 vs 789 kg/m³).
- **Acorn:** Acorn sinks through alcohol (1,100 vs 789 kg/m³).
- **Cloud:** Alcohol falls through cloud.
- **Caramel:** Caramel sinks through alcohol (1,300 vs 789 kg/m³).
- **Chalk:** Chalk sinks through alcohol (1,500 vs 789 kg/m³).
- **Liquid oxygen:** Alcohol burns: it catches fire at 365 °C next to liquid oxygen (oxidiser 1). Liquid oxygen sinks through alcohol (1,141 vs 789 kg/m³).
- **Molten iron:** Molten iron sinks through alcohol (6,980 vs 789 kg/m³). Molten iron (1,600 °C) can set alcohol on fire (it ignites at 365 °C).
- **Molten glass:** Molten glass sinks through alcohol (2,400 vs 789 kg/m³). Molten glass (1,450 °C) can set alcohol on fire (it ignites at 365 °C).
- **Molten silver:** Molten silver sinks through alcohol (9,320 vs 789 kg/m³). Molten silver (1,000 °C) can set alcohol on fire (it ignites at 365 °C).
- **Popcorn kernel:** Popcorn kernel sinks through alcohol (1,200 vs 789 kg/m³).
- **Tar:** Tar sinks through alcohol (1,150 vs 789 kg/m³).
- **Molten plastic:** Molten plastic sinks through alcohol (900 vs 789 kg/m³).
- **Napalm:** Napalm sinks through alcohol (900 vs 789 kg/m³).
- **Hydrogen peroxide:** Alcohol burns: it catches fire at 365 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through alcohol (1,450 vs 789 kg/m³). Hydrogen peroxide makes burning alcohol hotter and faster.
- **Lightning:** Alcohol catches from the flame touching it. Alcohol falls through lightning.
- **Plasma:** Alcohol catches from the flame touching it. Alcohol falls through plasma.
- **Firework:** Firework sinks through alcohol (1,400 vs 789 kg/m³).
- **Rocket:** Alcohol catches from the flame touching it. Alcohol falls through rocket.
- **Ember:** Alcohol catches from the flame touching it. Alcohol falls through ember.
- **Saltpeter:** Alcohol burns: it catches fire at 365 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through alcohol (2,100 vs 789 kg/m³). Saltpeter makes burning alcohol hotter and faster.
- **Molten tin:** Molten tin sinks through alcohol (6,990 vs 789 kg/m³).
- **Kerosene:** Kerosene sinks through alcohol (800 vs 789 kg/m³).
- **Acetone:** Alcohol sinks through acetone (789 vs 784 kg/m³).
- **Hail:** Hail sinks through alcohol (900 vs 789 kg/m³).
- **Ammonia:** Alcohol falls through ammonia.
- **Ozone:** Alcohol burns: it catches fire at 365 °C next to ozone (oxidiser 1). Alcohol falls through ozone. Ozone makes burning alcohol hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through alcohol (1,250 vs 789 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through alcohol (2,220 vs 789 kg/m³).
- **Acetylene:** Alcohol falls through acetylene.
- **Iodine:** Iodine sinks through alcohol (4,930 vs 789 kg/m³).
- **Iodine vapour:** Alcohol falls through iodine vapour.
- **Argon:** Alcohol falls through argon.
- **Bromine:** Bromine sinks through alcohol (3,100 vs 789 kg/m³).
- **Bromine vapour:** Alcohol falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through alcohol (6,095 vs 789 kg/m³).
- **Cactus seed:** Cactus seed sinks through alcohol (1,100 vs 789 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through alcohol (1,200 vs 789 kg/m³).
- **Peat:** Peat sinks through alcohol (900 vs 789 kg/m³).
- **Soda:** Soda sinks through alcohol (1,010 vs 789 kg/m³).

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sawdust

Fine wood dust, a very light powder. Drifts and floats on water. Catches fire easily and burns fast.

- **State:** Powder, 250 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 55 cells/s
- **Burns:** from 260 °C in air, 2.5 s per cell, leaves ash
- **Soaks up:** water, up to 60% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (39 interact):

- **Air:** Sawdust burns: it catches fire at 260 °C next to air (oxidiser 0.21).
- **Water:** Sawdust soaks up water: it is porous and holds up to 60% water.
- **Steam:** Sawdust falls through steam.
- **Lava:** Lava (1,200 °C) can set sawdust on fire (it ignites at 260 °C).
- **Fire:** Sawdust catches from the flame touching it. Sawdust falls through fire.
- **Smoke:** Sawdust falls through smoke.
- **Acid:** Acid eats sawdust: acidity 0.8 beats hardness 0.1.
- **Hydrogen:** Sawdust falls through hydrogen.
- **Oxygen:** Sawdust burns: it catches fire at 260 °C next to oxygen (oxidiser 1). Sawdust falls through oxygen. Oxygen makes burning sawdust hotter and faster.
- **Methane:** Sawdust falls through methane.
- **Spark:** Sawdust catches from the flame touching it. Sawdust falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set sawdust on fire (it ignites at 260 °C).
- **Molten gold:** Molten gold (1,150 °C) can set sawdust on fire (it ignites at 260 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set sawdust on fire (it ignites at 260 °C).
- **Molten lead:** Molten lead (400 °C) can set sawdust on fire (it ignites at 260 °C).
- **Nitrogen:** Sawdust falls through nitrogen.
- **Carbon dioxide:** Sawdust falls through carbon dioxide.
- **Helium:** Sawdust falls through helium.
- **Propane:** Sawdust falls through propane.
- **Chlorine:** Sawdust falls through chlorine.
- **Sulfur dioxide:** Sawdust falls through sulfur dioxide.
- **Cloud:** Sawdust falls through cloud.
- **Liquid oxygen:** Sawdust burns: it catches fire at 260 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set sawdust on fire (it ignites at 260 °C).
- **Molten glass:** Molten glass (1,450 °C) can set sawdust on fire (it ignites at 260 °C).
- **Molten silver:** Molten silver (1,000 °C) can set sawdust on fire (it ignites at 260 °C).
- **Hydrogen peroxide:** Sawdust burns: it catches fire at 260 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning sawdust hotter and faster.
- **Lightning:** Sawdust catches from the flame touching it. Sawdust falls through lightning.
- **Plasma:** Sawdust catches from the flame touching it. Sawdust falls through plasma.
- **Rocket:** Sawdust catches from the flame touching it. Sawdust falls through rocket.
- **Ember:** Sawdust catches from the flame touching it. Sawdust falls through ember.
- **Saltpeter:** Sawdust burns: it catches fire at 260 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning sawdust hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set sawdust on fire (it ignites at 260 °C).
- **Ammonia:** Sawdust falls through ammonia.
- **Ozone:** Sawdust burns: it catches fire at 260 °C next to ozone (oxidiser 1). Sawdust falls through ozone. Ozone makes burning sawdust hotter and faster.
- **Acetylene:** Sawdust falls through acetylene.
- **Iodine vapour:** Sawdust falls through iodine vapour.
- **Argon:** Sawdust falls through argon.
- **Bromine vapour:** Sawdust falls through bromine vapour.

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Salt

White crystals, a powder. Falls and piles. Dissolves into water, making it heavier; boiling the water leaves the salt behind.

- **State:** Powder, 2,160 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,160 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Poisons:** living things it touches: they wither
- **Dissolves in:** water, up to 40% of a cell; boiling leaves it as crystals

With other elements (55 interact):

- **Water:** Salt dissolves into water: water is a solvent and each cell holds up to 40% salt. Salt sinks through water (2,160 vs 1,000 kg/m³).
- **Oil:** Salt sinks through oil (2,160 vs 900 kg/m³).
- **Ice:** Salt melts ice: dissolved, it lowers the freezing point.
- **Steam:** Salt falls through steam.
- **Fire:** Salt falls through fire.
- **Smoke:** Salt falls through smoke.
- **Acid:** Salt sinks through acid (2,160 vs 1,100 kg/m³).
- **Hydrogen:** Salt falls through hydrogen.
- **Oxygen:** Salt falls through oxygen.
- **Methane:** Salt falls through methane.
- **Alcohol:** Salt sinks through alcohol (2,160 vs 789 kg/m³).
- **Snow:** Salt melts snow: dissolved, it lowers the freezing point.
- **Nitro:** Salt sinks through nitro (2,160 vs 1,600 kg/m³).
- **Spark:** Salt falls through spark.
- **Plant:** Salt is toxic: plant touching it withers.
- **Petrol:** Salt sinks through petrol (2,160 vs 740 kg/m³).
- **Molten wax:** Salt sinks through molten wax (2,160 vs 800 kg/m³).
- **Honey:** Salt sinks through honey (2,160 vs 1,420 kg/m³).
- **Vinegar:** Salt sinks through vinegar (2,160 vs 1,010 kg/m³).
- **Bleach:** Salt sinks through bleach (2,160 vs 1,100 kg/m³).
- **Lye:** Salt sinks through lye (2,160 vs 1,100 kg/m³).
- **Liquid nitrogen:** Salt sinks through liquid nitrogen (2,160 vs 808 kg/m³).
- **Nitrogen:** Salt falls through nitrogen.
- **Carbon dioxide:** Salt falls through carbon dioxide.
- **Helium:** Salt falls through helium.
- **Propane:** Salt falls through propane.
- **Chlorine:** Salt falls through chlorine.
- **Sulfur dioxide:** Salt falls through sulfur dioxide.
- **Grass:** Salt is toxic: grass touching it withers.
- **Tree:** Salt is toxic: tree touching it withers.
- **Leaves:** Salt is toxic: leaves touching it withers.
- **Flower:** Salt is toxic: flower touching it withers.
- **Cloud:** Salt falls through cloud.
- **Caramel:** Salt sinks through caramel (2,160 vs 1,300 kg/m³).
- **Liquid oxygen:** Salt sinks through liquid oxygen (2,160 vs 1,141 kg/m³).
- **Tar:** Salt sinks through tar (2,160 vs 1,150 kg/m³).
- **Molten plastic:** Salt sinks through molten plastic (2,160 vs 900 kg/m³).
- **Napalm:** Salt sinks through napalm (2,160 vs 900 kg/m³).
- **Hydrogen peroxide:** Salt sinks through hydrogen peroxide (2,160 vs 1,450 kg/m³).
- **Lightning:** Salt falls through lightning.
- **Plasma:** Salt falls through plasma.
- **Rocket:** Salt falls through rocket.
- **Ember:** Salt falls through ember.
- **Kerosene:** Salt sinks through kerosene (2,160 vs 800 kg/m³).
- **Acetone:** Salt sinks through acetone (2,160 vs 784 kg/m³).
- **Hail:** Salt melts hail: dissolved, it lowers the freezing point.
- **Ammonia:** Salt falls through ammonia.
- **Ozone:** Salt falls through ozone.
- **Molten chocolate:** Salt sinks through molten chocolate (2,160 vs 1,250 kg/m³).
- **Acetylene:** Salt falls through acetylene.
- **Iodine vapour:** Salt falls through iodine vapour.
- **Argon:** Salt falls through argon.
- **Bromine vapour:** Salt falls through bromine vapour.
- **Cactus:** Salt is toxic: cactus touching it withers.
- **Soda:** Salt sinks through soda (2,160 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Sugar, Dirt, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sugar

Sweet crystals, a powder. Falls and piles. Dissolves into water even more than salt does, and burns when hot.

- **State:** Powder, 1,590 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,590 kg/m³, rests on heavier ones
- **Falls:** up to 155 cells/s
- **Burns:** from 350 °C in air, 1.5 s per cell, leaves smoke
- **Bakes:** at 186 °C into caramel; there is no way back
- **Dissolves in:** water, up to 70% of a cell; boiling leaves it as crystals
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (58 interact):

- **Air:** Sugar burns: it catches fire at 350 °C next to air (oxidiser 0.21).
- **Water:** Sugar dissolves into water: water is a solvent and each cell holds up to 70% sugar. Sugar sinks through water (1,590 vs 1,000 kg/m³).
- **Oil:** Sugar sinks through oil (1,590 vs 900 kg/m³).
- **Ice:** Sugar melts ice: dissolved, it lowers the freezing point.
- **Steam:** Sugar falls through steam.
- **Lava:** Lava (1,200 °C) can set sugar on fire (it ignites at 350 °C).
- **Fire:** Sugar catches from the flame touching it. Sugar falls through fire.
- **Smoke:** Sugar falls through smoke.
- **Acid:** Acid eats sugar: acidity 0.8 beats hardness 0.2. Sugar sinks through acid (1,590 vs 1,100 kg/m³).
- **Hydrogen:** Sugar falls through hydrogen.
- **Oxygen:** Sugar burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Sugar falls through oxygen. Oxygen makes burning sugar hotter and faster.
- **Methane:** Sugar falls through methane.
- **Alcohol:** Sugar sinks through alcohol (1,590 vs 789 kg/m³).
- **Snow:** Sugar melts snow: dissolved, it lowers the freezing point.
- **Spark:** Sugar catches from the flame touching it. Sugar falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set sugar on fire (it ignites at 350 °C).
- **Molten gold:** Molten gold (1,150 °C) can set sugar on fire (it ignites at 350 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set sugar on fire (it ignites at 350 °C).
- **Molten lead:** Molten lead (400 °C) can set sugar on fire (it ignites at 350 °C).
- **Petrol:** Sugar sinks through petrol (1,590 vs 740 kg/m³).
- **Molten wax:** Sugar sinks through molten wax (1,590 vs 800 kg/m³).
- **Honey:** Sugar sinks through honey (1,590 vs 1,420 kg/m³).
- **Vinegar:** Sugar sinks through vinegar (1,590 vs 1,010 kg/m³).
- **Bleach:** Sugar sinks through bleach (1,590 vs 1,100 kg/m³).
- **Lye:** Sugar sinks through lye (1,590 vs 1,100 kg/m³).
- **Liquid nitrogen:** Sugar sinks through liquid nitrogen (1,590 vs 808 kg/m³).
- **Nitrogen:** Sugar falls through nitrogen.
- **Carbon dioxide:** Sugar falls through carbon dioxide.
- **Helium:** Sugar falls through helium.
- **Propane:** Sugar falls through propane.
- **Chlorine:** Sugar falls through chlorine.
- **Sulfur dioxide:** Sugar falls through sulfur dioxide.
- **Cloud:** Sugar falls through cloud.
- **Caramel:** Sugar sinks through caramel (1,590 vs 1,300 kg/m³).
- **Liquid oxygen:** Sugar burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1). Sugar sinks through liquid oxygen (1,590 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set sugar on fire (it ignites at 350 °C).
- **Molten glass:** Molten glass (1,450 °C) can set sugar on fire (it ignites at 350 °C).
- **Molten silver:** Molten silver (1,000 °C) can set sugar on fire (it ignites at 350 °C).
- **Tar:** Sugar sinks through tar (1,590 vs 1,150 kg/m³).
- **Molten plastic:** Sugar sinks through molten plastic (1,590 vs 900 kg/m³).
- **Napalm:** Sugar sinks through napalm (1,590 vs 900 kg/m³).
- **Hydrogen peroxide:** Sugar burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8). Sugar sinks through hydrogen peroxide (1,590 vs 1,450 kg/m³). Hydrogen peroxide makes burning sugar hotter and faster.
- **Lightning:** Sugar catches from the flame touching it. Sugar falls through lightning.
- **Plasma:** Sugar catches from the flame touching it. Sugar falls through plasma.
- **Rocket:** Sugar catches from the flame touching it. Sugar falls through rocket.
- **Ember:** Sugar catches from the flame touching it. Sugar falls through ember.
- **Saltpeter:** Sugar burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning sugar hotter and faster.
- **Kerosene:** Sugar sinks through kerosene (1,590 vs 800 kg/m³).
- **Acetone:** Sugar sinks through acetone (1,590 vs 784 kg/m³).
- **Hail:** Sugar melts hail: dissolved, it lowers the freezing point.
- **Ammonia:** Sugar falls through ammonia.
- **Ozone:** Sugar burns: it catches fire at 350 °C next to ozone (oxidiser 1). Sugar falls through ozone. Ozone makes burning sugar hotter and faster.
- **Molten chocolate:** Sugar sinks through molten chocolate (1,590 vs 1,250 kg/m³).
- **Acetylene:** Sugar falls through acetylene.
- **Iodine vapour:** Sugar falls through iodine vapour.
- **Argon:** Sugar falls through argon.
- **Bromine vapour:** Sugar falls through bromine vapour.
- **Soda:** Sugar sinks through soda (1,590 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Dirt, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dirt

Earth, a heavy powder. Falls and piles. Soaks up a lot of water and turns into dark, sticky mud.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Soaks up:** water, up to 50% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (45 interact):

- **Water:** Dirt soaks up water: it is porous and holds up to 50% water. Dirt sinks through water (1,500 vs 1,000 kg/m³).
- **Oil:** Dirt sinks through oil (1,500 vs 900 kg/m³).
- **Steam:** Dirt falls through steam.
- **Fire:** Dirt falls through fire.
- **Smoke:** Dirt falls through smoke.
- **Acid:** Acid eats dirt: acidity 0.8 beats hardness 0.3. Dirt sinks through acid (1,500 vs 1,100 kg/m³).
- **Hydrogen:** Dirt falls through hydrogen.
- **Oxygen:** Dirt falls through oxygen.
- **Methane:** Dirt falls through methane.
- **Alcohol:** Dirt sinks through alcohol (1,500 vs 789 kg/m³).
- **Spark:** Dirt falls through spark.
- **Petrol:** Dirt sinks through petrol (1,500 vs 740 kg/m³).
- **Molten wax:** Dirt sinks through molten wax (1,500 vs 800 kg/m³).
- **Honey:** Dirt sinks through honey (1,500 vs 1,420 kg/m³).
- **Vinegar:** Dirt sinks through vinegar (1,500 vs 1,010 kg/m³).
- **Bleach:** Dirt sinks through bleach (1,500 vs 1,100 kg/m³).
- **Lye:** Dirt sinks through lye (1,500 vs 1,100 kg/m³).
- **Liquid nitrogen:** Dirt sinks through liquid nitrogen (1,500 vs 808 kg/m³).
- **Nitrogen:** Dirt falls through nitrogen.
- **Carbon dioxide:** Dirt falls through carbon dioxide.
- **Helium:** Dirt falls through helium.
- **Propane:** Dirt falls through propane.
- **Chlorine:** Dirt falls through chlorine.
- **Sulfur dioxide:** Dirt falls through sulfur dioxide.
- **Cloud:** Dirt falls through cloud.
- **Caramel:** Dirt sinks through caramel (1,500 vs 1,300 kg/m³).
- **Liquid oxygen:** Dirt sinks through liquid oxygen (1,500 vs 1,141 kg/m³).
- **Tar:** Dirt sinks through tar (1,500 vs 1,150 kg/m³).
- **Molten plastic:** Dirt sinks through molten plastic (1,500 vs 900 kg/m³).
- **Napalm:** Dirt sinks through napalm (1,500 vs 900 kg/m³).
- **Hydrogen peroxide:** Dirt sinks through hydrogen peroxide (1,500 vs 1,450 kg/m³).
- **Lightning:** Dirt falls through lightning.
- **Plasma:** Dirt falls through plasma.
- **Rocket:** Dirt falls through rocket.
- **Ember:** Dirt falls through ember.
- **Kerosene:** Dirt sinks through kerosene (1,500 vs 800 kg/m³).
- **Acetone:** Dirt sinks through acetone (1,500 vs 784 kg/m³).
- **Ammonia:** Dirt falls through ammonia.
- **Ozone:** Dirt falls through ozone.
- **Molten chocolate:** Dirt sinks through molten chocolate (1,500 vs 1,250 kg/m³).
- **Acetylene:** Dirt falls through acetylene.
- **Iodine vapour:** Dirt falls through iodine vapour.
- **Argon:** Dirt falls through argon.
- **Bromine vapour:** Dirt falls through bromine vapour.
- **Soda:** Dirt sinks through soda (1,500 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Snow

Loose frozen flakes, a very light powder. Drifts down and settles in soft piles. Melts into water as it warms.

- **State:** Powder, 300 kg/m³
- **Starts at:** -5 °C
- **In liquids:** Rests on heavier ones
- **Falls:** up to 35 cells/s
- **Melts:** at 0 °C, into water

With other elements (43 interact):

- **Water:** Snow (-5 °C) is cold enough to freeze water into ice.
- **Steam:** Snow falls through steam. Snow (-5 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to melt snow into water.
- **Lava:** Snow (-5 °C) is cold enough to freeze lava into stone. Lava (1,200 °C) is hot enough to melt snow into water.
- **Fire:** Snow falls through fire. Fire (850 °C) is hot enough to melt snow into water.
- **Smoke:** Snow falls through smoke. Smoke (150 °C) is hot enough to melt snow into water.
- **Hydrogen:** Snow falls through hydrogen.
- **Oxygen:** Snow falls through oxygen.
- **Methane:** Snow falls through methane.
- **Salt:** Salt melts snow: dissolved, it lowers the freezing point.
- **Sugar:** Sugar melts snow: dissolved, it lowers the freezing point.
- **Spark:** Snow falls through spark. Spark (300 °C) is hot enough to melt snow into water.
- **Molten copper:** Snow (-5 °C) is cold enough to freeze molten copper into wire. Molten copper (1,200 °C) is hot enough to melt snow into water.
- **Molten gold:** Snow (-5 °C) is cold enough to freeze molten gold into gold. Molten gold (1,150 °C) is hot enough to melt snow into water.
- **Molten aluminium:** Snow (-5 °C) is cold enough to freeze molten aluminium into aluminium. Molten aluminium (750 °C) is hot enough to melt snow into water.
- **Molten lead:** Snow (-5 °C) is cold enough to freeze molten lead into lead. Molten lead (400 °C) is hot enough to melt snow into water.
- **Molten wax:** Snow (-5 °C) is cold enough to freeze molten wax into wax. Molten wax (80 °C) is hot enough to melt snow into water.
- **Nitrogen:** Snow falls through nitrogen.
- **Carbon dioxide:** Snow falls through carbon dioxide.
- **Helium:** Snow falls through helium.
- **Propane:** Snow falls through propane.
- **Chlorine:** Snow falls through chlorine.
- **Sulfur dioxide:** Snow falls through sulfur dioxide.
- **Baking soda:** Baking soda melts snow: dissolved, it lowers the freezing point.
- **Cloud:** Snow falls through cloud.
- **Caramel:** Caramel (190 °C) is hot enough to melt snow into water.
- **Molten iron:** Snow (-5 °C) is cold enough to freeze molten iron into iron. Molten iron (1,600 °C) is hot enough to melt snow into water.
- **Molten glass:** Snow (-5 °C) is cold enough to freeze molten glass into glass. Molten glass (1,450 °C) is hot enough to melt snow into water.
- **Molten silver:** Snow (-5 °C) is cold enough to freeze molten silver into silver. Molten silver (1,000 °C) is hot enough to melt snow into water.
- **Molten plastic:** Snow (-5 °C) is cold enough to freeze molten plastic into plastic. Molten plastic (200 °C) is hot enough to melt snow into water.
- **Lightning:** Snow falls through lightning. Lightning (3,000 °C) is hot enough to melt snow into water.
- **Plasma:** Snow falls through plasma. Plasma (3,000 °C) is hot enough to melt snow into water.
- **Rocket:** Snow falls through rocket. Rocket (900 °C) is hot enough to melt snow into water.
- **Ember:** Snow falls through ember. Ember (700 °C) is hot enough to melt snow into water.
- **Saltpeter:** Saltpeter melts snow: dissolved, it lowers the freezing point.
- **Molten tin:** Snow (-5 °C) is cold enough to freeze molten tin into tin. Molten tin (260 °C) is hot enough to melt snow into water.
- **Ammonia:** Snow falls through ammonia.
- **Ozone:** Snow falls through ozone.
- **Molten chocolate:** Snow (-5 °C) is cold enough to freeze molten chocolate into chocolate. Molten chocolate (45 °C) is hot enough to melt snow into water.
- **Acetylene:** Snow falls through acetylene.
- **Iodine vapour:** Snow falls through iodine vapour. Snow (-5 °C) is cold enough to condense iodine vapour into iodine. Iodine vapour (130 °C) is hot enough to melt snow into water.
- **Argon:** Snow falls through argon.
- **Bromine vapour:** Snow falls through bromine vapour. Snow (-5 °C) is cold enough to condense bromine vapour into bromine. Bromine vapour (70 °C) is hot enough to melt snow into water.
- **Liquid gallium:** Snow (-5 °C) is cold enough to freeze liquid gallium into gallium. Liquid gallium (35 °C) is hot enough to melt snow into water.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Alcohol, Sawdust, Dirt, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### TNT

A packed explosive block. Stays put. Heat or a flame sets it off: the whole block blasts outwards, throwing what is nearby.

- **State:** Solid, 1,650 kg/m³
- **Explodes:** from 300 °C or a flame; blast radius 7 cells
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** TNT explodes at 300 °C; it needs no air.
- **Lava:** Lava (1,200 °C) can set tnt on fire (it ignites at 300 °C).
- **Fire:** TNT explodes when a flame touches it.
- **Acid:** Acid eats tnt: acidity 0.8 beats hardness 0.3.
- **Oxygen:** TNT explodes at 300 °C; it needs no air. Oxygen makes burning tnt hotter and faster.
- **Spark:** TNT explodes when a flame touches it.
- **Molten copper:** Molten copper (1,200 °C) can set tnt on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set tnt on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set tnt on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set tnt on fire (it ignites at 300 °C).
- **Liquid oxygen:** TNT explodes at 300 °C; it needs no air.
- **Molten iron:** Molten iron (1,600 °C) can set tnt on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set tnt on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set tnt on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** TNT explodes at 300 °C; it needs no air. Hydrogen peroxide makes burning tnt hotter and faster.
- **Lightning:** TNT explodes when a flame touches it.
- **Plasma:** TNT explodes when a flame touches it.
- **Rocket:** TNT explodes when a flame touches it.
- **Ember:** TNT explodes when a flame touches it.
- **Saltpeter:** TNT explodes at 300 °C; it needs no air. Saltpeter makes burning tnt hotter and faster.
- **Ozone:** TNT explodes at 300 °C; it needs no air. Ozone makes burning tnt hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gunpowder

A dark explosive powder. Falls and piles. Lit, it goes off grain by grain in quick small bangs.

- **State:** Powder, 1,700 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,700 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Explodes:** from 250 °C or a flame; blast radius 2 cells
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (57 interact):

- **Air:** Gunpowder explodes at 250 °C; it needs no air.
- **Water:** Gunpowder sinks through water (1,700 vs 1,000 kg/m³).
- **Oil:** Gunpowder sinks through oil (1,700 vs 900 kg/m³).
- **Steam:** Gunpowder falls through steam.
- **Lava:** Lava (1,200 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Fire:** Gunpowder explodes when a flame touches it. Gunpowder falls through fire.
- **Smoke:** Gunpowder falls through smoke.
- **Acid:** Acid eats gunpowder: acidity 0.8 beats hardness 0.2. Gunpowder sinks through acid (1,700 vs 1,100 kg/m³).
- **Hydrogen:** Gunpowder falls through hydrogen.
- **Oxygen:** Gunpowder explodes at 250 °C; it needs no air. Gunpowder falls through oxygen. Oxygen makes burning gunpowder hotter and faster.
- **Methane:** Gunpowder falls through methane.
- **Alcohol:** Gunpowder sinks through alcohol (1,700 vs 789 kg/m³).
- **Nitro:** Gunpowder sinks through nitro (1,700 vs 1,600 kg/m³).
- **Spark:** Gunpowder explodes when a flame touches it. Gunpowder falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Molten gold:** Molten gold (1,150 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead (400 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Petrol:** Gunpowder sinks through petrol (1,700 vs 740 kg/m³).
- **Molten wax:** Gunpowder sinks through molten wax (1,700 vs 800 kg/m³).
- **Honey:** Gunpowder sinks through honey (1,700 vs 1,420 kg/m³).
- **Vinegar:** Gunpowder sinks through vinegar (1,700 vs 1,010 kg/m³).
- **Bleach:** Gunpowder sinks through bleach (1,700 vs 1,100 kg/m³).
- **Lye:** Gunpowder sinks through lye (1,700 vs 1,100 kg/m³).
- **Liquid nitrogen:** Gunpowder sinks through liquid nitrogen (1,700 vs 808 kg/m³).
- **Nitrogen:** Gunpowder falls through nitrogen.
- **Carbon dioxide:** Gunpowder falls through carbon dioxide.
- **Helium:** Gunpowder falls through helium.
- **Propane:** Gunpowder falls through propane.
- **Chlorine:** Gunpowder falls through chlorine.
- **Sulfur dioxide:** Gunpowder falls through sulfur dioxide.
- **Cloud:** Gunpowder falls through cloud.
- **Caramel:** Gunpowder sinks through caramel (1,700 vs 1,300 kg/m³).
- **Liquid oxygen:** Gunpowder explodes at 250 °C; it needs no air. Gunpowder sinks through liquid oxygen (1,700 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass (1,450 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver (1,000 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Tar:** Gunpowder sinks through tar (1,700 vs 1,150 kg/m³).
- **Molten plastic:** Gunpowder sinks through molten plastic (1,700 vs 900 kg/m³).
- **Napalm:** Gunpowder sinks through napalm (1,700 vs 900 kg/m³).
- **Hydrogen peroxide:** Gunpowder explodes at 250 °C; it needs no air. Gunpowder sinks through hydrogen peroxide (1,700 vs 1,450 kg/m³). Hydrogen peroxide makes burning gunpowder hotter and faster.
- **Lightning:** Gunpowder explodes when a flame touches it. Gunpowder falls through lightning.
- **Plasma:** Gunpowder explodes when a flame touches it. Gunpowder falls through plasma.
- **Rocket:** Gunpowder explodes when a flame touches it. Gunpowder falls through rocket.
- **Ember:** Gunpowder explodes when a flame touches it. Gunpowder falls through ember.
- **Saltpeter:** Gunpowder explodes at 250 °C; it needs no air. Saltpeter makes burning gunpowder hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Kerosene:** Gunpowder sinks through kerosene (1,700 vs 800 kg/m³).
- **Acetone:** Gunpowder sinks through acetone (1,700 vs 784 kg/m³).
- **Ammonia:** Gunpowder falls through ammonia.
- **Ozone:** Gunpowder explodes at 250 °C; it needs no air. Gunpowder falls through ozone. Ozone makes burning gunpowder hotter and faster.
- **Molten chocolate:** Gunpowder sinks through molten chocolate (1,700 vs 1,250 kg/m³).
- **Acetylene:** Gunpowder falls through acetylene.
- **Iodine vapour:** Gunpowder falls through iodine vapour.
- **Argon:** Gunpowder falls through argon.
- **Bromine vapour:** Gunpowder falls through bromine vapour.
- **Soda:** Gunpowder sinks through soda (1,700 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Nitro

An oily explosive liquid. Flows slowly. Goes off when heated, lit, or dropped hard.

- **State:** Liquid, 1,600 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,600 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Explodes:** from 200 °C or a flame, or when it lands hard; blast radius 6 cells

With other elements (68 interact):

- **Air:** Nitro explodes at 200 °C; it needs no air.
- **Water:** Nitro sinks through water (1,600 vs 1,000 kg/m³).
- **Oil:** Nitro sinks through oil (1,600 vs 900 kg/m³).
- **Steam:** Nitro falls through steam.
- **Lava:** Lava sinks through nitro (2,600 vs 1,600 kg/m³). Lava (1,200 °C) can set nitro on fire (it ignites at 200 °C).
- **Gravel:** Gravel sinks through nitro (2,000 vs 1,600 kg/m³).
- **Fire:** Nitro explodes when a flame touches it. Nitro falls through fire.
- **Smoke:** Nitro falls through smoke.
- **Acid:** Nitro sinks through acid (1,600 vs 1,100 kg/m³).
- **Hydrogen:** Nitro falls through hydrogen.
- **Oxygen:** Nitro explodes at 200 °C; it needs no air. Nitro falls through oxygen. Oxygen makes burning nitro hotter and faster.
- **Methane:** Nitro falls through methane.
- **Alcohol:** Nitro sinks through alcohol (1,600 vs 789 kg/m³).
- **Salt:** Salt sinks through nitro (2,160 vs 1,600 kg/m³).
- **Gunpowder:** Gunpowder sinks through nitro (1,700 vs 1,600 kg/m³).
- **Shards:** Shards sinks through nitro (2,500 vs 1,600 kg/m³).
- **Spark:** Nitro explodes when a flame touches it. Nitro falls through spark.
- **Mercury:** Mercury sinks through nitro (13,534 vs 1,600 kg/m³).
- **Molten copper:** Molten copper sinks through nitro (8,020 vs 1,600 kg/m³). Molten copper (1,200 °C) can set nitro on fire (it ignites at 200 °C).
- **Clay:** Clay sinks through nitro (1,700 vs 1,600 kg/m³).
- **Molten gold:** Molten gold sinks through nitro (17,300 vs 1,600 kg/m³). Molten gold (1,150 °C) can set nitro on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium sinks through nitro (2,375 vs 1,600 kg/m³). Molten aluminium (750 °C) can set nitro on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead sinks through nitro (10,660 vs 1,600 kg/m³). Molten lead (400 °C) can set nitro on fire (it ignites at 200 °C).
- **Rust:** Rust sinks through nitro (2,000 vs 1,600 kg/m³).
- **Sulfur:** Sulfur sinks through nitro (2,000 vs 1,600 kg/m³).
- **Petrol:** Nitro sinks through petrol (1,600 vs 740 kg/m³).
- **Molten wax:** Nitro sinks through molten wax (1,600 vs 800 kg/m³).
- **Honey:** Nitro sinks through honey (1,600 vs 1,420 kg/m³).
- **Vinegar:** Nitro sinks through vinegar (1,600 vs 1,010 kg/m³).
- **Bleach:** Nitro sinks through bleach (1,600 vs 1,100 kg/m³).
- **Lye:** Nitro sinks through lye (1,600 vs 1,100 kg/m³).
- **Liquid nitrogen:** Nitro sinks through liquid nitrogen (1,600 vs 808 kg/m³).
- **Nitrogen:** Nitro falls through nitrogen.
- **Carbon dioxide:** Nitro falls through carbon dioxide.
- **Helium:** Nitro falls through helium.
- **Propane:** Nitro falls through propane.
- **Chlorine:** Nitro falls through chlorine.
- **Sulfur dioxide:** Nitro falls through sulfur dioxide.
- **Cloud:** Nitro falls through cloud.
- **Caramel:** Nitro sinks through caramel (1,600 vs 1,300 kg/m³).
- **Liquid oxygen:** Nitro explodes at 200 °C; it needs no air. Nitro sinks through liquid oxygen (1,600 vs 1,141 kg/m³).
- **Molten iron:** Molten iron sinks through nitro (6,980 vs 1,600 kg/m³). Molten iron (1,600 °C) can set nitro on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass sinks through nitro (2,400 vs 1,600 kg/m³). Molten glass (1,450 °C) can set nitro on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver sinks through nitro (9,320 vs 1,600 kg/m³). Molten silver (1,000 °C) can set nitro on fire (it ignites at 200 °C).
- **Tar:** Nitro sinks through tar (1,600 vs 1,150 kg/m³).
- **Molten plastic:** Nitro sinks through molten plastic (1,600 vs 900 kg/m³). Molten plastic (200 °C) can set nitro on fire (it ignites at 200 °C).
- **Napalm:** Nitro sinks through napalm (1,600 vs 900 kg/m³).
- **Hydrogen peroxide:** Nitro explodes at 200 °C; it needs no air. Nitro sinks through hydrogen peroxide (1,600 vs 1,450 kg/m³). Hydrogen peroxide makes burning nitro hotter and faster.
- **Lightning:** Nitro explodes when a flame touches it. Nitro falls through lightning.
- **Plasma:** Nitro explodes when a flame touches it. Nitro falls through plasma.
- **Rocket:** Nitro explodes when a flame touches it. Nitro falls through rocket.
- **Ember:** Nitro explodes when a flame touches it. Nitro falls through ember.
- **Saltpeter:** Nitro explodes at 200 °C; it needs no air. Saltpeter sinks through nitro (2,100 vs 1,600 kg/m³). Saltpeter makes burning nitro hotter and faster.
- **Molten tin:** Molten tin sinks through nitro (6,990 vs 1,600 kg/m³). Molten tin (260 °C) can set nitro on fire (it ignites at 200 °C).
- **Kerosene:** Nitro sinks through kerosene (1,600 vs 800 kg/m³).
- **Acetone:** Nitro sinks through acetone (1,600 vs 784 kg/m³).
- **Ammonia:** Nitro falls through ammonia.
- **Ozone:** Nitro explodes at 200 °C; it needs no air. Nitro falls through ozone. Ozone makes burning nitro hotter and faster.
- **Molten chocolate:** Nitro sinks through molten chocolate (1,600 vs 1,250 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through nitro (2,220 vs 1,600 kg/m³).
- **Acetylene:** Nitro falls through acetylene.
- **Iodine:** Iodine sinks through nitro (4,930 vs 1,600 kg/m³).
- **Iodine vapour:** Nitro falls through iodine vapour.
- **Argon:** Nitro falls through argon.
- **Bromine:** Bromine sinks through nitro (3,100 vs 1,600 kg/m³).
- **Bromine vapour:** Nitro falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through nitro (6,095 vs 1,600 kg/m³).
- **Soda:** Nitro sinks through soda (1,600 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Wood, Ash, Iron, Sawdust, Sugar, Dirt, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Coal, Charcoal, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Glass

A clear, brittle solid. Stays put and lets you see through it. Shatters into shards when a blast hits it.

- **State:** Solid, 2,500 kg/m³
- **Melts:** at 1,400 °C, into molten glass
- **Shatters:** into shards when a blast hits it
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (4 interact):

- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt glass into molten glass.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt glass into molten glass.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt glass into molten glass.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt glass into molten glass.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Shards

Broken glass, a sharp powder. Falls and piles in glittering heaps.

- **State:** Powder, 2,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,500 kg/m³, rests on heavier ones
- **Falls:** up to 170 cells/s
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (48 interact):

- **Water:** Shards sinks through water (2,500 vs 1,000 kg/m³).
- **Oil:** Shards sinks through oil (2,500 vs 900 kg/m³).
- **Steam:** Shards falls through steam.
- **Fire:** Shards falls through fire.
- **Smoke:** Shards falls through smoke.
- **Acid:** Shards sinks through acid (2,500 vs 1,100 kg/m³).
- **Hydrogen:** Shards falls through hydrogen.
- **Oxygen:** Shards falls through oxygen.
- **Methane:** Shards falls through methane.
- **Alcohol:** Shards sinks through alcohol (2,500 vs 789 kg/m³).
- **Nitro:** Shards sinks through nitro (2,500 vs 1,600 kg/m³).
- **Spark:** Shards falls through spark.
- **Molten aluminium:** Shards sinks through molten aluminium (2,500 vs 2,375 kg/m³).
- **Petrol:** Shards sinks through petrol (2,500 vs 740 kg/m³).
- **Molten wax:** Shards sinks through molten wax (2,500 vs 800 kg/m³).
- **Honey:** Shards sinks through honey (2,500 vs 1,420 kg/m³).
- **Vinegar:** Shards sinks through vinegar (2,500 vs 1,010 kg/m³).
- **Bleach:** Shards sinks through bleach (2,500 vs 1,100 kg/m³).
- **Lye:** Shards sinks through lye (2,500 vs 1,100 kg/m³).
- **Liquid nitrogen:** Shards sinks through liquid nitrogen (2,500 vs 808 kg/m³).
- **Nitrogen:** Shards falls through nitrogen.
- **Carbon dioxide:** Shards falls through carbon dioxide.
- **Helium:** Shards falls through helium.
- **Propane:** Shards falls through propane.
- **Chlorine:** Shards falls through chlorine.
- **Sulfur dioxide:** Shards falls through sulfur dioxide.
- **Cloud:** Shards falls through cloud.
- **Caramel:** Shards sinks through caramel (2,500 vs 1,300 kg/m³).
- **Liquid oxygen:** Shards sinks through liquid oxygen (2,500 vs 1,141 kg/m³).
- **Molten glass:** Shards sinks through molten glass (2,500 vs 2,400 kg/m³).
- **Tar:** Shards sinks through tar (2,500 vs 1,150 kg/m³).
- **Molten plastic:** Shards sinks through molten plastic (2,500 vs 900 kg/m³).
- **Napalm:** Shards sinks through napalm (2,500 vs 900 kg/m³).
- **Hydrogen peroxide:** Shards sinks through hydrogen peroxide (2,500 vs 1,450 kg/m³).
- **Lightning:** Shards falls through lightning.
- **Plasma:** Shards falls through plasma.
- **Rocket:** Shards falls through rocket.
- **Ember:** Shards falls through ember.
- **Kerosene:** Shards sinks through kerosene (2,500 vs 800 kg/m³).
- **Acetone:** Shards sinks through acetone (2,500 vs 784 kg/m³).
- **Ammonia:** Shards falls through ammonia.
- **Ozone:** Shards falls through ozone.
- **Molten chocolate:** Shards sinks through molten chocolate (2,500 vs 1,250 kg/m³).
- **Acetylene:** Shards falls through acetylene.
- **Iodine vapour:** Shards falls through iodine vapour.
- **Argon:** Shards falls through argon.
- **Bromine vapour:** Shards falls through bromine vapour.
- **Soda:** Shards sinks through soda (2,500 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Spark

A flash of electric charge. Jumps into any conductor it touches and runs along it; on its own it fades at once.

- **State:** Energy, 0.1 kg/m³
- **Starts at:** 300 °C

With other elements (106 interact):

- **Sand:** Sand falls through spark.
- **Water:** Spark (300 °C) is hot enough to boil water into steam. Water falls through spark.
- **Oil:** Oil catches from the flame touching it. Oil falls through spark.
- **Ice:** Spark (300 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through spark.
- **Gravel:** Gravel falls through spark.
- **Wood:** Wood catches from the flame touching it.
- **Ash:** Ash falls through spark.
- **Acid:** Acid falls through spark.
- **Hydrogen:** Hydrogen catches from the flame touching it.
- **Methane:** Methane catches from the flame touching it.
- **Alcohol:** Alcohol catches from the flame touching it. Alcohol falls through spark.
- **Sawdust:** Sawdust catches from the flame touching it. Sawdust falls through spark.
- **Salt:** Salt falls through spark.
- **Sugar:** Sugar catches from the flame touching it. Sugar falls through spark.
- **Dirt:** Dirt falls through spark.
- **Snow:** Spark (300 °C) is hot enough to melt snow into water. Snow falls through spark.
- **TNT:** TNT explodes when a flame touches it.
- **Gunpowder:** Gunpowder explodes when a flame touches it. Gunpowder falls through spark.
- **Nitro:** Nitro explodes when a flame touches it. Nitro falls through spark.
- **Shards:** Shards falls through spark.
- **Mercury:** Mercury falls through spark.
- **Seed:** Seed catches from the flame touching it. Seed falls through spark.
- **Plant:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper falls through spark.
- **Dry plant:** Dry plant catches from the flame touching it.
- **Clay:** Clay falls through spark.
- **Cement:** Cement falls through spark.
- **Quicklime:** Quicklime falls through spark.
- **Slaked lime:** Slaked lime falls through spark.
- **Molten gold:** Molten gold falls through spark.
- **Molten aluminium:** Molten aluminium falls through spark.
- **Molten lead:** Molten lead falls through spark.
- **Rust:** Rust falls through spark.
- **Coal:** Coal catches from the flame touching it. Coal falls through spark.
- **Charcoal:** Charcoal catches from the flame touching it. Charcoal falls through spark.
- **Sulfur:** Sulfur catches from the flame touching it. Sulfur falls through spark.
- **Petrol:** Petrol catches from the flame touching it. Petrol falls through spark.
- **Wax:** Spark (300 °C) is hot enough to melt wax into molten wax. Wax catches from the flame touching it.
- **Molten wax:** Molten wax catches from the flame touching it. Molten wax falls through spark.
- **Paper:** Paper catches from the flame touching it.
- **Rubber:** Rubber catches from the flame touching it.
- **Flour:** Flour catches from the flame touching it. Flour falls through spark.
- **Thermite:** Thermite falls through spark.
- **Honey:** Honey falls through spark.
- **Vinegar:** Vinegar falls through spark.
- **Bleach:** Bleach falls through spark.
- **Lye:** Lye falls through spark.
- **Liquid nitrogen:** Spark (300 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through spark.
- **Propane:** Propane catches from the flame touching it.
- **Dry ice:** Spark (300 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through spark.
- **Grass seed:** Grass seed catches from the flame touching it. Grass seed falls through spark.
- **Grass:** Grass catches from the flame touching it.
- **Acorn:** Acorn catches from the flame touching it. Acorn falls through spark.
- **Tree:** Tree catches from the flame touching it.
- **Leaves:** Leaves catches from the flame touching it.
- **Flower:** Flower catches from the flame touching it.
- **Magnesium:** Magnesium catches from the flame touching it.
- **Caramel:** Caramel catches from the flame touching it. Caramel falls through spark.
- **Chalk:** Chalk falls through spark.
- **Liquid oxygen:** Spark (300 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through spark.
- **Molten iron:** Molten iron falls through spark.
- **Molten glass:** Molten glass falls through spark.
- **Molten silver:** Molten silver falls through spark.
- **Cooked meat:** Cooked meat catches from the flame touching it.
- **Popcorn kernel:** Popcorn kernel falls through spark.
- **Popcorn:** Popcorn catches from the flame touching it. Popcorn falls through spark.
- **Tar:** Tar catches from the flame touching it. Tar falls through spark.
- **Plastic:** Spark (300 °C) is hot enough to melt plastic into molten plastic. Plastic catches from the flame touching it.
- **Molten plastic:** Molten plastic catches from the flame touching it. Molten plastic falls through spark.
- **Pumice:** Pumice falls through spark.
- **Napalm:** Napalm catches from the flame touching it. Napalm falls through spark.
- **Hydrogen peroxide:** Hydrogen peroxide falls through spark.
- **Fish:** Fish catches from the flame touching it.
- **Ant:** Ant catches from the flame touching it.
- **Bird:** Bird catches from the flame touching it.
- **Firework:** Firework catches from the flame touching it. Firework falls through spark.
- **Saltpeter:** Saltpeter falls through spark.
- **Tin:** Spark (300 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin falls through spark.
- **Kerosene:** Kerosene catches from the flame touching it. Kerosene falls through spark.
- **Acetone:** Acetone catches from the flame touching it. Acetone falls through spark.
- **Hail:** Spark (300 °C) is hot enough to melt hail into water. Hail falls through spark.
- **Bee:** Bee catches from the flame touching it.
- **Spider:** Spider catches from the flame touching it.
- **Termite:** Termite catches from the flame touching it.
- **Frog:** Frog catches from the flame touching it.
- **Mouse:** Mouse catches from the flame touching it.
- **Snake:** Snake catches from the flame touching it.
- **Cotton:** Cotton catches from the flame touching it. Cotton falls through spark.
- **Chocolate:** Spark (300 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through spark.
- **Phosphorus:** Phosphorus catches from the flame touching it.
- **Calcium carbide:** Calcium carbide falls through spark.
- **Acetylene:** Acetylene catches from the flame touching it.
- **Iodine:** Spark (300 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through spark.
- **Bromine:** Spark (300 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through spark.
- **Gallium:** Spark (300 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through spark.
- **Cactus seed:** Cactus seed catches from the flame touching it. Cactus seed falls through spark.
- **Cactus:** Cactus catches from the flame touching it.
- **Smoke bomb:** Smoke bomb catches from the flame touching it. Smoke bomb falls through spark.
- **Peat:** Peat catches from the flame touching it. Peat falls through spark.
- **Soda:** Soda falls through spark.
- **Fuse:** Fuse catches from the flame touching it.

No direct interaction with: Air, Wall, Steam, Stone, Fire, Smoke, Iron, Oxygen, Glass, Wire, Battery, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Obsidian, Diamond, Worm, Lightning, Plasma, Rocket, Ember, Steel, Zinc, Uranium, Snail, Ammonia, Ozone, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wire

Thin copper. Stays put and carries charge from end to end, warming as current runs through it.

- **State:** Solid, 8,960 kg/m³
- **Melts:** at 1,085 °C, into molten copper
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.45 (acid stronger than this eats it)

With other elements (8 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt wire into molten copper.
- **Acid:** Acid eats wire: acidity 0.8 beats hardness 0.45, giving off hydrogen.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt wire into molten copper.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt wire into molten copper.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt wire into molten copper.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt wire into molten copper.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt wire into molten copper.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt wire into molten copper.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Battery

A power source. Stays put and sends a pulse of charge into any conductor touching it, about four times a second.

- **State:** Solid, 2,500 kg/m³
- **Powers:** touching conductors with a pulse every 0.25 s
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats battery: acidity 0.8 beats hardness 0.6, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Mercury

A liquid metal, very heavy. Flows and sinks through almost everything. Carries charge like a wire.

- **State:** Liquid, 13,534 kg/m³
- **In liquids:** Sinks through liquids lighter than 13,534 kg/m³, floats on heavier ones
- **Falls:** up to 170 cells/s
- **Conducts:** electric charge, warming as pulses pass

With other elements (57 interact):

- **Water:** Mercury sinks through water (13,534 vs 1,000 kg/m³).
- **Oil:** Mercury sinks through oil (13,534 vs 900 kg/m³).
- **Steam:** Mercury falls through steam.
- **Lava:** Mercury sinks through lava (13,534 vs 2,600 kg/m³).
- **Fire:** Mercury falls through fire.
- **Smoke:** Mercury falls through smoke.
- **Acid:** Mercury sinks through acid (13,534 vs 1,100 kg/m³).
- **Hydrogen:** Mercury falls through hydrogen.
- **Oxygen:** Mercury falls through oxygen.
- **Methane:** Mercury falls through methane.
- **Alcohol:** Mercury sinks through alcohol (13,534 vs 789 kg/m³).
- **Nitro:** Mercury sinks through nitro (13,534 vs 1,600 kg/m³).
- **Spark:** Mercury falls through spark.
- **Molten copper:** Mercury sinks through molten copper (13,534 vs 8,020 kg/m³).
- **Molten gold:** Molten gold sinks through mercury (17,300 vs 13,534 kg/m³).
- **Molten aluminium:** Mercury sinks through molten aluminium (13,534 vs 2,375 kg/m³).
- **Molten lead:** Mercury sinks through molten lead (13,534 vs 10,660 kg/m³).
- **Petrol:** Mercury sinks through petrol (13,534 vs 740 kg/m³).
- **Molten wax:** Mercury sinks through molten wax (13,534 vs 800 kg/m³).
- **Honey:** Mercury sinks through honey (13,534 vs 1,420 kg/m³).
- **Vinegar:** Mercury sinks through vinegar (13,534 vs 1,010 kg/m³).
- **Bleach:** Mercury sinks through bleach (13,534 vs 1,100 kg/m³).
- **Lye:** Mercury sinks through lye (13,534 vs 1,100 kg/m³).
- **Liquid nitrogen:** Mercury sinks through liquid nitrogen (13,534 vs 808 kg/m³).
- **Nitrogen:** Mercury falls through nitrogen.
- **Carbon dioxide:** Mercury falls through carbon dioxide.
- **Helium:** Mercury falls through helium.
- **Propane:** Mercury falls through propane.
- **Chlorine:** Mercury falls through chlorine.
- **Sulfur dioxide:** Mercury falls through sulfur dioxide.
- **Cloud:** Mercury falls through cloud.
- **Caramel:** Mercury sinks through caramel (13,534 vs 1,300 kg/m³).
- **Liquid oxygen:** Mercury sinks through liquid oxygen (13,534 vs 1,141 kg/m³).
- **Molten iron:** Mercury sinks through molten iron (13,534 vs 6,980 kg/m³).
- **Molten glass:** Mercury sinks through molten glass (13,534 vs 2,400 kg/m³).
- **Molten silver:** Mercury sinks through molten silver (13,534 vs 9,320 kg/m³).
- **Tar:** Mercury sinks through tar (13,534 vs 1,150 kg/m³).
- **Molten plastic:** Mercury sinks through molten plastic (13,534 vs 900 kg/m³).
- **Napalm:** Mercury sinks through napalm (13,534 vs 900 kg/m³).
- **Hydrogen peroxide:** Mercury sinks through hydrogen peroxide (13,534 vs 1,450 kg/m³).
- **Lightning:** Mercury falls through lightning.
- **Plasma:** Mercury falls through plasma.
- **Rocket:** Mercury falls through rocket.
- **Ember:** Mercury falls through ember.
- **Molten tin:** Mercury sinks through molten tin (13,534 vs 6,990 kg/m³).
- **Kerosene:** Mercury sinks through kerosene (13,534 vs 800 kg/m³).
- **Acetone:** Mercury sinks through acetone (13,534 vs 784 kg/m³).
- **Ammonia:** Mercury falls through ammonia.
- **Ozone:** Mercury falls through ozone.
- **Molten chocolate:** Mercury sinks through molten chocolate (13,534 vs 1,250 kg/m³).
- **Acetylene:** Mercury falls through acetylene.
- **Iodine vapour:** Mercury falls through iodine vapour.
- **Argon:** Mercury falls through argon.
- **Bromine:** Mercury sinks through bromine (13,534 vs 3,100 kg/m³).
- **Bromine vapour:** Mercury falls through bromine vapour.
- **Liquid gallium:** Mercury sinks through liquid gallium (13,534 vs 6,095 kg/m³).
- **Soda:** Mercury sinks through soda (13,534 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Seed

A small seed, a light powder. Falls, sinks in water and rests. On damp soil (wet dirt or sand), it sprouts into a plant, even under a puddle.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 140 cells/s
- **Burns:** from 250 °C in air, 1 s per cell, leaves ash
- **Grows:** into plant on damp soil (wet dirt or sand), even under a puddle

With other elements (49 interact):

- **Air:** Seed burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Water:** Seed sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Seed sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Seed falls through steam.
- **Lava:** Lava (1,200 °C) can set seed on fire (it ignites at 250 °C).
- **Fire:** Seed catches from the flame touching it. Seed falls through fire.
- **Smoke:** Seed falls through smoke.
- **Hydrogen:** Seed falls through hydrogen.
- **Oxygen:** Seed burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Seed falls through oxygen. Oxygen makes burning seed hotter and faster.
- **Methane:** Seed falls through methane.
- **Alcohol:** Seed sinks through alcohol (1,100 vs 789 kg/m³).
- **Spark:** Seed catches from the flame touching it. Seed falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set seed on fire (it ignites at 250 °C).
- **Molten gold:** Molten gold (1,150 °C) can set seed on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set seed on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead (400 °C) can set seed on fire (it ignites at 250 °C).
- **Petrol:** Seed sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Seed sinks through molten wax (1,100 vs 800 kg/m³).
- **Vinegar:** Seed sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Liquid nitrogen:** Seed sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Seed falls through nitrogen.
- **Carbon dioxide:** Seed falls through carbon dioxide.
- **Helium:** Seed falls through helium.
- **Propane:** Seed falls through propane.
- **Chlorine:** Seed falls through chlorine.
- **Sulfur dioxide:** Seed falls through sulfur dioxide.
- **Cloud:** Seed falls through cloud.
- **Liquid oxygen:** Seed burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set seed on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass (1,450 °C) can set seed on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver (1,000 °C) can set seed on fire (it ignites at 250 °C).
- **Molten plastic:** Seed sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Seed sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Seed burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning seed hotter and faster.
- **Lightning:** Seed catches from the flame touching it. Seed falls through lightning.
- **Plasma:** Seed catches from the flame touching it. Seed falls through plasma.
- **Rocket:** Seed catches from the flame touching it. Seed falls through rocket.
- **Ember:** Seed catches from the flame touching it. Seed falls through ember.
- **Saltpeter:** Seed burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning seed hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set seed on fire (it ignites at 250 °C).
- **Kerosene:** Seed sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Seed sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Seed falls through ammonia.
- **Ozone:** Seed burns: it catches fire at 250 °C next to ozone (oxidiser 1). Seed falls through ozone. Ozone makes burning seed hotter and faster.
- **Acetylene:** Seed falls through acetylene.
- **Iodine vapour:** Seed falls through iodine vapour.
- **Argon:** Seed falls through argon.
- **Bromine vapour:** Seed falls through bromine vapour.
- **Soda:** Seed sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Plant

A living green plant. Its roots drink from damp soil or water and pass it up the stem; it grows while it has water and puts out leaves. Dried out, it withers. Burns, and acid eats it.

- **State:** Solid, 900 kg/m³
- **Burns:** from 250 °C in air, 1.5 s per cell, leaves ash
- **Flowers:** each stem ends in flower
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.15 (acid stronger than this eats it)

With other elements (30 interact):

- **Air:** Plant burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set plant on fire (it ignites at 250 °C).
- **Fire:** Plant catches from the flame touching it.
- **Acid:** Acid eats plant: acidity 0.8 beats hardness 0.15.
- **Oxygen:** Plant burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Oxygen makes burning plant hotter and faster.
- **Salt:** Salt is toxic: plant touching it withers.
- **Spark:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set plant on fire (it ignites at 250 °C).
- **Molten gold:** Molten gold (1,150 °C) can set plant on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set plant on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead (400 °C) can set plant on fire (it ignites at 250 °C).
- **Bleach:** Bleach is toxic: plant touching it withers.
- **Chlorine:** Chlorine is toxic: plant touching it withers.
- **Sulfur dioxide:** Sulfur dioxide is toxic: plant touching it withers.
- **Liquid oxygen:** Plant burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set plant on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass (1,450 °C) can set plant on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver (1,000 °C) can set plant on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Plant burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning plant hotter and faster.
- **Lightning:** Plant catches from the flame touching it.
- **Plasma:** Plant catches from the flame touching it.
- **Rocket:** Plant catches from the flame touching it.
- **Ember:** Plant catches from the flame touching it.
- **Saltpeter:** Plant burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning plant hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set plant on fire (it ignites at 250 °C).
- **Uranium:** Uranium is toxic: plant touching it withers.
- **Ammonia:** Ammonia is toxic: plant touching it withers.
- **Ozone:** Plant burns: it catches fire at 250 °C next to ozone (oxidiser 1). Ozone is toxic: plant touching it withers. Ozone makes burning plant hotter and faster.
- **Bromine:** Bromine is toxic: plant touching it withers.
- **Bromine vapour:** Bromine vapour is toxic: plant touching it withers.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten copper

Melted wire, bright and very hot. Flows and sinks through lighter liquids. Carries charge, sets fuel alight, and sets back into wire as it cools.

- **State:** Liquid, 8,020 kg/m³
- **Starts at:** 1,200 °C
- **In liquids:** Sinks through liquids lighter than 8,020 kg/m³, floats on heavier ones
- **Falls:** up to 140 cells/s
- **Freezes:** below 1,085 °C, into wire
- **Conducts:** electric charge, warming as pulses pass

With other elements (119 interact):

- **Water:** Molten copper sinks through water (8,020 vs 1,000 kg/m³). Molten copper (1,200 °C) is hot enough to boil water into steam.
- **Oil:** Molten copper sinks through oil (8,020 vs 900 kg/m³). Molten copper (1,200 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten copper (1,200 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten copper into wire.
- **Steam:** Molten copper falls through steam.
- **Lava:** Molten copper sinks through lava (8,020 vs 2,600 kg/m³).
- **Stone:** Molten copper (1,200 °C) is hot enough to melt stone into lava.
- **Gravel:** Molten copper (1,200 °C) is hot enough to melt gravel into lava.
- **Fire:** Molten copper falls through fire.
- **Smoke:** Molten copper falls through smoke.
- **Wood:** Molten copper (1,200 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten copper sinks through acid (8,020 vs 1,100 kg/m³).
- **Hydrogen:** Molten copper falls through hydrogen. Molten copper (1,200 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Molten copper falls through oxygen.
- **Methane:** Molten copper falls through methane. Molten copper (1,200 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Molten copper sinks through alcohol (8,020 vs 789 kg/m³). Molten copper (1,200 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten copper (1,200 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten copper (1,200 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten copper (1,200 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten copper into wire.
- **TNT:** Molten copper (1,200 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten copper (1,200 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten copper sinks through nitro (8,020 vs 1,600 kg/m³). Molten copper (1,200 °C) can set nitro on fire (it ignites at 200 °C).
- **Spark:** Molten copper falls through spark.
- **Wire:** Molten copper (1,200 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Mercury sinks through molten copper (13,534 vs 8,020 kg/m³).
- **Seed:** Molten copper (1,200 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten copper (1,200 °C) can set plant on fire (it ignites at 250 °C).
- **Dry plant:** Molten copper (1,200 °C) can set dry plant on fire (it ignites at 200 °C).
- **Gold:** Molten copper (1,200 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold sinks through molten copper (17,300 vs 8,020 kg/m³).
- **Aluminium:** Molten copper (1,200 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten copper sinks through molten aluminium (8,020 vs 2,375 kg/m³).
- **Lead:** Molten copper (1,200 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead sinks through molten copper (10,660 vs 8,020 kg/m³).
- **Coal:** Molten copper (1,200 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Molten copper (1,200 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten copper (1,200 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten copper sinks through petrol (8,020 vs 740 kg/m³). Molten copper (1,200 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten copper (1,200 °C) is hot enough to melt wax into molten wax. Molten copper (1,200 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten copper sinks through molten wax (8,020 vs 800 kg/m³). Molten copper (1,200 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten copper (1,200 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten copper (1,200 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten copper (1,200 °C) can set flour on fire (it ignites at 380 °C).
- **Thermite:** Molten copper (1,200 °C) can set thermite on fire (it ignites at 900 °C).
- **Honey:** Molten copper sinks through honey (8,020 vs 1,420 kg/m³).
- **Vinegar:** Molten copper sinks through vinegar (8,020 vs 1,010 kg/m³).
- **Bleach:** Molten copper sinks through bleach (8,020 vs 1,100 kg/m³).
- **Lye:** Molten copper sinks through lye (8,020 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten copper sinks through liquid nitrogen (8,020 vs 808 kg/m³). Molten copper (1,200 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten copper into wire.
- **Nitrogen:** Molten copper falls through nitrogen.
- **Carbon dioxide:** Molten copper falls through carbon dioxide.
- **Helium:** Molten copper falls through helium.
- **Propane:** Molten copper falls through propane. Molten copper (1,200 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Molten copper falls through chlorine.
- **Sulfur dioxide:** Molten copper falls through sulfur dioxide.
- **Dry ice:** Molten copper (1,200 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten copper into wire.
- **C4:** Molten copper (1,200 °C) can set c4 on fire (it ignites at 900 °C).
- **Grass seed:** Molten copper (1,200 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten copper (1,200 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten copper (1,200 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten copper (1,200 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten copper (1,200 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten copper (1,200 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten copper falls through cloud.
- **Magnesium:** Molten copper (1,200 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Molten copper sinks through caramel (8,020 vs 1,300 kg/m³). Molten copper (1,200 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten copper sinks through liquid oxygen (8,020 vs 1,141 kg/m³). Molten copper (1,200 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten copper into wire.
- **Molten iron:** Molten copper sinks through molten iron (8,020 vs 6,980 kg/m³).
- **Molten glass:** Molten copper sinks through molten glass (8,020 vs 2,400 kg/m³).
- **Silver:** Molten copper (1,200 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver sinks through molten copper (9,320 vs 8,020 kg/m³).
- **Cooked meat:** Molten copper (1,200 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten copper (1,200 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten copper sinks through tar (8,020 vs 1,150 kg/m³). Molten copper (1,200 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten copper (1,200 °C) is hot enough to melt plastic into molten plastic. Molten copper (1,200 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten copper sinks through molten plastic (8,020 vs 900 kg/m³). Molten copper (1,200 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Obsidian:** Molten copper (1,200 °C) is hot enough to melt obsidian into lava.
- **Diamond:** Molten copper (1,200 °C) can set diamond on fire (it ignites at 900 °C).
- **Napalm:** Molten copper sinks through napalm (8,020 vs 900 kg/m³). Molten copper (1,200 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten copper sinks through hydrogen peroxide (8,020 vs 1,450 kg/m³).
- **Fish:** Molten copper (1,200 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten copper (1,200 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten copper (1,200 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten copper falls through lightning.
- **Plasma:** Molten copper falls through plasma.
- **Firework:** Molten copper (1,200 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten copper falls through rocket.
- **Ember:** Molten copper falls through ember.
- **Tin:** Molten copper (1,200 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten copper sinks through molten tin (8,020 vs 6,990 kg/m³).
- **Kerosene:** Molten copper sinks through kerosene (8,020 vs 800 kg/m³). Molten copper (1,200 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten copper sinks through acetone (8,020 vs 784 kg/m³). Molten copper (1,200 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Molten copper (1,200 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten copper into wire.
- **Bee:** Molten copper (1,200 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten copper (1,200 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten copper (1,200 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten copper (1,200 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten copper (1,200 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten copper (1,200 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten copper falls through ammonia.
- **Ozone:** Molten copper falls through ozone.
- **Cotton:** Molten copper (1,200 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten copper (1,200 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten copper sinks through molten chocolate (8,020 vs 1,250 kg/m³).
- **Phosphorus:** Molten copper (1,200 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten copper falls through acetylene. Molten copper (1,200 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten copper (1,200 °C) is hot enough to turn iodine into iodine vapour.
- **Iodine vapour:** Molten copper falls through iodine vapour.
- **Argon:** Molten copper falls through argon.
- **Bromine:** Molten copper sinks through bromine (8,020 vs 3,100 kg/m³). Molten copper (1,200 °C) is hot enough to boil bromine into bromine vapour.
- **Bromine vapour:** Molten copper falls through bromine vapour.
- **Gallium:** Molten copper (1,200 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Molten copper sinks through liquid gallium (8,020 vs 6,095 kg/m³).
- **Cactus seed:** Molten copper (1,200 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten copper (1,200 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten copper (1,200 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten copper (1,200 °C) can set peat on fire (it ignites at 300 °C).
- **Basalt:** Molten copper (1,200 °C) is hot enough to melt basalt into lava.
- **Soda:** Molten copper sinks through soda (8,020 vs 1,010 kg/m³).
- **Fuse:** Molten copper (1,200 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Glass, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Meat, Popcorn kernel, Pumice, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dry plant

A plant that ran out of water, dry and brown. Stays put. Catches fire very easily and burns fast, leaving ash.

- **State:** Solid, 300 kg/m³
- **Burns:** from 200 °C in air, 0.67 s per cell, leaves ash
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (24 interact):

- **Air:** Dry plant burns: it catches fire at 200 °C next to air (oxidiser 0.21).
- **Water:** Dry plant slowly rots into dirt where water touches it.
- **Lava:** Lava (1,200 °C) can set dry plant on fire (it ignites at 200 °C).
- **Fire:** Dry plant catches from the flame touching it.
- **Acid:** Acid eats dry plant: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Dry plant burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Oxygen makes burning dry plant hotter and faster.
- **Spark:** Dry plant catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold (1,150 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead (400 °C) can set dry plant on fire (it ignites at 200 °C).
- **Liquid oxygen:** Dry plant burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass (1,450 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver (1,000 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten plastic:** Molten plastic (200 °C) can set dry plant on fire (it ignites at 200 °C).
- **Hydrogen peroxide:** Dry plant burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning dry plant hotter and faster.
- **Lightning:** Dry plant catches from the flame touching it.
- **Plasma:** Dry plant catches from the flame touching it.
- **Rocket:** Dry plant catches from the flame touching it.
- **Ember:** Dry plant catches from the flame touching it.
- **Saltpeter:** Dry plant burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning dry plant hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set dry plant on fire (it ignites at 200 °C).
- **Ozone:** Dry plant burns: it catches fire at 200 °C next to ozone (oxidiser 1). Ozone makes burning dry plant hotter and faster.

No direct interaction with: Wall, Sand, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Clay

Fine, sticky earth, a heavy powder. Falls and piles, and soaks up water. Fired in great heat, it bakes hard into brick.

- **State:** Powder, 1,700 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,700 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Bakes:** at 900 °C into brick; there is no way back
- **Soaks up:** water, up to 40% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (46 interact):

- **Water:** Clay soaks up water: it is porous and holds up to 40% water. Clay sinks through water (1,700 vs 1,000 kg/m³).
- **Oil:** Clay sinks through oil (1,700 vs 900 kg/m³).
- **Steam:** Clay falls through steam.
- **Fire:** Clay falls through fire.
- **Smoke:** Clay falls through smoke.
- **Acid:** Acid eats clay: acidity 0.8 beats hardness 0.3. Clay sinks through acid (1,700 vs 1,100 kg/m³).
- **Hydrogen:** Clay falls through hydrogen.
- **Oxygen:** Clay falls through oxygen.
- **Methane:** Clay falls through methane.
- **Alcohol:** Clay sinks through alcohol (1,700 vs 789 kg/m³).
- **Nitro:** Clay sinks through nitro (1,700 vs 1,600 kg/m³).
- **Spark:** Clay falls through spark.
- **Petrol:** Clay sinks through petrol (1,700 vs 740 kg/m³).
- **Molten wax:** Clay sinks through molten wax (1,700 vs 800 kg/m³).
- **Honey:** Clay sinks through honey (1,700 vs 1,420 kg/m³).
- **Vinegar:** Clay sinks through vinegar (1,700 vs 1,010 kg/m³).
- **Bleach:** Clay sinks through bleach (1,700 vs 1,100 kg/m³).
- **Lye:** Clay sinks through lye (1,700 vs 1,100 kg/m³).
- **Liquid nitrogen:** Clay sinks through liquid nitrogen (1,700 vs 808 kg/m³).
- **Nitrogen:** Clay falls through nitrogen.
- **Carbon dioxide:** Clay falls through carbon dioxide.
- **Helium:** Clay falls through helium.
- **Propane:** Clay falls through propane.
- **Chlorine:** Clay falls through chlorine.
- **Sulfur dioxide:** Clay falls through sulfur dioxide.
- **Cloud:** Clay falls through cloud.
- **Caramel:** Clay sinks through caramel (1,700 vs 1,300 kg/m³).
- **Liquid oxygen:** Clay sinks through liquid oxygen (1,700 vs 1,141 kg/m³).
- **Tar:** Clay sinks through tar (1,700 vs 1,150 kg/m³).
- **Molten plastic:** Clay sinks through molten plastic (1,700 vs 900 kg/m³).
- **Napalm:** Clay sinks through napalm (1,700 vs 900 kg/m³).
- **Hydrogen peroxide:** Clay sinks through hydrogen peroxide (1,700 vs 1,450 kg/m³).
- **Lightning:** Clay falls through lightning.
- **Plasma:** Clay falls through plasma.
- **Rocket:** Clay falls through rocket.
- **Ember:** Clay falls through ember.
- **Kerosene:** Clay sinks through kerosene (1,700 vs 800 kg/m³).
- **Acetone:** Clay sinks through acetone (1,700 vs 784 kg/m³).
- **Ammonia:** Clay falls through ammonia.
- **Ozone:** Clay falls through ozone.
- **Molten chocolate:** Clay sinks through molten chocolate (1,700 vs 1,250 kg/m³).
- **Acetylene:** Clay falls through acetylene.
- **Iodine vapour:** Clay falls through iodine vapour.
- **Argon:** Clay falls through argon.
- **Bromine vapour:** Clay falls through bromine vapour.
- **Soda:** Clay sinks through soda (1,700 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Brick

Fired clay, a solid block. Stays put and shrugs off heat. A strong blast breaks it into gravel.

- **State:** Solid, 1,900 kg/m³
- **Shatters:** into gravel when a blast hits it
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cement

Grey building powder. Falls and piles. Water touching it is taken in, and it sets hard into concrete.

- **State:** Powder, 1,440 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,440 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Sets:** with water into concrete
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (44 interact):

- **Water:** Cement takes in the water and sets into concrete. Cement sinks through water (1,440 vs 1,000 kg/m³).
- **Oil:** Cement sinks through oil (1,440 vs 900 kg/m³).
- **Steam:** Cement falls through steam.
- **Fire:** Cement falls through fire.
- **Smoke:** Cement falls through smoke.
- **Acid:** Acid eats cement: acidity 0.8 beats hardness 0.4. Cement sinks through acid (1,440 vs 1,100 kg/m³).
- **Hydrogen:** Cement falls through hydrogen.
- **Oxygen:** Cement falls through oxygen.
- **Methane:** Cement falls through methane.
- **Alcohol:** Cement sinks through alcohol (1,440 vs 789 kg/m³).
- **Spark:** Cement falls through spark.
- **Petrol:** Cement sinks through petrol (1,440 vs 740 kg/m³).
- **Molten wax:** Cement sinks through molten wax (1,440 vs 800 kg/m³).
- **Honey:** Cement sinks through honey (1,440 vs 1,420 kg/m³).
- **Vinegar:** Cement sinks through vinegar (1,440 vs 1,010 kg/m³).
- **Bleach:** Cement sinks through bleach (1,440 vs 1,100 kg/m³).
- **Lye:** Cement sinks through lye (1,440 vs 1,100 kg/m³).
- **Liquid nitrogen:** Cement sinks through liquid nitrogen (1,440 vs 808 kg/m³).
- **Nitrogen:** Cement falls through nitrogen.
- **Carbon dioxide:** Cement falls through carbon dioxide.
- **Helium:** Cement falls through helium.
- **Propane:** Cement falls through propane.
- **Chlorine:** Cement falls through chlorine.
- **Sulfur dioxide:** Cement falls through sulfur dioxide.
- **Cloud:** Cement falls through cloud.
- **Caramel:** Cement sinks through caramel (1,440 vs 1,300 kg/m³).
- **Liquid oxygen:** Cement sinks through liquid oxygen (1,440 vs 1,141 kg/m³).
- **Tar:** Cement sinks through tar (1,440 vs 1,150 kg/m³).
- **Molten plastic:** Cement sinks through molten plastic (1,440 vs 900 kg/m³).
- **Napalm:** Cement sinks through napalm (1,440 vs 900 kg/m³).
- **Lightning:** Cement falls through lightning.
- **Plasma:** Cement falls through plasma.
- **Rocket:** Cement falls through rocket.
- **Ember:** Cement falls through ember.
- **Kerosene:** Cement sinks through kerosene (1,440 vs 800 kg/m³).
- **Acetone:** Cement sinks through acetone (1,440 vs 784 kg/m³).
- **Ammonia:** Cement falls through ammonia.
- **Ozone:** Cement falls through ozone.
- **Molten chocolate:** Cement sinks through molten chocolate (1,440 vs 1,250 kg/m³).
- **Acetylene:** Cement falls through acetylene.
- **Iodine vapour:** Cement falls through iodine vapour.
- **Argon:** Cement falls through argon.
- **Bromine vapour:** Cement falls through bromine vapour.
- **Soda:** Cement sinks through soda (1,440 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Concrete

Set cement, a hard grey solid. Stays put. Acid eats it slowly, and a big blast cracks it into gravel.

- **State:** Solid, 2,400 kg/m³
- **Shatters:** into gravel when a blast hits it
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats concrete: acidity 0.8 beats hardness 0.6.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Limestone

Pale sedimentary rock. Stays put. Acid fizzes it away into carbon dioxide, and great heat bakes it into quicklime.

- **State:** Solid, 2,700 kg/m³
- **Bakes:** at 900 °C into quicklime, giving off carbon dioxide; there is no way back
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats limestone: acidity 0.8 beats hardness 0.4, fizzing out carbon dioxide.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Quicklime

Burnt lime, a white caustic powder and a strong base. Falls and piles. Water makes it seethe into slaked lime, hot enough to boil.

- **State:** Powder, 1,200 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,200 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Sets:** with water into slaked lime, getting very hot
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (41 interact):

- **Water:** Quicklime takes in the water and sets into slaked lime, getting very hot. Quicklime sinks through water (1,200 vs 1,000 kg/m³).
- **Oil:** Quicklime sinks through oil (1,200 vs 900 kg/m³).
- **Steam:** Quicklime falls through steam.
- **Fire:** Quicklime falls through fire.
- **Smoke:** Quicklime falls through smoke.
- **Acid:** Acid eats quicklime: acidity 0.8 beats hardness 0.3. Quicklime sinks through acid (1,200 vs 1,100 kg/m³).
- **Hydrogen:** Quicklime falls through hydrogen.
- **Oxygen:** Quicklime falls through oxygen.
- **Methane:** Quicklime falls through methane.
- **Alcohol:** Quicklime sinks through alcohol (1,200 vs 789 kg/m³).
- **Spark:** Quicklime falls through spark.
- **Petrol:** Quicklime sinks through petrol (1,200 vs 740 kg/m³).
- **Molten wax:** Quicklime sinks through molten wax (1,200 vs 800 kg/m³).
- **Vinegar:** Quicklime and vinegar neutralise each other into water, and warm up. Quicklime sinks through vinegar (1,200 vs 1,010 kg/m³). Vinegar and quicklime neutralise each other into water, and warm up.
- **Bleach:** Quicklime sinks through bleach (1,200 vs 1,100 kg/m³).
- **Lye:** Quicklime sinks through lye (1,200 vs 1,100 kg/m³).
- **Liquid nitrogen:** Quicklime sinks through liquid nitrogen (1,200 vs 808 kg/m³).
- **Nitrogen:** Quicklime falls through nitrogen.
- **Carbon dioxide:** Quicklime falls through carbon dioxide.
- **Helium:** Quicklime falls through helium.
- **Propane:** Quicklime falls through propane.
- **Chlorine:** Quicklime falls through chlorine.
- **Sulfur dioxide:** Quicklime falls through sulfur dioxide.
- **Cloud:** Quicklime falls through cloud.
- **Liquid oxygen:** Quicklime sinks through liquid oxygen (1,200 vs 1,141 kg/m³).
- **Tar:** Quicklime sinks through tar (1,200 vs 1,150 kg/m³).
- **Molten plastic:** Quicklime sinks through molten plastic (1,200 vs 900 kg/m³).
- **Napalm:** Quicklime sinks through napalm (1,200 vs 900 kg/m³).
- **Lightning:** Quicklime falls through lightning.
- **Plasma:** Quicklime falls through plasma.
- **Rocket:** Quicklime falls through rocket.
- **Ember:** Quicklime falls through ember.
- **Kerosene:** Quicklime sinks through kerosene (1,200 vs 800 kg/m³).
- **Acetone:** Quicklime sinks through acetone (1,200 vs 784 kg/m³).
- **Ammonia:** Quicklime falls through ammonia.
- **Ozone:** Quicklime falls through ozone.
- **Acetylene:** Quicklime falls through acetylene.
- **Iodine vapour:** Quicklime falls through iodine vapour.
- **Argon:** Quicklime falls through argon.
- **Bromine vapour:** Quicklime falls through bromine vapour.
- **Soda:** Quicklime sinks through soda (1,200 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Slaked lime

A soft white powder and a base. Falls and piles. It neutralises acids into water.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 140 cells/s
- **Hardness:** 0.25 (acid stronger than this eats it)

With other elements (37 interact):

- **Water:** Slaked lime sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Slaked lime sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Slaked lime falls through steam.
- **Fire:** Slaked lime falls through fire.
- **Smoke:** Slaked lime falls through smoke.
- **Acid:** Acid eats slaked lime: acidity 0.8 beats hardness 0.25.
- **Hydrogen:** Slaked lime falls through hydrogen.
- **Oxygen:** Slaked lime falls through oxygen.
- **Methane:** Slaked lime falls through methane.
- **Alcohol:** Slaked lime sinks through alcohol (1,100 vs 789 kg/m³).
- **Spark:** Slaked lime falls through spark.
- **Petrol:** Slaked lime sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Slaked lime sinks through molten wax (1,100 vs 800 kg/m³).
- **Vinegar:** Slaked lime and vinegar neutralise each other into water, and warm up. Slaked lime sinks through vinegar (1,100 vs 1,010 kg/m³). Vinegar and slaked lime neutralise each other into water, and warm up.
- **Liquid nitrogen:** Slaked lime sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Slaked lime falls through nitrogen.
- **Carbon dioxide:** Slaked lime falls through carbon dioxide.
- **Helium:** Slaked lime falls through helium.
- **Propane:** Slaked lime falls through propane.
- **Chlorine:** Slaked lime falls through chlorine.
- **Sulfur dioxide:** Slaked lime falls through sulfur dioxide.
- **Cloud:** Slaked lime falls through cloud.
- **Molten plastic:** Slaked lime sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Slaked lime sinks through napalm (1,100 vs 900 kg/m³).
- **Lightning:** Slaked lime falls through lightning.
- **Plasma:** Slaked lime falls through plasma.
- **Rocket:** Slaked lime falls through rocket.
- **Ember:** Slaked lime falls through ember.
- **Kerosene:** Slaked lime sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Slaked lime sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Slaked lime falls through ammonia.
- **Ozone:** Slaked lime falls through ozone.
- **Acetylene:** Slaked lime falls through acetylene.
- **Iodine vapour:** Slaked lime falls through iodine vapour.
- **Argon:** Slaked lime falls through argon.
- **Bromine vapour:** Slaked lime falls through bromine vapour.
- **Soda:** Slaked lime sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gold

A soft, very heavy yellow metal. Stays put. Acid cannot touch it; it carries charge and heat superbly, and melts into molten gold.

- **State:** Solid, 19,300 kg/m³
- **Melts:** at 1,064 °C, into molten gold
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (7 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt gold into molten gold.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt gold into molten gold.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt gold into molten gold.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt gold into molten gold.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt gold into molten gold.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt gold into molten gold.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten gold

Melted gold, glowing and very heavy. Flows and sinks through almost everything. Sets back into gold as it cools.

- **State:** Liquid, 17,300 kg/m³
- **Starts at:** 1,150 °C
- **In liquids:** Sinks through liquids lighter than 17,300 kg/m³
- **Falls:** up to 170 cells/s
- **Freezes:** below 1,064 °C, into gold
- **Conducts:** electric charge, warming as pulses pass

With other elements (119 interact):

- **Water:** Molten gold sinks through water (17,300 vs 1,000 kg/m³). Molten gold (1,150 °C) is hot enough to boil water into steam.
- **Oil:** Molten gold sinks through oil (17,300 vs 900 kg/m³). Molten gold (1,150 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten gold (1,150 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten gold into gold.
- **Steam:** Molten gold falls through steam.
- **Lava:** Molten gold sinks through lava (17,300 vs 2,600 kg/m³).
- **Stone:** Molten gold (1,150 °C) is hot enough to melt stone into lava.
- **Gravel:** Molten gold (1,150 °C) is hot enough to melt gravel into lava.
- **Fire:** Molten gold falls through fire.
- **Smoke:** Molten gold falls through smoke.
- **Wood:** Molten gold (1,150 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten gold sinks through acid (17,300 vs 1,100 kg/m³).
- **Hydrogen:** Molten gold falls through hydrogen. Molten gold (1,150 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Molten gold falls through oxygen.
- **Methane:** Molten gold falls through methane. Molten gold (1,150 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Molten gold sinks through alcohol (17,300 vs 789 kg/m³). Molten gold (1,150 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten gold (1,150 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten gold (1,150 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten gold (1,150 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten gold into gold.
- **TNT:** Molten gold (1,150 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten gold (1,150 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten gold sinks through nitro (17,300 vs 1,600 kg/m³). Molten gold (1,150 °C) can set nitro on fire (it ignites at 200 °C).
- **Spark:** Molten gold falls through spark.
- **Wire:** Molten gold (1,150 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Molten gold sinks through mercury (17,300 vs 13,534 kg/m³).
- **Seed:** Molten gold (1,150 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten gold (1,150 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten gold sinks through molten copper (17,300 vs 8,020 kg/m³).
- **Dry plant:** Molten gold (1,150 °C) can set dry plant on fire (it ignites at 200 °C).
- **Gold:** Molten gold (1,150 °C) is hot enough to melt gold into molten gold.
- **Aluminium:** Molten gold (1,150 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten gold sinks through molten aluminium (17,300 vs 2,375 kg/m³).
- **Lead:** Molten gold (1,150 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten gold sinks through molten lead (17,300 vs 10,660 kg/m³).
- **Coal:** Molten gold (1,150 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Molten gold (1,150 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten gold (1,150 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten gold sinks through petrol (17,300 vs 740 kg/m³). Molten gold (1,150 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten gold (1,150 °C) is hot enough to melt wax into molten wax. Molten gold (1,150 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten gold sinks through molten wax (17,300 vs 800 kg/m³). Molten gold (1,150 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten gold (1,150 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten gold (1,150 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten gold (1,150 °C) can set flour on fire (it ignites at 380 °C).
- **Thermite:** Molten gold (1,150 °C) can set thermite on fire (it ignites at 900 °C).
- **Honey:** Molten gold sinks through honey (17,300 vs 1,420 kg/m³).
- **Vinegar:** Molten gold sinks through vinegar (17,300 vs 1,010 kg/m³).
- **Bleach:** Molten gold sinks through bleach (17,300 vs 1,100 kg/m³).
- **Lye:** Molten gold sinks through lye (17,300 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten gold sinks through liquid nitrogen (17,300 vs 808 kg/m³). Molten gold (1,150 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten gold into gold.
- **Nitrogen:** Molten gold falls through nitrogen.
- **Carbon dioxide:** Molten gold falls through carbon dioxide.
- **Helium:** Molten gold falls through helium.
- **Propane:** Molten gold falls through propane. Molten gold (1,150 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Molten gold falls through chlorine.
- **Sulfur dioxide:** Molten gold falls through sulfur dioxide.
- **Dry ice:** Molten gold (1,150 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten gold into gold.
- **C4:** Molten gold (1,150 °C) can set c4 on fire (it ignites at 900 °C).
- **Grass seed:** Molten gold (1,150 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten gold (1,150 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten gold (1,150 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten gold (1,150 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten gold (1,150 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten gold (1,150 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten gold falls through cloud.
- **Magnesium:** Molten gold (1,150 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Molten gold sinks through caramel (17,300 vs 1,300 kg/m³). Molten gold (1,150 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten gold sinks through liquid oxygen (17,300 vs 1,141 kg/m³). Molten gold (1,150 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten gold into gold.
- **Molten iron:** Molten gold sinks through molten iron (17,300 vs 6,980 kg/m³).
- **Molten glass:** Molten gold sinks through molten glass (17,300 vs 2,400 kg/m³).
- **Silver:** Molten gold (1,150 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten gold sinks through molten silver (17,300 vs 9,320 kg/m³).
- **Cooked meat:** Molten gold (1,150 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten gold (1,150 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten gold sinks through tar (17,300 vs 1,150 kg/m³). Molten gold (1,150 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten gold (1,150 °C) is hot enough to melt plastic into molten plastic. Molten gold (1,150 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten gold sinks through molten plastic (17,300 vs 900 kg/m³). Molten gold (1,150 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Obsidian:** Molten gold (1,150 °C) is hot enough to melt obsidian into lava.
- **Diamond:** Molten gold (1,150 °C) can set diamond on fire (it ignites at 900 °C).
- **Napalm:** Molten gold sinks through napalm (17,300 vs 900 kg/m³). Molten gold (1,150 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten gold sinks through hydrogen peroxide (17,300 vs 1,450 kg/m³).
- **Fish:** Molten gold (1,150 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten gold (1,150 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten gold (1,150 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten gold falls through lightning.
- **Plasma:** Molten gold falls through plasma.
- **Firework:** Molten gold (1,150 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten gold falls through rocket.
- **Ember:** Molten gold falls through ember.
- **Tin:** Molten gold (1,150 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten gold sinks through molten tin (17,300 vs 6,990 kg/m³).
- **Kerosene:** Molten gold sinks through kerosene (17,300 vs 800 kg/m³). Molten gold (1,150 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten gold sinks through acetone (17,300 vs 784 kg/m³). Molten gold (1,150 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Molten gold (1,150 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten gold into gold.
- **Bee:** Molten gold (1,150 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten gold (1,150 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten gold (1,150 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten gold (1,150 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten gold (1,150 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten gold (1,150 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten gold falls through ammonia.
- **Ozone:** Molten gold falls through ozone.
- **Cotton:** Molten gold (1,150 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten gold (1,150 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten gold sinks through molten chocolate (17,300 vs 1,250 kg/m³).
- **Phosphorus:** Molten gold (1,150 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten gold falls through acetylene. Molten gold (1,150 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten gold (1,150 °C) is hot enough to turn iodine into iodine vapour.
- **Iodine vapour:** Molten gold falls through iodine vapour.
- **Argon:** Molten gold falls through argon.
- **Bromine:** Molten gold sinks through bromine (17,300 vs 3,100 kg/m³). Molten gold (1,150 °C) is hot enough to boil bromine into bromine vapour.
- **Bromine vapour:** Molten gold falls through bromine vapour.
- **Gallium:** Molten gold (1,150 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Molten gold sinks through liquid gallium (17,300 vs 6,095 kg/m³).
- **Cactus seed:** Molten gold (1,150 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten gold (1,150 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten gold (1,150 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten gold (1,150 °C) can set peat on fire (it ignites at 300 °C).
- **Basalt:** Molten gold (1,150 °C) is hot enough to melt basalt into lava.
- **Soda:** Molten gold sinks through soda (17,300 vs 1,010 kg/m³).
- **Fuse:** Molten gold (1,150 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Glass, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Meat, Popcorn kernel, Pumice, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Aluminium

A light silvery metal. Stays put. Acid eats it, giving off hydrogen, and it melts at a modest heat into molten aluminium.

- **State:** Solid, 2,700 kg/m³
- **Melts:** at 660 °C, into molten aluminium
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (13 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt aluminium into molten aluminium.
- **Fire:** Fire (850 °C) is hot enough to melt aluminium into molten aluminium.
- **Acid:** Acid eats aluminium: acidity 0.8 beats hardness 0.4, giving off hydrogen.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt aluminium into molten aluminium.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt aluminium into molten aluminium.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt aluminium into molten aluminium.
- **Rocket:** Rocket (900 °C) is hot enough to melt aluminium into molten aluminium.
- **Ember:** Ember (700 °C) is hot enough to melt aluminium into molten aluminium.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten aluminium

Melted aluminium, dull red and runny. Flows and sinks through water. Sets back into aluminium as it cools.

- **State:** Liquid, 2,375 kg/m³
- **Starts at:** 750 °C
- **In liquids:** Sinks through liquids lighter than 2,375 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Freezes:** below 660 °C, into aluminium
- **Conducts:** electric charge, warming as pulses pass

With other elements (110 interact):

- **Water:** Molten aluminium sinks through water (2,375 vs 1,000 kg/m³). Molten aluminium (750 °C) is hot enough to boil water into steam.
- **Oil:** Molten aluminium sinks through oil (2,375 vs 900 kg/m³). Molten aluminium (750 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten aluminium (750 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten aluminium into aluminium.
- **Steam:** Molten aluminium falls through steam.
- **Lava:** Lava sinks through molten aluminium (2,600 vs 2,375 kg/m³).
- **Fire:** Molten aluminium falls through fire.
- **Smoke:** Molten aluminium falls through smoke.
- **Wood:** Molten aluminium (750 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten aluminium sinks through acid (2,375 vs 1,100 kg/m³).
- **Hydrogen:** Molten aluminium falls through hydrogen. Molten aluminium (750 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Molten aluminium falls through oxygen.
- **Methane:** Molten aluminium falls through methane. Molten aluminium (750 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Molten aluminium sinks through alcohol (2,375 vs 789 kg/m³). Molten aluminium (750 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten aluminium (750 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten aluminium (750 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten aluminium (750 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten aluminium into aluminium.
- **TNT:** Molten aluminium (750 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten aluminium (750 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten aluminium sinks through nitro (2,375 vs 1,600 kg/m³). Molten aluminium (750 °C) can set nitro on fire (it ignites at 200 °C).
- **Shards:** Shards sinks through molten aluminium (2,500 vs 2,375 kg/m³).
- **Spark:** Molten aluminium falls through spark.
- **Mercury:** Mercury sinks through molten aluminium (13,534 vs 2,375 kg/m³).
- **Seed:** Molten aluminium (750 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten aluminium (750 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten copper sinks through molten aluminium (8,020 vs 2,375 kg/m³).
- **Dry plant:** Molten aluminium (750 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold sinks through molten aluminium (17,300 vs 2,375 kg/m³).
- **Aluminium:** Molten aluminium (750 °C) is hot enough to melt aluminium into molten aluminium.
- **Lead:** Molten aluminium (750 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead sinks through molten aluminium (10,660 vs 2,375 kg/m³).
- **Coal:** Molten aluminium (750 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Molten aluminium (750 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten aluminium (750 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten aluminium sinks through petrol (2,375 vs 740 kg/m³). Molten aluminium (750 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten aluminium (750 °C) is hot enough to melt wax into molten wax. Molten aluminium (750 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten aluminium sinks through molten wax (2,375 vs 800 kg/m³). Molten aluminium (750 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten aluminium (750 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten aluminium (750 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten aluminium (750 °C) can set flour on fire (it ignites at 380 °C).
- **Honey:** Molten aluminium sinks through honey (2,375 vs 1,420 kg/m³).
- **Vinegar:** Molten aluminium sinks through vinegar (2,375 vs 1,010 kg/m³).
- **Bleach:** Molten aluminium sinks through bleach (2,375 vs 1,100 kg/m³).
- **Lye:** Molten aluminium sinks through lye (2,375 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten aluminium sinks through liquid nitrogen (2,375 vs 808 kg/m³). Molten aluminium (750 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten aluminium into aluminium.
- **Nitrogen:** Molten aluminium falls through nitrogen.
- **Carbon dioxide:** Molten aluminium falls through carbon dioxide.
- **Helium:** Molten aluminium falls through helium.
- **Propane:** Molten aluminium falls through propane. Molten aluminium (750 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Molten aluminium falls through chlorine.
- **Sulfur dioxide:** Molten aluminium falls through sulfur dioxide.
- **Dry ice:** Molten aluminium (750 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten aluminium into aluminium.
- **Grass seed:** Molten aluminium (750 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten aluminium (750 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten aluminium (750 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten aluminium (750 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten aluminium (750 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten aluminium (750 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten aluminium falls through cloud.
- **Magnesium:** Molten aluminium (750 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Molten aluminium sinks through caramel (2,375 vs 1,300 kg/m³). Molten aluminium (750 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten aluminium sinks through liquid oxygen (2,375 vs 1,141 kg/m³). Molten aluminium (750 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten aluminium into aluminium.
- **Molten iron:** Molten iron sinks through molten aluminium (6,980 vs 2,375 kg/m³).
- **Molten glass:** Molten glass sinks through molten aluminium (2,400 vs 2,375 kg/m³).
- **Molten silver:** Molten silver sinks through molten aluminium (9,320 vs 2,375 kg/m³).
- **Cooked meat:** Molten aluminium (750 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten aluminium (750 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten aluminium sinks through tar (2,375 vs 1,150 kg/m³). Molten aluminium (750 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten aluminium (750 °C) is hot enough to melt plastic into molten plastic. Molten aluminium (750 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten aluminium sinks through molten plastic (2,375 vs 900 kg/m³). Molten aluminium (750 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Napalm:** Molten aluminium sinks through napalm (2,375 vs 900 kg/m³). Molten aluminium (750 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten aluminium sinks through hydrogen peroxide (2,375 vs 1,450 kg/m³).
- **Fish:** Molten aluminium (750 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten aluminium (750 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten aluminium (750 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten aluminium falls through lightning.
- **Plasma:** Molten aluminium falls through plasma.
- **Firework:** Molten aluminium (750 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten aluminium falls through rocket.
- **Ember:** Molten aluminium falls through ember.
- **Tin:** Molten aluminium (750 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin sinks through molten aluminium (6,990 vs 2,375 kg/m³).
- **Kerosene:** Molten aluminium sinks through kerosene (2,375 vs 800 kg/m³). Molten aluminium (750 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten aluminium sinks through acetone (2,375 vs 784 kg/m³). Molten aluminium (750 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Molten aluminium (750 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten aluminium into aluminium.
- **Bee:** Molten aluminium (750 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten aluminium (750 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten aluminium (750 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten aluminium (750 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten aluminium (750 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten aluminium (750 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten aluminium falls through ammonia.
- **Ozone:** Molten aluminium falls through ozone.
- **Cotton:** Molten aluminium (750 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten aluminium (750 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten aluminium sinks through molten chocolate (2,375 vs 1,250 kg/m³).
- **Phosphorus:** Molten aluminium (750 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten aluminium falls through acetylene. Molten aluminium (750 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten aluminium (750 °C) is hot enough to turn iodine into iodine vapour. Iodine sinks through molten aluminium (4,930 vs 2,375 kg/m³).
- **Iodine vapour:** Molten aluminium falls through iodine vapour.
- **Argon:** Molten aluminium falls through argon.
- **Bromine:** Molten aluminium (750 °C) is hot enough to boil bromine into bromine vapour. Bromine sinks through molten aluminium (3,100 vs 2,375 kg/m³).
- **Bromine vapour:** Molten aluminium falls through bromine vapour.
- **Gallium:** Molten aluminium (750 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through molten aluminium (6,095 vs 2,375 kg/m³).
- **Cactus seed:** Molten aluminium (750 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten aluminium (750 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten aluminium (750 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten aluminium (750 °C) can set peat on fire (it ignites at 300 °C).
- **Soda:** Molten aluminium sinks through soda (2,375 vs 1,010 kg/m³).
- **Fuse:** Molten aluminium (750 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Ash, Iron, Salt, Dirt, Glass, Wire, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Rust, Sodium, Thermite, Baking soda, C4, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Silver, Meat, Popcorn kernel, Pumice, Obsidian, Diamond, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lead

A dull, very heavy grey metal. Stays put. It melts easily into molten lead, and acid eats it slowly.

- **State:** Solid, 11,340 kg/m³
- **Melts:** at 327 °C, into molten lead
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (14 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt lead into molten lead.
- **Fire:** Fire (850 °C) is hot enough to melt lead into molten lead.
- **Acid:** Acid eats lead: acidity 0.8 beats hardness 0.6, giving off hydrogen.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt lead into molten lead.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt lead into molten lead.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead (400 °C) is hot enough to melt lead into molten lead.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt lead into molten lead.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt lead into molten lead.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt lead into molten lead.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt lead into molten lead.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt lead into molten lead.
- **Rocket:** Rocket (900 °C) is hot enough to melt lead into molten lead.
- **Ember:** Ember (700 °C) is hot enough to melt lead into molten lead.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten lead

Melted lead, hot and very heavy. Flows and sinks through almost everything. Sets back into lead as it cools.

- **State:** Liquid, 10,660 kg/m³
- **Starts at:** 400 °C
- **In liquids:** Sinks through liquids lighter than 10,660 kg/m³, floats on heavier ones
- **Falls:** up to 170 cells/s
- **Freezes:** below 327 °C, into lead
- **Conducts:** electric charge, warming as pulses pass

With other elements (106 interact):

- **Water:** Molten lead sinks through water (10,660 vs 1,000 kg/m³). Molten lead (400 °C) is hot enough to boil water into steam.
- **Oil:** Molten lead sinks through oil (10,660 vs 900 kg/m³). Molten lead (400 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten lead (400 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten lead into lead.
- **Steam:** Molten lead falls through steam.
- **Lava:** Molten lead sinks through lava (10,660 vs 2,600 kg/m³).
- **Fire:** Molten lead falls through fire.
- **Smoke:** Molten lead falls through smoke.
- **Wood:** Molten lead (400 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten lead sinks through acid (10,660 vs 1,100 kg/m³).
- **Hydrogen:** Molten lead falls through hydrogen.
- **Oxygen:** Molten lead falls through oxygen.
- **Methane:** Molten lead falls through methane.
- **Alcohol:** Molten lead sinks through alcohol (10,660 vs 789 kg/m³). Molten lead (400 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten lead (400 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten lead (400 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten lead (400 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten lead into lead.
- **TNT:** Molten lead (400 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten lead (400 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten lead sinks through nitro (10,660 vs 1,600 kg/m³). Molten lead (400 °C) can set nitro on fire (it ignites at 200 °C).
- **Spark:** Molten lead falls through spark.
- **Mercury:** Mercury sinks through molten lead (13,534 vs 10,660 kg/m³).
- **Seed:** Molten lead (400 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten lead (400 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten lead sinks through molten copper (10,660 vs 8,020 kg/m³).
- **Dry plant:** Molten lead (400 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold sinks through molten lead (17,300 vs 10,660 kg/m³).
- **Molten aluminium:** Molten lead sinks through molten aluminium (10,660 vs 2,375 kg/m³).
- **Lead:** Molten lead (400 °C) is hot enough to melt lead into molten lead.
- **Charcoal:** Molten lead (400 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten lead (400 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten lead sinks through petrol (10,660 vs 740 kg/m³). Molten lead (400 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten lead (400 °C) is hot enough to melt wax into molten wax. Molten lead (400 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten lead sinks through molten wax (10,660 vs 800 kg/m³). Molten lead (400 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten lead (400 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten lead (400 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten lead (400 °C) can set flour on fire (it ignites at 380 °C).
- **Honey:** Molten lead sinks through honey (10,660 vs 1,420 kg/m³).
- **Vinegar:** Molten lead sinks through vinegar (10,660 vs 1,010 kg/m³).
- **Bleach:** Molten lead sinks through bleach (10,660 vs 1,100 kg/m³).
- **Lye:** Molten lead sinks through lye (10,660 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten lead sinks through liquid nitrogen (10,660 vs 808 kg/m³). Molten lead (400 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten lead into lead.
- **Nitrogen:** Molten lead falls through nitrogen.
- **Carbon dioxide:** Molten lead falls through carbon dioxide.
- **Helium:** Molten lead falls through helium.
- **Propane:** Molten lead falls through propane.
- **Chlorine:** Molten lead falls through chlorine.
- **Sulfur dioxide:** Molten lead falls through sulfur dioxide.
- **Dry ice:** Molten lead (400 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten lead into lead.
- **Grass seed:** Molten lead (400 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten lead (400 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten lead (400 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten lead (400 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten lead (400 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten lead (400 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten lead falls through cloud.
- **Caramel:** Molten lead sinks through caramel (10,660 vs 1,300 kg/m³). Molten lead (400 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten lead sinks through liquid oxygen (10,660 vs 1,141 kg/m³). Molten lead (400 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten lead into lead.
- **Molten iron:** Molten lead sinks through molten iron (10,660 vs 6,980 kg/m³).
- **Molten glass:** Molten lead sinks through molten glass (10,660 vs 2,400 kg/m³).
- **Molten silver:** Molten lead sinks through molten silver (10,660 vs 9,320 kg/m³).
- **Cooked meat:** Molten lead (400 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten lead (400 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten lead sinks through tar (10,660 vs 1,150 kg/m³). Molten lead (400 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten lead (400 °C) is hot enough to melt plastic into molten plastic. Molten lead (400 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten lead sinks through molten plastic (10,660 vs 900 kg/m³). Molten lead (400 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Napalm:** Molten lead sinks through napalm (10,660 vs 900 kg/m³). Molten lead (400 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten lead sinks through hydrogen peroxide (10,660 vs 1,450 kg/m³).
- **Fish:** Molten lead (400 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten lead (400 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten lead (400 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten lead falls through lightning.
- **Plasma:** Molten lead falls through plasma.
- **Firework:** Molten lead (400 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten lead falls through rocket.
- **Ember:** Molten lead falls through ember.
- **Tin:** Molten lead (400 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten lead sinks through molten tin (10,660 vs 6,990 kg/m³).
- **Kerosene:** Molten lead sinks through kerosene (10,660 vs 800 kg/m³). Molten lead (400 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten lead sinks through acetone (10,660 vs 784 kg/m³).
- **Hail:** Molten lead (400 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten lead into lead.
- **Bee:** Molten lead (400 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten lead (400 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten lead (400 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten lead (400 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten lead (400 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten lead (400 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten lead falls through ammonia.
- **Ozone:** Molten lead falls through ozone.
- **Cotton:** Molten lead (400 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten lead (400 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten lead sinks through molten chocolate (10,660 vs 1,250 kg/m³).
- **Phosphorus:** Molten lead (400 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten lead falls through acetylene. Molten lead (400 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten lead (400 °C) is hot enough to turn iodine into iodine vapour.
- **Iodine vapour:** Molten lead falls through iodine vapour.
- **Argon:** Molten lead falls through argon.
- **Bromine:** Molten lead sinks through bromine (10,660 vs 3,100 kg/m³). Molten lead (400 °C) is hot enough to boil bromine into bromine vapour.
- **Bromine vapour:** Molten lead falls through bromine vapour.
- **Gallium:** Molten lead (400 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Molten lead sinks through liquid gallium (10,660 vs 6,095 kg/m³).
- **Cactus seed:** Molten lead (400 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten lead (400 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten lead (400 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten lead (400 °C) can set peat on fire (it ignites at 300 °C).
- **Soda:** Molten lead sinks through soda (10,660 vs 1,010 kg/m³).
- **Fuse:** Molten lead (400 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Ash, Iron, Salt, Dirt, Glass, Shards, Wire, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Rust, Sodium, Coal, Thermite, Baking soda, C4, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Popcorn kernel, Pumice, Obsidian, Diamond, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Rust

Flaky red iron oxide, a powder. Falls and piles. It forms where water or oxygen slowly eats at iron.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (46 interact):

- **Water:** Rust sinks through water (2,000 vs 1,000 kg/m³).
- **Oil:** Rust sinks through oil (2,000 vs 900 kg/m³).
- **Steam:** Rust falls through steam.
- **Fire:** Rust falls through fire.
- **Smoke:** Rust falls through smoke.
- **Acid:** Acid eats rust: acidity 0.8 beats hardness 0.3. Rust sinks through acid (2,000 vs 1,100 kg/m³).
- **Hydrogen:** Rust falls through hydrogen.
- **Oxygen:** Rust falls through oxygen.
- **Methane:** Rust falls through methane.
- **Alcohol:** Rust sinks through alcohol (2,000 vs 789 kg/m³).
- **Nitro:** Rust sinks through nitro (2,000 vs 1,600 kg/m³).
- **Spark:** Rust falls through spark.
- **Petrol:** Rust sinks through petrol (2,000 vs 740 kg/m³).
- **Molten wax:** Rust sinks through molten wax (2,000 vs 800 kg/m³).
- **Honey:** Rust sinks through honey (2,000 vs 1,420 kg/m³).
- **Vinegar:** Rust sinks through vinegar (2,000 vs 1,010 kg/m³).
- **Bleach:** Rust sinks through bleach (2,000 vs 1,100 kg/m³).
- **Lye:** Rust sinks through lye (2,000 vs 1,100 kg/m³).
- **Liquid nitrogen:** Rust sinks through liquid nitrogen (2,000 vs 808 kg/m³).
- **Nitrogen:** Rust falls through nitrogen.
- **Carbon dioxide:** Rust falls through carbon dioxide.
- **Helium:** Rust falls through helium.
- **Propane:** Rust falls through propane.
- **Chlorine:** Rust falls through chlorine.
- **Sulfur dioxide:** Rust falls through sulfur dioxide.
- **Cloud:** Rust falls through cloud.
- **Caramel:** Rust sinks through caramel (2,000 vs 1,300 kg/m³).
- **Liquid oxygen:** Rust sinks through liquid oxygen (2,000 vs 1,141 kg/m³).
- **Tar:** Rust sinks through tar (2,000 vs 1,150 kg/m³).
- **Molten plastic:** Rust sinks through molten plastic (2,000 vs 900 kg/m³).
- **Napalm:** Rust sinks through napalm (2,000 vs 900 kg/m³).
- **Hydrogen peroxide:** Rust sinks through hydrogen peroxide (2,000 vs 1,450 kg/m³). Rust speeds up peroxide breaking down: it fizzes into oxygen.
- **Lightning:** Rust falls through lightning.
- **Plasma:** Rust falls through plasma.
- **Rocket:** Rust falls through rocket.
- **Ember:** Rust falls through ember.
- **Kerosene:** Rust sinks through kerosene (2,000 vs 800 kg/m³).
- **Acetone:** Rust sinks through acetone (2,000 vs 784 kg/m³).
- **Ammonia:** Rust falls through ammonia.
- **Ozone:** Rust falls through ozone.
- **Molten chocolate:** Rust sinks through molten chocolate (2,000 vs 1,250 kg/m³).
- **Acetylene:** Rust falls through acetylene.
- **Iodine vapour:** Rust falls through iodine vapour.
- **Argon:** Rust falls through argon.
- **Bromine vapour:** Rust falls through bromine vapour.
- **Soda:** Rust sinks through soda (2,000 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sodium

A soft, light silvery metal. Stays put. Water touching it makes it fizz violently into lye and burning hydrogen.

- **State:** Solid, 968 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Sodium reacts violently with water: it becomes lye and hydrogen, hot enough to set the hydrogen alight.
- **Acid:** Acid eats sodium: acidity 0.8 beats hardness 0.1, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Coal

Black lumps of fossil fuel, a heavy powder. Falls and piles. Hard to light, but once going it burns hot for a very long time.

- **State:** Powder, 1,350 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,350 kg/m³, rests on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 450 °C in air, 15 s per cell, leaves ash
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (53 interact):

- **Air:** Coal burns: it catches fire at 450 °C next to air (oxidiser 0.21).
- **Water:** Coal sinks through water (1,350 vs 1,000 kg/m³).
- **Oil:** Coal sinks through oil (1,350 vs 900 kg/m³).
- **Steam:** Coal falls through steam.
- **Lava:** Lava (1,200 °C) can set coal on fire (it ignites at 450 °C).
- **Fire:** Coal catches from the flame touching it. Coal falls through fire.
- **Smoke:** Coal falls through smoke.
- **Acid:** Coal sinks through acid (1,350 vs 1,100 kg/m³).
- **Hydrogen:** Coal falls through hydrogen.
- **Oxygen:** Coal burns: it catches fire at 450 °C next to oxygen (oxidiser 1). Coal falls through oxygen. Oxygen makes burning coal hotter and faster.
- **Methane:** Coal falls through methane.
- **Alcohol:** Coal sinks through alcohol (1,350 vs 789 kg/m³).
- **Spark:** Coal catches from the flame touching it. Coal falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set coal on fire (it ignites at 450 °C).
- **Molten gold:** Molten gold (1,150 °C) can set coal on fire (it ignites at 450 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set coal on fire (it ignites at 450 °C).
- **Petrol:** Coal sinks through petrol (1,350 vs 740 kg/m³).
- **Molten wax:** Coal sinks through molten wax (1,350 vs 800 kg/m³).
- **Vinegar:** Coal sinks through vinegar (1,350 vs 1,010 kg/m³).
- **Bleach:** Coal sinks through bleach (1,350 vs 1,100 kg/m³).
- **Lye:** Coal sinks through lye (1,350 vs 1,100 kg/m³).
- **Liquid nitrogen:** Coal sinks through liquid nitrogen (1,350 vs 808 kg/m³).
- **Nitrogen:** Coal falls through nitrogen.
- **Carbon dioxide:** Coal falls through carbon dioxide.
- **Helium:** Coal falls through helium.
- **Propane:** Coal falls through propane.
- **Chlorine:** Coal falls through chlorine.
- **Sulfur dioxide:** Coal falls through sulfur dioxide.
- **Cloud:** Coal falls through cloud.
- **Caramel:** Coal sinks through caramel (1,350 vs 1,300 kg/m³).
- **Liquid oxygen:** Coal burns: it catches fire at 450 °C next to liquid oxygen (oxidiser 1). Coal sinks through liquid oxygen (1,350 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set coal on fire (it ignites at 450 °C).
- **Molten glass:** Molten glass (1,450 °C) can set coal on fire (it ignites at 450 °C).
- **Molten silver:** Molten silver (1,000 °C) can set coal on fire (it ignites at 450 °C).
- **Tar:** Coal sinks through tar (1,350 vs 1,150 kg/m³).
- **Molten plastic:** Coal sinks through molten plastic (1,350 vs 900 kg/m³).
- **Napalm:** Coal sinks through napalm (1,350 vs 900 kg/m³).
- **Hydrogen peroxide:** Coal burns: it catches fire at 450 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning coal hotter and faster.
- **Lightning:** Coal catches from the flame touching it. Coal falls through lightning.
- **Plasma:** Coal catches from the flame touching it. Coal falls through plasma.
- **Rocket:** Coal catches from the flame touching it. Coal falls through rocket.
- **Ember:** Coal catches from the flame touching it. Coal falls through ember.
- **Saltpeter:** Coal burns: it catches fire at 450 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning coal hotter and faster.
- **Kerosene:** Coal sinks through kerosene (1,350 vs 800 kg/m³).
- **Acetone:** Coal sinks through acetone (1,350 vs 784 kg/m³).
- **Ammonia:** Coal falls through ammonia.
- **Ozone:** Coal burns: it catches fire at 450 °C next to ozone (oxidiser 1). Coal falls through ozone. Ozone makes burning coal hotter and faster.
- **Molten chocolate:** Coal sinks through molten chocolate (1,350 vs 1,250 kg/m³).
- **Acetylene:** Coal falls through acetylene.
- **Iodine vapour:** Coal falls through iodine vapour.
- **Argon:** Coal falls through argon.
- **Bromine vapour:** Coal falls through bromine vapour.
- **Soda:** Coal sinks through soda (1,350 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Molten lead, Rust, Sodium, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Charcoal

Charred wood, a light black powder. Falls and piles. It catches more easily than coal and glows hot for a long time.

- **State:** Powder, 400 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 100 cells/s
- **Burns:** from 350 °C in air, 8.33 s per cell, leaves ash
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (36 interact):

- **Air:** Charcoal burns: it catches fire at 350 °C next to air (oxidiser 0.21).
- **Steam:** Charcoal falls through steam.
- **Lava:** Lava (1,200 °C) can set charcoal on fire (it ignites at 350 °C).
- **Fire:** Charcoal catches from the flame touching it. Charcoal falls through fire.
- **Smoke:** Charcoal falls through smoke.
- **Hydrogen:** Charcoal falls through hydrogen.
- **Oxygen:** Charcoal burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Charcoal falls through oxygen. Oxygen makes burning charcoal hotter and faster.
- **Methane:** Charcoal falls through methane.
- **Spark:** Charcoal catches from the flame touching it. Charcoal falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set charcoal on fire (it ignites at 350 °C).
- **Molten gold:** Molten gold (1,150 °C) can set charcoal on fire (it ignites at 350 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set charcoal on fire (it ignites at 350 °C).
- **Molten lead:** Molten lead (400 °C) can set charcoal on fire (it ignites at 350 °C).
- **Nitrogen:** Charcoal falls through nitrogen.
- **Carbon dioxide:** Charcoal falls through carbon dioxide.
- **Helium:** Charcoal falls through helium.
- **Propane:** Charcoal falls through propane.
- **Chlorine:** Charcoal falls through chlorine.
- **Sulfur dioxide:** Charcoal falls through sulfur dioxide.
- **Cloud:** Charcoal falls through cloud.
- **Liquid oxygen:** Charcoal burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set charcoal on fire (it ignites at 350 °C).
- **Molten glass:** Molten glass (1,450 °C) can set charcoal on fire (it ignites at 350 °C).
- **Molten silver:** Molten silver (1,000 °C) can set charcoal on fire (it ignites at 350 °C).
- **Hydrogen peroxide:** Charcoal burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning charcoal hotter and faster.
- **Lightning:** Charcoal catches from the flame touching it. Charcoal falls through lightning.
- **Plasma:** Charcoal catches from the flame touching it. Charcoal falls through plasma.
- **Rocket:** Charcoal catches from the flame touching it. Charcoal falls through rocket.
- **Ember:** Charcoal catches from the flame touching it. Charcoal falls through ember.
- **Saltpeter:** Charcoal burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning charcoal hotter and faster.
- **Ammonia:** Charcoal falls through ammonia.
- **Ozone:** Charcoal burns: it catches fire at 350 °C next to ozone (oxidiser 1). Charcoal falls through ozone. Ozone makes burning charcoal hotter and faster.
- **Acetylene:** Charcoal falls through acetylene.
- **Iodine vapour:** Charcoal falls through iodine vapour.
- **Argon:** Charcoal falls through argon.
- **Bromine vapour:** Charcoal falls through bromine vapour.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sulfur

Yellow crystals, a powder. Falls and piles. It burns with a blue flame into choking sulfur dioxide.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Burns:** from 232 °C in air, 1.5 s per cell, leaves sulfur dioxide
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (57 interact):

- **Air:** Sulfur burns: it catches fire at 232 °C next to air (oxidiser 0.21).
- **Water:** Sulfur sinks through water (2,000 vs 1,000 kg/m³).
- **Oil:** Sulfur sinks through oil (2,000 vs 900 kg/m³).
- **Steam:** Sulfur falls through steam.
- **Lava:** Lava (1,200 °C) can set sulfur on fire (it ignites at 232 °C).
- **Fire:** Sulfur catches from the flame touching it. Sulfur falls through fire.
- **Smoke:** Sulfur falls through smoke.
- **Acid:** Sulfur sinks through acid (2,000 vs 1,100 kg/m³).
- **Hydrogen:** Sulfur falls through hydrogen.
- **Oxygen:** Sulfur burns: it catches fire at 232 °C next to oxygen (oxidiser 1). Sulfur falls through oxygen. Oxygen makes burning sulfur hotter and faster.
- **Methane:** Sulfur falls through methane.
- **Alcohol:** Sulfur sinks through alcohol (2,000 vs 789 kg/m³).
- **Nitro:** Sulfur sinks through nitro (2,000 vs 1,600 kg/m³).
- **Spark:** Sulfur catches from the flame touching it. Sulfur falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set sulfur on fire (it ignites at 232 °C).
- **Molten gold:** Molten gold (1,150 °C) can set sulfur on fire (it ignites at 232 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set sulfur on fire (it ignites at 232 °C).
- **Molten lead:** Molten lead (400 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Sulfur sinks through petrol (2,000 vs 740 kg/m³).
- **Molten wax:** Sulfur sinks through molten wax (2,000 vs 800 kg/m³).
- **Honey:** Sulfur sinks through honey (2,000 vs 1,420 kg/m³).
- **Vinegar:** Sulfur sinks through vinegar (2,000 vs 1,010 kg/m³).
- **Bleach:** Sulfur sinks through bleach (2,000 vs 1,100 kg/m³).
- **Lye:** Sulfur sinks through lye (2,000 vs 1,100 kg/m³).
- **Liquid nitrogen:** Sulfur sinks through liquid nitrogen (2,000 vs 808 kg/m³).
- **Nitrogen:** Sulfur falls through nitrogen.
- **Carbon dioxide:** Sulfur falls through carbon dioxide.
- **Helium:** Sulfur falls through helium.
- **Propane:** Sulfur falls through propane.
- **Chlorine:** Sulfur falls through chlorine.
- **Sulfur dioxide:** Sulfur falls through sulfur dioxide.
- **Cloud:** Sulfur falls through cloud.
- **Caramel:** Sulfur sinks through caramel (2,000 vs 1,300 kg/m³).
- **Liquid oxygen:** Sulfur burns: it catches fire at 232 °C next to liquid oxygen (oxidiser 1). Sulfur sinks through liquid oxygen (2,000 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set sulfur on fire (it ignites at 232 °C).
- **Molten glass:** Molten glass (1,450 °C) can set sulfur on fire (it ignites at 232 °C).
- **Molten silver:** Molten silver (1,000 °C) can set sulfur on fire (it ignites at 232 °C).
- **Tar:** Sulfur sinks through tar (2,000 vs 1,150 kg/m³).
- **Molten plastic:** Sulfur sinks through molten plastic (2,000 vs 900 kg/m³).
- **Napalm:** Sulfur sinks through napalm (2,000 vs 900 kg/m³).
- **Hydrogen peroxide:** Sulfur burns: it catches fire at 232 °C next to hydrogen peroxide (oxidiser 0.8). Sulfur sinks through hydrogen peroxide (2,000 vs 1,450 kg/m³). Hydrogen peroxide makes burning sulfur hotter and faster.
- **Lightning:** Sulfur catches from the flame touching it. Sulfur falls through lightning.
- **Plasma:** Sulfur catches from the flame touching it. Sulfur falls through plasma.
- **Rocket:** Sulfur catches from the flame touching it. Sulfur falls through rocket.
- **Ember:** Sulfur catches from the flame touching it. Sulfur falls through ember.
- **Saltpeter:** Sulfur burns: it catches fire at 232 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning sulfur hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set sulfur on fire (it ignites at 232 °C).
- **Kerosene:** Sulfur sinks through kerosene (2,000 vs 800 kg/m³).
- **Acetone:** Sulfur sinks through acetone (2,000 vs 784 kg/m³).
- **Ammonia:** Sulfur falls through ammonia.
- **Ozone:** Sulfur burns: it catches fire at 232 °C next to ozone (oxidiser 1). Sulfur falls through ozone. Ozone makes burning sulfur hotter and faster.
- **Molten chocolate:** Sulfur sinks through molten chocolate (2,000 vs 1,250 kg/m³).
- **Acetylene:** Sulfur falls through acetylene.
- **Iodine vapour:** Sulfur falls through iodine vapour.
- **Argon:** Sulfur falls through argon.
- **Bromine vapour:** Sulfur falls through bromine vapour.
- **Soda:** Sulfur sinks through soda (2,000 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Petrol

A thin, volatile fuel. Flows freely and floats on water. Its vapour catches from the smallest flame, so a pool goes up at once.

- **State:** Liquid, 740 kg/m³
- **In liquids:** Floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 280 °C in air, 1 s per cell
- **Flash point:** -43 °C: above it, flames spread across it

With other elements (87 interact):

- **Air:** Petrol burns: it catches fire at 280 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through petrol (1,600 vs 740 kg/m³).
- **Water:** Water sinks through petrol (1,000 vs 740 kg/m³).
- **Oil:** Oil sinks through petrol (900 vs 740 kg/m³).
- **Steam:** Petrol falls through steam.
- **Lava:** Lava sinks through petrol (2,600 vs 740 kg/m³). Lava (1,200 °C) can set petrol on fire (it ignites at 280 °C).
- **Gravel:** Gravel sinks through petrol (2,000 vs 740 kg/m³).
- **Fire:** Petrol catches from the flame touching it. Petrol falls through fire.
- **Smoke:** Petrol falls through smoke.
- **Acid:** Acid sinks through petrol (1,100 vs 740 kg/m³).
- **Hydrogen:** Petrol falls through hydrogen.
- **Oxygen:** Petrol burns: it catches fire at 280 °C next to oxygen (oxidiser 1). Petrol falls through oxygen. Oxygen makes burning petrol hotter and faster.
- **Methane:** Petrol falls through methane.
- **Alcohol:** Alcohol sinks through petrol (789 vs 740 kg/m³).
- **Salt:** Salt sinks through petrol (2,160 vs 740 kg/m³).
- **Sugar:** Sugar sinks through petrol (1,590 vs 740 kg/m³).
- **Dirt:** Dirt sinks through petrol (1,500 vs 740 kg/m³).
- **Gunpowder:** Gunpowder sinks through petrol (1,700 vs 740 kg/m³).
- **Nitro:** Nitro sinks through petrol (1,600 vs 740 kg/m³).
- **Shards:** Shards sinks through petrol (2,500 vs 740 kg/m³).
- **Spark:** Petrol catches from the flame touching it. Petrol falls through spark.
- **Mercury:** Mercury sinks through petrol (13,534 vs 740 kg/m³).
- **Seed:** Seed sinks through petrol (1,100 vs 740 kg/m³).
- **Molten copper:** Molten copper sinks through petrol (8,020 vs 740 kg/m³). Molten copper (1,200 °C) can set petrol on fire (it ignites at 280 °C).
- **Clay:** Clay sinks through petrol (1,700 vs 740 kg/m³).
- **Cement:** Cement sinks through petrol (1,440 vs 740 kg/m³).
- **Quicklime:** Quicklime sinks through petrol (1,200 vs 740 kg/m³).
- **Slaked lime:** Slaked lime sinks through petrol (1,100 vs 740 kg/m³).
- **Molten gold:** Molten gold sinks through petrol (17,300 vs 740 kg/m³). Molten gold (1,150 °C) can set petrol on fire (it ignites at 280 °C).
- **Molten aluminium:** Molten aluminium sinks through petrol (2,375 vs 740 kg/m³). Molten aluminium (750 °C) can set petrol on fire (it ignites at 280 °C).
- **Molten lead:** Molten lead sinks through petrol (10,660 vs 740 kg/m³). Molten lead (400 °C) can set petrol on fire (it ignites at 280 °C).
- **Rust:** Rust sinks through petrol (2,000 vs 740 kg/m³).
- **Coal:** Coal sinks through petrol (1,350 vs 740 kg/m³).
- **Sulfur:** Sulfur sinks through petrol (2,000 vs 740 kg/m³).
- **Molten wax:** Molten wax sinks through petrol (800 vs 740 kg/m³).
- **Thermite:** Thermite sinks through petrol (1,500 vs 740 kg/m³).
- **Honey:** Honey sinks through petrol (1,420 vs 740 kg/m³).
- **Vinegar:** Vinegar sinks through petrol (1,010 vs 740 kg/m³).
- **Bleach:** Bleach sinks through petrol (1,100 vs 740 kg/m³).
- **Lye:** Lye sinks through petrol (1,100 vs 740 kg/m³).
- **Liquid nitrogen:** Liquid nitrogen sinks through petrol (808 vs 740 kg/m³).
- **Nitrogen:** Petrol falls through nitrogen.
- **Carbon dioxide:** Petrol falls through carbon dioxide.
- **Helium:** Petrol falls through helium.
- **Propane:** Petrol falls through propane.
- **Chlorine:** Petrol falls through chlorine.
- **Sulfur dioxide:** Petrol falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through petrol (1,100 vs 740 kg/m³).
- **Grass seed:** Grass seed sinks through petrol (1,100 vs 740 kg/m³).
- **Acorn:** Acorn sinks through petrol (1,100 vs 740 kg/m³).
- **Cloud:** Petrol falls through cloud.
- **Caramel:** Caramel sinks through petrol (1,300 vs 740 kg/m³).
- **Chalk:** Chalk sinks through petrol (1,500 vs 740 kg/m³).
- **Liquid oxygen:** Petrol burns: it catches fire at 280 °C next to liquid oxygen (oxidiser 1). Liquid oxygen sinks through petrol (1,141 vs 740 kg/m³).
- **Molten iron:** Molten iron sinks through petrol (6,980 vs 740 kg/m³). Molten iron (1,600 °C) can set petrol on fire (it ignites at 280 °C).
- **Molten glass:** Molten glass sinks through petrol (2,400 vs 740 kg/m³). Molten glass (1,450 °C) can set petrol on fire (it ignites at 280 °C).
- **Molten silver:** Molten silver sinks through petrol (9,320 vs 740 kg/m³). Molten silver (1,000 °C) can set petrol on fire (it ignites at 280 °C).
- **Popcorn kernel:** Popcorn kernel sinks through petrol (1,200 vs 740 kg/m³).
- **Tar:** Tar sinks through petrol (1,150 vs 740 kg/m³).
- **Molten plastic:** Molten plastic sinks through petrol (900 vs 740 kg/m³).
- **Napalm:** Napalm sinks through petrol (900 vs 740 kg/m³).
- **Hydrogen peroxide:** Petrol burns: it catches fire at 280 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through petrol (1,450 vs 740 kg/m³). Hydrogen peroxide makes burning petrol hotter and faster.
- **Lightning:** Petrol catches from the flame touching it. Petrol falls through lightning.
- **Plasma:** Petrol catches from the flame touching it. Petrol falls through plasma.
- **Firework:** Firework sinks through petrol (1,400 vs 740 kg/m³).
- **Rocket:** Petrol catches from the flame touching it. Petrol falls through rocket.
- **Ember:** Petrol catches from the flame touching it. Petrol falls through ember.
- **Saltpeter:** Petrol burns: it catches fire at 280 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through petrol (2,100 vs 740 kg/m³). Saltpeter makes burning petrol hotter and faster.
- **Molten tin:** Molten tin sinks through petrol (6,990 vs 740 kg/m³).
- **Kerosene:** Kerosene sinks through petrol (800 vs 740 kg/m³).
- **Acetone:** Acetone sinks through petrol (784 vs 740 kg/m³).
- **Hail:** Hail sinks through petrol (900 vs 740 kg/m³).
- **Ammonia:** Petrol falls through ammonia.
- **Ozone:** Petrol burns: it catches fire at 280 °C next to ozone (oxidiser 1). Petrol falls through ozone. Ozone makes burning petrol hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through petrol (1,250 vs 740 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through petrol (2,220 vs 740 kg/m³).
- **Acetylene:** Petrol falls through acetylene.
- **Iodine:** Iodine sinks through petrol (4,930 vs 740 kg/m³).
- **Iodine vapour:** Petrol falls through iodine vapour.
- **Argon:** Petrol falls through argon.
- **Bromine:** Bromine sinks through petrol (3,100 vs 740 kg/m³).
- **Bromine vapour:** Petrol falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through petrol (6,095 vs 740 kg/m³).
- **Cactus seed:** Cactus seed sinks through petrol (1,100 vs 740 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through petrol (1,200 vs 740 kg/m³).
- **Peat:** Peat sinks through petrol (900 vs 740 kg/m³).
- **Soda:** Soda sinks through petrol (1,010 vs 740 kg/m³).

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wax

Soft, pale wax. Stays put. It melts at a gentle heat into molten wax and burns slowly, like a candle.

- **State:** Solid, 900 kg/m³
- **Melts:** at 60 °C, into molten wax
- **Burns:** from 300 °C in air, 5 s per cell
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (29 interact):

- **Air:** Wax burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Steam:** Steam (150 °C) is hot enough to melt wax into molten wax.
- **Lava:** Lava (1,200 °C) is hot enough to melt wax into molten wax. Lava (1,200 °C) can set wax on fire (it ignites at 300 °C).
- **Fire:** Wax catches from the flame touching it. Fire (850 °C) is hot enough to melt wax into molten wax.
- **Smoke:** Smoke (150 °C) is hot enough to melt wax into molten wax.
- **Acid:** Acid eats wax: acidity 0.8 beats hardness 0.2.
- **Oxygen:** Wax burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning wax hotter and faster.
- **Spark:** Wax catches from the flame touching it. Spark (300 °C) is hot enough to melt wax into molten wax.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt wax into molten wax. Molten copper (1,200 °C) can set wax on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt wax into molten wax. Molten gold (1,150 °C) can set wax on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt wax into molten wax. Molten aluminium (750 °C) can set wax on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) is hot enough to melt wax into molten wax. Molten lead (400 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten wax (80 °C) is hot enough to melt wax into molten wax.
- **Caramel:** Caramel (190 °C) is hot enough to melt wax into molten wax.
- **Liquid oxygen:** Wax burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt wax into molten wax. Molten iron (1,600 °C) can set wax on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt wax into molten wax. Molten glass (1,450 °C) can set wax on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt wax into molten wax. Molten silver (1,000 °C) can set wax on fire (it ignites at 300 °C).
- **Molten plastic:** Molten plastic (200 °C) is hot enough to melt wax into molten wax.
- **Hydrogen peroxide:** Wax burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning wax hotter and faster.
- **Lightning:** Wax catches from the flame touching it. Lightning (3,000 °C) is hot enough to melt wax into molten wax.
- **Plasma:** Wax catches from the flame touching it. Plasma (3,000 °C) is hot enough to melt wax into molten wax.
- **Rocket:** Wax catches from the flame touching it. Rocket (900 °C) is hot enough to melt wax into molten wax.
- **Ember:** Wax catches from the flame touching it. Ember (700 °C) is hot enough to melt wax into molten wax.
- **Saltpeter:** Wax burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning wax hotter and faster.
- **Molten tin:** Molten tin (260 °C) is hot enough to melt wax into molten wax.
- **Ozone:** Wax burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning wax hotter and faster.
- **Iodine vapour:** Iodine vapour (130 °C) is hot enough to melt wax into molten wax.
- **Bromine vapour:** Bromine vapour (70 °C) is hot enough to melt wax into molten wax.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Titanium, Platinum, Argon, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten wax

Melted wax, warm and runny. Flows and floats on water. It sets back into wax as it cools, and burns once it gets hot.

- **State:** Liquid, 800 kg/m³
- **Starts at:** 80 °C
- **In liquids:** Sinks through liquids lighter than 800 kg/m³, floats on heavier ones
- **Falls:** up to 120 cells/s
- **Freezes:** below 60 °C, into wax
- **Burns:** from 300 °C in air, 3.33 s per cell
- **Flash point:** 200 °C: above it, flames spread across it

With other elements (93 interact):

- **Air:** Molten wax burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through molten wax (1,600 vs 800 kg/m³).
- **Water:** Water sinks through molten wax (1,000 vs 800 kg/m³).
- **Oil:** Oil sinks through molten wax (900 vs 800 kg/m³).
- **Ice:** Molten wax (80 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten wax into wax.
- **Steam:** Molten wax falls through steam.
- **Lava:** Lava sinks through molten wax (2,600 vs 800 kg/m³). Lava (1,200 °C) can set molten wax on fire (it ignites at 300 °C).
- **Gravel:** Gravel sinks through molten wax (2,000 vs 800 kg/m³).
- **Fire:** Molten wax catches from the flame touching it. Molten wax falls through fire.
- **Smoke:** Molten wax falls through smoke.
- **Acid:** Acid sinks through molten wax (1,100 vs 800 kg/m³).
- **Hydrogen:** Molten wax falls through hydrogen.
- **Oxygen:** Molten wax burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Molten wax falls through oxygen. Oxygen makes burning molten wax hotter and faster.
- **Methane:** Molten wax falls through methane.
- **Alcohol:** Molten wax sinks through alcohol (800 vs 789 kg/m³).
- **Salt:** Salt sinks through molten wax (2,160 vs 800 kg/m³).
- **Sugar:** Sugar sinks through molten wax (1,590 vs 800 kg/m³).
- **Dirt:** Dirt sinks through molten wax (1,500 vs 800 kg/m³).
- **Snow:** Molten wax (80 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten wax into wax.
- **Gunpowder:** Gunpowder sinks through molten wax (1,700 vs 800 kg/m³).
- **Nitro:** Nitro sinks through molten wax (1,600 vs 800 kg/m³).
- **Shards:** Shards sinks through molten wax (2,500 vs 800 kg/m³).
- **Spark:** Molten wax catches from the flame touching it. Molten wax falls through spark.
- **Mercury:** Mercury sinks through molten wax (13,534 vs 800 kg/m³).
- **Seed:** Seed sinks through molten wax (1,100 vs 800 kg/m³).
- **Molten copper:** Molten copper sinks through molten wax (8,020 vs 800 kg/m³). Molten copper (1,200 °C) can set molten wax on fire (it ignites at 300 °C).
- **Clay:** Clay sinks through molten wax (1,700 vs 800 kg/m³).
- **Cement:** Cement sinks through molten wax (1,440 vs 800 kg/m³).
- **Quicklime:** Quicklime sinks through molten wax (1,200 vs 800 kg/m³).
- **Slaked lime:** Slaked lime sinks through molten wax (1,100 vs 800 kg/m³).
- **Molten gold:** Molten gold sinks through molten wax (17,300 vs 800 kg/m³). Molten gold (1,150 °C) can set molten wax on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium sinks through molten wax (2,375 vs 800 kg/m³). Molten aluminium (750 °C) can set molten wax on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead sinks through molten wax (10,660 vs 800 kg/m³). Molten lead (400 °C) can set molten wax on fire (it ignites at 300 °C).
- **Rust:** Rust sinks through molten wax (2,000 vs 800 kg/m³).
- **Coal:** Coal sinks through molten wax (1,350 vs 800 kg/m³).
- **Sulfur:** Sulfur sinks through molten wax (2,000 vs 800 kg/m³).
- **Petrol:** Molten wax sinks through petrol (800 vs 740 kg/m³).
- **Wax:** Molten wax (80 °C) is hot enough to melt wax into molten wax.
- **Thermite:** Thermite sinks through molten wax (1,500 vs 800 kg/m³).
- **Honey:** Honey sinks through molten wax (1,420 vs 800 kg/m³).
- **Vinegar:** Vinegar sinks through molten wax (1,010 vs 800 kg/m³).
- **Bleach:** Bleach sinks through molten wax (1,100 vs 800 kg/m³).
- **Lye:** Lye sinks through molten wax (1,100 vs 800 kg/m³).
- **Liquid nitrogen:** Molten wax (80 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen sinks through molten wax (808 vs 800 kg/m³). Liquid nitrogen (-196 °C) is cold enough to freeze molten wax into wax.
- **Nitrogen:** Molten wax falls through nitrogen.
- **Carbon dioxide:** Molten wax falls through carbon dioxide.
- **Helium:** Molten wax falls through helium.
- **Propane:** Molten wax falls through propane.
- **Chlorine:** Molten wax falls through chlorine.
- **Sulfur dioxide:** Molten wax falls through sulfur dioxide.
- **Dry ice:** Molten wax (80 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten wax into wax.
- **Baking soda:** Baking soda sinks through molten wax (1,100 vs 800 kg/m³).
- **Grass seed:** Grass seed sinks through molten wax (1,100 vs 800 kg/m³).
- **Acorn:** Acorn sinks through molten wax (1,100 vs 800 kg/m³).
- **Cloud:** Molten wax falls through cloud.
- **Caramel:** Caramel sinks through molten wax (1,300 vs 800 kg/m³).
- **Chalk:** Chalk sinks through molten wax (1,500 vs 800 kg/m³).
- **Liquid oxygen:** Molten wax burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1). Molten wax (80 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen sinks through molten wax (1,141 vs 800 kg/m³). Liquid oxygen (-183 °C) is cold enough to freeze molten wax into wax.
- **Molten iron:** Molten iron sinks through molten wax (6,980 vs 800 kg/m³). Molten iron (1,600 °C) can set molten wax on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass sinks through molten wax (2,400 vs 800 kg/m³). Molten glass (1,450 °C) can set molten wax on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver sinks through molten wax (9,320 vs 800 kg/m³). Molten silver (1,000 °C) can set molten wax on fire (it ignites at 300 °C).
- **Popcorn kernel:** Popcorn kernel sinks through molten wax (1,200 vs 800 kg/m³).
- **Tar:** Tar sinks through molten wax (1,150 vs 800 kg/m³).
- **Molten plastic:** Molten plastic sinks through molten wax (900 vs 800 kg/m³).
- **Napalm:** Napalm sinks through molten wax (900 vs 800 kg/m³).
- **Hydrogen peroxide:** Molten wax burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through molten wax (1,450 vs 800 kg/m³). Hydrogen peroxide makes burning molten wax hotter and faster.
- **Lightning:** Molten wax catches from the flame touching it. Molten wax falls through lightning.
- **Plasma:** Molten wax catches from the flame touching it. Molten wax falls through plasma.
- **Firework:** Firework sinks through molten wax (1,400 vs 800 kg/m³).
- **Rocket:** Molten wax catches from the flame touching it. Molten wax falls through rocket.
- **Ember:** Molten wax catches from the flame touching it. Molten wax falls through ember.
- **Saltpeter:** Molten wax burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through molten wax (2,100 vs 800 kg/m³). Saltpeter makes burning molten wax hotter and faster.
- **Molten tin:** Molten tin sinks through molten wax (6,990 vs 800 kg/m³).
- **Acetone:** Molten wax sinks through acetone (800 vs 784 kg/m³).
- **Hail:** Molten wax (80 °C) is hot enough to melt hail into water. Hail sinks through molten wax (900 vs 800 kg/m³). Hail (-5 °C) is cold enough to freeze molten wax into wax.
- **Ammonia:** Molten wax falls through ammonia.
- **Ozone:** Molten wax burns: it catches fire at 300 °C next to ozone (oxidiser 1). Molten wax falls through ozone. Ozone makes burning molten wax hotter and faster.
- **Chocolate:** Molten wax (80 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate sinks through molten wax (1,250 vs 800 kg/m³).
- **Phosphorus:** Molten wax (80 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide sinks through molten wax (2,220 vs 800 kg/m³).
- **Acetylene:** Molten wax falls through acetylene.
- **Iodine:** Iodine sinks through molten wax (4,930 vs 800 kg/m³).
- **Iodine vapour:** Molten wax falls through iodine vapour.
- **Argon:** Molten wax falls through argon.
- **Bromine:** Molten wax (80 °C) is hot enough to boil bromine into bromine vapour. Bromine sinks through molten wax (3,100 vs 800 kg/m³).
- **Bromine vapour:** Molten wax falls through bromine vapour.
- **Gallium:** Molten wax (80 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through molten wax (6,095 vs 800 kg/m³).
- **Cactus seed:** Cactus seed sinks through molten wax (1,100 vs 800 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through molten wax (1,200 vs 800 kg/m³).
- **Peat:** Peat sinks through molten wax (900 vs 800 kg/m³).
- **Soda:** Soda sinks through molten wax (1,010 vs 800 kg/m³).

No direct interaction with: Wall, Stone, Wood, Ash, Iron, Sawdust, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Paper, Rubber, Flour, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Kerosene, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Egg, Cooked egg, Lithium, Titanium, Platinum, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Paper

Thin sheets of wood pulp. Stays put. It catches at the lightest flame and burns up quickly into ash.

- **State:** Solid, 700 kg/m³
- **Burns:** from 233 °C in air, 0.67 s per cell, leaves ash
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.05 (acid stronger than this eats it)

With other elements (23 interact):

- **Air:** Paper burns: it catches fire at 233 °C next to air (oxidiser 0.21).
- **Water:** Paper slowly rots into dirt where water touches it.
- **Lava:** Lava (1,200 °C) can set paper on fire (it ignites at 233 °C).
- **Fire:** Paper catches from the flame touching it.
- **Acid:** Acid eats paper: acidity 0.8 beats hardness 0.05.
- **Oxygen:** Paper burns: it catches fire at 233 °C next to oxygen (oxidiser 1). Oxygen makes burning paper hotter and faster.
- **Spark:** Paper catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set paper on fire (it ignites at 233 °C).
- **Molten gold:** Molten gold (1,150 °C) can set paper on fire (it ignites at 233 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set paper on fire (it ignites at 233 °C).
- **Molten lead:** Molten lead (400 °C) can set paper on fire (it ignites at 233 °C).
- **Liquid oxygen:** Paper burns: it catches fire at 233 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set paper on fire (it ignites at 233 °C).
- **Molten glass:** Molten glass (1,450 °C) can set paper on fire (it ignites at 233 °C).
- **Molten silver:** Molten silver (1,000 °C) can set paper on fire (it ignites at 233 °C).
- **Hydrogen peroxide:** Paper burns: it catches fire at 233 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning paper hotter and faster.
- **Lightning:** Paper catches from the flame touching it.
- **Plasma:** Paper catches from the flame touching it.
- **Rocket:** Paper catches from the flame touching it.
- **Ember:** Paper catches from the flame touching it.
- **Saltpeter:** Paper burns: it catches fire at 233 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning paper hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set paper on fire (it ignites at 233 °C).
- **Ozone:** Paper burns: it catches fire at 233 °C next to ozone (oxidiser 1). Ozone makes burning paper hotter and faster.

No direct interaction with: Wall, Sand, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Rubber

Tough black rubber. Stays put and never carries charge. Hard to light, but it burns long and hot.

- **State:** Solid, 1,100 kg/m³
- **Burns:** from 400 °C in air, 6.67 s per cell, leaves ash
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Rubber burns: it catches fire at 400 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set rubber on fire (it ignites at 400 °C).
- **Fire:** Rubber catches from the flame touching it.
- **Acid:** Acid eats rubber: acidity 0.8 beats hardness 0.4.
- **Oxygen:** Rubber burns: it catches fire at 400 °C next to oxygen (oxidiser 1). Oxygen makes burning rubber hotter and faster.
- **Spark:** Rubber catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set rubber on fire (it ignites at 400 °C).
- **Molten gold:** Molten gold (1,150 °C) can set rubber on fire (it ignites at 400 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set rubber on fire (it ignites at 400 °C).
- **Molten lead:** Molten lead (400 °C) can set rubber on fire (it ignites at 400 °C).
- **Liquid oxygen:** Rubber burns: it catches fire at 400 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set rubber on fire (it ignites at 400 °C).
- **Molten glass:** Molten glass (1,450 °C) can set rubber on fire (it ignites at 400 °C).
- **Molten silver:** Molten silver (1,000 °C) can set rubber on fire (it ignites at 400 °C).
- **Hydrogen peroxide:** Rubber burns: it catches fire at 400 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning rubber hotter and faster.
- **Lightning:** Rubber catches from the flame touching it.
- **Plasma:** Rubber catches from the flame touching it.
- **Rocket:** Rubber catches from the flame touching it.
- **Ember:** Rubber catches from the flame touching it.
- **Saltpeter:** Rubber burns: it catches fire at 400 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning rubber hotter and faster.
- **Ozone:** Rubber burns: it catches fire at 400 °C next to ozone (oxidiser 1). Ozone makes burning rubber hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Flour

Fine white powder, very light. Drifts as it falls. It catches easily and burns fast where air reaches it, but soaks up water into a paste that will not burn.

- **State:** Powder, 600 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 70 cells/s
- **Burns:** from 380 °C in air, 0.33 s per cell, leaves ash
- **Flash point:** 50 °C: above it, flames spread across it
- **Soaks up:** water, up to 30% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (38 interact):

- **Air:** Flour burns: it catches fire at 380 °C next to air (oxidiser 0.21).
- **Water:** Flour soaks up water: it is porous and holds up to 30% water.
- **Steam:** Flour falls through steam.
- **Lava:** Lava (1,200 °C) can set flour on fire (it ignites at 380 °C).
- **Fire:** Flour catches from the flame touching it. Flour falls through fire.
- **Smoke:** Flour falls through smoke.
- **Acid:** Acid eats flour: acidity 0.8 beats hardness 0.1.
- **Hydrogen:** Flour falls through hydrogen.
- **Oxygen:** Flour burns: it catches fire at 380 °C next to oxygen (oxidiser 1). Flour falls through oxygen. Oxygen makes burning flour hotter and faster.
- **Methane:** Flour falls through methane.
- **Spark:** Flour catches from the flame touching it. Flour falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set flour on fire (it ignites at 380 °C).
- **Molten gold:** Molten gold (1,150 °C) can set flour on fire (it ignites at 380 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set flour on fire (it ignites at 380 °C).
- **Molten lead:** Molten lead (400 °C) can set flour on fire (it ignites at 380 °C).
- **Nitrogen:** Flour falls through nitrogen.
- **Carbon dioxide:** Flour falls through carbon dioxide.
- **Helium:** Flour falls through helium.
- **Propane:** Flour falls through propane.
- **Chlorine:** Flour falls through chlorine.
- **Sulfur dioxide:** Flour falls through sulfur dioxide.
- **Cloud:** Flour falls through cloud.
- **Liquid oxygen:** Flour burns: it catches fire at 380 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set flour on fire (it ignites at 380 °C).
- **Molten glass:** Molten glass (1,450 °C) can set flour on fire (it ignites at 380 °C).
- **Molten silver:** Molten silver (1,000 °C) can set flour on fire (it ignites at 380 °C).
- **Hydrogen peroxide:** Flour burns: it catches fire at 380 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning flour hotter and faster.
- **Lightning:** Flour catches from the flame touching it. Flour falls through lightning.
- **Plasma:** Flour catches from the flame touching it. Flour falls through plasma.
- **Rocket:** Flour catches from the flame touching it. Flour falls through rocket.
- **Ember:** Flour catches from the flame touching it. Flour falls through ember.
- **Saltpeter:** Flour burns: it catches fire at 380 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning flour hotter and faster.
- **Ammonia:** Flour falls through ammonia.
- **Ozone:** Flour burns: it catches fire at 380 °C next to ozone (oxidiser 1). Flour falls through ozone. Ozone makes burning flour hotter and faster.
- **Acetylene:** Flour falls through acetylene.
- **Iodine vapour:** Flour falls through iodine vapour.
- **Argon:** Flour falls through argon.
- **Bromine vapour:** Flour falls through bromine vapour.

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Thermite

A grey-red metal powder that carries its own oxygen. Falls and piles. A flame will not light it, but great heat does, and it burns white-hot with no air, leaving iron.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Burns:** from 900 °C in air, 2 s per cell, leaves iron
- **Burns without air:** it carries its own oxygen
- **A flame:** will not light it; it needs 900 °C
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (53 interact):

- **Air:** Thermite burns: it catches fire at 900 °C next to air (oxidiser 0.21).
- **Water:** Thermite sinks through water (1,500 vs 1,000 kg/m³).
- **Oil:** Thermite sinks through oil (1,500 vs 900 kg/m³).
- **Steam:** Thermite falls through steam.
- **Lava:** Lava (1,200 °C) can set thermite on fire (it ignites at 900 °C).
- **Fire:** Thermite falls through fire.
- **Smoke:** Thermite falls through smoke.
- **Acid:** Thermite sinks through acid (1,500 vs 1,100 kg/m³).
- **Hydrogen:** Thermite falls through hydrogen.
- **Oxygen:** Thermite burns: it catches fire at 900 °C next to oxygen (oxidiser 1). Thermite falls through oxygen. Oxygen makes burning thermite hotter and faster.
- **Methane:** Thermite falls through methane.
- **Alcohol:** Thermite sinks through alcohol (1,500 vs 789 kg/m³).
- **Spark:** Thermite falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set thermite on fire (it ignites at 900 °C).
- **Molten gold:** Molten gold (1,150 °C) can set thermite on fire (it ignites at 900 °C).
- **Petrol:** Thermite sinks through petrol (1,500 vs 740 kg/m³).
- **Molten wax:** Thermite sinks through molten wax (1,500 vs 800 kg/m³).
- **Honey:** Thermite sinks through honey (1,500 vs 1,420 kg/m³).
- **Vinegar:** Thermite sinks through vinegar (1,500 vs 1,010 kg/m³).
- **Bleach:** Thermite sinks through bleach (1,500 vs 1,100 kg/m³).
- **Lye:** Thermite sinks through lye (1,500 vs 1,100 kg/m³).
- **Liquid nitrogen:** Thermite sinks through liquid nitrogen (1,500 vs 808 kg/m³).
- **Nitrogen:** Thermite falls through nitrogen.
- **Carbon dioxide:** Thermite falls through carbon dioxide.
- **Helium:** Thermite falls through helium.
- **Propane:** Thermite falls through propane.
- **Chlorine:** Thermite falls through chlorine.
- **Sulfur dioxide:** Thermite falls through sulfur dioxide.
- **Cloud:** Thermite falls through cloud.
- **Caramel:** Thermite sinks through caramel (1,500 vs 1,300 kg/m³).
- **Liquid oxygen:** Thermite burns: it catches fire at 900 °C next to liquid oxygen (oxidiser 1). Thermite sinks through liquid oxygen (1,500 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set thermite on fire (it ignites at 900 °C).
- **Molten glass:** Molten glass (1,450 °C) can set thermite on fire (it ignites at 900 °C).
- **Molten silver:** Molten silver (1,000 °C) can set thermite on fire (it ignites at 900 °C).
- **Tar:** Thermite sinks through tar (1,500 vs 1,150 kg/m³).
- **Molten plastic:** Thermite sinks through molten plastic (1,500 vs 900 kg/m³).
- **Napalm:** Thermite sinks through napalm (1,500 vs 900 kg/m³).
- **Hydrogen peroxide:** Thermite burns: it catches fire at 900 °C next to hydrogen peroxide (oxidiser 0.8). Thermite sinks through hydrogen peroxide (1,500 vs 1,450 kg/m³). Hydrogen peroxide makes burning thermite hotter and faster.
- **Lightning:** Thermite falls through lightning.
- **Plasma:** Thermite falls through plasma.
- **Rocket:** Thermite falls through rocket.
- **Ember:** Thermite falls through ember.
- **Saltpeter:** Thermite burns: it catches fire at 900 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning thermite hotter and faster.
- **Kerosene:** Thermite sinks through kerosene (1,500 vs 800 kg/m³).
- **Acetone:** Thermite sinks through acetone (1,500 vs 784 kg/m³).
- **Ammonia:** Thermite falls through ammonia.
- **Ozone:** Thermite burns: it catches fire at 900 °C next to ozone (oxidiser 1). Thermite falls through ozone. Ozone makes burning thermite hotter and faster.
- **Molten chocolate:** Thermite sinks through molten chocolate (1,500 vs 1,250 kg/m³).
- **Acetylene:** Thermite falls through acetylene.
- **Iodine vapour:** Thermite falls through iodine vapour.
- **Argon:** Thermite falls through argon.
- **Bromine vapour:** Thermite falls through bromine vapour.
- **Soda:** Thermite sinks through soda (1,500 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Honey

Thick golden syrup. Oozes very slowly and sinks through water. Sticky and sweet; it does not burn.

- **State:** Liquid, 1,420 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,420 kg/m³, floats on heavier ones
- **Falls:** up to 40 cells/s

With other elements (73 interact):

- **Sand:** Sand sinks through honey (1,600 vs 1,420 kg/m³).
- **Water:** Honey sinks through water (1,420 vs 1,000 kg/m³).
- **Oil:** Honey sinks through oil (1,420 vs 900 kg/m³).
- **Steam:** Honey falls through steam.
- **Lava:** Lava sinks through honey (2,600 vs 1,420 kg/m³).
- **Gravel:** Gravel sinks through honey (2,000 vs 1,420 kg/m³).
- **Fire:** Honey falls through fire.
- **Smoke:** Honey falls through smoke.
- **Acid:** Honey sinks through acid (1,420 vs 1,100 kg/m³).
- **Hydrogen:** Honey falls through hydrogen.
- **Oxygen:** Honey falls through oxygen.
- **Methane:** Honey falls through methane.
- **Alcohol:** Honey sinks through alcohol (1,420 vs 789 kg/m³).
- **Salt:** Salt sinks through honey (2,160 vs 1,420 kg/m³).
- **Sugar:** Sugar sinks through honey (1,590 vs 1,420 kg/m³).
- **Dirt:** Dirt sinks through honey (1,500 vs 1,420 kg/m³).
- **Gunpowder:** Gunpowder sinks through honey (1,700 vs 1,420 kg/m³).
- **Nitro:** Nitro sinks through honey (1,600 vs 1,420 kg/m³).
- **Shards:** Shards sinks through honey (2,500 vs 1,420 kg/m³).
- **Spark:** Honey falls through spark.
- **Mercury:** Mercury sinks through honey (13,534 vs 1,420 kg/m³).
- **Molten copper:** Molten copper sinks through honey (8,020 vs 1,420 kg/m³).
- **Clay:** Clay sinks through honey (1,700 vs 1,420 kg/m³).
- **Cement:** Cement sinks through honey (1,440 vs 1,420 kg/m³).
- **Molten gold:** Molten gold sinks through honey (17,300 vs 1,420 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through honey (2,375 vs 1,420 kg/m³).
- **Molten lead:** Molten lead sinks through honey (10,660 vs 1,420 kg/m³).
- **Rust:** Rust sinks through honey (2,000 vs 1,420 kg/m³).
- **Sulfur:** Sulfur sinks through honey (2,000 vs 1,420 kg/m³).
- **Petrol:** Honey sinks through petrol (1,420 vs 740 kg/m³).
- **Molten wax:** Honey sinks through molten wax (1,420 vs 800 kg/m³).
- **Thermite:** Thermite sinks through honey (1,500 vs 1,420 kg/m³).
- **Vinegar:** Honey sinks through vinegar (1,420 vs 1,010 kg/m³).
- **Bleach:** Honey sinks through bleach (1,420 vs 1,100 kg/m³).
- **Lye:** Honey sinks through lye (1,420 vs 1,100 kg/m³).
- **Liquid nitrogen:** Honey sinks through liquid nitrogen (1,420 vs 808 kg/m³).
- **Nitrogen:** Honey falls through nitrogen.
- **Carbon dioxide:** Honey falls through carbon dioxide.
- **Helium:** Honey falls through helium.
- **Propane:** Honey falls through propane.
- **Chlorine:** Honey falls through chlorine.
- **Sulfur dioxide:** Honey falls through sulfur dioxide.
- **Cloud:** Honey falls through cloud.
- **Caramel:** Honey sinks through caramel (1,420 vs 1,300 kg/m³).
- **Chalk:** Chalk sinks through honey (1,500 vs 1,420 kg/m³).
- **Liquid oxygen:** Honey sinks through liquid oxygen (1,420 vs 1,141 kg/m³).
- **Molten iron:** Molten iron sinks through honey (6,980 vs 1,420 kg/m³).
- **Molten glass:** Molten glass sinks through honey (2,400 vs 1,420 kg/m³).
- **Molten silver:** Molten silver sinks through honey (9,320 vs 1,420 kg/m³).
- **Tar:** Honey sinks through tar (1,420 vs 1,150 kg/m³).
- **Molten plastic:** Honey sinks through molten plastic (1,420 vs 900 kg/m³).
- **Napalm:** Honey sinks through napalm (1,420 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through honey (1,450 vs 1,420 kg/m³).
- **Lightning:** Honey falls through lightning.
- **Plasma:** Honey falls through plasma.
- **Rocket:** Honey falls through rocket.
- **Ember:** Honey falls through ember.
- **Saltpeter:** Saltpeter sinks through honey (2,100 vs 1,420 kg/m³).
- **Molten tin:** Molten tin sinks through honey (6,990 vs 1,420 kg/m³).
- **Kerosene:** Honey sinks through kerosene (1,420 vs 800 kg/m³).
- **Acetone:** Honey sinks through acetone (1,420 vs 784 kg/m³).
- **Ammonia:** Honey falls through ammonia.
- **Ozone:** Honey falls through ozone.
- **Molten chocolate:** Honey sinks through molten chocolate (1,420 vs 1,250 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through honey (2,220 vs 1,420 kg/m³).
- **Acetylene:** Honey falls through acetylene.
- **Iodine:** Iodine sinks through honey (4,930 vs 1,420 kg/m³).
- **Iodine vapour:** Honey falls through iodine vapour.
- **Argon:** Honey falls through argon.
- **Bromine:** Bromine sinks through honey (3,100 vs 1,420 kg/m³).
- **Bromine vapour:** Honey falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through honey (6,095 vs 1,420 kg/m³).
- **Soda:** Honey sinks through soda (1,420 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Coal, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Vinegar

A weak acid, mostly water. Flows like water. Too weak to eat metal, but it fizzes with baking soda and neutralises bases.

- **State:** Liquid, 1,010 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,010 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s

With other elements (83 interact):

- **Sand:** Sand sinks through vinegar (1,600 vs 1,010 kg/m³).
- **Water:** Vinegar sinks through water (1,010 vs 1,000 kg/m³).
- **Oil:** Vinegar sinks through oil (1,010 vs 900 kg/m³).
- **Steam:** Vinegar falls through steam.
- **Lava:** Lava sinks through vinegar (2,600 vs 1,010 kg/m³).
- **Gravel:** Gravel sinks through vinegar (2,000 vs 1,010 kg/m³).
- **Fire:** Vinegar falls through fire.
- **Smoke:** Vinegar falls through smoke.
- **Acid:** Acid sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Hydrogen:** Vinegar falls through hydrogen.
- **Oxygen:** Vinegar falls through oxygen.
- **Methane:** Vinegar falls through methane.
- **Alcohol:** Vinegar sinks through alcohol (1,010 vs 789 kg/m³).
- **Salt:** Salt sinks through vinegar (2,160 vs 1,010 kg/m³).
- **Sugar:** Sugar sinks through vinegar (1,590 vs 1,010 kg/m³).
- **Dirt:** Dirt sinks through vinegar (1,500 vs 1,010 kg/m³).
- **Gunpowder:** Gunpowder sinks through vinegar (1,700 vs 1,010 kg/m³).
- **Nitro:** Nitro sinks through vinegar (1,600 vs 1,010 kg/m³).
- **Shards:** Shards sinks through vinegar (2,500 vs 1,010 kg/m³).
- **Spark:** Vinegar falls through spark.
- **Mercury:** Mercury sinks through vinegar (13,534 vs 1,010 kg/m³).
- **Seed:** Seed sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Molten copper:** Molten copper sinks through vinegar (8,020 vs 1,010 kg/m³).
- **Clay:** Clay sinks through vinegar (1,700 vs 1,010 kg/m³).
- **Cement:** Cement sinks through vinegar (1,440 vs 1,010 kg/m³).
- **Quicklime:** Vinegar and quicklime neutralise each other into water, and warm up. Quicklime and vinegar neutralise each other into water, and warm up. Quicklime sinks through vinegar (1,200 vs 1,010 kg/m³).
- **Slaked lime:** Vinegar and slaked lime neutralise each other into water, and warm up. Slaked lime and vinegar neutralise each other into water, and warm up. Slaked lime sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Molten gold:** Molten gold sinks through vinegar (17,300 vs 1,010 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through vinegar (2,375 vs 1,010 kg/m³).
- **Molten lead:** Molten lead sinks through vinegar (10,660 vs 1,010 kg/m³).
- **Rust:** Rust sinks through vinegar (2,000 vs 1,010 kg/m³).
- **Coal:** Coal sinks through vinegar (1,350 vs 1,010 kg/m³).
- **Sulfur:** Sulfur sinks through vinegar (2,000 vs 1,010 kg/m³).
- **Petrol:** Vinegar sinks through petrol (1,010 vs 740 kg/m³).
- **Molten wax:** Vinegar sinks through molten wax (1,010 vs 800 kg/m³).
- **Thermite:** Thermite sinks through vinegar (1,500 vs 1,010 kg/m³).
- **Honey:** Honey sinks through vinegar (1,420 vs 1,010 kg/m³).
- **Bleach:** Vinegar and bleach release poisonous chlorine gas. Bleach and vinegar release poisonous chlorine gas. Bleach sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Lye:** Vinegar and lye neutralise each other into water, and warm up. Lye and vinegar neutralise each other into water, and warm up. Lye sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Liquid nitrogen:** Vinegar sinks through liquid nitrogen (1,010 vs 808 kg/m³).
- **Nitrogen:** Vinegar falls through nitrogen.
- **Carbon dioxide:** Vinegar falls through carbon dioxide.
- **Helium:** Vinegar falls through helium.
- **Propane:** Vinegar falls through propane.
- **Chlorine:** Vinegar falls through chlorine.
- **Sulfur dioxide:** Vinegar falls through sulfur dioxide.
- **Baking soda:** Vinegar and baking soda neutralise each other into water, fizzing out carbon dioxide, and warm up. Baking soda and vinegar neutralise each other into water, fizzing out carbon dioxide, and warm up. Baking soda sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Grass seed:** Grass seed sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Acorn:** Acorn sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Cloud:** Vinegar falls through cloud.
- **Caramel:** Caramel sinks through vinegar (1,300 vs 1,010 kg/m³).
- **Chalk:** Chalk sinks through vinegar (1,500 vs 1,010 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through vinegar (1,141 vs 1,010 kg/m³).
- **Molten iron:** Molten iron sinks through vinegar (6,980 vs 1,010 kg/m³).
- **Molten glass:** Molten glass sinks through vinegar (2,400 vs 1,010 kg/m³).
- **Molten silver:** Molten silver sinks through vinegar (9,320 vs 1,010 kg/m³).
- **Popcorn kernel:** Popcorn kernel sinks through vinegar (1,200 vs 1,010 kg/m³).
- **Tar:** Tar sinks through vinegar (1,150 vs 1,010 kg/m³).
- **Molten plastic:** Vinegar sinks through molten plastic (1,010 vs 900 kg/m³).
- **Napalm:** Vinegar sinks through napalm (1,010 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through vinegar (1,450 vs 1,010 kg/m³).
- **Lightning:** Vinegar falls through lightning.
- **Plasma:** Vinegar falls through plasma.
- **Firework:** Firework sinks through vinegar (1,400 vs 1,010 kg/m³).
- **Rocket:** Vinegar falls through rocket.
- **Ember:** Vinegar falls through ember.
- **Saltpeter:** Saltpeter sinks through vinegar (2,100 vs 1,010 kg/m³).
- **Molten tin:** Molten tin sinks through vinegar (6,990 vs 1,010 kg/m³).
- **Kerosene:** Vinegar sinks through kerosene (1,010 vs 800 kg/m³).
- **Acetone:** Vinegar sinks through acetone (1,010 vs 784 kg/m³).
- **Ammonia:** Vinegar and ammonia neutralise each other into water, and warm up. Vinegar falls through ammonia. Ammonia and vinegar neutralise each other into water, and warm up.
- **Ozone:** Vinegar falls through ozone.
- **Molten chocolate:** Molten chocolate sinks through vinegar (1,250 vs 1,010 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through vinegar (2,220 vs 1,010 kg/m³).
- **Acetylene:** Vinegar falls through acetylene.
- **Iodine:** Iodine sinks through vinegar (4,930 vs 1,010 kg/m³).
- **Iodine vapour:** Vinegar falls through iodine vapour.
- **Argon:** Vinegar falls through argon.
- **Bromine:** Bromine sinks through vinegar (3,100 vs 1,010 kg/m³).
- **Bromine vapour:** Vinegar falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through vinegar (6,095 vs 1,010 kg/m³).
- **Cactus seed:** Cactus seed sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through vinegar (1,200 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bleach

A strong cleaning base. Flows like water. Mixed with any acid it gives off poisonous chlorine gas.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Poisons:** living things it touches: they wither

With other elements (83 interact):

- **Sand:** Sand sinks through bleach (1,600 vs 1,100 kg/m³).
- **Water:** Bleach sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Bleach sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Bleach falls through steam.
- **Lava:** Lava sinks through bleach (2,600 vs 1,100 kg/m³).
- **Gravel:** Gravel sinks through bleach (2,000 vs 1,100 kg/m³).
- **Fire:** Bleach falls through fire.
- **Smoke:** Bleach falls through smoke.
- **Acid:** Bleach and acid release poisonous chlorine gas. Acid and bleach release poisonous chlorine gas.
- **Hydrogen:** Bleach falls through hydrogen.
- **Oxygen:** Bleach falls through oxygen.
- **Methane:** Bleach falls through methane.
- **Alcohol:** Bleach sinks through alcohol (1,100 vs 789 kg/m³).
- **Salt:** Salt sinks through bleach (2,160 vs 1,100 kg/m³).
- **Sugar:** Sugar sinks through bleach (1,590 vs 1,100 kg/m³).
- **Dirt:** Dirt sinks through bleach (1,500 vs 1,100 kg/m³).
- **Gunpowder:** Gunpowder sinks through bleach (1,700 vs 1,100 kg/m³).
- **Nitro:** Nitro sinks through bleach (1,600 vs 1,100 kg/m³).
- **Shards:** Shards sinks through bleach (2,500 vs 1,100 kg/m³).
- **Spark:** Bleach falls through spark.
- **Mercury:** Mercury sinks through bleach (13,534 vs 1,100 kg/m³).
- **Plant:** Bleach is toxic: plant touching it withers.
- **Molten copper:** Molten copper sinks through bleach (8,020 vs 1,100 kg/m³).
- **Clay:** Clay sinks through bleach (1,700 vs 1,100 kg/m³).
- **Cement:** Cement sinks through bleach (1,440 vs 1,100 kg/m³).
- **Quicklime:** Quicklime sinks through bleach (1,200 vs 1,100 kg/m³).
- **Molten gold:** Molten gold sinks through bleach (17,300 vs 1,100 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through bleach (2,375 vs 1,100 kg/m³).
- **Molten lead:** Molten lead sinks through bleach (10,660 vs 1,100 kg/m³).
- **Rust:** Rust sinks through bleach (2,000 vs 1,100 kg/m³).
- **Coal:** Coal sinks through bleach (1,350 vs 1,100 kg/m³).
- **Sulfur:** Sulfur sinks through bleach (2,000 vs 1,100 kg/m³).
- **Petrol:** Bleach sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Bleach sinks through molten wax (1,100 vs 800 kg/m³).
- **Thermite:** Thermite sinks through bleach (1,500 vs 1,100 kg/m³).
- **Honey:** Honey sinks through bleach (1,420 vs 1,100 kg/m³).
- **Vinegar:** Bleach and vinegar release poisonous chlorine gas. Bleach sinks through vinegar (1,100 vs 1,010 kg/m³). Vinegar and bleach release poisonous chlorine gas.
- **Liquid nitrogen:** Bleach sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Bleach falls through nitrogen.
- **Carbon dioxide:** Bleach falls through carbon dioxide.
- **Helium:** Bleach falls through helium.
- **Propane:** Bleach falls through propane.
- **Chlorine:** Bleach falls through chlorine.
- **Sulfur dioxide:** Bleach falls through sulfur dioxide.
- **Grass:** Bleach is toxic: grass touching it withers.
- **Tree:** Bleach is toxic: tree touching it withers.
- **Leaves:** Bleach is toxic: leaves touching it withers.
- **Flower:** Bleach is toxic: flower touching it withers.
- **Cloud:** Bleach falls through cloud.
- **Caramel:** Caramel sinks through bleach (1,300 vs 1,100 kg/m³).
- **Chalk:** Chalk sinks through bleach (1,500 vs 1,100 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through bleach (1,141 vs 1,100 kg/m³).
- **Molten iron:** Molten iron sinks through bleach (6,980 vs 1,100 kg/m³).
- **Molten glass:** Molten glass sinks through bleach (2,400 vs 1,100 kg/m³).
- **Molten silver:** Molten silver sinks through bleach (9,320 vs 1,100 kg/m³).
- **Popcorn kernel:** Popcorn kernel sinks through bleach (1,200 vs 1,100 kg/m³).
- **Tar:** Tar sinks through bleach (1,150 vs 1,100 kg/m³).
- **Molten plastic:** Bleach sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Bleach sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through bleach (1,450 vs 1,100 kg/m³).
- **Lightning:** Bleach falls through lightning.
- **Plasma:** Bleach falls through plasma.
- **Firework:** Firework sinks through bleach (1,400 vs 1,100 kg/m³).
- **Rocket:** Bleach falls through rocket.
- **Ember:** Bleach falls through ember.
- **Saltpeter:** Saltpeter sinks through bleach (2,100 vs 1,100 kg/m³).
- **Molten tin:** Molten tin sinks through bleach (6,990 vs 1,100 kg/m³).
- **Kerosene:** Bleach sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Bleach sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Bleach falls through ammonia.
- **Ozone:** Bleach falls through ozone.
- **Molten chocolate:** Molten chocolate sinks through bleach (1,250 vs 1,100 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through bleach (2,220 vs 1,100 kg/m³).
- **Acetylene:** Bleach falls through acetylene.
- **Iodine:** Iodine sinks through bleach (4,930 vs 1,100 kg/m³).
- **Iodine vapour:** Bleach falls through iodine vapour.
- **Argon:** Bleach falls through argon.
- **Bromine:** Bromine sinks through bleach (3,100 vs 1,100 kg/m³).
- **Bromine vapour:** Bleach falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through bleach (6,095 vs 1,100 kg/m³).
- **Cactus:** Bleach is toxic: cactus touching it withers.
- **Smoke bomb:** Smoke bomb sinks through bleach (1,200 vs 1,100 kg/m³).
- **Soda:** Bleach sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Dry plant, Brick, Concrete, Limestone, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Lye, Dry ice, Baking soda, C4, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus seed, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lye

A caustic alkaline liquid. Flows like water. It neutralises acid into water, warming as it does.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s

With other elements (77 interact):

- **Sand:** Sand sinks through lye (1,600 vs 1,100 kg/m³).
- **Water:** Lye sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Lye sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Lye falls through steam.
- **Lava:** Lava sinks through lye (2,600 vs 1,100 kg/m³).
- **Gravel:** Gravel sinks through lye (2,000 vs 1,100 kg/m³).
- **Fire:** Lye falls through fire.
- **Smoke:** Lye falls through smoke.
- **Acid:** Lye and acid neutralise each other into water, and warm up. Acid and lye neutralise each other into water, and warm up.
- **Hydrogen:** Lye falls through hydrogen.
- **Oxygen:** Lye falls through oxygen.
- **Methane:** Lye falls through methane.
- **Alcohol:** Lye sinks through alcohol (1,100 vs 789 kg/m³).
- **Salt:** Salt sinks through lye (2,160 vs 1,100 kg/m³).
- **Sugar:** Sugar sinks through lye (1,590 vs 1,100 kg/m³).
- **Dirt:** Dirt sinks through lye (1,500 vs 1,100 kg/m³).
- **Gunpowder:** Gunpowder sinks through lye (1,700 vs 1,100 kg/m³).
- **Nitro:** Nitro sinks through lye (1,600 vs 1,100 kg/m³).
- **Shards:** Shards sinks through lye (2,500 vs 1,100 kg/m³).
- **Spark:** Lye falls through spark.
- **Mercury:** Mercury sinks through lye (13,534 vs 1,100 kg/m³).
- **Molten copper:** Molten copper sinks through lye (8,020 vs 1,100 kg/m³).
- **Clay:** Clay sinks through lye (1,700 vs 1,100 kg/m³).
- **Cement:** Cement sinks through lye (1,440 vs 1,100 kg/m³).
- **Quicklime:** Quicklime sinks through lye (1,200 vs 1,100 kg/m³).
- **Molten gold:** Molten gold sinks through lye (17,300 vs 1,100 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through lye (2,375 vs 1,100 kg/m³).
- **Molten lead:** Molten lead sinks through lye (10,660 vs 1,100 kg/m³).
- **Rust:** Rust sinks through lye (2,000 vs 1,100 kg/m³).
- **Coal:** Coal sinks through lye (1,350 vs 1,100 kg/m³).
- **Sulfur:** Sulfur sinks through lye (2,000 vs 1,100 kg/m³).
- **Petrol:** Lye sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Lye sinks through molten wax (1,100 vs 800 kg/m³).
- **Thermite:** Thermite sinks through lye (1,500 vs 1,100 kg/m³).
- **Honey:** Honey sinks through lye (1,420 vs 1,100 kg/m³).
- **Vinegar:** Lye and vinegar neutralise each other into water, and warm up. Lye sinks through vinegar (1,100 vs 1,010 kg/m³). Vinegar and lye neutralise each other into water, and warm up.
- **Liquid nitrogen:** Lye sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Lye falls through nitrogen.
- **Carbon dioxide:** Lye falls through carbon dioxide.
- **Helium:** Lye falls through helium.
- **Propane:** Lye falls through propane.
- **Chlorine:** Lye falls through chlorine.
- **Sulfur dioxide:** Lye falls through sulfur dioxide.
- **Cloud:** Lye falls through cloud.
- **Caramel:** Caramel sinks through lye (1,300 vs 1,100 kg/m³).
- **Chalk:** Chalk sinks through lye (1,500 vs 1,100 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through lye (1,141 vs 1,100 kg/m³).
- **Molten iron:** Molten iron sinks through lye (6,980 vs 1,100 kg/m³).
- **Molten glass:** Molten glass sinks through lye (2,400 vs 1,100 kg/m³).
- **Molten silver:** Molten silver sinks through lye (9,320 vs 1,100 kg/m³).
- **Popcorn kernel:** Popcorn kernel sinks through lye (1,200 vs 1,100 kg/m³).
- **Tar:** Tar sinks through lye (1,150 vs 1,100 kg/m³).
- **Molten plastic:** Lye sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Lye sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through lye (1,450 vs 1,100 kg/m³).
- **Lightning:** Lye falls through lightning.
- **Plasma:** Lye falls through plasma.
- **Firework:** Firework sinks through lye (1,400 vs 1,100 kg/m³).
- **Rocket:** Lye falls through rocket.
- **Ember:** Lye falls through ember.
- **Saltpeter:** Saltpeter sinks through lye (2,100 vs 1,100 kg/m³).
- **Molten tin:** Molten tin sinks through lye (6,990 vs 1,100 kg/m³).
- **Kerosene:** Lye sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Lye sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Lye falls through ammonia.
- **Ozone:** Lye falls through ozone.
- **Molten chocolate:** Molten chocolate sinks through lye (1,250 vs 1,100 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through lye (2,220 vs 1,100 kg/m³).
- **Acetylene:** Lye falls through acetylene.
- **Iodine:** Iodine sinks through lye (4,930 vs 1,100 kg/m³).
- **Iodine vapour:** Lye falls through iodine vapour.
- **Argon:** Lye falls through argon.
- **Bromine:** Bromine sinks through lye (3,100 vs 1,100 kg/m³).
- **Bromine vapour:** Lye falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through lye (6,095 vs 1,100 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through lye (1,200 vs 1,100 kg/m³).
- **Soda:** Lye sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Bleach, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus seed, Cactus, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Liquid nitrogen

Nitrogen cooled to a liquid, bitterly cold. Flows and boils away fast into nitrogen gas, freezing whatever it touches.

- **State:** Liquid, 808 kg/m³
- **Starts at:** -196 °C
- **In liquids:** Sinks through liquids lighter than 808 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Boils:** at -196 °C, into nitrogen

With other elements (86 interact):

- **Sand:** Sand sinks through liquid nitrogen (1,600 vs 808 kg/m³).
- **Water:** Liquid nitrogen (-196 °C) is cold enough to freeze water into ice. Water sinks through liquid nitrogen (1,000 vs 808 kg/m³).
- **Oil:** Oil sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Steam:** Liquid nitrogen falls through steam. Liquid nitrogen (-196 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Lava:** Liquid nitrogen (-196 °C) is cold enough to freeze lava into stone. Lava sinks through liquid nitrogen (2,600 vs 808 kg/m³). Lava (1,200 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Gravel:** Gravel sinks through liquid nitrogen (2,000 vs 808 kg/m³).
- **Fire:** Liquid nitrogen puts out the fire, flashing into nitrogen. Liquid nitrogen falls through fire. Fire (850 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Smoke:** Liquid nitrogen falls through smoke. Smoke (150 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Acid:** Acid sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Hydrogen:** Liquid nitrogen falls through hydrogen.
- **Oxygen:** Liquid nitrogen falls through oxygen. Liquid nitrogen (-196 °C) is cold enough to condense oxygen into liquid oxygen.
- **Methane:** Liquid nitrogen falls through methane.
- **Alcohol:** Liquid nitrogen sinks through alcohol (808 vs 789 kg/m³).
- **Salt:** Salt sinks through liquid nitrogen (2,160 vs 808 kg/m³).
- **Sugar:** Sugar sinks through liquid nitrogen (1,590 vs 808 kg/m³).
- **Dirt:** Dirt sinks through liquid nitrogen (1,500 vs 808 kg/m³).
- **Gunpowder:** Gunpowder sinks through liquid nitrogen (1,700 vs 808 kg/m³).
- **Nitro:** Nitro sinks through liquid nitrogen (1,600 vs 808 kg/m³).
- **Shards:** Shards sinks through liquid nitrogen (2,500 vs 808 kg/m³).
- **Spark:** Liquid nitrogen falls through spark. Spark (300 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Mercury:** Mercury sinks through liquid nitrogen (13,534 vs 808 kg/m³).
- **Seed:** Seed sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Molten copper:** Liquid nitrogen (-196 °C) is cold enough to freeze molten copper into wire. Molten copper sinks through liquid nitrogen (8,020 vs 808 kg/m³). Molten copper (1,200 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Clay:** Clay sinks through liquid nitrogen (1,700 vs 808 kg/m³).
- **Cement:** Cement sinks through liquid nitrogen (1,440 vs 808 kg/m³).
- **Quicklime:** Quicklime sinks through liquid nitrogen (1,200 vs 808 kg/m³).
- **Slaked lime:** Slaked lime sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Molten gold:** Liquid nitrogen (-196 °C) is cold enough to freeze molten gold into gold. Molten gold sinks through liquid nitrogen (17,300 vs 808 kg/m³). Molten gold (1,150 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Molten aluminium:** Liquid nitrogen (-196 °C) is cold enough to freeze molten aluminium into aluminium. Molten aluminium sinks through liquid nitrogen (2,375 vs 808 kg/m³). Molten aluminium (750 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Molten lead:** Liquid nitrogen (-196 °C) is cold enough to freeze molten lead into lead. Molten lead sinks through liquid nitrogen (10,660 vs 808 kg/m³). Molten lead (400 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Rust:** Rust sinks through liquid nitrogen (2,000 vs 808 kg/m³).
- **Coal:** Coal sinks through liquid nitrogen (1,350 vs 808 kg/m³).
- **Sulfur:** Sulfur sinks through liquid nitrogen (2,000 vs 808 kg/m³).
- **Petrol:** Liquid nitrogen sinks through petrol (808 vs 740 kg/m³).
- **Molten wax:** Liquid nitrogen sinks through molten wax (808 vs 800 kg/m³). Liquid nitrogen (-196 °C) is cold enough to freeze molten wax into wax. Molten wax (80 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Thermite:** Thermite sinks through liquid nitrogen (1,500 vs 808 kg/m³).
- **Honey:** Honey sinks through liquid nitrogen (1,420 vs 808 kg/m³).
- **Vinegar:** Vinegar sinks through liquid nitrogen (1,010 vs 808 kg/m³).
- **Bleach:** Bleach sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Lye:** Lye sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Liquid nitrogen falls through nitrogen.
- **Carbon dioxide:** Liquid nitrogen falls through carbon dioxide. Liquid nitrogen (-196 °C) is cold enough to condense carbon dioxide into dry ice.
- **Helium:** Liquid nitrogen falls through helium.
- **Propane:** Liquid nitrogen falls through propane.
- **Chlorine:** Liquid nitrogen falls through chlorine.
- **Sulfur dioxide:** Liquid nitrogen falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Grass seed:** Grass seed sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Acorn:** Acorn sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Cloud:** Liquid nitrogen falls through cloud.
- **Caramel:** Caramel sinks through liquid nitrogen (1,300 vs 808 kg/m³). Caramel (190 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Chalk:** Chalk sinks through liquid nitrogen (1,500 vs 808 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through liquid nitrogen (1,141 vs 808 kg/m³).
- **Molten iron:** Liquid nitrogen (-196 °C) is cold enough to freeze molten iron into iron. Molten iron sinks through liquid nitrogen (6,980 vs 808 kg/m³). Molten iron (1,600 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Molten glass:** Liquid nitrogen (-196 °C) is cold enough to freeze molten glass into glass. Molten glass sinks through liquid nitrogen (2,400 vs 808 kg/m³). Molten glass (1,450 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Molten silver:** Liquid nitrogen (-196 °C) is cold enough to freeze molten silver into silver. Molten silver sinks through liquid nitrogen (9,320 vs 808 kg/m³). Molten silver (1,000 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Popcorn kernel:** Popcorn kernel sinks through liquid nitrogen (1,200 vs 808 kg/m³).
- **Tar:** Tar sinks through liquid nitrogen (1,150 vs 808 kg/m³).
- **Molten plastic:** Liquid nitrogen (-196 °C) is cold enough to freeze molten plastic into plastic. Molten plastic sinks through liquid nitrogen (900 vs 808 kg/m³). Molten plastic (200 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Napalm:** Napalm sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through liquid nitrogen (1,450 vs 808 kg/m³).
- **Lightning:** Liquid nitrogen falls through lightning. Lightning (3,000 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Plasma:** Liquid nitrogen falls through plasma. Plasma (3,000 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Firework:** Firework sinks through liquid nitrogen (1,400 vs 808 kg/m³).
- **Rocket:** Liquid nitrogen falls through rocket. Rocket (900 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Ember:** Liquid nitrogen falls through ember. Ember (700 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Saltpeter:** Saltpeter sinks through liquid nitrogen (2,100 vs 808 kg/m³).
- **Molten tin:** Liquid nitrogen (-196 °C) is cold enough to freeze molten tin into tin. Molten tin sinks through liquid nitrogen (6,990 vs 808 kg/m³). Molten tin (260 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Kerosene:** Liquid nitrogen sinks through kerosene (808 vs 800 kg/m³).
- **Acetone:** Liquid nitrogen sinks through acetone (808 vs 784 kg/m³).
- **Hail:** Hail sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Ammonia:** Liquid nitrogen falls through ammonia.
- **Ozone:** Liquid nitrogen falls through ozone.
- **Molten chocolate:** Liquid nitrogen (-196 °C) is cold enough to freeze molten chocolate into chocolate. Molten chocolate sinks through liquid nitrogen (1,250 vs 808 kg/m³). Molten chocolate (45 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Calcium carbide:** Calcium carbide sinks through liquid nitrogen (2,220 vs 808 kg/m³).
- **Acetylene:** Liquid nitrogen falls through acetylene.
- **Iodine:** Iodine sinks through liquid nitrogen (4,930 vs 808 kg/m³).
- **Iodine vapour:** Liquid nitrogen falls through iodine vapour. Liquid nitrogen (-196 °C) is cold enough to condense iodine vapour into iodine. Iodine vapour (130 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Argon:** Liquid nitrogen falls through argon.
- **Bromine:** Bromine sinks through liquid nitrogen (3,100 vs 808 kg/m³).
- **Bromine vapour:** Liquid nitrogen falls through bromine vapour. Liquid nitrogen (-196 °C) is cold enough to condense bromine vapour into bromine. Bromine vapour (70 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Liquid gallium:** Liquid nitrogen (-196 °C) is cold enough to freeze liquid gallium into gallium. Liquid gallium sinks through liquid nitrogen (6,095 vs 808 kg/m³). Liquid gallium (35 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Cactus seed:** Cactus seed sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through liquid nitrogen (1,200 vs 808 kg/m³).
- **Peat:** Peat sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Soda:** Soda sinks through liquid nitrogen (1,010 vs 808 kg/m³).

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Nitrogen

The inert gas that makes up most of air. Drifts slowly upwards. It feeds no fire, so it smothers flames it surrounds.

- **State:** Gas, 1.17 kg/m³
- **In air:** Rises (lighter than air)
- **Condenses:** below -196 °C, into liquid nitrogen

With other elements (71 interact):

- **Sand:** Sand falls through nitrogen.
- **Water:** Water falls through nitrogen.
- **Oil:** Oil falls through nitrogen.
- **Lava:** Lava falls through nitrogen.
- **Gravel:** Gravel falls through nitrogen.
- **Ash:** Ash falls through nitrogen.
- **Acid:** Acid falls through nitrogen.
- **Alcohol:** Alcohol falls through nitrogen.
- **Sawdust:** Sawdust falls through nitrogen.
- **Salt:** Salt falls through nitrogen.
- **Sugar:** Sugar falls through nitrogen.
- **Dirt:** Dirt falls through nitrogen.
- **Snow:** Snow falls through nitrogen.
- **Gunpowder:** Gunpowder falls through nitrogen.
- **Nitro:** Nitro falls through nitrogen.
- **Shards:** Shards falls through nitrogen.
- **Mercury:** Mercury falls through nitrogen.
- **Seed:** Seed falls through nitrogen.
- **Molten copper:** Molten copper falls through nitrogen.
- **Clay:** Clay falls through nitrogen.
- **Cement:** Cement falls through nitrogen.
- **Quicklime:** Quicklime falls through nitrogen.
- **Slaked lime:** Slaked lime falls through nitrogen.
- **Molten gold:** Molten gold falls through nitrogen.
- **Molten aluminium:** Molten aluminium falls through nitrogen.
- **Molten lead:** Molten lead falls through nitrogen.
- **Rust:** Rust falls through nitrogen.
- **Coal:** Coal falls through nitrogen.
- **Charcoal:** Charcoal falls through nitrogen.
- **Sulfur:** Sulfur falls through nitrogen.
- **Petrol:** Petrol falls through nitrogen.
- **Molten wax:** Molten wax falls through nitrogen.
- **Flour:** Flour falls through nitrogen.
- **Thermite:** Thermite falls through nitrogen.
- **Honey:** Honey falls through nitrogen.
- **Vinegar:** Vinegar falls through nitrogen.
- **Bleach:** Bleach falls through nitrogen.
- **Lye:** Lye falls through nitrogen.
- **Liquid nitrogen:** Liquid nitrogen falls through nitrogen.
- **Baking soda:** Baking soda falls through nitrogen.
- **Grass seed:** Grass seed falls through nitrogen.
- **Acorn:** Acorn falls through nitrogen.
- **Caramel:** Caramel falls through nitrogen.
- **Chalk:** Chalk falls through nitrogen.
- **Liquid oxygen:** Liquid oxygen falls through nitrogen.
- **Molten iron:** Molten iron falls through nitrogen.
- **Molten glass:** Molten glass falls through nitrogen.
- **Molten silver:** Molten silver falls through nitrogen.
- **Popcorn kernel:** Popcorn kernel falls through nitrogen.
- **Popcorn:** Popcorn falls through nitrogen.
- **Tar:** Tar falls through nitrogen.
- **Molten plastic:** Molten plastic falls through nitrogen.
- **Pumice:** Pumice falls through nitrogen.
- **Napalm:** Napalm falls through nitrogen.
- **Hydrogen peroxide:** Hydrogen peroxide falls through nitrogen.
- **Firework:** Firework falls through nitrogen.
- **Saltpeter:** Saltpeter falls through nitrogen.
- **Molten tin:** Molten tin falls through nitrogen.
- **Kerosene:** Kerosene falls through nitrogen.
- **Acetone:** Acetone falls through nitrogen.
- **Hail:** Hail falls through nitrogen.
- **Cotton:** Cotton falls through nitrogen.
- **Molten chocolate:** Molten chocolate falls through nitrogen.
- **Calcium carbide:** Calcium carbide falls through nitrogen.
- **Iodine:** Iodine falls through nitrogen.
- **Bromine:** Bromine falls through nitrogen.
- **Liquid gallium:** Liquid gallium falls through nitrogen.
- **Cactus seed:** Cactus seed falls through nitrogen.
- **Smoke bomb:** Smoke bomb falls through nitrogen.
- **Peat:** Peat falls through nitrogen.
- **Soda:** Soda falls through nitrogen.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Carbon dioxide

A heavy, colourless gas. Sinks and pools low like water. It feeds no fire, so it smothers flames; cooled hard it freezes into dry ice.

- **State:** Gas, 1.98 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Condenses:** below -78 °C, into dry ice

With other elements (71 interact):

- **Sand:** Sand falls through carbon dioxide.
- **Water:** Water falls through carbon dioxide.
- **Oil:** Oil falls through carbon dioxide.
- **Lava:** Lava falls through carbon dioxide.
- **Gravel:** Gravel falls through carbon dioxide.
- **Ash:** Ash falls through carbon dioxide.
- **Acid:** Acid falls through carbon dioxide.
- **Alcohol:** Alcohol falls through carbon dioxide.
- **Sawdust:** Sawdust falls through carbon dioxide.
- **Salt:** Salt falls through carbon dioxide.
- **Sugar:** Sugar falls through carbon dioxide.
- **Dirt:** Dirt falls through carbon dioxide.
- **Snow:** Snow falls through carbon dioxide.
- **Gunpowder:** Gunpowder falls through carbon dioxide.
- **Nitro:** Nitro falls through carbon dioxide.
- **Shards:** Shards falls through carbon dioxide.
- **Mercury:** Mercury falls through carbon dioxide.
- **Seed:** Seed falls through carbon dioxide.
- **Molten copper:** Molten copper falls through carbon dioxide.
- **Clay:** Clay falls through carbon dioxide.
- **Cement:** Cement falls through carbon dioxide.
- **Quicklime:** Quicklime falls through carbon dioxide.
- **Slaked lime:** Slaked lime falls through carbon dioxide.
- **Molten gold:** Molten gold falls through carbon dioxide.
- **Molten aluminium:** Molten aluminium falls through carbon dioxide.
- **Molten lead:** Molten lead falls through carbon dioxide.
- **Rust:** Rust falls through carbon dioxide.
- **Coal:** Coal falls through carbon dioxide.
- **Charcoal:** Charcoal falls through carbon dioxide.
- **Sulfur:** Sulfur falls through carbon dioxide.
- **Petrol:** Petrol falls through carbon dioxide.
- **Molten wax:** Molten wax falls through carbon dioxide.
- **Flour:** Flour falls through carbon dioxide.
- **Thermite:** Thermite falls through carbon dioxide.
- **Honey:** Honey falls through carbon dioxide.
- **Vinegar:** Vinegar falls through carbon dioxide.
- **Bleach:** Bleach falls through carbon dioxide.
- **Lye:** Lye falls through carbon dioxide.
- **Liquid nitrogen:** Liquid nitrogen falls through carbon dioxide. Liquid nitrogen (-196 °C) is cold enough to condense carbon dioxide into dry ice.
- **Baking soda:** Baking soda falls through carbon dioxide.
- **Grass seed:** Grass seed falls through carbon dioxide.
- **Acorn:** Acorn falls through carbon dioxide.
- **Caramel:** Caramel falls through carbon dioxide.
- **Chalk:** Chalk falls through carbon dioxide.
- **Liquid oxygen:** Liquid oxygen falls through carbon dioxide. Liquid oxygen (-183 °C) is cold enough to condense carbon dioxide into dry ice.
- **Molten iron:** Molten iron falls through carbon dioxide.
- **Molten glass:** Molten glass falls through carbon dioxide.
- **Molten silver:** Molten silver falls through carbon dioxide.
- **Popcorn kernel:** Popcorn kernel falls through carbon dioxide.
- **Popcorn:** Popcorn falls through carbon dioxide.
- **Tar:** Tar falls through carbon dioxide.
- **Molten plastic:** Molten plastic falls through carbon dioxide.
- **Pumice:** Pumice falls through carbon dioxide.
- **Napalm:** Napalm falls through carbon dioxide.
- **Hydrogen peroxide:** Hydrogen peroxide falls through carbon dioxide.
- **Firework:** Firework falls through carbon dioxide.
- **Saltpeter:** Saltpeter falls through carbon dioxide.
- **Molten tin:** Molten tin falls through carbon dioxide.
- **Kerosene:** Kerosene falls through carbon dioxide.
- **Acetone:** Acetone falls through carbon dioxide.
- **Hail:** Hail falls through carbon dioxide.
- **Cotton:** Cotton falls through carbon dioxide.
- **Molten chocolate:** Molten chocolate falls through carbon dioxide.
- **Calcium carbide:** Calcium carbide falls through carbon dioxide.
- **Iodine:** Iodine falls through carbon dioxide.
- **Bromine:** Bromine falls through carbon dioxide.
- **Liquid gallium:** Liquid gallium falls through carbon dioxide.
- **Cactus seed:** Cactus seed falls through carbon dioxide.
- **Smoke bomb:** Smoke bomb falls through carbon dioxide.
- **Peat:** Peat falls through carbon dioxide.
- **Soda:** Soda falls through carbon dioxide.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Helium

A very light, inert gas. Rises fast and gathers at the top. It never burns or reacts.

- **State:** Gas, 0.18 kg/m³
- **In air:** Rises (lighter than air)

With other elements (71 interact):

- **Sand:** Sand falls through helium.
- **Water:** Water falls through helium.
- **Oil:** Oil falls through helium.
- **Lava:** Lava falls through helium.
- **Gravel:** Gravel falls through helium.
- **Ash:** Ash falls through helium.
- **Acid:** Acid falls through helium.
- **Alcohol:** Alcohol falls through helium.
- **Sawdust:** Sawdust falls through helium.
- **Salt:** Salt falls through helium.
- **Sugar:** Sugar falls through helium.
- **Dirt:** Dirt falls through helium.
- **Snow:** Snow falls through helium.
- **Gunpowder:** Gunpowder falls through helium.
- **Nitro:** Nitro falls through helium.
- **Shards:** Shards falls through helium.
- **Mercury:** Mercury falls through helium.
- **Seed:** Seed falls through helium.
- **Molten copper:** Molten copper falls through helium.
- **Clay:** Clay falls through helium.
- **Cement:** Cement falls through helium.
- **Quicklime:** Quicklime falls through helium.
- **Slaked lime:** Slaked lime falls through helium.
- **Molten gold:** Molten gold falls through helium.
- **Molten aluminium:** Molten aluminium falls through helium.
- **Molten lead:** Molten lead falls through helium.
- **Rust:** Rust falls through helium.
- **Coal:** Coal falls through helium.
- **Charcoal:** Charcoal falls through helium.
- **Sulfur:** Sulfur falls through helium.
- **Petrol:** Petrol falls through helium.
- **Molten wax:** Molten wax falls through helium.
- **Flour:** Flour falls through helium.
- **Thermite:** Thermite falls through helium.
- **Honey:** Honey falls through helium.
- **Vinegar:** Vinegar falls through helium.
- **Bleach:** Bleach falls through helium.
- **Lye:** Lye falls through helium.
- **Liquid nitrogen:** Liquid nitrogen falls through helium.
- **Baking soda:** Baking soda falls through helium.
- **Grass seed:** Grass seed falls through helium.
- **Acorn:** Acorn falls through helium.
- **Caramel:** Caramel falls through helium.
- **Chalk:** Chalk falls through helium.
- **Liquid oxygen:** Liquid oxygen falls through helium.
- **Molten iron:** Molten iron falls through helium.
- **Molten glass:** Molten glass falls through helium.
- **Molten silver:** Molten silver falls through helium.
- **Popcorn kernel:** Popcorn kernel falls through helium.
- **Popcorn:** Popcorn falls through helium.
- **Tar:** Tar falls through helium.
- **Molten plastic:** Molten plastic falls through helium.
- **Pumice:** Pumice falls through helium.
- **Napalm:** Napalm falls through helium.
- **Hydrogen peroxide:** Hydrogen peroxide falls through helium.
- **Firework:** Firework falls through helium.
- **Saltpeter:** Saltpeter falls through helium.
- **Molten tin:** Molten tin falls through helium.
- **Kerosene:** Kerosene falls through helium.
- **Acetone:** Acetone falls through helium.
- **Hail:** Hail falls through helium.
- **Cotton:** Cotton falls through helium.
- **Molten chocolate:** Molten chocolate falls through helium.
- **Calcium carbide:** Calcium carbide falls through helium.
- **Iodine:** Iodine falls through helium.
- **Bromine:** Bromine falls through helium.
- **Liquid gallium:** Liquid gallium falls through helium.
- **Cactus seed:** Cactus seed falls through helium.
- **Smoke bomb:** Smoke bomb falls through helium.
- **Peat:** Peat falls through helium.
- **Soda:** Soda falls through helium.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Propane

A fuel gas, heavier than air. Sinks and pools in low places. Its vapour catches from any flame and burns hot into steam.

- **State:** Gas, 1.88 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Burns:** from 470 °C in air, 0.2 s per cell, leaves steam
- **Flash point:** -104 °C: above it, flames spread across it

With other elements (80 interact):

- **Air:** Propane burns: it catches fire at 470 °C next to air (oxidiser 0.21).
- **Sand:** Sand falls through propane.
- **Water:** Water falls through propane.
- **Oil:** Oil falls through propane.
- **Lava:** Lava falls through propane. Lava (1,200 °C) can set propane on fire (it ignites at 470 °C).
- **Gravel:** Gravel falls through propane.
- **Fire:** Propane catches from the flame touching it.
- **Ash:** Ash falls through propane.
- **Acid:** Acid falls through propane.
- **Oxygen:** Propane burns: it catches fire at 470 °C next to oxygen (oxidiser 1). Oxygen makes burning propane hotter and faster.
- **Alcohol:** Alcohol falls through propane.
- **Sawdust:** Sawdust falls through propane.
- **Salt:** Salt falls through propane.
- **Sugar:** Sugar falls through propane.
- **Dirt:** Dirt falls through propane.
- **Snow:** Snow falls through propane.
- **Gunpowder:** Gunpowder falls through propane.
- **Nitro:** Nitro falls through propane.
- **Shards:** Shards falls through propane.
- **Spark:** Propane catches from the flame touching it.
- **Mercury:** Mercury falls through propane.
- **Seed:** Seed falls through propane.
- **Molten copper:** Molten copper falls through propane. Molten copper (1,200 °C) can set propane on fire (it ignites at 470 °C).
- **Clay:** Clay falls through propane.
- **Cement:** Cement falls through propane.
- **Quicklime:** Quicklime falls through propane.
- **Slaked lime:** Slaked lime falls through propane.
- **Molten gold:** Molten gold falls through propane. Molten gold (1,150 °C) can set propane on fire (it ignites at 470 °C).
- **Molten aluminium:** Molten aluminium falls through propane. Molten aluminium (750 °C) can set propane on fire (it ignites at 470 °C).
- **Molten lead:** Molten lead falls through propane.
- **Rust:** Rust falls through propane.
- **Coal:** Coal falls through propane.
- **Charcoal:** Charcoal falls through propane.
- **Sulfur:** Sulfur falls through propane.
- **Petrol:** Petrol falls through propane.
- **Molten wax:** Molten wax falls through propane.
- **Flour:** Flour falls through propane.
- **Thermite:** Thermite falls through propane.
- **Honey:** Honey falls through propane.
- **Vinegar:** Vinegar falls through propane.
- **Bleach:** Bleach falls through propane.
- **Lye:** Lye falls through propane.
- **Liquid nitrogen:** Liquid nitrogen falls through propane.
- **Baking soda:** Baking soda falls through propane.
- **Grass seed:** Grass seed falls through propane.
- **Acorn:** Acorn falls through propane.
- **Caramel:** Caramel falls through propane.
- **Chalk:** Chalk falls through propane.
- **Liquid oxygen:** Propane burns: it catches fire at 470 °C next to liquid oxygen (oxidiser 1). Liquid oxygen falls through propane.
- **Molten iron:** Molten iron falls through propane. Molten iron (1,600 °C) can set propane on fire (it ignites at 470 °C).
- **Molten glass:** Molten glass falls through propane. Molten glass (1,450 °C) can set propane on fire (it ignites at 470 °C).
- **Molten silver:** Molten silver falls through propane. Molten silver (1,000 °C) can set propane on fire (it ignites at 470 °C).
- **Popcorn kernel:** Popcorn kernel falls through propane.
- **Popcorn:** Popcorn falls through propane.
- **Tar:** Tar falls through propane.
- **Molten plastic:** Molten plastic falls through propane.
- **Pumice:** Pumice falls through propane.
- **Napalm:** Napalm falls through propane.
- **Hydrogen peroxide:** Propane burns: it catches fire at 470 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide falls through propane. Hydrogen peroxide makes burning propane hotter and faster.
- **Lightning:** Propane catches from the flame touching it.
- **Plasma:** Propane catches from the flame touching it.
- **Firework:** Firework falls through propane.
- **Rocket:** Propane catches from the flame touching it.
- **Ember:** Propane catches from the flame touching it.
- **Saltpeter:** Propane burns: it catches fire at 470 °C next to saltpeter (oxidiser 0.9). Saltpeter falls through propane. Saltpeter makes burning propane hotter and faster.
- **Molten tin:** Molten tin falls through propane.
- **Kerosene:** Kerosene falls through propane.
- **Acetone:** Acetone falls through propane.
- **Hail:** Hail falls through propane.
- **Ozone:** Propane burns: it catches fire at 470 °C next to ozone (oxidiser 1). Ozone makes burning propane hotter and faster.
- **Cotton:** Cotton falls through propane.
- **Molten chocolate:** Molten chocolate falls through propane.
- **Calcium carbide:** Calcium carbide falls through propane.
- **Iodine:** Iodine falls through propane.
- **Bromine:** Bromine falls through propane.
- **Liquid gallium:** Liquid gallium falls through propane.
- **Cactus seed:** Cactus seed falls through propane.
- **Smoke bomb:** Smoke bomb falls through propane.
- **Peat:** Peat falls through propane.
- **Soda:** Soda falls through propane.

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Hydrogen, Methane, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Chlorine

A poisonous yellow-green gas, very heavy. Sinks and pools low. It kills plants and turns water it touches into acid.

- **State:** Gas, 3.2 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **In water:** dissolves and turns the water into acid
- **Poisons:** living things it touches: they wither

With other elements (77 interact):

- **Sand:** Sand falls through chlorine.
- **Water:** Chlorine dissolves in water and turns it into acid. Water falls through chlorine.
- **Oil:** Oil falls through chlorine.
- **Lava:** Lava falls through chlorine.
- **Gravel:** Gravel falls through chlorine.
- **Ash:** Ash falls through chlorine.
- **Acid:** Acid falls through chlorine.
- **Alcohol:** Alcohol falls through chlorine.
- **Sawdust:** Sawdust falls through chlorine.
- **Salt:** Salt falls through chlorine.
- **Sugar:** Sugar falls through chlorine.
- **Dirt:** Dirt falls through chlorine.
- **Snow:** Snow falls through chlorine.
- **Gunpowder:** Gunpowder falls through chlorine.
- **Nitro:** Nitro falls through chlorine.
- **Shards:** Shards falls through chlorine.
- **Mercury:** Mercury falls through chlorine.
- **Seed:** Seed falls through chlorine.
- **Plant:** Chlorine is toxic: plant touching it withers.
- **Molten copper:** Molten copper falls through chlorine.
- **Clay:** Clay falls through chlorine.
- **Cement:** Cement falls through chlorine.
- **Quicklime:** Quicklime falls through chlorine.
- **Slaked lime:** Slaked lime falls through chlorine.
- **Molten gold:** Molten gold falls through chlorine.
- **Molten aluminium:** Molten aluminium falls through chlorine.
- **Molten lead:** Molten lead falls through chlorine.
- **Rust:** Rust falls through chlorine.
- **Coal:** Coal falls through chlorine.
- **Charcoal:** Charcoal falls through chlorine.
- **Sulfur:** Sulfur falls through chlorine.
- **Petrol:** Petrol falls through chlorine.
- **Molten wax:** Molten wax falls through chlorine.
- **Flour:** Flour falls through chlorine.
- **Thermite:** Thermite falls through chlorine.
- **Honey:** Honey falls through chlorine.
- **Vinegar:** Vinegar falls through chlorine.
- **Bleach:** Bleach falls through chlorine.
- **Lye:** Lye falls through chlorine.
- **Liquid nitrogen:** Liquid nitrogen falls through chlorine.
- **Baking soda:** Baking soda falls through chlorine.
- **Grass seed:** Grass seed falls through chlorine.
- **Grass:** Chlorine is toxic: grass touching it withers.
- **Acorn:** Acorn falls through chlorine.
- **Tree:** Chlorine is toxic: tree touching it withers.
- **Leaves:** Chlorine is toxic: leaves touching it withers.
- **Flower:** Chlorine is toxic: flower touching it withers.
- **Caramel:** Caramel falls through chlorine.
- **Chalk:** Chalk falls through chlorine.
- **Liquid oxygen:** Liquid oxygen falls through chlorine.
- **Molten iron:** Molten iron falls through chlorine.
- **Molten glass:** Molten glass falls through chlorine.
- **Molten silver:** Molten silver falls through chlorine.
- **Popcorn kernel:** Popcorn kernel falls through chlorine.
- **Popcorn:** Popcorn falls through chlorine.
- **Tar:** Tar falls through chlorine.
- **Molten plastic:** Molten plastic falls through chlorine.
- **Pumice:** Pumice falls through chlorine.
- **Napalm:** Napalm falls through chlorine.
- **Hydrogen peroxide:** Hydrogen peroxide falls through chlorine.
- **Firework:** Firework falls through chlorine.
- **Saltpeter:** Saltpeter falls through chlorine.
- **Molten tin:** Molten tin falls through chlorine.
- **Kerosene:** Kerosene falls through chlorine.
- **Acetone:** Acetone falls through chlorine.
- **Hail:** Hail falls through chlorine.
- **Cotton:** Cotton falls through chlorine.
- **Molten chocolate:** Molten chocolate falls through chlorine.
- **Calcium carbide:** Calcium carbide falls through chlorine.
- **Iodine:** Iodine falls through chlorine.
- **Bromine:** Bromine falls through chlorine.
- **Liquid gallium:** Liquid gallium falls through chlorine.
- **Cactus seed:** Cactus seed falls through chlorine.
- **Cactus:** Chlorine is toxic: cactus touching it withers.
- **Smoke bomb:** Smoke bomb falls through chlorine.
- **Peat:** Peat falls through chlorine.
- **Soda:** Soda falls through chlorine.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Sulfur dioxide, Dry ice, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sulfur dioxide

A choking gas, much heavier than air. Sinks and pools low. It turns water it touches into acid and kills plants.

- **State:** Gas, 2.6 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **In water:** dissolves and turns the water into acid
- **Poisons:** living things it touches: they wither

With other elements (77 interact):

- **Sand:** Sand falls through sulfur dioxide.
- **Water:** Sulfur dioxide dissolves in water and turns it into acid. Water falls through sulfur dioxide.
- **Oil:** Oil falls through sulfur dioxide.
- **Lava:** Lava falls through sulfur dioxide.
- **Gravel:** Gravel falls through sulfur dioxide.
- **Ash:** Ash falls through sulfur dioxide.
- **Acid:** Acid falls through sulfur dioxide.
- **Alcohol:** Alcohol falls through sulfur dioxide.
- **Sawdust:** Sawdust falls through sulfur dioxide.
- **Salt:** Salt falls through sulfur dioxide.
- **Sugar:** Sugar falls through sulfur dioxide.
- **Dirt:** Dirt falls through sulfur dioxide.
- **Snow:** Snow falls through sulfur dioxide.
- **Gunpowder:** Gunpowder falls through sulfur dioxide.
- **Nitro:** Nitro falls through sulfur dioxide.
- **Shards:** Shards falls through sulfur dioxide.
- **Mercury:** Mercury falls through sulfur dioxide.
- **Seed:** Seed falls through sulfur dioxide.
- **Plant:** Sulfur dioxide is toxic: plant touching it withers.
- **Molten copper:** Molten copper falls through sulfur dioxide.
- **Clay:** Clay falls through sulfur dioxide.
- **Cement:** Cement falls through sulfur dioxide.
- **Quicklime:** Quicklime falls through sulfur dioxide.
- **Slaked lime:** Slaked lime falls through sulfur dioxide.
- **Molten gold:** Molten gold falls through sulfur dioxide.
- **Molten aluminium:** Molten aluminium falls through sulfur dioxide.
- **Molten lead:** Molten lead falls through sulfur dioxide.
- **Rust:** Rust falls through sulfur dioxide.
- **Coal:** Coal falls through sulfur dioxide.
- **Charcoal:** Charcoal falls through sulfur dioxide.
- **Sulfur:** Sulfur falls through sulfur dioxide.
- **Petrol:** Petrol falls through sulfur dioxide.
- **Molten wax:** Molten wax falls through sulfur dioxide.
- **Flour:** Flour falls through sulfur dioxide.
- **Thermite:** Thermite falls through sulfur dioxide.
- **Honey:** Honey falls through sulfur dioxide.
- **Vinegar:** Vinegar falls through sulfur dioxide.
- **Bleach:** Bleach falls through sulfur dioxide.
- **Lye:** Lye falls through sulfur dioxide.
- **Liquid nitrogen:** Liquid nitrogen falls through sulfur dioxide.
- **Baking soda:** Baking soda falls through sulfur dioxide.
- **Grass seed:** Grass seed falls through sulfur dioxide.
- **Grass:** Sulfur dioxide is toxic: grass touching it withers.
- **Acorn:** Acorn falls through sulfur dioxide.
- **Tree:** Sulfur dioxide is toxic: tree touching it withers.
- **Leaves:** Sulfur dioxide is toxic: leaves touching it withers.
- **Flower:** Sulfur dioxide is toxic: flower touching it withers.
- **Caramel:** Caramel falls through sulfur dioxide.
- **Chalk:** Chalk falls through sulfur dioxide.
- **Liquid oxygen:** Liquid oxygen falls through sulfur dioxide.
- **Molten iron:** Molten iron falls through sulfur dioxide.
- **Molten glass:** Molten glass falls through sulfur dioxide.
- **Molten silver:** Molten silver falls through sulfur dioxide.
- **Popcorn kernel:** Popcorn kernel falls through sulfur dioxide.
- **Popcorn:** Popcorn falls through sulfur dioxide.
- **Tar:** Tar falls through sulfur dioxide.
- **Molten plastic:** Molten plastic falls through sulfur dioxide.
- **Pumice:** Pumice falls through sulfur dioxide.
- **Napalm:** Napalm falls through sulfur dioxide.
- **Hydrogen peroxide:** Hydrogen peroxide falls through sulfur dioxide.
- **Firework:** Firework falls through sulfur dioxide.
- **Saltpeter:** Saltpeter falls through sulfur dioxide.
- **Molten tin:** Molten tin falls through sulfur dioxide.
- **Kerosene:** Kerosene falls through sulfur dioxide.
- **Acetone:** Acetone falls through sulfur dioxide.
- **Hail:** Hail falls through sulfur dioxide.
- **Cotton:** Cotton falls through sulfur dioxide.
- **Molten chocolate:** Molten chocolate falls through sulfur dioxide.
- **Calcium carbide:** Calcium carbide falls through sulfur dioxide.
- **Iodine:** Iodine falls through sulfur dioxide.
- **Bromine:** Bromine falls through sulfur dioxide.
- **Liquid gallium:** Liquid gallium falls through sulfur dioxide.
- **Cactus seed:** Cactus seed falls through sulfur dioxide.
- **Cactus:** Sulfur dioxide is toxic: cactus touching it withers.
- **Smoke bomb:** Smoke bomb falls through sulfur dioxide.
- **Peat:** Peat falls through sulfur dioxide.
- **Soda:** Soda falls through sulfur dioxide.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Dry ice, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dry ice

Frozen carbon dioxide, very cold. Stays put and turns straight into gas without melting, chilling everything nearby.

- **State:** Solid, 1,560 kg/m³
- **Starts at:** -79 °C
- **Sublimes:** at -78 °C, into carbon dioxide

With other elements (25 interact):

- **Water:** Dry ice (-79 °C) is cold enough to freeze water into ice.
- **Steam:** Dry ice (-79 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to turn dry ice into carbon dioxide.
- **Lava:** Dry ice (-79 °C) is cold enough to freeze lava into stone. Lava (1,200 °C) is hot enough to turn dry ice into carbon dioxide.
- **Fire:** Fire (850 °C) is hot enough to turn dry ice into carbon dioxide.
- **Smoke:** Smoke (150 °C) is hot enough to turn dry ice into carbon dioxide.
- **Spark:** Spark (300 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten copper:** Dry ice (-79 °C) is cold enough to freeze molten copper into wire. Molten copper (1,200 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten gold:** Dry ice (-79 °C) is cold enough to freeze molten gold into gold. Molten gold (1,150 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten aluminium:** Dry ice (-79 °C) is cold enough to freeze molten aluminium into aluminium. Molten aluminium (750 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten lead:** Dry ice (-79 °C) is cold enough to freeze molten lead into lead. Molten lead (400 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten wax:** Dry ice (-79 °C) is cold enough to freeze molten wax into wax. Molten wax (80 °C) is hot enough to turn dry ice into carbon dioxide.
- **Caramel:** Caramel (190 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten iron:** Dry ice (-79 °C) is cold enough to freeze molten iron into iron. Molten iron (1,600 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten glass:** Dry ice (-79 °C) is cold enough to freeze molten glass into glass. Molten glass (1,450 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten silver:** Dry ice (-79 °C) is cold enough to freeze molten silver into silver. Molten silver (1,000 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten plastic:** Dry ice (-79 °C) is cold enough to freeze molten plastic into plastic. Molten plastic (200 °C) is hot enough to turn dry ice into carbon dioxide.
- **Lightning:** Lightning (3,000 °C) is hot enough to turn dry ice into carbon dioxide.
- **Plasma:** Plasma (3,000 °C) is hot enough to turn dry ice into carbon dioxide.
- **Rocket:** Rocket (900 °C) is hot enough to turn dry ice into carbon dioxide.
- **Ember:** Ember (700 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten tin:** Dry ice (-79 °C) is cold enough to freeze molten tin into tin. Molten tin (260 °C) is hot enough to turn dry ice into carbon dioxide.
- **Molten chocolate:** Dry ice (-79 °C) is cold enough to freeze molten chocolate into chocolate. Molten chocolate (45 °C) is hot enough to turn dry ice into carbon dioxide.
- **Iodine vapour:** Dry ice (-79 °C) is cold enough to condense iodine vapour into iodine. Iodine vapour (130 °C) is hot enough to turn dry ice into carbon dioxide.
- **Bromine vapour:** Dry ice (-79 °C) is cold enough to condense bromine vapour into bromine. Bromine vapour (70 °C) is hot enough to turn dry ice into carbon dioxide.
- **Liquid gallium:** Dry ice (-79 °C) is cold enough to freeze liquid gallium into gallium. Liquid gallium (35 °C) is hot enough to turn dry ice into carbon dioxide.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Titanium, Platinum, Argon, Bromine, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Baking soda

A mild white powder and a base. Falls and piles. Acid makes it fizz into carbon dioxide, and it dissolves a little in water.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Dissolves in:** water, up to 20% of a cell; boiling leaves it as crystals

With other elements (40 interact):

- **Water:** Baking soda dissolves into water: water is a solvent and each cell holds up to 20% baking soda. Baking soda sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Baking soda sinks through oil (1,100 vs 900 kg/m³).
- **Ice:** Baking soda melts ice: dissolved, it lowers the freezing point.
- **Steam:** Baking soda falls through steam.
- **Fire:** Baking soda falls through fire.
- **Smoke:** Baking soda falls through smoke.
- **Acid:** Baking soda and acid neutralise each other into water, fizzing out carbon dioxide, and warm up. Acid and baking soda neutralise each other into water, fizzing out carbon dioxide, and warm up.
- **Hydrogen:** Baking soda falls through hydrogen.
- **Oxygen:** Baking soda falls through oxygen.
- **Methane:** Baking soda falls through methane.
- **Alcohol:** Baking soda sinks through alcohol (1,100 vs 789 kg/m³).
- **Snow:** Baking soda melts snow: dissolved, it lowers the freezing point.
- **Spark:** Baking soda falls through spark.
- **Petrol:** Baking soda sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Baking soda sinks through molten wax (1,100 vs 800 kg/m³).
- **Vinegar:** Baking soda and vinegar neutralise each other into water, fizzing out carbon dioxide, and warm up. Baking soda sinks through vinegar (1,100 vs 1,010 kg/m³). Vinegar and baking soda neutralise each other into water, fizzing out carbon dioxide, and warm up.
- **Liquid nitrogen:** Baking soda sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Baking soda falls through nitrogen.
- **Carbon dioxide:** Baking soda falls through carbon dioxide.
- **Helium:** Baking soda falls through helium.
- **Propane:** Baking soda falls through propane.
- **Chlorine:** Baking soda falls through chlorine.
- **Sulfur dioxide:** Baking soda falls through sulfur dioxide.
- **Cloud:** Baking soda falls through cloud.
- **Molten plastic:** Baking soda sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Baking soda sinks through napalm (1,100 vs 900 kg/m³).
- **Lightning:** Baking soda falls through lightning.
- **Plasma:** Baking soda falls through plasma.
- **Rocket:** Baking soda falls through rocket.
- **Ember:** Baking soda falls through ember.
- **Kerosene:** Baking soda sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Baking soda sinks through acetone (1,100 vs 784 kg/m³).
- **Hail:** Baking soda melts hail: dissolved, it lowers the freezing point.
- **Ammonia:** Baking soda falls through ammonia.
- **Ozone:** Baking soda falls through ozone.
- **Acetylene:** Baking soda falls through acetylene.
- **Iodine vapour:** Baking soda falls through iodine vapour.
- **Argon:** Baking soda falls through argon.
- **Bromine vapour:** Baking soda falls through bromine vapour.
- **Soda:** Baking soda sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### C4

A putty-like plastic explosive. Stays put. A flame alone will not set it off, but a spark or great heat does, with a huge blast.

- **State:** Solid, 1,600 kg/m³
- **Explodes:** from 900 °C or a flame; blast radius 6 cells
- **A flame:** will not light it; it needs 900 °C or a spark
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (13 interact):

- **Air:** C4 explodes at 900 °C; it needs no air.
- **Lava:** Lava (1,200 °C) can set c4 on fire (it ignites at 900 °C).
- **Acid:** Acid eats c4: acidity 0.8 beats hardness 0.3.
- **Oxygen:** C4 explodes at 900 °C; it needs no air. Oxygen makes burning c4 hotter and faster.
- **Molten copper:** Molten copper (1,200 °C) can set c4 on fire (it ignites at 900 °C).
- **Molten gold:** Molten gold (1,150 °C) can set c4 on fire (it ignites at 900 °C).
- **Liquid oxygen:** C4 explodes at 900 °C; it needs no air.
- **Molten iron:** Molten iron (1,600 °C) can set c4 on fire (it ignites at 900 °C).
- **Molten glass:** Molten glass (1,450 °C) can set c4 on fire (it ignites at 900 °C).
- **Molten silver:** Molten silver (1,000 °C) can set c4 on fire (it ignites at 900 °C).
- **Hydrogen peroxide:** C4 explodes at 900 °C; it needs no air. Hydrogen peroxide makes burning c4 hotter and faster.
- **Saltpeter:** C4 explodes at 900 °C; it needs no air. Saltpeter makes burning c4 hotter and faster.
- **Ozone:** C4 explodes at 900 °C; it needs no air. Ozone makes burning c4 hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Grass seed

Tiny pale seeds, a light powder. Falls and sinks in water. On damp soil it sprouts into a short tuft of grass.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 120 cells/s
- **Burns:** from 250 °C in air, 0.67 s per cell, leaves ash
- **Grows:** into grass on damp soil (wet dirt or sand), even under a puddle

With other elements (49 interact):

- **Air:** Grass seed burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Water:** Grass seed sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Grass seed sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Grass seed falls through steam.
- **Lava:** Lava (1,200 °C) can set grass seed on fire (it ignites at 250 °C).
- **Fire:** Grass seed catches from the flame touching it. Grass seed falls through fire.
- **Smoke:** Grass seed falls through smoke.
- **Hydrogen:** Grass seed falls through hydrogen.
- **Oxygen:** Grass seed burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Grass seed falls through oxygen. Oxygen makes burning grass seed hotter and faster.
- **Methane:** Grass seed falls through methane.
- **Alcohol:** Grass seed sinks through alcohol (1,100 vs 789 kg/m³).
- **Spark:** Grass seed catches from the flame touching it. Grass seed falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set grass seed on fire (it ignites at 250 °C).
- **Molten gold:** Molten gold (1,150 °C) can set grass seed on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set grass seed on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead (400 °C) can set grass seed on fire (it ignites at 250 °C).
- **Petrol:** Grass seed sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Grass seed sinks through molten wax (1,100 vs 800 kg/m³).
- **Vinegar:** Grass seed sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Liquid nitrogen:** Grass seed sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Grass seed falls through nitrogen.
- **Carbon dioxide:** Grass seed falls through carbon dioxide.
- **Helium:** Grass seed falls through helium.
- **Propane:** Grass seed falls through propane.
- **Chlorine:** Grass seed falls through chlorine.
- **Sulfur dioxide:** Grass seed falls through sulfur dioxide.
- **Cloud:** Grass seed falls through cloud.
- **Liquid oxygen:** Grass seed burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set grass seed on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass (1,450 °C) can set grass seed on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver (1,000 °C) can set grass seed on fire (it ignites at 250 °C).
- **Molten plastic:** Grass seed sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Grass seed sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Grass seed burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning grass seed hotter and faster.
- **Lightning:** Grass seed catches from the flame touching it. Grass seed falls through lightning.
- **Plasma:** Grass seed catches from the flame touching it. Grass seed falls through plasma.
- **Rocket:** Grass seed catches from the flame touching it. Grass seed falls through rocket.
- **Ember:** Grass seed catches from the flame touching it. Grass seed falls through ember.
- **Saltpeter:** Grass seed burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning grass seed hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set grass seed on fire (it ignites at 250 °C).
- **Kerosene:** Grass seed sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Grass seed sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Grass seed falls through ammonia.
- **Ozone:** Grass seed burns: it catches fire at 250 °C next to ozone (oxidiser 1). Grass seed falls through ozone. Ozone makes burning grass seed hotter and faster.
- **Acetylene:** Grass seed falls through acetylene.
- **Iodine vapour:** Grass seed falls through iodine vapour.
- **Argon:** Grass seed falls through argon.
- **Bromine vapour:** Grass seed falls through bromine vapour.
- **Soda:** Grass seed sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Grass

Short living blades. Stays put and drinks from damp soil. Dried out it withers into dry plant, and it burns easily.

- **State:** Solid, 600 kg/m³
- **Burns:** from 220 °C in air, 0.67 s per cell, leaves ash
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (30 interact):

- **Air:** Grass burns: it catches fire at 220 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set grass on fire (it ignites at 220 °C).
- **Fire:** Grass catches from the flame touching it.
- **Acid:** Acid eats grass: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Grass burns: it catches fire at 220 °C next to oxygen (oxidiser 1). Oxygen makes burning grass hotter and faster.
- **Salt:** Salt is toxic: grass touching it withers.
- **Spark:** Grass catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set grass on fire (it ignites at 220 °C).
- **Molten gold:** Molten gold (1,150 °C) can set grass on fire (it ignites at 220 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set grass on fire (it ignites at 220 °C).
- **Molten lead:** Molten lead (400 °C) can set grass on fire (it ignites at 220 °C).
- **Bleach:** Bleach is toxic: grass touching it withers.
- **Chlorine:** Chlorine is toxic: grass touching it withers.
- **Sulfur dioxide:** Sulfur dioxide is toxic: grass touching it withers.
- **Liquid oxygen:** Grass burns: it catches fire at 220 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set grass on fire (it ignites at 220 °C).
- **Molten glass:** Molten glass (1,450 °C) can set grass on fire (it ignites at 220 °C).
- **Molten silver:** Molten silver (1,000 °C) can set grass on fire (it ignites at 220 °C).
- **Hydrogen peroxide:** Grass burns: it catches fire at 220 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning grass hotter and faster.
- **Lightning:** Grass catches from the flame touching it.
- **Plasma:** Grass catches from the flame touching it.
- **Rocket:** Grass catches from the flame touching it.
- **Ember:** Grass catches from the flame touching it.
- **Saltpeter:** Grass burns: it catches fire at 220 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning grass hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set grass on fire (it ignites at 220 °C).
- **Uranium:** Uranium is toxic: grass touching it withers.
- **Ammonia:** Ammonia is toxic: grass touching it withers.
- **Ozone:** Grass burns: it catches fire at 220 °C next to ozone (oxidiser 1). Ozone is toxic: grass touching it withers. Ozone makes burning grass hotter and faster.
- **Bromine:** Bromine is toxic: grass touching it withers.
- **Bromine vapour:** Bromine vapour is toxic: grass touching it withers.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acorn

A heavy brown seed, a powder. Falls and sinks in water. On damp soil it sprouts into a tall, branching tree.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Burns:** from 260 °C in air, 1 s per cell, leaves ash
- **Grows:** into tree on damp soil (wet dirt or sand), even under a puddle

With other elements (49 interact):

- **Air:** Acorn burns: it catches fire at 260 °C next to air (oxidiser 0.21).
- **Water:** Acorn sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Acorn sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Acorn falls through steam.
- **Lava:** Lava (1,200 °C) can set acorn on fire (it ignites at 260 °C).
- **Fire:** Acorn catches from the flame touching it. Acorn falls through fire.
- **Smoke:** Acorn falls through smoke.
- **Hydrogen:** Acorn falls through hydrogen.
- **Oxygen:** Acorn burns: it catches fire at 260 °C next to oxygen (oxidiser 1). Acorn falls through oxygen. Oxygen makes burning acorn hotter and faster.
- **Methane:** Acorn falls through methane.
- **Alcohol:** Acorn sinks through alcohol (1,100 vs 789 kg/m³).
- **Spark:** Acorn catches from the flame touching it. Acorn falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set acorn on fire (it ignites at 260 °C).
- **Molten gold:** Molten gold (1,150 °C) can set acorn on fire (it ignites at 260 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set acorn on fire (it ignites at 260 °C).
- **Molten lead:** Molten lead (400 °C) can set acorn on fire (it ignites at 260 °C).
- **Petrol:** Acorn sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Acorn sinks through molten wax (1,100 vs 800 kg/m³).
- **Vinegar:** Acorn sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Liquid nitrogen:** Acorn sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Acorn falls through nitrogen.
- **Carbon dioxide:** Acorn falls through carbon dioxide.
- **Helium:** Acorn falls through helium.
- **Propane:** Acorn falls through propane.
- **Chlorine:** Acorn falls through chlorine.
- **Sulfur dioxide:** Acorn falls through sulfur dioxide.
- **Cloud:** Acorn falls through cloud.
- **Liquid oxygen:** Acorn burns: it catches fire at 260 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set acorn on fire (it ignites at 260 °C).
- **Molten glass:** Molten glass (1,450 °C) can set acorn on fire (it ignites at 260 °C).
- **Molten silver:** Molten silver (1,000 °C) can set acorn on fire (it ignites at 260 °C).
- **Molten plastic:** Acorn sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Acorn sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Acorn burns: it catches fire at 260 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning acorn hotter and faster.
- **Lightning:** Acorn catches from the flame touching it. Acorn falls through lightning.
- **Plasma:** Acorn catches from the flame touching it. Acorn falls through plasma.
- **Rocket:** Acorn catches from the flame touching it. Acorn falls through rocket.
- **Ember:** Acorn catches from the flame touching it. Acorn falls through ember.
- **Saltpeter:** Acorn burns: it catches fire at 260 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning acorn hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set acorn on fire (it ignites at 260 °C).
- **Kerosene:** Acorn sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Acorn sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Acorn falls through ammonia.
- **Ozone:** Acorn burns: it catches fire at 260 °C next to ozone (oxidiser 1). Acorn falls through ozone. Ozone makes burning acorn hotter and faster.
- **Acetylene:** Acorn falls through acetylene.
- **Iodine vapour:** Acorn falls through iodine vapour.
- **Argon:** Acorn falls through argon.
- **Bromine vapour:** Acorn falls through bromine vapour.
- **Soda:** Acorn sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Tree

A living woody trunk. Grows tall and branches, drinking from damp soil and putting out leaves. Dead and dry, it is plain wood.

- **State:** Solid, 750 kg/m³
- **Burns:** from 300 °C in air, 2.5 s per cell, leaves ash
- **Leaves:** grows leaves beside its branches
- **Lives:** on water drawn from damp soil; dried out, it withers into wood
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (29 interact):

- **Air:** Tree burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set tree on fire (it ignites at 300 °C).
- **Fire:** Tree catches from the flame touching it.
- **Acid:** Acid eats tree: acidity 0.8 beats hardness 0.3.
- **Oxygen:** Tree burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning tree hotter and faster.
- **Salt:** Salt is toxic: tree touching it withers.
- **Spark:** Tree catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set tree on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set tree on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set tree on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set tree on fire (it ignites at 300 °C).
- **Bleach:** Bleach is toxic: tree touching it withers.
- **Chlorine:** Chlorine is toxic: tree touching it withers.
- **Sulfur dioxide:** Sulfur dioxide is toxic: tree touching it withers.
- **Liquid oxygen:** Tree burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set tree on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set tree on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set tree on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Tree burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning tree hotter and faster.
- **Lightning:** Tree catches from the flame touching it.
- **Plasma:** Tree catches from the flame touching it.
- **Rocket:** Tree catches from the flame touching it.
- **Ember:** Tree catches from the flame touching it.
- **Saltpeter:** Tree burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning tree hotter and faster.
- **Uranium:** Uranium is toxic: tree touching it withers.
- **Ammonia:** Ammonia is toxic: tree touching it withers.
- **Ozone:** Tree burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone is toxic: tree touching it withers. Ozone makes burning tree hotter and faster.
- **Bromine:** Bromine is toxic: tree touching it withers.
- **Bromine vapour:** Bromine vapour is toxic: tree touching it withers.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Leaves

Living green leaves on a tree. Stay put and take water from the branch. Dried out they wither, and they burn easily.

- **State:** Solid, 500 kg/m³
- **Burns:** from 230 °C in air, 0.5 s per cell, leaves ash
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (30 interact):

- **Air:** Leaves burns: it catches fire at 230 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set leaves on fire (it ignites at 230 °C).
- **Fire:** Leaves catches from the flame touching it.
- **Acid:** Acid eats leaves: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Leaves burns: it catches fire at 230 °C next to oxygen (oxidiser 1). Oxygen makes burning leaves hotter and faster.
- **Salt:** Salt is toxic: leaves touching it withers.
- **Spark:** Leaves catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set leaves on fire (it ignites at 230 °C).
- **Molten gold:** Molten gold (1,150 °C) can set leaves on fire (it ignites at 230 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set leaves on fire (it ignites at 230 °C).
- **Molten lead:** Molten lead (400 °C) can set leaves on fire (it ignites at 230 °C).
- **Bleach:** Bleach is toxic: leaves touching it withers.
- **Chlorine:** Chlorine is toxic: leaves touching it withers.
- **Sulfur dioxide:** Sulfur dioxide is toxic: leaves touching it withers.
- **Liquid oxygen:** Leaves burns: it catches fire at 230 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set leaves on fire (it ignites at 230 °C).
- **Molten glass:** Molten glass (1,450 °C) can set leaves on fire (it ignites at 230 °C).
- **Molten silver:** Molten silver (1,000 °C) can set leaves on fire (it ignites at 230 °C).
- **Hydrogen peroxide:** Leaves burns: it catches fire at 230 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning leaves hotter and faster.
- **Lightning:** Leaves catches from the flame touching it.
- **Plasma:** Leaves catches from the flame touching it.
- **Rocket:** Leaves catches from the flame touching it.
- **Ember:** Leaves catches from the flame touching it.
- **Saltpeter:** Leaves burns: it catches fire at 230 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning leaves hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set leaves on fire (it ignites at 230 °C).
- **Uranium:** Uranium is toxic: leaves touching it withers.
- **Ammonia:** Ammonia is toxic: leaves touching it withers.
- **Ozone:** Leaves burns: it catches fire at 230 °C next to ozone (oxidiser 1). Ozone is toxic: leaves touching it withers. Ozone makes burning leaves hotter and faster.
- **Bromine:** Bromine is toxic: leaves touching it withers.
- **Bromine vapour:** Bromine vapour is toxic: leaves touching it withers.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Flower

A bright bloom at the tip of a plant. Stays put and takes water from the stem. Dried out it withers, and it burns easily.

- **State:** Solid, 400 kg/m³
- **Burns:** from 220 °C in air, 0.33 s per cell, leaves ash
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (30 interact):

- **Air:** Flower burns: it catches fire at 220 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set flower on fire (it ignites at 220 °C).
- **Fire:** Flower catches from the flame touching it.
- **Acid:** Acid eats flower: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Flower burns: it catches fire at 220 °C next to oxygen (oxidiser 1). Oxygen makes burning flower hotter and faster.
- **Salt:** Salt is toxic: flower touching it withers.
- **Spark:** Flower catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set flower on fire (it ignites at 220 °C).
- **Molten gold:** Molten gold (1,150 °C) can set flower on fire (it ignites at 220 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set flower on fire (it ignites at 220 °C).
- **Molten lead:** Molten lead (400 °C) can set flower on fire (it ignites at 220 °C).
- **Bleach:** Bleach is toxic: flower touching it withers.
- **Chlorine:** Chlorine is toxic: flower touching it withers.
- **Sulfur dioxide:** Sulfur dioxide is toxic: flower touching it withers.
- **Liquid oxygen:** Flower burns: it catches fire at 220 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set flower on fire (it ignites at 220 °C).
- **Molten glass:** Molten glass (1,450 °C) can set flower on fire (it ignites at 220 °C).
- **Molten silver:** Molten silver (1,000 °C) can set flower on fire (it ignites at 220 °C).
- **Hydrogen peroxide:** Flower burns: it catches fire at 220 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning flower hotter and faster.
- **Lightning:** Flower catches from the flame touching it.
- **Plasma:** Flower catches from the flame touching it.
- **Rocket:** Flower catches from the flame touching it.
- **Ember:** Flower catches from the flame touching it.
- **Saltpeter:** Flower burns: it catches fire at 220 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning flower hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set flower on fire (it ignites at 220 °C).
- **Uranium:** Uranium is toxic: flower touching it withers.
- **Ammonia:** Ammonia is toxic: flower touching it withers.
- **Ozone:** Flower burns: it catches fire at 220 °C next to ozone (oxidiser 1). Ozone is toxic: flower touching it withers. Ozone makes burning flower hotter and faster.
- **Bromine:** Bromine is toxic: flower touching it withers.
- **Bromine vapour:** Bromine vapour is toxic: flower touching it withers.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cloud

A drifting mass of droplets, a gas. Rises slowly and spreads. It rains, or snows when below freezing, until it runs dry.

- **State:** Gas, 1.1 kg/m³
- **In air:** Rises (lighter than air)
- **Rains:** water, or snow below 0 °C, until it runs dry

With other elements (71 interact):

- **Sand:** Sand falls through cloud.
- **Water:** Water falls through cloud.
- **Oil:** Oil falls through cloud.
- **Lava:** Lava falls through cloud.
- **Gravel:** Gravel falls through cloud.
- **Ash:** Ash falls through cloud.
- **Acid:** Acid falls through cloud.
- **Alcohol:** Alcohol falls through cloud.
- **Sawdust:** Sawdust falls through cloud.
- **Salt:** Salt falls through cloud.
- **Sugar:** Sugar falls through cloud.
- **Dirt:** Dirt falls through cloud.
- **Snow:** Snow falls through cloud.
- **Gunpowder:** Gunpowder falls through cloud.
- **Nitro:** Nitro falls through cloud.
- **Shards:** Shards falls through cloud.
- **Mercury:** Mercury falls through cloud.
- **Seed:** Seed falls through cloud.
- **Molten copper:** Molten copper falls through cloud.
- **Clay:** Clay falls through cloud.
- **Cement:** Cement falls through cloud.
- **Quicklime:** Quicklime falls through cloud.
- **Slaked lime:** Slaked lime falls through cloud.
- **Molten gold:** Molten gold falls through cloud.
- **Molten aluminium:** Molten aluminium falls through cloud.
- **Molten lead:** Molten lead falls through cloud.
- **Rust:** Rust falls through cloud.
- **Coal:** Coal falls through cloud.
- **Charcoal:** Charcoal falls through cloud.
- **Sulfur:** Sulfur falls through cloud.
- **Petrol:** Petrol falls through cloud.
- **Molten wax:** Molten wax falls through cloud.
- **Flour:** Flour falls through cloud.
- **Thermite:** Thermite falls through cloud.
- **Honey:** Honey falls through cloud.
- **Vinegar:** Vinegar falls through cloud.
- **Bleach:** Bleach falls through cloud.
- **Lye:** Lye falls through cloud.
- **Liquid nitrogen:** Liquid nitrogen falls through cloud.
- **Baking soda:** Baking soda falls through cloud.
- **Grass seed:** Grass seed falls through cloud.
- **Acorn:** Acorn falls through cloud.
- **Caramel:** Caramel falls through cloud.
- **Chalk:** Chalk falls through cloud.
- **Liquid oxygen:** Liquid oxygen falls through cloud.
- **Molten iron:** Molten iron falls through cloud.
- **Molten glass:** Molten glass falls through cloud.
- **Molten silver:** Molten silver falls through cloud.
- **Popcorn kernel:** Popcorn kernel falls through cloud.
- **Popcorn:** Popcorn falls through cloud.
- **Tar:** Tar falls through cloud.
- **Molten plastic:** Molten plastic falls through cloud.
- **Pumice:** Pumice falls through cloud.
- **Napalm:** Napalm falls through cloud.
- **Hydrogen peroxide:** Hydrogen peroxide falls through cloud.
- **Firework:** Firework falls through cloud.
- **Saltpeter:** Saltpeter falls through cloud.
- **Molten tin:** Molten tin falls through cloud.
- **Kerosene:** Kerosene falls through cloud.
- **Acetone:** Acetone falls through cloud.
- **Hail:** Hail falls through cloud.
- **Cotton:** Cotton falls through cloud.
- **Molten chocolate:** Molten chocolate falls through cloud.
- **Calcium carbide:** Calcium carbide falls through cloud.
- **Iodine:** Iodine falls through cloud.
- **Bromine:** Bromine falls through cloud.
- **Liquid gallium:** Liquid gallium falls through cloud.
- **Cactus seed:** Cactus seed falls through cloud.
- **Smoke bomb:** Smoke bomb falls through cloud.
- **Peat:** Peat falls through cloud.
- **Soda:** Soda falls through cloud.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Heater

A hot plate. Stays put and holds itself at a steady high heat, warming whatever touches it.

- **State:** Solid, 3,000 kg/m³
- **Holds:** itself at 300 °C
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cooler

A cold plate. Stays put and holds itself far below freezing, chilling whatever touches it.

- **State:** Solid, 3,000 kg/m³
- **Holds:** itself at -60 °C
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Clone

A copying block. Stays put. It learns the first element that touches it and keeps making more of it in the space around.

- **State:** Solid, 3,000 kg/m³
- **Copies:** the first element that touches it into the space around
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Void

A hole in the world. Stays put and deletes anything that touches it, except walls and other devices.

- **State:** Solid, 3,000 kg/m³
- **Deletes:** anything that touches it, except walls and devices
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fan

A blower. Stays put and pushes a steady stream of air upwards, lifting gases, flames and light powders.

- **State:** Solid, 3,000 kg/m³
- **Blows:** air upwards above it
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bulb

A light bulb filament. Stays put and carries charge; current heats it until it glows, and it fades when the power stops.

- **State:** Solid, 3,000 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Glows:** when current heats it, fading when the power stops
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Magnesium

A light silvery metal. Stays put. Once very hot it burns with a blinding white flame, hot enough to set off thermite.

- **State:** Solid, 1,740 kg/m³
- **Burns:** from 650 °C in air, 2 s per cell, leaves ash
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.35 (acid stronger than this eats it)

With other elements (20 interact):

- **Air:** Magnesium burns: it catches fire at 650 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set magnesium on fire (it ignites at 650 °C).
- **Fire:** Magnesium catches from the flame touching it.
- **Acid:** Acid eats magnesium: acidity 0.8 beats hardness 0.35, giving off hydrogen.
- **Oxygen:** Magnesium burns: it catches fire at 650 °C next to oxygen (oxidiser 1). Oxygen makes burning magnesium hotter and faster.
- **Spark:** Magnesium catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set magnesium on fire (it ignites at 650 °C).
- **Molten gold:** Molten gold (1,150 °C) can set magnesium on fire (it ignites at 650 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set magnesium on fire (it ignites at 650 °C).
- **Liquid oxygen:** Magnesium burns: it catches fire at 650 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set magnesium on fire (it ignites at 650 °C).
- **Molten glass:** Molten glass (1,450 °C) can set magnesium on fire (it ignites at 650 °C).
- **Molten silver:** Molten silver (1,000 °C) can set magnesium on fire (it ignites at 650 °C).
- **Hydrogen peroxide:** Magnesium burns: it catches fire at 650 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning magnesium hotter and faster.
- **Lightning:** Magnesium catches from the flame touching it.
- **Plasma:** Magnesium catches from the flame touching it.
- **Rocket:** Magnesium catches from the flame touching it.
- **Ember:** Magnesium catches from the flame touching it.
- **Saltpeter:** Magnesium burns: it catches fire at 650 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning magnesium hotter and faster.
- **Ozone:** Magnesium burns: it catches fire at 650 °C next to ozone (oxidiser 1). Ozone makes burning magnesium hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Potassium

A very soft, light metal. Stays put. Water touching it makes it burst into lye and burning hydrogen, even more fiercely than sodium.

- **State:** Solid, 862 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.05 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Potassium bursts in water: it becomes lye and hydrogen, hot enough to set the hydrogen alight.
- **Acid:** Acid eats potassium: acidity 0.8 beats hardness 0.05, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Caramel

Melted, browned sugar. Oozes very slowly. It burns once it gets very hot.

- **State:** Liquid, 1,300 kg/m³
- **Starts at:** 190 °C
- **In liquids:** Sinks through liquids lighter than 1,300 kg/m³, floats on heavier ones
- **Falls:** up to 30 cells/s
- **Burns:** from 400 °C in air, 3.33 s per cell, leaves ash

With other elements (86 interact):

- **Air:** Caramel burns: it catches fire at 400 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through caramel (1,600 vs 1,300 kg/m³).
- **Water:** Caramel sinks through water (1,300 vs 1,000 kg/m³). Caramel (190 °C) is hot enough to boil water into steam.
- **Oil:** Caramel sinks through oil (1,300 vs 900 kg/m³).
- **Ice:** Caramel (190 °C) is hot enough to melt ice into water.
- **Steam:** Caramel falls through steam.
- **Lava:** Lava sinks through caramel (2,600 vs 1,300 kg/m³). Lava (1,200 °C) can set caramel on fire (it ignites at 400 °C).
- **Gravel:** Gravel sinks through caramel (2,000 vs 1,300 kg/m³).
- **Fire:** Caramel catches from the flame touching it. Caramel falls through fire.
- **Smoke:** Caramel falls through smoke.
- **Acid:** Caramel sinks through acid (1,300 vs 1,100 kg/m³).
- **Hydrogen:** Caramel falls through hydrogen.
- **Oxygen:** Caramel burns: it catches fire at 400 °C next to oxygen (oxidiser 1). Caramel falls through oxygen. Oxygen makes burning caramel hotter and faster.
- **Methane:** Caramel falls through methane.
- **Alcohol:** Caramel sinks through alcohol (1,300 vs 789 kg/m³).
- **Salt:** Salt sinks through caramel (2,160 vs 1,300 kg/m³).
- **Sugar:** Sugar sinks through caramel (1,590 vs 1,300 kg/m³).
- **Dirt:** Dirt sinks through caramel (1,500 vs 1,300 kg/m³).
- **Snow:** Caramel (190 °C) is hot enough to melt snow into water.
- **Gunpowder:** Gunpowder sinks through caramel (1,700 vs 1,300 kg/m³).
- **Nitro:** Nitro sinks through caramel (1,600 vs 1,300 kg/m³).
- **Shards:** Shards sinks through caramel (2,500 vs 1,300 kg/m³).
- **Spark:** Caramel catches from the flame touching it. Caramel falls through spark.
- **Mercury:** Mercury sinks through caramel (13,534 vs 1,300 kg/m³).
- **Molten copper:** Molten copper sinks through caramel (8,020 vs 1,300 kg/m³). Molten copper (1,200 °C) can set caramel on fire (it ignites at 400 °C).
- **Clay:** Clay sinks through caramel (1,700 vs 1,300 kg/m³).
- **Cement:** Cement sinks through caramel (1,440 vs 1,300 kg/m³).
- **Molten gold:** Molten gold sinks through caramel (17,300 vs 1,300 kg/m³). Molten gold (1,150 °C) can set caramel on fire (it ignites at 400 °C).
- **Molten aluminium:** Molten aluminium sinks through caramel (2,375 vs 1,300 kg/m³). Molten aluminium (750 °C) can set caramel on fire (it ignites at 400 °C).
- **Molten lead:** Molten lead sinks through caramel (10,660 vs 1,300 kg/m³). Molten lead (400 °C) can set caramel on fire (it ignites at 400 °C).
- **Rust:** Rust sinks through caramel (2,000 vs 1,300 kg/m³).
- **Coal:** Coal sinks through caramel (1,350 vs 1,300 kg/m³).
- **Sulfur:** Sulfur sinks through caramel (2,000 vs 1,300 kg/m³).
- **Petrol:** Caramel sinks through petrol (1,300 vs 740 kg/m³).
- **Wax:** Caramel (190 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Caramel sinks through molten wax (1,300 vs 800 kg/m³).
- **Thermite:** Thermite sinks through caramel (1,500 vs 1,300 kg/m³).
- **Honey:** Honey sinks through caramel (1,420 vs 1,300 kg/m³).
- **Vinegar:** Caramel sinks through vinegar (1,300 vs 1,010 kg/m³).
- **Bleach:** Caramel sinks through bleach (1,300 vs 1,100 kg/m³).
- **Lye:** Caramel sinks through lye (1,300 vs 1,100 kg/m³).
- **Liquid nitrogen:** Caramel sinks through liquid nitrogen (1,300 vs 808 kg/m³). Caramel (190 °C) is hot enough to boil liquid nitrogen into nitrogen.
- **Nitrogen:** Caramel falls through nitrogen.
- **Carbon dioxide:** Caramel falls through carbon dioxide.
- **Helium:** Caramel falls through helium.
- **Propane:** Caramel falls through propane.
- **Chlorine:** Caramel falls through chlorine.
- **Sulfur dioxide:** Caramel falls through sulfur dioxide.
- **Dry ice:** Caramel (190 °C) is hot enough to turn dry ice into carbon dioxide.
- **Cloud:** Caramel falls through cloud.
- **Chalk:** Chalk sinks through caramel (1,500 vs 1,300 kg/m³).
- **Liquid oxygen:** Caramel burns: it catches fire at 400 °C next to liquid oxygen (oxidiser 1). Caramel sinks through liquid oxygen (1,300 vs 1,141 kg/m³). Caramel (190 °C) is hot enough to boil liquid oxygen into oxygen.
- **Molten iron:** Molten iron sinks through caramel (6,980 vs 1,300 kg/m³). Molten iron (1,600 °C) can set caramel on fire (it ignites at 400 °C).
- **Molten glass:** Molten glass sinks through caramel (2,400 vs 1,300 kg/m³). Molten glass (1,450 °C) can set caramel on fire (it ignites at 400 °C).
- **Molten silver:** Molten silver sinks through caramel (9,320 vs 1,300 kg/m³). Molten silver (1,000 °C) can set caramel on fire (it ignites at 400 °C).
- **Tar:** Caramel sinks through tar (1,300 vs 1,150 kg/m³).
- **Plastic:** Caramel (190 °C) is hot enough to melt plastic into molten plastic.
- **Molten plastic:** Caramel sinks through molten plastic (1,300 vs 900 kg/m³).
- **Napalm:** Caramel sinks through napalm (1,300 vs 900 kg/m³).
- **Hydrogen peroxide:** Caramel burns: it catches fire at 400 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through caramel (1,450 vs 1,300 kg/m³). Hydrogen peroxide makes burning caramel hotter and faster.
- **Lightning:** Caramel catches from the flame touching it. Caramel falls through lightning.
- **Plasma:** Caramel catches from the flame touching it. Caramel falls through plasma.
- **Firework:** Firework sinks through caramel (1,400 vs 1,300 kg/m³).
- **Rocket:** Caramel catches from the flame touching it. Caramel falls through rocket.
- **Ember:** Caramel catches from the flame touching it. Caramel falls through ember.
- **Saltpeter:** Caramel burns: it catches fire at 400 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through caramel (2,100 vs 1,300 kg/m³). Saltpeter makes burning caramel hotter and faster.
- **Molten tin:** Molten tin sinks through caramel (6,990 vs 1,300 kg/m³).
- **Kerosene:** Caramel sinks through kerosene (1,300 vs 800 kg/m³).
- **Acetone:** Caramel sinks through acetone (1,300 vs 784 kg/m³).
- **Hail:** Caramel (190 °C) is hot enough to melt hail into water.
- **Ammonia:** Caramel falls through ammonia.
- **Ozone:** Caramel burns: it catches fire at 400 °C next to ozone (oxidiser 1). Caramel falls through ozone. Ozone makes burning caramel hotter and faster.
- **Chocolate:** Caramel (190 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Caramel sinks through molten chocolate (1,300 vs 1,250 kg/m³).
- **Phosphorus:** Caramel (190 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide sinks through caramel (2,220 vs 1,300 kg/m³).
- **Acetylene:** Caramel falls through acetylene.
- **Iodine:** Caramel (190 °C) is hot enough to turn iodine into iodine vapour. Iodine sinks through caramel (4,930 vs 1,300 kg/m³).
- **Iodine vapour:** Caramel falls through iodine vapour.
- **Argon:** Caramel falls through argon.
- **Bromine:** Caramel (190 °C) is hot enough to boil bromine into bromine vapour. Bromine sinks through caramel (3,100 vs 1,300 kg/m³).
- **Bromine vapour:** Caramel falls through bromine vapour.
- **Gallium:** Caramel (190 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through caramel (6,095 vs 1,300 kg/m³).
- **Soda:** Caramel sinks through soda (1,300 vs 1,010 kg/m³).
- **Fuse:** Caramel (190 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Wall, Stone, Wood, Ash, Iron, Sawdust, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Paper, Rubber, Flour, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Egg, Cooked egg, Lithium, Titanium, Platinum, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Marble

Polished white rock, a carbonate. Stays put. Acid fizzes it away into carbon dioxide, and great heat bakes it into quicklime.

- **State:** Solid, 2,700 kg/m³
- **Bakes:** at 900 °C into quicklime, giving off carbon dioxide; there is no way back
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Hardness:** 0.5 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats marble: acidity 0.8 beats hardness 0.5, fizzing out carbon dioxide.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Chalk

Soft white carbonate, a powder. Falls and piles. Acid fizzes it away into carbon dioxide.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (45 interact):

- **Water:** Chalk sinks through water (1,500 vs 1,000 kg/m³).
- **Oil:** Chalk sinks through oil (1,500 vs 900 kg/m³).
- **Steam:** Chalk falls through steam.
- **Fire:** Chalk falls through fire.
- **Smoke:** Chalk falls through smoke.
- **Acid:** Acid eats chalk: acidity 0.8 beats hardness 0.2, fizzing out carbon dioxide. Chalk sinks through acid (1,500 vs 1,100 kg/m³).
- **Hydrogen:** Chalk falls through hydrogen.
- **Oxygen:** Chalk falls through oxygen.
- **Methane:** Chalk falls through methane.
- **Alcohol:** Chalk sinks through alcohol (1,500 vs 789 kg/m³).
- **Spark:** Chalk falls through spark.
- **Petrol:** Chalk sinks through petrol (1,500 vs 740 kg/m³).
- **Molten wax:** Chalk sinks through molten wax (1,500 vs 800 kg/m³).
- **Honey:** Chalk sinks through honey (1,500 vs 1,420 kg/m³).
- **Vinegar:** Chalk sinks through vinegar (1,500 vs 1,010 kg/m³).
- **Bleach:** Chalk sinks through bleach (1,500 vs 1,100 kg/m³).
- **Lye:** Chalk sinks through lye (1,500 vs 1,100 kg/m³).
- **Liquid nitrogen:** Chalk sinks through liquid nitrogen (1,500 vs 808 kg/m³).
- **Nitrogen:** Chalk falls through nitrogen.
- **Carbon dioxide:** Chalk falls through carbon dioxide.
- **Helium:** Chalk falls through helium.
- **Propane:** Chalk falls through propane.
- **Chlorine:** Chalk falls through chlorine.
- **Sulfur dioxide:** Chalk falls through sulfur dioxide.
- **Cloud:** Chalk falls through cloud.
- **Caramel:** Chalk sinks through caramel (1,500 vs 1,300 kg/m³).
- **Liquid oxygen:** Chalk sinks through liquid oxygen (1,500 vs 1,141 kg/m³).
- **Tar:** Chalk sinks through tar (1,500 vs 1,150 kg/m³).
- **Molten plastic:** Chalk sinks through molten plastic (1,500 vs 900 kg/m³).
- **Napalm:** Chalk sinks through napalm (1,500 vs 900 kg/m³).
- **Hydrogen peroxide:** Chalk sinks through hydrogen peroxide (1,500 vs 1,450 kg/m³).
- **Lightning:** Chalk falls through lightning.
- **Plasma:** Chalk falls through plasma.
- **Rocket:** Chalk falls through rocket.
- **Ember:** Chalk falls through ember.
- **Kerosene:** Chalk sinks through kerosene (1,500 vs 800 kg/m³).
- **Acetone:** Chalk sinks through acetone (1,500 vs 784 kg/m³).
- **Ammonia:** Chalk falls through ammonia.
- **Ozone:** Chalk falls through ozone.
- **Molten chocolate:** Chalk sinks through molten chocolate (1,500 vs 1,250 kg/m³).
- **Acetylene:** Chalk falls through acetylene.
- **Iodine vapour:** Chalk falls through iodine vapour.
- **Argon:** Chalk falls through argon.
- **Bromine vapour:** Chalk falls through bromine vapour.
- **Soda:** Chalk sinks through soda (1,500 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Liquid oxygen

Oxygen cooled to a pale blue liquid, bitterly cold. Flows and boils away into oxygen. A fuel it soaks burns with ferocious heat.

- **State:** Liquid, 1,141 kg/m³
- **Starts at:** -183 °C
- **In liquids:** Sinks through liquids lighter than 1,141 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Boils:** at -183 °C, into oxygen
- **Feeds fire:** strength 1 (air is 0.21)

With other elements (118 interact):

- **Sand:** Sand sinks through liquid oxygen (1,600 vs 1,141 kg/m³).
- **Water:** Liquid oxygen sinks through water (1,141 vs 1,000 kg/m³). Liquid oxygen (-183 °C) is cold enough to freeze water into ice.
- **Oil:** Liquid oxygen sinks through oil (1,141 vs 900 kg/m³). Oil burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Steam:** Liquid oxygen falls through steam. Liquid oxygen (-183 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to boil liquid oxygen into oxygen.
- **Lava:** Liquid oxygen (-183 °C) is cold enough to freeze lava into stone. Lava sinks through liquid oxygen (2,600 vs 1,141 kg/m³). Lava (1,200 °C) is hot enough to boil liquid oxygen into oxygen.
- **Gravel:** Gravel sinks through liquid oxygen (2,000 vs 1,141 kg/m³).
- **Fire:** Liquid oxygen puts out the fire, flashing into oxygen. Liquid oxygen falls through fire. Fire (850 °C) is hot enough to boil liquid oxygen into oxygen.
- **Smoke:** Liquid oxygen falls through smoke. Smoke (150 °C) is hot enough to boil liquid oxygen into oxygen.
- **Wood:** Wood burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Acid:** Liquid oxygen sinks through acid (1,141 vs 1,100 kg/m³).
- **Iron:** Iron slowly rusts into rust where liquid oxygen touches it.
- **Hydrogen:** Liquid oxygen falls through hydrogen. Hydrogen burns: it catches fire at 500 °C next to liquid oxygen (oxidiser 1).
- **Oxygen:** Liquid oxygen falls through oxygen.
- **Methane:** Liquid oxygen falls through methane. Methane burns: it catches fire at 540 °C next to liquid oxygen (oxidiser 1).
- **Alcohol:** Liquid oxygen sinks through alcohol (1,141 vs 789 kg/m³). Alcohol burns: it catches fire at 365 °C next to liquid oxygen (oxidiser 1).
- **Sawdust:** Sawdust burns: it catches fire at 260 °C next to liquid oxygen (oxidiser 1).
- **Salt:** Salt sinks through liquid oxygen (2,160 vs 1,141 kg/m³).
- **Sugar:** Sugar burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1). Sugar sinks through liquid oxygen (1,590 vs 1,141 kg/m³).
- **Dirt:** Dirt sinks through liquid oxygen (1,500 vs 1,141 kg/m³).
- **TNT:** TNT explodes at 300 °C; it needs no air.
- **Gunpowder:** Gunpowder explodes at 250 °C; it needs no air. Gunpowder sinks through liquid oxygen (1,700 vs 1,141 kg/m³).
- **Nitro:** Nitro explodes at 200 °C; it needs no air. Nitro sinks through liquid oxygen (1,600 vs 1,141 kg/m³).
- **Shards:** Shards sinks through liquid oxygen (2,500 vs 1,141 kg/m³).
- **Spark:** Liquid oxygen falls through spark. Spark (300 °C) is hot enough to boil liquid oxygen into oxygen.
- **Mercury:** Mercury sinks through liquid oxygen (13,534 vs 1,141 kg/m³).
- **Seed:** Seed burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Plant:** Plant burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Molten copper:** Liquid oxygen (-183 °C) is cold enough to freeze molten copper into wire. Molten copper sinks through liquid oxygen (8,020 vs 1,141 kg/m³). Molten copper (1,200 °C) is hot enough to boil liquid oxygen into oxygen.
- **Dry plant:** Dry plant burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Clay:** Clay sinks through liquid oxygen (1,700 vs 1,141 kg/m³).
- **Cement:** Cement sinks through liquid oxygen (1,440 vs 1,141 kg/m³).
- **Quicklime:** Quicklime sinks through liquid oxygen (1,200 vs 1,141 kg/m³).
- **Molten gold:** Liquid oxygen (-183 °C) is cold enough to freeze molten gold into gold. Molten gold sinks through liquid oxygen (17,300 vs 1,141 kg/m³). Molten gold (1,150 °C) is hot enough to boil liquid oxygen into oxygen.
- **Molten aluminium:** Liquid oxygen (-183 °C) is cold enough to freeze molten aluminium into aluminium. Molten aluminium sinks through liquid oxygen (2,375 vs 1,141 kg/m³). Molten aluminium (750 °C) is hot enough to boil liquid oxygen into oxygen.
- **Molten lead:** Liquid oxygen (-183 °C) is cold enough to freeze molten lead into lead. Molten lead sinks through liquid oxygen (10,660 vs 1,141 kg/m³). Molten lead (400 °C) is hot enough to boil liquid oxygen into oxygen.
- **Rust:** Rust sinks through liquid oxygen (2,000 vs 1,141 kg/m³).
- **Coal:** Coal burns: it catches fire at 450 °C next to liquid oxygen (oxidiser 1). Coal sinks through liquid oxygen (1,350 vs 1,141 kg/m³).
- **Charcoal:** Charcoal burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1).
- **Sulfur:** Sulfur burns: it catches fire at 232 °C next to liquid oxygen (oxidiser 1). Sulfur sinks through liquid oxygen (2,000 vs 1,141 kg/m³).
- **Petrol:** Liquid oxygen sinks through petrol (1,141 vs 740 kg/m³). Petrol burns: it catches fire at 280 °C next to liquid oxygen (oxidiser 1).
- **Wax:** Wax burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten wax:** Liquid oxygen sinks through molten wax (1,141 vs 800 kg/m³). Liquid oxygen (-183 °C) is cold enough to freeze molten wax into wax. Molten wax burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1). Molten wax (80 °C) is hot enough to boil liquid oxygen into oxygen.
- **Paper:** Paper burns: it catches fire at 233 °C next to liquid oxygen (oxidiser 1).
- **Rubber:** Rubber burns: it catches fire at 400 °C next to liquid oxygen (oxidiser 1).
- **Flour:** Flour burns: it catches fire at 380 °C next to liquid oxygen (oxidiser 1).
- **Thermite:** Thermite burns: it catches fire at 900 °C next to liquid oxygen (oxidiser 1). Thermite sinks through liquid oxygen (1,500 vs 1,141 kg/m³).
- **Honey:** Honey sinks through liquid oxygen (1,420 vs 1,141 kg/m³).
- **Vinegar:** Liquid oxygen sinks through vinegar (1,141 vs 1,010 kg/m³).
- **Bleach:** Liquid oxygen sinks through bleach (1,141 vs 1,100 kg/m³).
- **Lye:** Liquid oxygen sinks through lye (1,141 vs 1,100 kg/m³).
- **Liquid nitrogen:** Liquid oxygen sinks through liquid nitrogen (1,141 vs 808 kg/m³).
- **Nitrogen:** Liquid oxygen falls through nitrogen.
- **Carbon dioxide:** Liquid oxygen falls through carbon dioxide. Liquid oxygen (-183 °C) is cold enough to condense carbon dioxide into dry ice.
- **Helium:** Liquid oxygen falls through helium.
- **Propane:** Liquid oxygen falls through propane. Propane burns: it catches fire at 470 °C next to liquid oxygen (oxidiser 1).
- **Chlorine:** Liquid oxygen falls through chlorine.
- **Sulfur dioxide:** Liquid oxygen falls through sulfur dioxide.
- **C4:** C4 explodes at 900 °C; it needs no air.
- **Grass seed:** Grass seed burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Grass:** Grass burns: it catches fire at 220 °C next to liquid oxygen (oxidiser 1).
- **Acorn:** Acorn burns: it catches fire at 260 °C next to liquid oxygen (oxidiser 1).
- **Tree:** Tree burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Leaves:** Leaves burns: it catches fire at 230 °C next to liquid oxygen (oxidiser 1).
- **Flower:** Flower burns: it catches fire at 220 °C next to liquid oxygen (oxidiser 1).
- **Cloud:** Liquid oxygen falls through cloud.
- **Magnesium:** Magnesium burns: it catches fire at 650 °C next to liquid oxygen (oxidiser 1).
- **Caramel:** Caramel burns: it catches fire at 400 °C next to liquid oxygen (oxidiser 1). Caramel sinks through liquid oxygen (1,300 vs 1,141 kg/m³). Caramel (190 °C) is hot enough to boil liquid oxygen into oxygen.
- **Chalk:** Chalk sinks through liquid oxygen (1,500 vs 1,141 kg/m³).
- **Molten iron:** Liquid oxygen (-183 °C) is cold enough to freeze molten iron into iron. Molten iron sinks through liquid oxygen (6,980 vs 1,141 kg/m³). Molten iron (1,600 °C) is hot enough to boil liquid oxygen into oxygen.
- **Molten glass:** Liquid oxygen (-183 °C) is cold enough to freeze molten glass into glass. Molten glass sinks through liquid oxygen (2,400 vs 1,141 kg/m³). Molten glass (1,450 °C) is hot enough to boil liquid oxygen into oxygen.
- **Molten silver:** Liquid oxygen (-183 °C) is cold enough to freeze molten silver into silver. Molten silver sinks through liquid oxygen (9,320 vs 1,141 kg/m³). Molten silver (1,000 °C) is hot enough to boil liquid oxygen into oxygen.
- **Cooked meat:** Cooked meat burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Popcorn kernel:** Popcorn kernel sinks through liquid oxygen (1,200 vs 1,141 kg/m³).
- **Popcorn:** Popcorn burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Tar:** Tar burns: it catches fire at 320 °C next to liquid oxygen (oxidiser 1). Tar sinks through liquid oxygen (1,150 vs 1,141 kg/m³).
- **Plastic:** Plastic burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1).
- **Molten plastic:** Liquid oxygen sinks through molten plastic (1,141 vs 900 kg/m³). Liquid oxygen (-183 °C) is cold enough to freeze molten plastic into plastic. Molten plastic burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1). Molten plastic (200 °C) is hot enough to boil liquid oxygen into oxygen.
- **Diamond:** Diamond burns: it catches fire at 900 °C next to liquid oxygen (oxidiser 1).
- **Napalm:** Liquid oxygen sinks through napalm (1,141 vs 900 kg/m³). Napalm burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through liquid oxygen (1,450 vs 1,141 kg/m³).
- **Fish:** Fish burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Ant:** Ant burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Bird:** Bird burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Lightning:** Liquid oxygen falls through lightning. Lightning (3,000 °C) is hot enough to boil liquid oxygen into oxygen.
- **Plasma:** Liquid oxygen falls through plasma. Plasma (3,000 °C) is hot enough to boil liquid oxygen into oxygen.
- **Firework:** Firework burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1). Firework sinks through liquid oxygen (1,400 vs 1,141 kg/m³).
- **Rocket:** Liquid oxygen falls through rocket. Rocket (900 °C) is hot enough to boil liquid oxygen into oxygen.
- **Ember:** Liquid oxygen falls through ember. Ember (700 °C) is hot enough to boil liquid oxygen into oxygen.
- **Saltpeter:** Saltpeter sinks through liquid oxygen (2,100 vs 1,141 kg/m³).
- **Molten tin:** Liquid oxygen (-183 °C) is cold enough to freeze molten tin into tin. Molten tin sinks through liquid oxygen (6,990 vs 1,141 kg/m³). Molten tin (260 °C) is hot enough to boil liquid oxygen into oxygen.
- **Steel:** Steel slowly rusts into rust where liquid oxygen touches it.
- **Kerosene:** Liquid oxygen sinks through kerosene (1,141 vs 800 kg/m³). Kerosene burns: it catches fire at 220 °C next to liquid oxygen (oxidiser 1).
- **Acetone:** Liquid oxygen sinks through acetone (1,141 vs 784 kg/m³). Acetone burns: it catches fire at 465 °C next to liquid oxygen (oxidiser 1).
- **Bee:** Bee burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Spider:** Spider burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Termite:** Termite burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Frog:** Frog burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Mouse:** Mouse burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Snake:** Snake burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Ammonia:** Liquid oxygen falls through ammonia.
- **Ozone:** Liquid oxygen falls through ozone.
- **Cotton:** Cotton burns: it catches fire at 255 °C next to liquid oxygen (oxidiser 1).
- **Molten chocolate:** Liquid oxygen (-183 °C) is cold enough to freeze molten chocolate into chocolate. Molten chocolate sinks through liquid oxygen (1,250 vs 1,141 kg/m³). Molten chocolate (45 °C) is hot enough to boil liquid oxygen into oxygen.
- **Phosphorus:** Phosphorus burns: it catches fire at 30 °C next to liquid oxygen (oxidiser 1).
- **Calcium carbide:** Calcium carbide sinks through liquid oxygen (2,220 vs 1,141 kg/m³).
- **Acetylene:** Liquid oxygen falls through acetylene. Acetylene burns: it catches fire at 305 °C next to liquid oxygen (oxidiser 1).
- **Iodine:** Iodine sinks through liquid oxygen (4,930 vs 1,141 kg/m³).
- **Iodine vapour:** Liquid oxygen falls through iodine vapour. Liquid oxygen (-183 °C) is cold enough to condense iodine vapour into iodine. Iodine vapour (130 °C) is hot enough to boil liquid oxygen into oxygen.
- **Argon:** Liquid oxygen falls through argon.
- **Bromine:** Bromine sinks through liquid oxygen (3,100 vs 1,141 kg/m³).
- **Bromine vapour:** Liquid oxygen falls through bromine vapour. Liquid oxygen (-183 °C) is cold enough to condense bromine vapour into bromine. Bromine vapour (70 °C) is hot enough to boil liquid oxygen into oxygen.
- **Liquid gallium:** Liquid oxygen (-183 °C) is cold enough to freeze liquid gallium into gallium. Liquid gallium sinks through liquid oxygen (6,095 vs 1,141 kg/m³). Liquid gallium (35 °C) is hot enough to boil liquid oxygen into oxygen.
- **Cactus seed:** Cactus seed burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Cactus:** Cactus burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Smoke bomb:** Smoke bomb burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1). Smoke bomb sinks through liquid oxygen (1,200 vs 1,141 kg/m³).
- **Peat:** Peat burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Soda:** Liquid oxygen sinks through soda (1,141 vs 1,010 kg/m³).
- **Fuse:** Fuse burns: it catches fire at 150 °C next to liquid oxygen (oxidiser 1).

No direct interaction with: Air, Wall, Ice, Stone, Ash, Snow, Glass, Wire, Battery, Brick, Concrete, Limestone, Slaked lime, Gold, Aluminium, Lead, Sodium, Dry ice, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Pumice, Obsidian, Worm, Tin, Zinc, Hail, Uranium, Snail, Chocolate, Egg, Cooked egg, Lithium, Titanium, Platinum, Gallium, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten iron

Melted iron, white-hot and heavy. Flows and sinks through water and rock. Sets back into iron as it cools.

- **State:** Liquid, 6,980 kg/m³
- **Starts at:** 1,600 °C
- **In liquids:** Sinks through liquids lighter than 6,980 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Freezes:** below 1,538 °C, into iron
- **Conducts:** electric charge, warming as pulses pass

With other elements (123 interact):

- **Water:** Molten iron sinks through water (6,980 vs 1,000 kg/m³). Molten iron (1,600 °C) is hot enough to boil water into steam.
- **Oil:** Molten iron sinks through oil (6,980 vs 900 kg/m³). Molten iron (1,600 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten iron (1,600 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten iron into iron.
- **Steam:** Molten iron falls through steam.
- **Lava:** Molten iron sinks through lava (6,980 vs 2,600 kg/m³).
- **Stone:** Molten iron (1,600 °C) is hot enough to melt stone into lava.
- **Gravel:** Molten iron (1,600 °C) is hot enough to melt gravel into lava.
- **Fire:** Molten iron falls through fire.
- **Smoke:** Molten iron falls through smoke.
- **Wood:** Molten iron (1,600 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten iron sinks through acid (6,980 vs 1,100 kg/m³).
- **Iron:** Molten iron (1,600 °C) is hot enough to melt iron into molten iron.
- **Hydrogen:** Molten iron falls through hydrogen. Molten iron (1,600 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Molten iron falls through oxygen.
- **Methane:** Molten iron falls through methane. Molten iron (1,600 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Molten iron sinks through alcohol (6,980 vs 789 kg/m³). Molten iron (1,600 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten iron (1,600 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten iron (1,600 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten iron (1,600 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten iron into iron.
- **TNT:** Molten iron (1,600 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten iron (1,600 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten iron sinks through nitro (6,980 vs 1,600 kg/m³). Molten iron (1,600 °C) can set nitro on fire (it ignites at 200 °C).
- **Glass:** Molten iron (1,600 °C) is hot enough to melt glass into molten glass.
- **Spark:** Molten iron falls through spark.
- **Wire:** Molten iron (1,600 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Mercury sinks through molten iron (13,534 vs 6,980 kg/m³).
- **Seed:** Molten iron (1,600 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten iron (1,600 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten copper sinks through molten iron (8,020 vs 6,980 kg/m³).
- **Dry plant:** Molten iron (1,600 °C) can set dry plant on fire (it ignites at 200 °C).
- **Gold:** Molten iron (1,600 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold sinks through molten iron (17,300 vs 6,980 kg/m³).
- **Aluminium:** Molten iron (1,600 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten iron sinks through molten aluminium (6,980 vs 2,375 kg/m³).
- **Lead:** Molten iron (1,600 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead sinks through molten iron (10,660 vs 6,980 kg/m³).
- **Coal:** Molten iron (1,600 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Molten iron (1,600 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten iron (1,600 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten iron sinks through petrol (6,980 vs 740 kg/m³). Molten iron (1,600 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten iron (1,600 °C) is hot enough to melt wax into molten wax. Molten iron (1,600 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten iron sinks through molten wax (6,980 vs 800 kg/m³). Molten iron (1,600 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten iron (1,600 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten iron (1,600 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten iron (1,600 °C) can set flour on fire (it ignites at 380 °C).
- **Thermite:** Molten iron (1,600 °C) can set thermite on fire (it ignites at 900 °C).
- **Honey:** Molten iron sinks through honey (6,980 vs 1,420 kg/m³).
- **Vinegar:** Molten iron sinks through vinegar (6,980 vs 1,010 kg/m³).
- **Bleach:** Molten iron sinks through bleach (6,980 vs 1,100 kg/m³).
- **Lye:** Molten iron sinks through lye (6,980 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten iron sinks through liquid nitrogen (6,980 vs 808 kg/m³). Molten iron (1,600 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten iron into iron.
- **Nitrogen:** Molten iron falls through nitrogen.
- **Carbon dioxide:** Molten iron falls through carbon dioxide.
- **Helium:** Molten iron falls through helium.
- **Propane:** Molten iron falls through propane. Molten iron (1,600 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Molten iron falls through chlorine.
- **Sulfur dioxide:** Molten iron falls through sulfur dioxide.
- **Dry ice:** Molten iron (1,600 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten iron into iron.
- **C4:** Molten iron (1,600 °C) can set c4 on fire (it ignites at 900 °C).
- **Grass seed:** Molten iron (1,600 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten iron (1,600 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten iron (1,600 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten iron (1,600 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten iron (1,600 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten iron (1,600 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten iron falls through cloud.
- **Magnesium:** Molten iron (1,600 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Molten iron sinks through caramel (6,980 vs 1,300 kg/m³). Molten iron (1,600 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten iron sinks through liquid oxygen (6,980 vs 1,141 kg/m³). Molten iron (1,600 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten iron into iron.
- **Molten glass:** Molten iron sinks through molten glass (6,980 vs 2,400 kg/m³).
- **Silver:** Molten iron (1,600 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver sinks through molten iron (9,320 vs 6,980 kg/m³).
- **Cooked meat:** Molten iron (1,600 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten iron (1,600 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten iron sinks through tar (6,980 vs 1,150 kg/m³). Molten iron (1,600 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten iron (1,600 °C) is hot enough to melt plastic into molten plastic. Molten iron (1,600 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten iron sinks through molten plastic (6,980 vs 900 kg/m³). Molten iron (1,600 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Obsidian:** Molten iron (1,600 °C) is hot enough to melt obsidian into lava.
- **Diamond:** Molten iron (1,600 °C) can set diamond on fire (it ignites at 900 °C).
- **Napalm:** Molten iron sinks through napalm (6,980 vs 900 kg/m³). Molten iron (1,600 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten iron sinks through hydrogen peroxide (6,980 vs 1,450 kg/m³).
- **Fish:** Molten iron (1,600 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten iron (1,600 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten iron (1,600 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten iron falls through lightning.
- **Plasma:** Molten iron falls through plasma.
- **Firework:** Molten iron (1,600 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten iron falls through rocket.
- **Ember:** Molten iron falls through ember.
- **Tin:** Molten iron (1,600 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin sinks through molten iron (6,990 vs 6,980 kg/m³).
- **Steel:** Molten iron (1,600 °C) is hot enough to melt steel into molten iron.
- **Kerosene:** Molten iron sinks through kerosene (6,980 vs 800 kg/m³). Molten iron (1,600 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten iron sinks through acetone (6,980 vs 784 kg/m³). Molten iron (1,600 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Molten iron (1,600 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten iron into iron.
- **Bee:** Molten iron (1,600 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten iron (1,600 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten iron (1,600 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten iron (1,600 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten iron (1,600 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten iron (1,600 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten iron falls through ammonia.
- **Ozone:** Molten iron falls through ozone.
- **Cotton:** Molten iron (1,600 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten iron (1,600 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten iron sinks through molten chocolate (6,980 vs 1,250 kg/m³).
- **Phosphorus:** Molten iron (1,600 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten iron falls through acetylene. Molten iron (1,600 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten iron (1,600 °C) is hot enough to turn iodine into iodine vapour.
- **Iodine vapour:** Molten iron falls through iodine vapour.
- **Argon:** Molten iron falls through argon.
- **Bromine:** Molten iron sinks through bromine (6,980 vs 3,100 kg/m³). Molten iron (1,600 °C) is hot enough to boil bromine into bromine vapour.
- **Bromine vapour:** Molten iron falls through bromine vapour.
- **Gallium:** Molten iron (1,600 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Molten iron sinks through liquid gallium (6,980 vs 6,095 kg/m³).
- **Cactus seed:** Molten iron (1,600 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten iron (1,600 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten iron (1,600 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten iron (1,600 °C) can set peat on fire (it ignites at 300 °C).
- **Basalt:** Molten iron (1,600 °C) is hot enough to melt basalt into lava.
- **Granite:** Molten iron (1,600 °C) is hot enough to melt granite into lava.
- **Soda:** Molten iron sinks through soda (6,980 vs 1,010 kg/m³).
- **Fuse:** Molten iron (1,600 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Ash, Salt, Dirt, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Meat, Popcorn kernel, Pumice, Worm, Saltpeter, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten glass

Melted sand, glowing and thick. Oozes slowly. As it cools it sets into clear glass.

- **State:** Liquid, 2,400 kg/m³
- **Starts at:** 1,450 °C
- **In liquids:** Sinks through liquids lighter than 2,400 kg/m³, floats on heavier ones
- **Falls:** up to 40 cells/s
- **Freezes:** below 1,400 °C, into glass

With other elements (122 interact):

- **Water:** Molten glass sinks through water (2,400 vs 1,000 kg/m³). Molten glass (1,450 °C) is hot enough to boil water into steam.
- **Oil:** Molten glass sinks through oil (2,400 vs 900 kg/m³). Molten glass (1,450 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten glass (1,450 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten glass into glass.
- **Steam:** Molten glass falls through steam.
- **Lava:** Lava sinks through molten glass (2,600 vs 2,400 kg/m³).
- **Stone:** Molten glass (1,450 °C) is hot enough to melt stone into lava.
- **Gravel:** Molten glass (1,450 °C) is hot enough to melt gravel into lava.
- **Fire:** Molten glass falls through fire.
- **Smoke:** Molten glass falls through smoke.
- **Wood:** Molten glass (1,450 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten glass sinks through acid (2,400 vs 1,100 kg/m³).
- **Hydrogen:** Molten glass falls through hydrogen. Molten glass (1,450 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Molten glass falls through oxygen.
- **Methane:** Molten glass falls through methane. Molten glass (1,450 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Molten glass sinks through alcohol (2,400 vs 789 kg/m³). Molten glass (1,450 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten glass (1,450 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten glass (1,450 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten glass (1,450 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten glass into glass.
- **TNT:** Molten glass (1,450 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten glass (1,450 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten glass sinks through nitro (2,400 vs 1,600 kg/m³). Molten glass (1,450 °C) can set nitro on fire (it ignites at 200 °C).
- **Glass:** Molten glass (1,450 °C) is hot enough to melt glass into molten glass.
- **Shards:** Shards sinks through molten glass (2,500 vs 2,400 kg/m³).
- **Spark:** Molten glass falls through spark.
- **Wire:** Molten glass (1,450 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Mercury sinks through molten glass (13,534 vs 2,400 kg/m³).
- **Seed:** Molten glass (1,450 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten glass (1,450 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten copper sinks through molten glass (8,020 vs 2,400 kg/m³).
- **Dry plant:** Molten glass (1,450 °C) can set dry plant on fire (it ignites at 200 °C).
- **Gold:** Molten glass (1,450 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold sinks through molten glass (17,300 vs 2,400 kg/m³).
- **Aluminium:** Molten glass (1,450 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten glass sinks through molten aluminium (2,400 vs 2,375 kg/m³).
- **Lead:** Molten glass (1,450 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead sinks through molten glass (10,660 vs 2,400 kg/m³).
- **Coal:** Molten glass (1,450 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Molten glass (1,450 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten glass (1,450 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten glass sinks through petrol (2,400 vs 740 kg/m³). Molten glass (1,450 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten glass (1,450 °C) is hot enough to melt wax into molten wax. Molten glass (1,450 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten glass sinks through molten wax (2,400 vs 800 kg/m³). Molten glass (1,450 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten glass (1,450 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten glass (1,450 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten glass (1,450 °C) can set flour on fire (it ignites at 380 °C).
- **Thermite:** Molten glass (1,450 °C) can set thermite on fire (it ignites at 900 °C).
- **Honey:** Molten glass sinks through honey (2,400 vs 1,420 kg/m³).
- **Vinegar:** Molten glass sinks through vinegar (2,400 vs 1,010 kg/m³).
- **Bleach:** Molten glass sinks through bleach (2,400 vs 1,100 kg/m³).
- **Lye:** Molten glass sinks through lye (2,400 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten glass sinks through liquid nitrogen (2,400 vs 808 kg/m³). Molten glass (1,450 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten glass into glass.
- **Nitrogen:** Molten glass falls through nitrogen.
- **Carbon dioxide:** Molten glass falls through carbon dioxide.
- **Helium:** Molten glass falls through helium.
- **Propane:** Molten glass falls through propane. Molten glass (1,450 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Molten glass falls through chlorine.
- **Sulfur dioxide:** Molten glass falls through sulfur dioxide.
- **Dry ice:** Molten glass (1,450 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten glass into glass.
- **C4:** Molten glass (1,450 °C) can set c4 on fire (it ignites at 900 °C).
- **Grass seed:** Molten glass (1,450 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten glass (1,450 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten glass (1,450 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten glass (1,450 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten glass (1,450 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten glass (1,450 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten glass falls through cloud.
- **Magnesium:** Molten glass (1,450 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Molten glass sinks through caramel (2,400 vs 1,300 kg/m³). Molten glass (1,450 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten glass sinks through liquid oxygen (2,400 vs 1,141 kg/m³). Molten glass (1,450 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten glass into glass.
- **Molten iron:** Molten iron sinks through molten glass (6,980 vs 2,400 kg/m³).
- **Silver:** Molten glass (1,450 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver sinks through molten glass (9,320 vs 2,400 kg/m³).
- **Cooked meat:** Molten glass (1,450 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten glass (1,450 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten glass sinks through tar (2,400 vs 1,150 kg/m³). Molten glass (1,450 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten glass (1,450 °C) is hot enough to melt plastic into molten plastic. Molten glass (1,450 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten glass sinks through molten plastic (2,400 vs 900 kg/m³). Molten glass (1,450 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Obsidian:** Molten glass (1,450 °C) is hot enough to melt obsidian into lava.
- **Diamond:** Molten glass (1,450 °C) can set diamond on fire (it ignites at 900 °C).
- **Napalm:** Molten glass sinks through napalm (2,400 vs 900 kg/m³). Molten glass (1,450 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten glass sinks through hydrogen peroxide (2,400 vs 1,450 kg/m³).
- **Fish:** Molten glass (1,450 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten glass (1,450 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten glass (1,450 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten glass falls through lightning.
- **Plasma:** Molten glass falls through plasma.
- **Firework:** Molten glass (1,450 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten glass falls through rocket.
- **Ember:** Molten glass falls through ember.
- **Tin:** Molten glass (1,450 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin sinks through molten glass (6,990 vs 2,400 kg/m³).
- **Kerosene:** Molten glass sinks through kerosene (2,400 vs 800 kg/m³). Molten glass (1,450 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten glass sinks through acetone (2,400 vs 784 kg/m³). Molten glass (1,450 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Molten glass (1,450 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten glass into glass.
- **Bee:** Molten glass (1,450 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten glass (1,450 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten glass (1,450 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten glass (1,450 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten glass (1,450 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten glass (1,450 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten glass falls through ammonia.
- **Ozone:** Molten glass falls through ozone.
- **Cotton:** Molten glass (1,450 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten glass (1,450 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten glass sinks through molten chocolate (2,400 vs 1,250 kg/m³).
- **Phosphorus:** Molten glass (1,450 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten glass falls through acetylene. Molten glass (1,450 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten glass (1,450 °C) is hot enough to turn iodine into iodine vapour. Iodine sinks through molten glass (4,930 vs 2,400 kg/m³).
- **Iodine vapour:** Molten glass falls through iodine vapour.
- **Argon:** Molten glass falls through argon.
- **Bromine:** Molten glass (1,450 °C) is hot enough to boil bromine into bromine vapour. Bromine sinks through molten glass (3,100 vs 2,400 kg/m³).
- **Bromine vapour:** Molten glass falls through bromine vapour.
- **Gallium:** Molten glass (1,450 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through molten glass (6,095 vs 2,400 kg/m³).
- **Cactus seed:** Molten glass (1,450 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten glass (1,450 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten glass (1,450 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten glass (1,450 °C) can set peat on fire (it ignites at 300 °C).
- **Basalt:** Molten glass (1,450 °C) is hot enough to melt basalt into lava.
- **Granite:** Molten glass (1,450 °C) is hot enough to melt granite into lava.
- **Soda:** Molten glass sinks through soda (2,400 vs 1,010 kg/m³).
- **Fuse:** Molten glass (1,450 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Meat, Popcorn kernel, Pumice, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Silver

A bright, heavy white metal. Stays put. It carries charge and heat better than any other metal, and melts into molten silver.

- **State:** Solid, 10,490 kg/m³
- **Melts:** at 962 °C, into molten silver
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (8 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt silver into molten silver.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt silver into molten silver.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt silver into molten silver.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt silver into molten silver.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt silver into molten silver.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt silver into molten silver.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt silver into molten silver.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten silver

Melted silver, glowing and heavy. Flows and sinks through almost everything. Sets back into silver as it cools.

- **State:** Liquid, 9,320 kg/m³
- **Starts at:** 1,000 °C
- **In liquids:** Sinks through liquids lighter than 9,320 kg/m³, floats on heavier ones
- **Falls:** up to 170 cells/s
- **Freezes:** below 962 °C, into silver
- **Conducts:** electric charge, warming as pulses pass

With other elements (113 interact):

- **Water:** Molten silver sinks through water (9,320 vs 1,000 kg/m³). Molten silver (1,000 °C) is hot enough to boil water into steam.
- **Oil:** Molten silver sinks through oil (9,320 vs 900 kg/m³). Molten silver (1,000 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten silver (1,000 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten silver into silver.
- **Steam:** Molten silver falls through steam.
- **Lava:** Molten silver sinks through lava (9,320 vs 2,600 kg/m³).
- **Fire:** Molten silver falls through fire.
- **Smoke:** Molten silver falls through smoke.
- **Wood:** Molten silver (1,000 °C) can set wood on fire (it ignites at 300 °C).
- **Acid:** Molten silver sinks through acid (9,320 vs 1,100 kg/m³).
- **Hydrogen:** Molten silver falls through hydrogen. Molten silver (1,000 °C) can set hydrogen on fire (it ignites at 500 °C).
- **Oxygen:** Molten silver falls through oxygen.
- **Methane:** Molten silver falls through methane. Molten silver (1,000 °C) can set methane on fire (it ignites at 540 °C).
- **Alcohol:** Molten silver sinks through alcohol (9,320 vs 789 kg/m³). Molten silver (1,000 °C) can set alcohol on fire (it ignites at 365 °C).
- **Sawdust:** Molten silver (1,000 °C) can set sawdust on fire (it ignites at 260 °C).
- **Sugar:** Molten silver (1,000 °C) can set sugar on fire (it ignites at 350 °C).
- **Snow:** Molten silver (1,000 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten silver into silver.
- **TNT:** Molten silver (1,000 °C) can set tnt on fire (it ignites at 300 °C).
- **Gunpowder:** Molten silver (1,000 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten silver sinks through nitro (9,320 vs 1,600 kg/m³). Molten silver (1,000 °C) can set nitro on fire (it ignites at 200 °C).
- **Spark:** Molten silver falls through spark.
- **Mercury:** Mercury sinks through molten silver (13,534 vs 9,320 kg/m³).
- **Seed:** Molten silver (1,000 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten silver (1,000 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten silver sinks through molten copper (9,320 vs 8,020 kg/m³).
- **Dry plant:** Molten silver (1,000 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold sinks through molten silver (17,300 vs 9,320 kg/m³).
- **Aluminium:** Molten silver (1,000 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten silver sinks through molten aluminium (9,320 vs 2,375 kg/m³).
- **Lead:** Molten silver (1,000 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead sinks through molten silver (10,660 vs 9,320 kg/m³).
- **Coal:** Molten silver (1,000 °C) can set coal on fire (it ignites at 450 °C).
- **Charcoal:** Molten silver (1,000 °C) can set charcoal on fire (it ignites at 350 °C).
- **Sulfur:** Molten silver (1,000 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten silver sinks through petrol (9,320 vs 740 kg/m³). Molten silver (1,000 °C) can set petrol on fire (it ignites at 280 °C).
- **Wax:** Molten silver (1,000 °C) is hot enough to melt wax into molten wax. Molten silver (1,000 °C) can set wax on fire (it ignites at 300 °C).
- **Molten wax:** Molten silver sinks through molten wax (9,320 vs 800 kg/m³). Molten silver (1,000 °C) can set molten wax on fire (it ignites at 300 °C).
- **Paper:** Molten silver (1,000 °C) can set paper on fire (it ignites at 233 °C).
- **Rubber:** Molten silver (1,000 °C) can set rubber on fire (it ignites at 400 °C).
- **Flour:** Molten silver (1,000 °C) can set flour on fire (it ignites at 380 °C).
- **Thermite:** Molten silver (1,000 °C) can set thermite on fire (it ignites at 900 °C).
- **Honey:** Molten silver sinks through honey (9,320 vs 1,420 kg/m³).
- **Vinegar:** Molten silver sinks through vinegar (9,320 vs 1,010 kg/m³).
- **Bleach:** Molten silver sinks through bleach (9,320 vs 1,100 kg/m³).
- **Lye:** Molten silver sinks through lye (9,320 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten silver sinks through liquid nitrogen (9,320 vs 808 kg/m³). Molten silver (1,000 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten silver into silver.
- **Nitrogen:** Molten silver falls through nitrogen.
- **Carbon dioxide:** Molten silver falls through carbon dioxide.
- **Helium:** Molten silver falls through helium.
- **Propane:** Molten silver falls through propane. Molten silver (1,000 °C) can set propane on fire (it ignites at 470 °C).
- **Chlorine:** Molten silver falls through chlorine.
- **Sulfur dioxide:** Molten silver falls through sulfur dioxide.
- **Dry ice:** Molten silver (1,000 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten silver into silver.
- **C4:** Molten silver (1,000 °C) can set c4 on fire (it ignites at 900 °C).
- **Grass seed:** Molten silver (1,000 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten silver (1,000 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten silver (1,000 °C) can set acorn on fire (it ignites at 260 °C).
- **Tree:** Molten silver (1,000 °C) can set tree on fire (it ignites at 300 °C).
- **Leaves:** Molten silver (1,000 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten silver (1,000 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten silver falls through cloud.
- **Magnesium:** Molten silver (1,000 °C) can set magnesium on fire (it ignites at 650 °C).
- **Caramel:** Molten silver sinks through caramel (9,320 vs 1,300 kg/m³). Molten silver (1,000 °C) can set caramel on fire (it ignites at 400 °C).
- **Liquid oxygen:** Molten silver sinks through liquid oxygen (9,320 vs 1,141 kg/m³). Molten silver (1,000 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten silver into silver.
- **Molten iron:** Molten silver sinks through molten iron (9,320 vs 6,980 kg/m³).
- **Molten glass:** Molten silver sinks through molten glass (9,320 vs 2,400 kg/m³).
- **Silver:** Molten silver (1,000 °C) is hot enough to melt silver into molten silver.
- **Cooked meat:** Molten silver (1,000 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Popcorn:** Molten silver (1,000 °C) can set popcorn on fire (it ignites at 300 °C).
- **Tar:** Molten silver sinks through tar (9,320 vs 1,150 kg/m³). Molten silver (1,000 °C) can set tar on fire (it ignites at 320 °C).
- **Plastic:** Molten silver (1,000 °C) is hot enough to melt plastic into molten plastic. Molten silver (1,000 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten silver sinks through molten plastic (9,320 vs 900 kg/m³). Molten silver (1,000 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Diamond:** Molten silver (1,000 °C) can set diamond on fire (it ignites at 900 °C).
- **Napalm:** Molten silver sinks through napalm (9,320 vs 900 kg/m³). Molten silver (1,000 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten silver sinks through hydrogen peroxide (9,320 vs 1,450 kg/m³).
- **Fish:** Molten silver (1,000 °C) can set fish on fire (it ignites at 300 °C).
- **Ant:** Molten silver (1,000 °C) can set ant on fire (it ignites at 200 °C).
- **Bird:** Molten silver (1,000 °C) can set bird on fire (it ignites at 300 °C).
- **Lightning:** Molten silver falls through lightning.
- **Plasma:** Molten silver falls through plasma.
- **Firework:** Molten silver (1,000 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten silver falls through rocket.
- **Ember:** Molten silver falls through ember.
- **Tin:** Molten silver (1,000 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten silver sinks through molten tin (9,320 vs 6,990 kg/m³).
- **Kerosene:** Molten silver sinks through kerosene (9,320 vs 800 kg/m³). Molten silver (1,000 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten silver sinks through acetone (9,320 vs 784 kg/m³). Molten silver (1,000 °C) can set acetone on fire (it ignites at 465 °C).
- **Hail:** Molten silver (1,000 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten silver into silver.
- **Bee:** Molten silver (1,000 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten silver (1,000 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten silver (1,000 °C) can set termite on fire (it ignites at 200 °C).
- **Frog:** Molten silver (1,000 °C) can set frog on fire (it ignites at 300 °C).
- **Mouse:** Molten silver (1,000 °C) can set mouse on fire (it ignites at 300 °C).
- **Snake:** Molten silver (1,000 °C) can set snake on fire (it ignites at 300 °C).
- **Ammonia:** Molten silver falls through ammonia.
- **Ozone:** Molten silver falls through ozone.
- **Cotton:** Molten silver (1,000 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten silver (1,000 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten silver sinks through molten chocolate (9,320 vs 1,250 kg/m³).
- **Phosphorus:** Molten silver (1,000 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten silver falls through acetylene. Molten silver (1,000 °C) can set acetylene on fire (it ignites at 305 °C).
- **Iodine:** Molten silver (1,000 °C) is hot enough to turn iodine into iodine vapour.
- **Iodine vapour:** Molten silver falls through iodine vapour.
- **Argon:** Molten silver falls through argon.
- **Bromine:** Molten silver sinks through bromine (9,320 vs 3,100 kg/m³). Molten silver (1,000 °C) is hot enough to boil bromine into bromine vapour.
- **Bromine vapour:** Molten silver falls through bromine vapour.
- **Gallium:** Molten silver (1,000 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Molten silver sinks through liquid gallium (9,320 vs 6,095 kg/m³).
- **Cactus seed:** Molten silver (1,000 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Cactus:** Molten silver (1,000 °C) can set cactus on fire (it ignites at 300 °C).
- **Smoke bomb:** Molten silver (1,000 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Peat:** Molten silver (1,000 °C) can set peat on fire (it ignites at 300 °C).
- **Soda:** Molten silver sinks through soda (9,320 vs 1,010 kg/m³).
- **Fuse:** Molten silver (1,000 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Ash, Iron, Salt, Dirt, Glass, Shards, Wire, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Meat, Popcorn kernel, Pumice, Obsidian, Worm, Saltpeter, Steel, Zinc, Uranium, Snail, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Meat

Raw red meat. Stays put. Warm it and it cooks; left in water it slowly rots.

- **State:** Solid, 1,050 kg/m³
- **Bakes:** at 70 °C into cooked meat; there is no way back
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Meat slowly rots into dirt where water touches it.
- **Acid:** Acid eats meat: acidity 0.8 beats hardness 0.2.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cooked meat

Browned, cooked meat. Stays put. Overdone it chars into charcoal, and in open air it burns.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 300 °C in air, 3.33 s per cell, leaves ash
- **Bakes:** at 250 °C into charcoal; there is no way back
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (22 interact):

- **Air:** Cooked meat burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Water:** Cooked meat slowly rots into dirt where water touches it.
- **Lava:** Lava (1,200 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Fire:** Cooked meat catches from the flame touching it.
- **Acid:** Acid eats cooked meat: acidity 0.8 beats hardness 0.2.
- **Oxygen:** Cooked meat burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning cooked meat hotter and faster.
- **Spark:** Cooked meat catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Liquid oxygen:** Cooked meat burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set cooked meat on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Cooked meat burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning cooked meat hotter and faster.
- **Lightning:** Cooked meat catches from the flame touching it.
- **Plasma:** Cooked meat catches from the flame touching it.
- **Rocket:** Cooked meat catches from the flame touching it.
- **Ember:** Cooked meat catches from the flame touching it.
- **Saltpeter:** Cooked meat burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning cooked meat hotter and faster.
- **Ozone:** Cooked meat burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning cooked meat hotter and faster.

No direct interaction with: Wall, Sand, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Popcorn kernel

Hard yellow kernels, a powder. Falls and piles. Heat them and they pop into light, fluffy popcorn.

- **State:** Powder, 1,200 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,200 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Bakes:** at 180 °C into popcorn; there is no way back
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (41 interact):

- **Water:** Popcorn kernel sinks through water (1,200 vs 1,000 kg/m³).
- **Oil:** Popcorn kernel sinks through oil (1,200 vs 900 kg/m³).
- **Steam:** Popcorn kernel falls through steam.
- **Fire:** Popcorn kernel falls through fire.
- **Smoke:** Popcorn kernel falls through smoke.
- **Acid:** Acid eats popcorn kernel: acidity 0.8 beats hardness 0.3. Popcorn kernel sinks through acid (1,200 vs 1,100 kg/m³).
- **Hydrogen:** Popcorn kernel falls through hydrogen.
- **Oxygen:** Popcorn kernel falls through oxygen.
- **Methane:** Popcorn kernel falls through methane.
- **Alcohol:** Popcorn kernel sinks through alcohol (1,200 vs 789 kg/m³).
- **Spark:** Popcorn kernel falls through spark.
- **Petrol:** Popcorn kernel sinks through petrol (1,200 vs 740 kg/m³).
- **Molten wax:** Popcorn kernel sinks through molten wax (1,200 vs 800 kg/m³).
- **Vinegar:** Popcorn kernel sinks through vinegar (1,200 vs 1,010 kg/m³).
- **Bleach:** Popcorn kernel sinks through bleach (1,200 vs 1,100 kg/m³).
- **Lye:** Popcorn kernel sinks through lye (1,200 vs 1,100 kg/m³).
- **Liquid nitrogen:** Popcorn kernel sinks through liquid nitrogen (1,200 vs 808 kg/m³).
- **Nitrogen:** Popcorn kernel falls through nitrogen.
- **Carbon dioxide:** Popcorn kernel falls through carbon dioxide.
- **Helium:** Popcorn kernel falls through helium.
- **Propane:** Popcorn kernel falls through propane.
- **Chlorine:** Popcorn kernel falls through chlorine.
- **Sulfur dioxide:** Popcorn kernel falls through sulfur dioxide.
- **Cloud:** Popcorn kernel falls through cloud.
- **Liquid oxygen:** Popcorn kernel sinks through liquid oxygen (1,200 vs 1,141 kg/m³).
- **Tar:** Popcorn kernel sinks through tar (1,200 vs 1,150 kg/m³).
- **Molten plastic:** Popcorn kernel sinks through molten plastic (1,200 vs 900 kg/m³).
- **Napalm:** Popcorn kernel sinks through napalm (1,200 vs 900 kg/m³).
- **Lightning:** Popcorn kernel falls through lightning.
- **Plasma:** Popcorn kernel falls through plasma.
- **Rocket:** Popcorn kernel falls through rocket.
- **Ember:** Popcorn kernel falls through ember.
- **Kerosene:** Popcorn kernel sinks through kerosene (1,200 vs 800 kg/m³).
- **Acetone:** Popcorn kernel sinks through acetone (1,200 vs 784 kg/m³).
- **Ammonia:** Popcorn kernel falls through ammonia.
- **Ozone:** Popcorn kernel falls through ozone.
- **Acetylene:** Popcorn kernel falls through acetylene.
- **Iodine vapour:** Popcorn kernel falls through iodine vapour.
- **Argon:** Popcorn kernel falls through argon.
- **Bromine vapour:** Popcorn kernel falls through bromine vapour.
- **Soda:** Popcorn kernel sinks through soda (1,200 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Popcorn

Popped corn, a very light powder. Drifts down softly and floats on water. It burns easily.

- **State:** Powder, 50 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 35 cells/s
- **Burns:** from 300 °C in air, 0.5 s per cell, leaves ash
- **Hardness:** 0.05 (acid stronger than this eats it)

With other elements (37 interact):

- **Air:** Popcorn burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Steam:** Popcorn falls through steam.
- **Lava:** Lava (1,200 °C) can set popcorn on fire (it ignites at 300 °C).
- **Fire:** Popcorn catches from the flame touching it. Popcorn falls through fire.
- **Smoke:** Popcorn falls through smoke.
- **Acid:** Acid eats popcorn: acidity 0.8 beats hardness 0.05.
- **Hydrogen:** Popcorn falls through hydrogen.
- **Oxygen:** Popcorn burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Popcorn falls through oxygen. Oxygen makes burning popcorn hotter and faster.
- **Methane:** Popcorn falls through methane.
- **Spark:** Popcorn catches from the flame touching it. Popcorn falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set popcorn on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set popcorn on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set popcorn on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set popcorn on fire (it ignites at 300 °C).
- **Nitrogen:** Popcorn falls through nitrogen.
- **Carbon dioxide:** Popcorn falls through carbon dioxide.
- **Helium:** Popcorn falls through helium.
- **Propane:** Popcorn falls through propane.
- **Chlorine:** Popcorn falls through chlorine.
- **Sulfur dioxide:** Popcorn falls through sulfur dioxide.
- **Cloud:** Popcorn falls through cloud.
- **Liquid oxygen:** Popcorn burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set popcorn on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set popcorn on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set popcorn on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Popcorn burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning popcorn hotter and faster.
- **Lightning:** Popcorn catches from the flame touching it. Popcorn falls through lightning.
- **Plasma:** Popcorn catches from the flame touching it. Popcorn falls through plasma.
- **Rocket:** Popcorn catches from the flame touching it. Popcorn falls through rocket.
- **Ember:** Popcorn catches from the flame touching it. Popcorn falls through ember.
- **Saltpeter:** Popcorn burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning popcorn hotter and faster.
- **Ammonia:** Popcorn falls through ammonia.
- **Ozone:** Popcorn burns: it catches fire at 300 °C next to ozone (oxidiser 1). Popcorn falls through ozone. Ozone makes burning popcorn hotter and faster.
- **Acetylene:** Popcorn falls through acetylene.
- **Iodine vapour:** Popcorn falls through iodine vapour.
- **Argon:** Popcorn falls through argon.
- **Bromine vapour:** Popcorn falls through bromine vapour.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Tar

Thick black pitch. Creeps along very slowly and sinks through water. Hard to light, but it burns for a long time.

- **State:** Liquid, 1,150 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,150 kg/m³, floats on heavier ones
- **Falls:** up to 25 cells/s
- **Burns:** from 320 °C in air, 10 s per cell, leaves ash
- **Flash point:** 200 °C: above it, flames spread across it

With other elements (79 interact):

- **Air:** Tar burns: it catches fire at 320 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through tar (1,600 vs 1,150 kg/m³).
- **Water:** Tar sinks through water (1,150 vs 1,000 kg/m³).
- **Oil:** Tar sinks through oil (1,150 vs 900 kg/m³).
- **Steam:** Tar falls through steam.
- **Lava:** Lava sinks through tar (2,600 vs 1,150 kg/m³). Lava (1,200 °C) can set tar on fire (it ignites at 320 °C).
- **Gravel:** Gravel sinks through tar (2,000 vs 1,150 kg/m³).
- **Fire:** Tar catches from the flame touching it. Tar falls through fire.
- **Smoke:** Tar falls through smoke.
- **Acid:** Tar sinks through acid (1,150 vs 1,100 kg/m³).
- **Hydrogen:** Tar falls through hydrogen.
- **Oxygen:** Tar burns: it catches fire at 320 °C next to oxygen (oxidiser 1). Tar falls through oxygen. Oxygen makes burning tar hotter and faster.
- **Methane:** Tar falls through methane.
- **Alcohol:** Tar sinks through alcohol (1,150 vs 789 kg/m³).
- **Salt:** Salt sinks through tar (2,160 vs 1,150 kg/m³).
- **Sugar:** Sugar sinks through tar (1,590 vs 1,150 kg/m³).
- **Dirt:** Dirt sinks through tar (1,500 vs 1,150 kg/m³).
- **Gunpowder:** Gunpowder sinks through tar (1,700 vs 1,150 kg/m³).
- **Nitro:** Nitro sinks through tar (1,600 vs 1,150 kg/m³).
- **Shards:** Shards sinks through tar (2,500 vs 1,150 kg/m³).
- **Spark:** Tar catches from the flame touching it. Tar falls through spark.
- **Mercury:** Mercury sinks through tar (13,534 vs 1,150 kg/m³).
- **Molten copper:** Molten copper sinks through tar (8,020 vs 1,150 kg/m³). Molten copper (1,200 °C) can set tar on fire (it ignites at 320 °C).
- **Clay:** Clay sinks through tar (1,700 vs 1,150 kg/m³).
- **Cement:** Cement sinks through tar (1,440 vs 1,150 kg/m³).
- **Quicklime:** Quicklime sinks through tar (1,200 vs 1,150 kg/m³).
- **Molten gold:** Molten gold sinks through tar (17,300 vs 1,150 kg/m³). Molten gold (1,150 °C) can set tar on fire (it ignites at 320 °C).
- **Molten aluminium:** Molten aluminium sinks through tar (2,375 vs 1,150 kg/m³). Molten aluminium (750 °C) can set tar on fire (it ignites at 320 °C).
- **Molten lead:** Molten lead sinks through tar (10,660 vs 1,150 kg/m³). Molten lead (400 °C) can set tar on fire (it ignites at 320 °C).
- **Rust:** Rust sinks through tar (2,000 vs 1,150 kg/m³).
- **Coal:** Coal sinks through tar (1,350 vs 1,150 kg/m³).
- **Sulfur:** Sulfur sinks through tar (2,000 vs 1,150 kg/m³).
- **Petrol:** Tar sinks through petrol (1,150 vs 740 kg/m³).
- **Molten wax:** Tar sinks through molten wax (1,150 vs 800 kg/m³).
- **Thermite:** Thermite sinks through tar (1,500 vs 1,150 kg/m³).
- **Honey:** Honey sinks through tar (1,420 vs 1,150 kg/m³).
- **Vinegar:** Tar sinks through vinegar (1,150 vs 1,010 kg/m³).
- **Bleach:** Tar sinks through bleach (1,150 vs 1,100 kg/m³).
- **Lye:** Tar sinks through lye (1,150 vs 1,100 kg/m³).
- **Liquid nitrogen:** Tar sinks through liquid nitrogen (1,150 vs 808 kg/m³).
- **Nitrogen:** Tar falls through nitrogen.
- **Carbon dioxide:** Tar falls through carbon dioxide.
- **Helium:** Tar falls through helium.
- **Propane:** Tar falls through propane.
- **Chlorine:** Tar falls through chlorine.
- **Sulfur dioxide:** Tar falls through sulfur dioxide.
- **Cloud:** Tar falls through cloud.
- **Caramel:** Caramel sinks through tar (1,300 vs 1,150 kg/m³).
- **Chalk:** Chalk sinks through tar (1,500 vs 1,150 kg/m³).
- **Liquid oxygen:** Tar burns: it catches fire at 320 °C next to liquid oxygen (oxidiser 1). Tar sinks through liquid oxygen (1,150 vs 1,141 kg/m³).
- **Molten iron:** Molten iron sinks through tar (6,980 vs 1,150 kg/m³). Molten iron (1,600 °C) can set tar on fire (it ignites at 320 °C).
- **Molten glass:** Molten glass sinks through tar (2,400 vs 1,150 kg/m³). Molten glass (1,450 °C) can set tar on fire (it ignites at 320 °C).
- **Molten silver:** Molten silver sinks through tar (9,320 vs 1,150 kg/m³). Molten silver (1,000 °C) can set tar on fire (it ignites at 320 °C).
- **Popcorn kernel:** Popcorn kernel sinks through tar (1,200 vs 1,150 kg/m³).
- **Molten plastic:** Tar sinks through molten plastic (1,150 vs 900 kg/m³).
- **Napalm:** Tar sinks through napalm (1,150 vs 900 kg/m³).
- **Hydrogen peroxide:** Tar burns: it catches fire at 320 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through tar (1,450 vs 1,150 kg/m³). Hydrogen peroxide makes burning tar hotter and faster.
- **Lightning:** Tar catches from the flame touching it. Tar falls through lightning.
- **Plasma:** Tar catches from the flame touching it. Tar falls through plasma.
- **Firework:** Firework sinks through tar (1,400 vs 1,150 kg/m³).
- **Rocket:** Tar catches from the flame touching it. Tar falls through rocket.
- **Ember:** Tar catches from the flame touching it. Tar falls through ember.
- **Saltpeter:** Tar burns: it catches fire at 320 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through tar (2,100 vs 1,150 kg/m³). Saltpeter makes burning tar hotter and faster.
- **Molten tin:** Molten tin sinks through tar (6,990 vs 1,150 kg/m³).
- **Kerosene:** Tar sinks through kerosene (1,150 vs 800 kg/m³).
- **Acetone:** Tar sinks through acetone (1,150 vs 784 kg/m³).
- **Ammonia:** Tar falls through ammonia.
- **Ozone:** Tar burns: it catches fire at 320 °C next to ozone (oxidiser 1). Tar falls through ozone. Ozone makes burning tar hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through tar (1,250 vs 1,150 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through tar (2,220 vs 1,150 kg/m³).
- **Acetylene:** Tar falls through acetylene.
- **Iodine:** Iodine sinks through tar (4,930 vs 1,150 kg/m³).
- **Iodine vapour:** Tar falls through iodine vapour.
- **Argon:** Tar falls through argon.
- **Bromine:** Bromine sinks through tar (3,100 vs 1,150 kg/m³).
- **Bromine vapour:** Tar falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through tar (6,095 vs 1,150 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through tar (1,200 vs 1,150 kg/m³).
- **Soda:** Tar sinks through soda (1,150 vs 1,010 kg/m³).

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus seed, Cactus, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Plastic

A hard, bright synthetic. Stays put and shrugs off acid. It melts at a modest heat into molten plastic and burns with thick smoke.

- **State:** Solid, 950 kg/m³
- **Melts:** at 160 °C, into molten plastic
- **Burns:** from 350 °C in air, 3.33 s per cell, leaves ash
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (24 interact):

- **Air:** Plastic burns: it catches fire at 350 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) is hot enough to melt plastic into molten plastic. Lava (1,200 °C) can set plastic on fire (it ignites at 350 °C).
- **Fire:** Plastic catches from the flame touching it. Fire (850 °C) is hot enough to melt plastic into molten plastic.
- **Oxygen:** Plastic burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Oxygen makes burning plastic hotter and faster.
- **Spark:** Plastic catches from the flame touching it. Spark (300 °C) is hot enough to melt plastic into molten plastic.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt plastic into molten plastic. Molten copper (1,200 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt plastic into molten plastic. Molten gold (1,150 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt plastic into molten plastic. Molten aluminium (750 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten lead:** Molten lead (400 °C) is hot enough to melt plastic into molten plastic. Molten lead (400 °C) can set plastic on fire (it ignites at 350 °C).
- **Caramel:** Caramel (190 °C) is hot enough to melt plastic into molten plastic.
- **Liquid oxygen:** Plastic burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt plastic into molten plastic. Molten iron (1,600 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt plastic into molten plastic. Molten glass (1,450 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt plastic into molten plastic. Molten silver (1,000 °C) can set plastic on fire (it ignites at 350 °C).
- **Molten plastic:** Molten plastic (200 °C) is hot enough to melt plastic into molten plastic.
- **Hydrogen peroxide:** Plastic burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning plastic hotter and faster.
- **Lightning:** Plastic catches from the flame touching it. Lightning (3,000 °C) is hot enough to melt plastic into molten plastic.
- **Plasma:** Plastic catches from the flame touching it. Plasma (3,000 °C) is hot enough to melt plastic into molten plastic.
- **Rocket:** Plastic catches from the flame touching it. Rocket (900 °C) is hot enough to melt plastic into molten plastic.
- **Ember:** Plastic catches from the flame touching it. Ember (700 °C) is hot enough to melt plastic into molten plastic.
- **Saltpeter:** Plastic burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning plastic hotter and faster.
- **Molten tin:** Molten tin (260 °C) is hot enough to melt plastic into molten plastic.
- **Acetone:** Acetone dissolves plastic.
- **Ozone:** Plastic burns: it catches fire at 350 °C next to ozone (oxidiser 1). Ozone makes burning plastic hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten plastic

Melted plastic, a hot sticky goo. Oozes slowly and floats on water. Sets back into plastic as it cools, and burns if it gets hotter.

- **State:** Liquid, 900 kg/m³
- **Starts at:** 200 °C
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, floats on heavier ones
- **Falls:** up to 40 cells/s
- **Freezes:** below 160 °C, into plastic
- **Burns:** from 350 °C in air, 3.33 s per cell, leaves ash

With other elements (98 interact):

- **Air:** Molten plastic burns: it catches fire at 350 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through molten plastic (1,600 vs 900 kg/m³).
- **Water:** Molten plastic (200 °C) is hot enough to boil water into steam. Water sinks through molten plastic (1,000 vs 900 kg/m³).
- **Ice:** Molten plastic (200 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten plastic into plastic.
- **Steam:** Molten plastic falls through steam.
- **Lava:** Lava sinks through molten plastic (2,600 vs 900 kg/m³). Lava (1,200 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Gravel:** Gravel sinks through molten plastic (2,000 vs 900 kg/m³).
- **Fire:** Molten plastic catches from the flame touching it. Molten plastic falls through fire.
- **Smoke:** Molten plastic falls through smoke.
- **Acid:** Acid sinks through molten plastic (1,100 vs 900 kg/m³).
- **Hydrogen:** Molten plastic falls through hydrogen.
- **Oxygen:** Molten plastic burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Molten plastic falls through oxygen. Oxygen makes burning molten plastic hotter and faster.
- **Methane:** Molten plastic falls through methane.
- **Alcohol:** Molten plastic sinks through alcohol (900 vs 789 kg/m³).
- **Salt:** Salt sinks through molten plastic (2,160 vs 900 kg/m³).
- **Sugar:** Sugar sinks through molten plastic (1,590 vs 900 kg/m³).
- **Dirt:** Dirt sinks through molten plastic (1,500 vs 900 kg/m³).
- **Snow:** Molten plastic (200 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten plastic into plastic.
- **Gunpowder:** Gunpowder sinks through molten plastic (1,700 vs 900 kg/m³).
- **Nitro:** Molten plastic (200 °C) can set nitro on fire (it ignites at 200 °C). Nitro sinks through molten plastic (1,600 vs 900 kg/m³).
- **Shards:** Shards sinks through molten plastic (2,500 vs 900 kg/m³).
- **Spark:** Molten plastic catches from the flame touching it. Molten plastic falls through spark.
- **Mercury:** Mercury sinks through molten plastic (13,534 vs 900 kg/m³).
- **Seed:** Seed sinks through molten plastic (1,100 vs 900 kg/m³).
- **Molten copper:** Molten copper sinks through molten plastic (8,020 vs 900 kg/m³). Molten copper (1,200 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Dry plant:** Molten plastic (200 °C) can set dry plant on fire (it ignites at 200 °C).
- **Clay:** Clay sinks through molten plastic (1,700 vs 900 kg/m³).
- **Cement:** Cement sinks through molten plastic (1,440 vs 900 kg/m³).
- **Quicklime:** Quicklime sinks through molten plastic (1,200 vs 900 kg/m³).
- **Slaked lime:** Slaked lime sinks through molten plastic (1,100 vs 900 kg/m³).
- **Molten gold:** Molten gold sinks through molten plastic (17,300 vs 900 kg/m³). Molten gold (1,150 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Molten aluminium:** Molten aluminium sinks through molten plastic (2,375 vs 900 kg/m³). Molten aluminium (750 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Molten lead:** Molten lead sinks through molten plastic (10,660 vs 900 kg/m³). Molten lead (400 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Rust:** Rust sinks through molten plastic (2,000 vs 900 kg/m³).
- **Coal:** Coal sinks through molten plastic (1,350 vs 900 kg/m³).
- **Sulfur:** Sulfur sinks through molten plastic (2,000 vs 900 kg/m³).
- **Petrol:** Molten plastic sinks through petrol (900 vs 740 kg/m³).
- **Wax:** Molten plastic (200 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Molten plastic sinks through molten wax (900 vs 800 kg/m³).
- **Thermite:** Thermite sinks through molten plastic (1,500 vs 900 kg/m³).
- **Honey:** Honey sinks through molten plastic (1,420 vs 900 kg/m³).
- **Vinegar:** Vinegar sinks through molten plastic (1,010 vs 900 kg/m³).
- **Bleach:** Bleach sinks through molten plastic (1,100 vs 900 kg/m³).
- **Lye:** Lye sinks through molten plastic (1,100 vs 900 kg/m³).
- **Liquid nitrogen:** Molten plastic sinks through liquid nitrogen (900 vs 808 kg/m³). Molten plastic (200 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten plastic into plastic.
- **Nitrogen:** Molten plastic falls through nitrogen.
- **Carbon dioxide:** Molten plastic falls through carbon dioxide.
- **Helium:** Molten plastic falls through helium.
- **Propane:** Molten plastic falls through propane.
- **Chlorine:** Molten plastic falls through chlorine.
- **Sulfur dioxide:** Molten plastic falls through sulfur dioxide.
- **Dry ice:** Molten plastic (200 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten plastic into plastic.
- **Baking soda:** Baking soda sinks through molten plastic (1,100 vs 900 kg/m³).
- **Grass seed:** Grass seed sinks through molten plastic (1,100 vs 900 kg/m³).
- **Acorn:** Acorn sinks through molten plastic (1,100 vs 900 kg/m³).
- **Cloud:** Molten plastic falls through cloud.
- **Caramel:** Caramel sinks through molten plastic (1,300 vs 900 kg/m³).
- **Chalk:** Chalk sinks through molten plastic (1,500 vs 900 kg/m³).
- **Liquid oxygen:** Molten plastic burns: it catches fire at 350 °C next to liquid oxygen (oxidiser 1). Molten plastic (200 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen sinks through molten plastic (1,141 vs 900 kg/m³). Liquid oxygen (-183 °C) is cold enough to freeze molten plastic into plastic.
- **Molten iron:** Molten iron sinks through molten plastic (6,980 vs 900 kg/m³). Molten iron (1,600 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Molten glass:** Molten glass sinks through molten plastic (2,400 vs 900 kg/m³). Molten glass (1,450 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Molten silver:** Molten silver sinks through molten plastic (9,320 vs 900 kg/m³). Molten silver (1,000 °C) can set molten plastic on fire (it ignites at 350 °C).
- **Popcorn kernel:** Popcorn kernel sinks through molten plastic (1,200 vs 900 kg/m³).
- **Tar:** Tar sinks through molten plastic (1,150 vs 900 kg/m³).
- **Plastic:** Molten plastic (200 °C) is hot enough to melt plastic into molten plastic.
- **Hydrogen peroxide:** Molten plastic burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through molten plastic (1,450 vs 900 kg/m³). Hydrogen peroxide makes burning molten plastic hotter and faster.
- **Ant:** Molten plastic (200 °C) can set ant on fire (it ignites at 200 °C).
- **Lightning:** Molten plastic catches from the flame touching it. Molten plastic falls through lightning.
- **Plasma:** Molten plastic catches from the flame touching it. Molten plastic falls through plasma.
- **Firework:** Firework sinks through molten plastic (1,400 vs 900 kg/m³).
- **Rocket:** Molten plastic catches from the flame touching it. Molten plastic falls through rocket.
- **Ember:** Molten plastic catches from the flame touching it. Molten plastic falls through ember.
- **Saltpeter:** Molten plastic burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through molten plastic (2,100 vs 900 kg/m³). Saltpeter makes burning molten plastic hotter and faster.
- **Molten tin:** Molten tin sinks through molten plastic (6,990 vs 900 kg/m³).
- **Kerosene:** Molten plastic sinks through kerosene (900 vs 800 kg/m³).
- **Acetone:** Molten plastic sinks through acetone (900 vs 784 kg/m³).
- **Hail:** Molten plastic (200 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten plastic into plastic.
- **Bee:** Molten plastic (200 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten plastic (200 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten plastic (200 °C) can set termite on fire (it ignites at 200 °C).
- **Ammonia:** Molten plastic falls through ammonia.
- **Ozone:** Molten plastic burns: it catches fire at 350 °C next to ozone (oxidiser 1). Molten plastic falls through ozone. Ozone makes burning molten plastic hotter and faster.
- **Chocolate:** Molten plastic (200 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate sinks through molten plastic (1,250 vs 900 kg/m³).
- **Phosphorus:** Molten plastic (200 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide sinks through molten plastic (2,220 vs 900 kg/m³).
- **Acetylene:** Molten plastic falls through acetylene.
- **Iodine:** Molten plastic (200 °C) is hot enough to turn iodine into iodine vapour. Iodine sinks through molten plastic (4,930 vs 900 kg/m³).
- **Iodine vapour:** Molten plastic falls through iodine vapour.
- **Argon:** Molten plastic falls through argon.
- **Bromine:** Molten plastic (200 °C) is hot enough to boil bromine into bromine vapour. Bromine sinks through molten plastic (3,100 vs 900 kg/m³).
- **Bromine vapour:** Molten plastic falls through bromine vapour.
- **Gallium:** Molten plastic (200 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through molten plastic (6,095 vs 900 kg/m³).
- **Cactus seed:** Cactus seed sinks through molten plastic (1,100 vs 900 kg/m³).
- **Smoke bomb:** Molten plastic (200 °C) can set smoke bomb on fire (it ignites at 200 °C). Smoke bomb sinks through molten plastic (1,200 vs 900 kg/m³).
- **Soda:** Soda sinks through molten plastic (1,010 vs 900 kg/m³).
- **Fuse:** Molten plastic (200 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Wall, Oil, Stone, Wood, Ash, Iron, Sawdust, TNT, Glass, Wire, Battery, Plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Paper, Rubber, Flour, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Pumice, Obsidian, Diamond, Napalm, Fish, Worm, Bird, Tin, Steel, Zinc, Uranium, Snail, Frog, Mouse, Snake, Cotton, Egg, Cooked egg, Lithium, Titanium, Platinum, Cactus, Peat, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Pumice

Light, bubbly volcanic rock, a powder. Falls and piles, yet floats on water. It soaks up water into its pores.

- **State:** Powder, 640 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 120 cells/s
- **Soaks up:** water, up to 30% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (26 interact):

- **Water:** Pumice soaks up water: it is porous and holds up to 30% water.
- **Steam:** Pumice falls through steam.
- **Fire:** Pumice falls through fire.
- **Smoke:** Pumice falls through smoke.
- **Acid:** Acid eats pumice: acidity 0.8 beats hardness 0.6.
- **Hydrogen:** Pumice falls through hydrogen.
- **Oxygen:** Pumice falls through oxygen.
- **Methane:** Pumice falls through methane.
- **Spark:** Pumice falls through spark.
- **Nitrogen:** Pumice falls through nitrogen.
- **Carbon dioxide:** Pumice falls through carbon dioxide.
- **Helium:** Pumice falls through helium.
- **Propane:** Pumice falls through propane.
- **Chlorine:** Pumice falls through chlorine.
- **Sulfur dioxide:** Pumice falls through sulfur dioxide.
- **Cloud:** Pumice falls through cloud.
- **Lightning:** Pumice falls through lightning.
- **Plasma:** Pumice falls through plasma.
- **Rocket:** Pumice falls through rocket.
- **Ember:** Pumice falls through ember.
- **Ammonia:** Pumice falls through ammonia.
- **Ozone:** Pumice falls through ozone.
- **Acetylene:** Pumice falls through acetylene.
- **Iodine vapour:** Pumice falls through iodine vapour.
- **Argon:** Pumice falls through argon.
- **Bromine vapour:** Pumice falls through bromine vapour.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Obsidian

Black volcanic glass, formed where water chills lava fast. Stays put. A blast shatters it into sharp shards, and great heat melts it back into lava.

- **State:** Solid, 2,400 kg/m³
- **Melts:** at 1,000 °C, into lava
- **Shatters:** into shards when a blast hits it
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (7 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt obsidian into lava.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt obsidian into lava.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt obsidian into lava.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt obsidian into lava.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt obsidian into lava.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt obsidian into lava.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt obsidian into lava.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Diamond

Pure crystal carbon, the hardest thing there is. Stays put and moves heat superbly. In great heat it burns away into carbon dioxide.

- **State:** Solid, 3,510 kg/m³
- **Burns:** from 900 °C in air, 5 s per cell, leaves carbon dioxide
- **A flame:** will not light it; it needs 900 °C
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (12 interact):

- **Air:** Diamond burns: it catches fire at 900 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set diamond on fire (it ignites at 900 °C).
- **Oxygen:** Diamond burns: it catches fire at 900 °C next to oxygen (oxidiser 1). Oxygen makes burning diamond hotter and faster.
- **Molten copper:** Molten copper (1,200 °C) can set diamond on fire (it ignites at 900 °C).
- **Molten gold:** Molten gold (1,150 °C) can set diamond on fire (it ignites at 900 °C).
- **Liquid oxygen:** Diamond burns: it catches fire at 900 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set diamond on fire (it ignites at 900 °C).
- **Molten glass:** Molten glass (1,450 °C) can set diamond on fire (it ignites at 900 °C).
- **Molten silver:** Molten silver (1,000 °C) can set diamond on fire (it ignites at 900 °C).
- **Hydrogen peroxide:** Diamond burns: it catches fire at 900 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning diamond hotter and faster.
- **Saltpeter:** Diamond burns: it catches fire at 900 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning diamond hotter and faster.
- **Ozone:** Diamond burns: it catches fire at 900 °C next to ozone (oxidiser 1). Ozone makes burning diamond hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Napalm, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Napalm

A sticky fuel gel. Oozes slowly and floats on water. Its vapour catches at once, and it burns fiercely for a long time, even on water.

- **State:** Liquid, 900 kg/m³
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, floats on heavier ones
- **Falls:** up to 40 cells/s
- **Burns:** from 250 °C in air, 15 s per cell, leaves ash
- **Flash point:** -10 °C: above it, flames spread across it

With other elements (83 interact):

- **Air:** Napalm burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through napalm (1,600 vs 900 kg/m³).
- **Water:** Water sinks through napalm (1,000 vs 900 kg/m³).
- **Steam:** Napalm falls through steam.
- **Lava:** Lava sinks through napalm (2,600 vs 900 kg/m³). Lava (1,200 °C) can set napalm on fire (it ignites at 250 °C).
- **Gravel:** Gravel sinks through napalm (2,000 vs 900 kg/m³).
- **Fire:** Napalm catches from the flame touching it. Napalm falls through fire.
- **Smoke:** Napalm falls through smoke.
- **Acid:** Acid sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen:** Napalm falls through hydrogen.
- **Oxygen:** Napalm burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Napalm falls through oxygen. Oxygen makes burning napalm hotter and faster.
- **Methane:** Napalm falls through methane.
- **Alcohol:** Napalm sinks through alcohol (900 vs 789 kg/m³).
- **Salt:** Salt sinks through napalm (2,160 vs 900 kg/m³).
- **Sugar:** Sugar sinks through napalm (1,590 vs 900 kg/m³).
- **Dirt:** Dirt sinks through napalm (1,500 vs 900 kg/m³).
- **Gunpowder:** Gunpowder sinks through napalm (1,700 vs 900 kg/m³).
- **Nitro:** Nitro sinks through napalm (1,600 vs 900 kg/m³).
- **Shards:** Shards sinks through napalm (2,500 vs 900 kg/m³).
- **Spark:** Napalm catches from the flame touching it. Napalm falls through spark.
- **Mercury:** Mercury sinks through napalm (13,534 vs 900 kg/m³).
- **Seed:** Seed sinks through napalm (1,100 vs 900 kg/m³).
- **Molten copper:** Molten copper sinks through napalm (8,020 vs 900 kg/m³). Molten copper (1,200 °C) can set napalm on fire (it ignites at 250 °C).
- **Clay:** Clay sinks through napalm (1,700 vs 900 kg/m³).
- **Cement:** Cement sinks through napalm (1,440 vs 900 kg/m³).
- **Quicklime:** Quicklime sinks through napalm (1,200 vs 900 kg/m³).
- **Slaked lime:** Slaked lime sinks through napalm (1,100 vs 900 kg/m³).
- **Molten gold:** Molten gold sinks through napalm (17,300 vs 900 kg/m³). Molten gold (1,150 °C) can set napalm on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium sinks through napalm (2,375 vs 900 kg/m³). Molten aluminium (750 °C) can set napalm on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead sinks through napalm (10,660 vs 900 kg/m³). Molten lead (400 °C) can set napalm on fire (it ignites at 250 °C).
- **Rust:** Rust sinks through napalm (2,000 vs 900 kg/m³).
- **Coal:** Coal sinks through napalm (1,350 vs 900 kg/m³).
- **Sulfur:** Sulfur sinks through napalm (2,000 vs 900 kg/m³).
- **Petrol:** Napalm sinks through petrol (900 vs 740 kg/m³).
- **Molten wax:** Napalm sinks through molten wax (900 vs 800 kg/m³).
- **Thermite:** Thermite sinks through napalm (1,500 vs 900 kg/m³).
- **Honey:** Honey sinks through napalm (1,420 vs 900 kg/m³).
- **Vinegar:** Vinegar sinks through napalm (1,010 vs 900 kg/m³).
- **Bleach:** Bleach sinks through napalm (1,100 vs 900 kg/m³).
- **Lye:** Lye sinks through napalm (1,100 vs 900 kg/m³).
- **Liquid nitrogen:** Napalm sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Nitrogen:** Napalm falls through nitrogen.
- **Carbon dioxide:** Napalm falls through carbon dioxide.
- **Helium:** Napalm falls through helium.
- **Propane:** Napalm falls through propane.
- **Chlorine:** Napalm falls through chlorine.
- **Sulfur dioxide:** Napalm falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through napalm (1,100 vs 900 kg/m³).
- **Grass seed:** Grass seed sinks through napalm (1,100 vs 900 kg/m³).
- **Acorn:** Acorn sinks through napalm (1,100 vs 900 kg/m³).
- **Cloud:** Napalm falls through cloud.
- **Caramel:** Caramel sinks through napalm (1,300 vs 900 kg/m³).
- **Chalk:** Chalk sinks through napalm (1,500 vs 900 kg/m³).
- **Liquid oxygen:** Napalm burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1). Liquid oxygen sinks through napalm (1,141 vs 900 kg/m³).
- **Molten iron:** Molten iron sinks through napalm (6,980 vs 900 kg/m³). Molten iron (1,600 °C) can set napalm on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass sinks through napalm (2,400 vs 900 kg/m³). Molten glass (1,450 °C) can set napalm on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver sinks through napalm (9,320 vs 900 kg/m³). Molten silver (1,000 °C) can set napalm on fire (it ignites at 250 °C).
- **Popcorn kernel:** Popcorn kernel sinks through napalm (1,200 vs 900 kg/m³).
- **Tar:** Tar sinks through napalm (1,150 vs 900 kg/m³).
- **Hydrogen peroxide:** Napalm burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through napalm (1,450 vs 900 kg/m³). Hydrogen peroxide makes burning napalm hotter and faster.
- **Lightning:** Napalm catches from the flame touching it. Napalm falls through lightning.
- **Plasma:** Napalm catches from the flame touching it. Napalm falls through plasma.
- **Firework:** Firework sinks through napalm (1,400 vs 900 kg/m³).
- **Rocket:** Napalm catches from the flame touching it. Napalm falls through rocket.
- **Ember:** Napalm catches from the flame touching it. Napalm falls through ember.
- **Saltpeter:** Napalm burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through napalm (2,100 vs 900 kg/m³). Saltpeter makes burning napalm hotter and faster.
- **Molten tin:** Molten tin sinks through napalm (6,990 vs 900 kg/m³). Molten tin (260 °C) can set napalm on fire (it ignites at 250 °C).
- **Kerosene:** Napalm sinks through kerosene (900 vs 800 kg/m³).
- **Acetone:** Napalm sinks through acetone (900 vs 784 kg/m³).
- **Ammonia:** Napalm falls through ammonia.
- **Ozone:** Napalm burns: it catches fire at 250 °C next to ozone (oxidiser 1). Napalm falls through ozone. Ozone makes burning napalm hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through napalm (1,250 vs 900 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through napalm (2,220 vs 900 kg/m³).
- **Acetylene:** Napalm falls through acetylene.
- **Iodine:** Iodine sinks through napalm (4,930 vs 900 kg/m³).
- **Iodine vapour:** Napalm falls through iodine vapour.
- **Argon:** Napalm falls through argon.
- **Bromine:** Bromine sinks through napalm (3,100 vs 900 kg/m³).
- **Bromine vapour:** Napalm falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through napalm (6,095 vs 900 kg/m³).
- **Cactus seed:** Cactus seed sinks through napalm (1,100 vs 900 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through napalm (1,200 vs 900 kg/m³).
- **Soda:** Soda sinks through napalm (1,010 vs 900 kg/m³).

No direct interaction with: Wall, Oil, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Hydrogen peroxide

A pale blue liquid that carries spare oxygen. Flows and sinks through water. It feeds fire, and breaks down into water and oxygen when heated or on rust.

- **State:** Liquid, 1,450 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,450 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Bakes:** at 150 °C into water, giving off oxygen; there is no way back
- **Feeds fire:** strength 0.8 (air is 0.21)

With other elements (115 interact):

- **Sand:** Sand sinks through hydrogen peroxide (1,600 vs 1,450 kg/m³).
- **Water:** Hydrogen peroxide sinks through water (1,450 vs 1,000 kg/m³).
- **Oil:** Hydrogen peroxide sinks through oil (1,450 vs 900 kg/m³). Hydrogen peroxide makes burning oil hotter and faster. Oil burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Steam:** Hydrogen peroxide falls through steam.
- **Lava:** Lava sinks through hydrogen peroxide (2,600 vs 1,450 kg/m³).
- **Gravel:** Gravel sinks through hydrogen peroxide (2,000 vs 1,450 kg/m³).
- **Fire:** Hydrogen peroxide falls through fire.
- **Smoke:** Hydrogen peroxide falls through smoke.
- **Wood:** Hydrogen peroxide makes burning wood hotter and faster. Wood burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Acid:** Hydrogen peroxide sinks through acid (1,450 vs 1,100 kg/m³).
- **Iron:** Iron slowly rusts into rust where hydrogen peroxide touches it.
- **Hydrogen:** Hydrogen peroxide falls through hydrogen. Hydrogen peroxide makes burning hydrogen hotter and faster. Hydrogen burns: it catches fire at 500 °C next to hydrogen peroxide (oxidiser 0.8).
- **Oxygen:** Hydrogen peroxide falls through oxygen.
- **Methane:** Hydrogen peroxide falls through methane. Hydrogen peroxide makes burning methane hotter and faster. Methane burns: it catches fire at 540 °C next to hydrogen peroxide (oxidiser 0.8).
- **Alcohol:** Hydrogen peroxide sinks through alcohol (1,450 vs 789 kg/m³). Hydrogen peroxide makes burning alcohol hotter and faster. Alcohol burns: it catches fire at 365 °C next to hydrogen peroxide (oxidiser 0.8).
- **Sawdust:** Hydrogen peroxide makes burning sawdust hotter and faster. Sawdust burns: it catches fire at 260 °C next to hydrogen peroxide (oxidiser 0.8).
- **Salt:** Salt sinks through hydrogen peroxide (2,160 vs 1,450 kg/m³).
- **Sugar:** Hydrogen peroxide makes burning sugar hotter and faster. Sugar burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8). Sugar sinks through hydrogen peroxide (1,590 vs 1,450 kg/m³).
- **Dirt:** Dirt sinks through hydrogen peroxide (1,500 vs 1,450 kg/m³).
- **TNT:** Hydrogen peroxide makes burning tnt hotter and faster. TNT explodes at 300 °C; it needs no air.
- **Gunpowder:** Hydrogen peroxide makes burning gunpowder hotter and faster. Gunpowder explodes at 250 °C; it needs no air. Gunpowder sinks through hydrogen peroxide (1,700 vs 1,450 kg/m³).
- **Nitro:** Hydrogen peroxide makes burning nitro hotter and faster. Nitro explodes at 200 °C; it needs no air. Nitro sinks through hydrogen peroxide (1,600 vs 1,450 kg/m³).
- **Shards:** Shards sinks through hydrogen peroxide (2,500 vs 1,450 kg/m³).
- **Spark:** Hydrogen peroxide falls through spark.
- **Mercury:** Mercury sinks through hydrogen peroxide (13,534 vs 1,450 kg/m³).
- **Seed:** Hydrogen peroxide makes burning seed hotter and faster. Seed burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Plant:** Hydrogen peroxide makes burning plant hotter and faster. Plant burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Molten copper:** Molten copper sinks through hydrogen peroxide (8,020 vs 1,450 kg/m³).
- **Dry plant:** Hydrogen peroxide makes burning dry plant hotter and faster. Dry plant burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8).
- **Clay:** Clay sinks through hydrogen peroxide (1,700 vs 1,450 kg/m³).
- **Molten gold:** Molten gold sinks through hydrogen peroxide (17,300 vs 1,450 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through hydrogen peroxide (2,375 vs 1,450 kg/m³).
- **Molten lead:** Molten lead sinks through hydrogen peroxide (10,660 vs 1,450 kg/m³).
- **Rust:** Rust speeds up peroxide breaking down: it fizzes into oxygen. Rust sinks through hydrogen peroxide (2,000 vs 1,450 kg/m³).
- **Coal:** Hydrogen peroxide makes burning coal hotter and faster. Coal burns: it catches fire at 450 °C next to hydrogen peroxide (oxidiser 0.8).
- **Charcoal:** Hydrogen peroxide makes burning charcoal hotter and faster. Charcoal burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8).
- **Sulfur:** Hydrogen peroxide makes burning sulfur hotter and faster. Sulfur burns: it catches fire at 232 °C next to hydrogen peroxide (oxidiser 0.8). Sulfur sinks through hydrogen peroxide (2,000 vs 1,450 kg/m³).
- **Petrol:** Hydrogen peroxide sinks through petrol (1,450 vs 740 kg/m³). Hydrogen peroxide makes burning petrol hotter and faster. Petrol burns: it catches fire at 280 °C next to hydrogen peroxide (oxidiser 0.8).
- **Wax:** Hydrogen peroxide makes burning wax hotter and faster. Wax burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Molten wax:** Hydrogen peroxide sinks through molten wax (1,450 vs 800 kg/m³). Hydrogen peroxide makes burning molten wax hotter and faster. Molten wax burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Paper:** Hydrogen peroxide makes burning paper hotter and faster. Paper burns: it catches fire at 233 °C next to hydrogen peroxide (oxidiser 0.8).
- **Rubber:** Hydrogen peroxide makes burning rubber hotter and faster. Rubber burns: it catches fire at 400 °C next to hydrogen peroxide (oxidiser 0.8).
- **Flour:** Hydrogen peroxide makes burning flour hotter and faster. Flour burns: it catches fire at 380 °C next to hydrogen peroxide (oxidiser 0.8).
- **Thermite:** Hydrogen peroxide makes burning thermite hotter and faster. Thermite burns: it catches fire at 900 °C next to hydrogen peroxide (oxidiser 0.8). Thermite sinks through hydrogen peroxide (1,500 vs 1,450 kg/m³).
- **Honey:** Hydrogen peroxide sinks through honey (1,450 vs 1,420 kg/m³).
- **Vinegar:** Hydrogen peroxide sinks through vinegar (1,450 vs 1,010 kg/m³).
- **Bleach:** Hydrogen peroxide sinks through bleach (1,450 vs 1,100 kg/m³).
- **Lye:** Hydrogen peroxide sinks through lye (1,450 vs 1,100 kg/m³).
- **Liquid nitrogen:** Hydrogen peroxide sinks through liquid nitrogen (1,450 vs 808 kg/m³).
- **Nitrogen:** Hydrogen peroxide falls through nitrogen.
- **Carbon dioxide:** Hydrogen peroxide falls through carbon dioxide.
- **Helium:** Hydrogen peroxide falls through helium.
- **Propane:** Hydrogen peroxide falls through propane. Hydrogen peroxide makes burning propane hotter and faster. Propane burns: it catches fire at 470 °C next to hydrogen peroxide (oxidiser 0.8).
- **Chlorine:** Hydrogen peroxide falls through chlorine.
- **Sulfur dioxide:** Hydrogen peroxide falls through sulfur dioxide.
- **C4:** Hydrogen peroxide makes burning c4 hotter and faster. C4 explodes at 900 °C; it needs no air.
- **Grass seed:** Hydrogen peroxide makes burning grass seed hotter and faster. Grass seed burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Grass:** Hydrogen peroxide makes burning grass hotter and faster. Grass burns: it catches fire at 220 °C next to hydrogen peroxide (oxidiser 0.8).
- **Acorn:** Hydrogen peroxide makes burning acorn hotter and faster. Acorn burns: it catches fire at 260 °C next to hydrogen peroxide (oxidiser 0.8).
- **Tree:** Hydrogen peroxide makes burning tree hotter and faster. Tree burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Leaves:** Hydrogen peroxide makes burning leaves hotter and faster. Leaves burns: it catches fire at 230 °C next to hydrogen peroxide (oxidiser 0.8).
- **Flower:** Hydrogen peroxide makes burning flower hotter and faster. Flower burns: it catches fire at 220 °C next to hydrogen peroxide (oxidiser 0.8).
- **Cloud:** Hydrogen peroxide falls through cloud.
- **Magnesium:** Hydrogen peroxide makes burning magnesium hotter and faster. Magnesium burns: it catches fire at 650 °C next to hydrogen peroxide (oxidiser 0.8).
- **Caramel:** Hydrogen peroxide sinks through caramel (1,450 vs 1,300 kg/m³). Hydrogen peroxide makes burning caramel hotter and faster. Caramel burns: it catches fire at 400 °C next to hydrogen peroxide (oxidiser 0.8).
- **Chalk:** Chalk sinks through hydrogen peroxide (1,500 vs 1,450 kg/m³).
- **Liquid oxygen:** Hydrogen peroxide sinks through liquid oxygen (1,450 vs 1,141 kg/m³).
- **Molten iron:** Molten iron sinks through hydrogen peroxide (6,980 vs 1,450 kg/m³).
- **Molten glass:** Molten glass sinks through hydrogen peroxide (2,400 vs 1,450 kg/m³).
- **Molten silver:** Molten silver sinks through hydrogen peroxide (9,320 vs 1,450 kg/m³).
- **Cooked meat:** Hydrogen peroxide makes burning cooked meat hotter and faster. Cooked meat burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Popcorn:** Hydrogen peroxide makes burning popcorn hotter and faster. Popcorn burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Tar:** Hydrogen peroxide sinks through tar (1,450 vs 1,150 kg/m³). Hydrogen peroxide makes burning tar hotter and faster. Tar burns: it catches fire at 320 °C next to hydrogen peroxide (oxidiser 0.8).
- **Plastic:** Hydrogen peroxide makes burning plastic hotter and faster. Plastic burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8).
- **Molten plastic:** Hydrogen peroxide sinks through molten plastic (1,450 vs 900 kg/m³). Hydrogen peroxide makes burning molten plastic hotter and faster. Molten plastic burns: it catches fire at 350 °C next to hydrogen peroxide (oxidiser 0.8).
- **Diamond:** Hydrogen peroxide makes burning diamond hotter and faster. Diamond burns: it catches fire at 900 °C next to hydrogen peroxide (oxidiser 0.8).
- **Napalm:** Hydrogen peroxide sinks through napalm (1,450 vs 900 kg/m³). Hydrogen peroxide makes burning napalm hotter and faster. Napalm burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Fish:** Hydrogen peroxide makes burning fish hotter and faster. Fish burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Ant:** Hydrogen peroxide makes burning ant hotter and faster. Ant burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8).
- **Bird:** Hydrogen peroxide makes burning bird hotter and faster. Bird burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Lightning:** Hydrogen peroxide falls through lightning.
- **Plasma:** Hydrogen peroxide falls through plasma.
- **Firework:** Hydrogen peroxide makes burning firework hotter and faster. Firework burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Rocket:** Hydrogen peroxide falls through rocket.
- **Ember:** Hydrogen peroxide falls through ember.
- **Saltpeter:** Saltpeter sinks through hydrogen peroxide (2,100 vs 1,450 kg/m³).
- **Molten tin:** Molten tin sinks through hydrogen peroxide (6,990 vs 1,450 kg/m³).
- **Steel:** Steel slowly rusts into rust where hydrogen peroxide touches it.
- **Kerosene:** Hydrogen peroxide sinks through kerosene (1,450 vs 800 kg/m³). Hydrogen peroxide makes burning kerosene hotter and faster. Kerosene burns: it catches fire at 220 °C next to hydrogen peroxide (oxidiser 0.8).
- **Acetone:** Hydrogen peroxide sinks through acetone (1,450 vs 784 kg/m³). Hydrogen peroxide makes burning acetone hotter and faster. Acetone burns: it catches fire at 465 °C next to hydrogen peroxide (oxidiser 0.8).
- **Bee:** Hydrogen peroxide makes burning bee hotter and faster. Bee burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8).
- **Spider:** Hydrogen peroxide makes burning spider hotter and faster. Spider burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8).
- **Termite:** Hydrogen peroxide makes burning termite hotter and faster. Termite burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8).
- **Frog:** Hydrogen peroxide makes burning frog hotter and faster. Frog burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Mouse:** Hydrogen peroxide makes burning mouse hotter and faster. Mouse burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Snake:** Hydrogen peroxide makes burning snake hotter and faster. Snake burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Ammonia:** Hydrogen peroxide falls through ammonia.
- **Ozone:** Hydrogen peroxide falls through ozone.
- **Cotton:** Hydrogen peroxide makes burning cotton hotter and faster. Cotton burns: it catches fire at 255 °C next to hydrogen peroxide (oxidiser 0.8).
- **Molten chocolate:** Hydrogen peroxide sinks through molten chocolate (1,450 vs 1,250 kg/m³).
- **Phosphorus:** Hydrogen peroxide makes burning phosphorus hotter and faster. Phosphorus burns: it catches fire at 30 °C next to hydrogen peroxide (oxidiser 0.8).
- **Calcium carbide:** Calcium carbide sinks through hydrogen peroxide (2,220 vs 1,450 kg/m³).
- **Acetylene:** Hydrogen peroxide falls through acetylene. Hydrogen peroxide makes burning acetylene hotter and faster. Acetylene burns: it catches fire at 305 °C next to hydrogen peroxide (oxidiser 0.8).
- **Iodine:** Iodine sinks through hydrogen peroxide (4,930 vs 1,450 kg/m³).
- **Iodine vapour:** Hydrogen peroxide falls through iodine vapour.
- **Argon:** Hydrogen peroxide falls through argon.
- **Bromine:** Bromine sinks through hydrogen peroxide (3,100 vs 1,450 kg/m³).
- **Bromine vapour:** Hydrogen peroxide falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through hydrogen peroxide (6,095 vs 1,450 kg/m³).
- **Cactus seed:** Hydrogen peroxide makes burning cactus seed hotter and faster. Cactus seed burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8).
- **Cactus:** Hydrogen peroxide makes burning cactus hotter and faster. Cactus burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Smoke bomb:** Hydrogen peroxide makes burning smoke bomb hotter and faster. Smoke bomb burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8).
- **Peat:** Hydrogen peroxide makes burning peat hotter and faster. Peat burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8).
- **Soda:** Hydrogen peroxide sinks through soda (1,450 vs 1,010 kg/m³).
- **Fuse:** Hydrogen peroxide makes burning fuse hotter and faster. Fuse burns: it catches fire at 150 °C next to hydrogen peroxide (oxidiser 0.8).

No direct interaction with: Air, Wall, Ice, Stone, Ash, Snow, Glass, Wire, Battery, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Dry ice, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Popcorn kernel, Pumice, Obsidian, Worm, Tin, Zinc, Hail, Uranium, Snail, Chocolate, Egg, Cooked egg, Lithium, Titanium, Platinum, Gallium, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fish

A small fish. Swims about in water, eating seeds that sink to it and breeding when fed. Out of water it suffocates; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 300 °C in air, 1 s per cell, leaves ash
- **Habitat:** swims in water; out of it, it suffocates
- **Eats:** seed, grass seed, acorn, ant; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into meat
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Fish burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set fish on fire (it ignites at 300 °C).
- **Fire:** Fish catches from the flame touching it.
- **Acid:** Acid eats fish: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Fish burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning fish hotter and faster.
- **Spark:** Fish catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set fish on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set fish on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set fish on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set fish on fire (it ignites at 300 °C).
- **Liquid oxygen:** Fish burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set fish on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set fish on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set fish on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Fish burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning fish hotter and faster.
- **Lightning:** Fish catches from the flame touching it.
- **Plasma:** Fish catches from the flame touching it.
- **Rocket:** Fish catches from the flame touching it.
- **Ember:** Fish catches from the flame touching it.
- **Saltpeter:** Fish burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning fish hotter and faster.
- **Ozone:** Fish burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning fish hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ant

A busy little ant. Walks over the ground and climbs steps, eating anything sweet or meaty and breeding when fed. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 200 °C in air, 0.17 s per cell, leaves ash
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** sugar, honey, caramel, flour, meat, cooked meat, popcorn, chocolate; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into dirt
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (23 interact):

- **Air:** Ant burns: it catches fire at 200 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set ant on fire (it ignites at 200 °C).
- **Fire:** Ant catches from the flame touching it.
- **Acid:** Acid eats ant: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Ant burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Oxygen makes burning ant hotter and faster.
- **Spark:** Ant catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set ant on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold (1,150 °C) can set ant on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set ant on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead (400 °C) can set ant on fire (it ignites at 200 °C).
- **Liquid oxygen:** Ant burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set ant on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass (1,450 °C) can set ant on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver (1,000 °C) can set ant on fire (it ignites at 200 °C).
- **Molten plastic:** Molten plastic (200 °C) can set ant on fire (it ignites at 200 °C).
- **Hydrogen peroxide:** Ant burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning ant hotter and faster.
- **Lightning:** Ant catches from the flame touching it.
- **Plasma:** Ant catches from the flame touching it.
- **Rocket:** Ant catches from the flame touching it.
- **Ember:** Ant catches from the flame touching it.
- **Saltpeter:** Ant burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning ant hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set ant on fire (it ignites at 200 °C).
- **Ozone:** Ant burns: it catches fire at 200 °C next to ozone (oxidiser 1). Ozone makes burning ant hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Worm

An earthworm. Digs through soil, turning dead plants, paper and ash into rich dirt, and breeds as it eats. Dried out above ground, it dies.

- **State:** Solid, 1,050 kg/m³
- **Habitat:** digs through soil; dried out above ground, it dies
- **Eats:** dry plant, paper, ash; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into dirt
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats worm: acidity 0.8 beats hardness 0.1.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bird

A small bird. Flies about in the open air, eating seeds and ants and breeding when fed. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 300 °C in air, 1 s per cell, leaves ash
- **Habitat:** flies in open air; water drowns it
- **Eats:** seed, grass seed, acorn, ant, bee, spider, termite, snail, popcorn kernel, popcorn; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into meat
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Bird burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set bird on fire (it ignites at 300 °C).
- **Fire:** Bird catches from the flame touching it.
- **Acid:** Acid eats bird: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Bird burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning bird hotter and faster.
- **Spark:** Bird catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set bird on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set bird on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set bird on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set bird on fire (it ignites at 300 °C).
- **Liquid oxygen:** Bird burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set bird on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set bird on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set bird on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Bird burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning bird hotter and faster.
- **Lightning:** Bird catches from the flame touching it.
- **Plasma:** Bird catches from the flame touching it.
- **Rocket:** Bird catches from the flame touching it.
- **Ember:** Bird catches from the flame touching it.
- **Saltpeter:** Bird burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning bird hotter and faster.
- **Ozone:** Bird burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning bird hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lightning

A bolt of lightning. Strikes straight down at once in a jagged line. Where it lands it pours in heat, lights flames and sends current through anything that conducts.

- **State:** Energy, 0.1 kg/m³
- **Starts at:** 3,000 °C

With other elements (118 interact):

- **Sand:** Sand falls through lightning.
- **Water:** Lightning (3,000 °C) is hot enough to boil water into steam. Water falls through lightning.
- **Oil:** Oil catches from the flame touching it. Oil falls through lightning.
- **Ice:** Lightning (3,000 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through lightning.
- **Stone:** Lightning (3,000 °C) is hot enough to melt stone into lava.
- **Gravel:** Lightning (3,000 °C) is hot enough to melt gravel into lava. Gravel falls through lightning.
- **Wood:** Wood catches from the flame touching it.
- **Ash:** Ash falls through lightning.
- **Acid:** Acid falls through lightning.
- **Iron:** Lightning (3,000 °C) is hot enough to melt iron into molten iron.
- **Hydrogen:** Hydrogen catches from the flame touching it.
- **Methane:** Methane catches from the flame touching it.
- **Alcohol:** Alcohol catches from the flame touching it. Alcohol falls through lightning.
- **Sawdust:** Sawdust catches from the flame touching it. Sawdust falls through lightning.
- **Salt:** Salt falls through lightning.
- **Sugar:** Sugar catches from the flame touching it. Sugar falls through lightning.
- **Dirt:** Dirt falls through lightning.
- **Snow:** Lightning (3,000 °C) is hot enough to melt snow into water. Snow falls through lightning.
- **TNT:** TNT explodes when a flame touches it.
- **Gunpowder:** Gunpowder explodes when a flame touches it. Gunpowder falls through lightning.
- **Nitro:** Nitro explodes when a flame touches it. Nitro falls through lightning.
- **Glass:** Lightning (3,000 °C) is hot enough to melt glass into molten glass.
- **Shards:** Shards falls through lightning.
- **Wire:** Lightning (3,000 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Mercury falls through lightning.
- **Seed:** Seed catches from the flame touching it. Seed falls through lightning.
- **Plant:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper falls through lightning.
- **Dry plant:** Dry plant catches from the flame touching it.
- **Clay:** Clay falls through lightning.
- **Cement:** Cement falls through lightning.
- **Quicklime:** Quicklime falls through lightning.
- **Slaked lime:** Slaked lime falls through lightning.
- **Gold:** Lightning (3,000 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold falls through lightning.
- **Aluminium:** Lightning (3,000 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium falls through lightning.
- **Lead:** Lightning (3,000 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead falls through lightning.
- **Rust:** Rust falls through lightning.
- **Coal:** Coal catches from the flame touching it. Coal falls through lightning.
- **Charcoal:** Charcoal catches from the flame touching it. Charcoal falls through lightning.
- **Sulfur:** Sulfur catches from the flame touching it. Sulfur falls through lightning.
- **Petrol:** Petrol catches from the flame touching it. Petrol falls through lightning.
- **Wax:** Lightning (3,000 °C) is hot enough to melt wax into molten wax. Wax catches from the flame touching it.
- **Molten wax:** Molten wax catches from the flame touching it. Molten wax falls through lightning.
- **Paper:** Paper catches from the flame touching it.
- **Rubber:** Rubber catches from the flame touching it.
- **Flour:** Flour catches from the flame touching it. Flour falls through lightning.
- **Thermite:** Thermite falls through lightning.
- **Honey:** Honey falls through lightning.
- **Vinegar:** Vinegar falls through lightning.
- **Bleach:** Bleach falls through lightning.
- **Lye:** Lye falls through lightning.
- **Liquid nitrogen:** Lightning (3,000 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through lightning.
- **Propane:** Propane catches from the flame touching it.
- **Dry ice:** Lightning (3,000 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through lightning.
- **Grass seed:** Grass seed catches from the flame touching it. Grass seed falls through lightning.
- **Grass:** Grass catches from the flame touching it.
- **Acorn:** Acorn catches from the flame touching it. Acorn falls through lightning.
- **Tree:** Tree catches from the flame touching it.
- **Leaves:** Leaves catches from the flame touching it.
- **Flower:** Flower catches from the flame touching it.
- **Magnesium:** Magnesium catches from the flame touching it.
- **Caramel:** Caramel catches from the flame touching it. Caramel falls through lightning.
- **Chalk:** Chalk falls through lightning.
- **Liquid oxygen:** Lightning (3,000 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through lightning.
- **Molten iron:** Molten iron falls through lightning.
- **Molten glass:** Molten glass falls through lightning.
- **Silver:** Lightning (3,000 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver falls through lightning.
- **Cooked meat:** Cooked meat catches from the flame touching it.
- **Popcorn kernel:** Popcorn kernel falls through lightning.
- **Popcorn:** Popcorn catches from the flame touching it. Popcorn falls through lightning.
- **Tar:** Tar catches from the flame touching it. Tar falls through lightning.
- **Plastic:** Lightning (3,000 °C) is hot enough to melt plastic into molten plastic. Plastic catches from the flame touching it.
- **Molten plastic:** Molten plastic catches from the flame touching it. Molten plastic falls through lightning.
- **Pumice:** Pumice falls through lightning.
- **Obsidian:** Lightning (3,000 °C) is hot enough to melt obsidian into lava.
- **Napalm:** Napalm catches from the flame touching it. Napalm falls through lightning.
- **Hydrogen peroxide:** Hydrogen peroxide falls through lightning.
- **Fish:** Fish catches from the flame touching it.
- **Ant:** Ant catches from the flame touching it.
- **Bird:** Bird catches from the flame touching it.
- **Firework:** Firework catches from the flame touching it. Firework falls through lightning.
- **Saltpeter:** Saltpeter falls through lightning.
- **Tin:** Lightning (3,000 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin falls through lightning.
- **Steel:** Lightning (3,000 °C) is hot enough to melt steel into molten iron.
- **Kerosene:** Kerosene catches from the flame touching it. Kerosene falls through lightning.
- **Acetone:** Acetone catches from the flame touching it. Acetone falls through lightning.
- **Hail:** Lightning (3,000 °C) is hot enough to melt hail into water. Hail falls through lightning.
- **Bee:** Bee catches from the flame touching it.
- **Spider:** Spider catches from the flame touching it.
- **Termite:** Termite catches from the flame touching it.
- **Frog:** Frog catches from the flame touching it.
- **Mouse:** Mouse catches from the flame touching it.
- **Snake:** Snake catches from the flame touching it.
- **Cotton:** Cotton catches from the flame touching it. Cotton falls through lightning.
- **Chocolate:** Lightning (3,000 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through lightning.
- **Phosphorus:** Phosphorus catches from the flame touching it.
- **Calcium carbide:** Calcium carbide falls through lightning.
- **Acetylene:** Acetylene catches from the flame touching it.
- **Iodine:** Lightning (3,000 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through lightning.
- **Bromine:** Lightning (3,000 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through lightning.
- **Gallium:** Lightning (3,000 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through lightning.
- **Cactus seed:** Cactus seed catches from the flame touching it. Cactus seed falls through lightning.
- **Cactus:** Cactus catches from the flame touching it.
- **Smoke bomb:** Smoke bomb catches from the flame touching it. Smoke bomb falls through lightning.
- **Peat:** Peat catches from the flame touching it. Peat falls through lightning.
- **Basalt:** Lightning (3,000 °C) is hot enough to melt basalt into lava.
- **Granite:** Lightning (3,000 °C) is hot enough to melt granite into lava.
- **Soda:** Soda falls through lightning.
- **Fuse:** Fuse catches from the flame touching it.

No direct interaction with: Air, Wall, Steam, Fire, Smoke, Oxygen, Spark, Battery, Brick, Concrete, Limestone, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Meat, Diamond, Worm, Plasma, Rocket, Ember, Zinc, Uranium, Snail, Ammonia, Ozone, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Plasma

Glowing, electrified air left by lightning. Flickers out in a moment. It lights anything flammable it touches.

- **State:** Energy, 0.1 kg/m³
- **Starts at:** 3,000 °C

With other elements (118 interact):

- **Sand:** Sand falls through plasma.
- **Water:** Plasma (3,000 °C) is hot enough to boil water into steam. Water falls through plasma.
- **Oil:** Oil catches from the flame touching it. Oil falls through plasma.
- **Ice:** Plasma (3,000 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through plasma.
- **Stone:** Plasma (3,000 °C) is hot enough to melt stone into lava.
- **Gravel:** Plasma (3,000 °C) is hot enough to melt gravel into lava. Gravel falls through plasma.
- **Wood:** Wood catches from the flame touching it.
- **Ash:** Ash falls through plasma.
- **Acid:** Acid falls through plasma.
- **Iron:** Plasma (3,000 °C) is hot enough to melt iron into molten iron.
- **Hydrogen:** Hydrogen catches from the flame touching it.
- **Methane:** Methane catches from the flame touching it.
- **Alcohol:** Alcohol catches from the flame touching it. Alcohol falls through plasma.
- **Sawdust:** Sawdust catches from the flame touching it. Sawdust falls through plasma.
- **Salt:** Salt falls through plasma.
- **Sugar:** Sugar catches from the flame touching it. Sugar falls through plasma.
- **Dirt:** Dirt falls through plasma.
- **Snow:** Plasma (3,000 °C) is hot enough to melt snow into water. Snow falls through plasma.
- **TNT:** TNT explodes when a flame touches it.
- **Gunpowder:** Gunpowder explodes when a flame touches it. Gunpowder falls through plasma.
- **Nitro:** Nitro explodes when a flame touches it. Nitro falls through plasma.
- **Glass:** Plasma (3,000 °C) is hot enough to melt glass into molten glass.
- **Shards:** Shards falls through plasma.
- **Wire:** Plasma (3,000 °C) is hot enough to melt wire into molten copper.
- **Mercury:** Mercury falls through plasma.
- **Seed:** Seed catches from the flame touching it. Seed falls through plasma.
- **Plant:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper falls through plasma.
- **Dry plant:** Dry plant catches from the flame touching it.
- **Clay:** Clay falls through plasma.
- **Cement:** Cement falls through plasma.
- **Quicklime:** Quicklime falls through plasma.
- **Slaked lime:** Slaked lime falls through plasma.
- **Gold:** Plasma (3,000 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold falls through plasma.
- **Aluminium:** Plasma (3,000 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium falls through plasma.
- **Lead:** Plasma (3,000 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead falls through plasma.
- **Rust:** Rust falls through plasma.
- **Coal:** Coal catches from the flame touching it. Coal falls through plasma.
- **Charcoal:** Charcoal catches from the flame touching it. Charcoal falls through plasma.
- **Sulfur:** Sulfur catches from the flame touching it. Sulfur falls through plasma.
- **Petrol:** Petrol catches from the flame touching it. Petrol falls through plasma.
- **Wax:** Plasma (3,000 °C) is hot enough to melt wax into molten wax. Wax catches from the flame touching it.
- **Molten wax:** Molten wax catches from the flame touching it. Molten wax falls through plasma.
- **Paper:** Paper catches from the flame touching it.
- **Rubber:** Rubber catches from the flame touching it.
- **Flour:** Flour catches from the flame touching it. Flour falls through plasma.
- **Thermite:** Thermite falls through plasma.
- **Honey:** Honey falls through plasma.
- **Vinegar:** Vinegar falls through plasma.
- **Bleach:** Bleach falls through plasma.
- **Lye:** Lye falls through plasma.
- **Liquid nitrogen:** Plasma (3,000 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through plasma.
- **Propane:** Propane catches from the flame touching it.
- **Dry ice:** Plasma (3,000 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through plasma.
- **Grass seed:** Grass seed catches from the flame touching it. Grass seed falls through plasma.
- **Grass:** Grass catches from the flame touching it.
- **Acorn:** Acorn catches from the flame touching it. Acorn falls through plasma.
- **Tree:** Tree catches from the flame touching it.
- **Leaves:** Leaves catches from the flame touching it.
- **Flower:** Flower catches from the flame touching it.
- **Magnesium:** Magnesium catches from the flame touching it.
- **Caramel:** Caramel catches from the flame touching it. Caramel falls through plasma.
- **Chalk:** Chalk falls through plasma.
- **Liquid oxygen:** Plasma (3,000 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through plasma.
- **Molten iron:** Molten iron falls through plasma.
- **Molten glass:** Molten glass falls through plasma.
- **Silver:** Plasma (3,000 °C) is hot enough to melt silver into molten silver.
- **Molten silver:** Molten silver falls through plasma.
- **Cooked meat:** Cooked meat catches from the flame touching it.
- **Popcorn kernel:** Popcorn kernel falls through plasma.
- **Popcorn:** Popcorn catches from the flame touching it. Popcorn falls through plasma.
- **Tar:** Tar catches from the flame touching it. Tar falls through plasma.
- **Plastic:** Plasma (3,000 °C) is hot enough to melt plastic into molten plastic. Plastic catches from the flame touching it.
- **Molten plastic:** Molten plastic catches from the flame touching it. Molten plastic falls through plasma.
- **Pumice:** Pumice falls through plasma.
- **Obsidian:** Plasma (3,000 °C) is hot enough to melt obsidian into lava.
- **Napalm:** Napalm catches from the flame touching it. Napalm falls through plasma.
- **Hydrogen peroxide:** Hydrogen peroxide falls through plasma.
- **Fish:** Fish catches from the flame touching it.
- **Ant:** Ant catches from the flame touching it.
- **Bird:** Bird catches from the flame touching it.
- **Firework:** Firework catches from the flame touching it. Firework falls through plasma.
- **Saltpeter:** Saltpeter falls through plasma.
- **Tin:** Plasma (3,000 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin falls through plasma.
- **Steel:** Plasma (3,000 °C) is hot enough to melt steel into molten iron.
- **Kerosene:** Kerosene catches from the flame touching it. Kerosene falls through plasma.
- **Acetone:** Acetone catches from the flame touching it. Acetone falls through plasma.
- **Hail:** Plasma (3,000 °C) is hot enough to melt hail into water. Hail falls through plasma.
- **Bee:** Bee catches from the flame touching it.
- **Spider:** Spider catches from the flame touching it.
- **Termite:** Termite catches from the flame touching it.
- **Frog:** Frog catches from the flame touching it.
- **Mouse:** Mouse catches from the flame touching it.
- **Snake:** Snake catches from the flame touching it.
- **Cotton:** Cotton catches from the flame touching it. Cotton falls through plasma.
- **Chocolate:** Plasma (3,000 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through plasma.
- **Phosphorus:** Phosphorus catches from the flame touching it.
- **Calcium carbide:** Calcium carbide falls through plasma.
- **Acetylene:** Acetylene catches from the flame touching it.
- **Iodine:** Plasma (3,000 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through plasma.
- **Bromine:** Plasma (3,000 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through plasma.
- **Gallium:** Plasma (3,000 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through plasma.
- **Cactus seed:** Cactus seed catches from the flame touching it. Cactus seed falls through plasma.
- **Cactus:** Cactus catches from the flame touching it.
- **Smoke bomb:** Smoke bomb catches from the flame touching it. Smoke bomb falls through plasma.
- **Peat:** Peat catches from the flame touching it. Peat falls through plasma.
- **Basalt:** Plasma (3,000 °C) is hot enough to melt basalt into lava.
- **Granite:** Plasma (3,000 °C) is hot enough to melt granite into lava.
- **Soda:** Soda falls through plasma.
- **Fuse:** Fuse catches from the flame touching it.

No direct interaction with: Air, Wall, Steam, Fire, Smoke, Oxygen, Spark, Battery, Brick, Concrete, Limestone, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Meat, Diamond, Worm, Lightning, Rocket, Ember, Zinc, Uranium, Snail, Ammonia, Ozone, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Firework

A packed firework powder. Falls and piles. A flame or heat launches each grain as a rocket that bursts high up into falling coloured embers.

- **State:** Powder, 1,400 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,400 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Burns:** from 250 °C in air, 0.17 s per cell
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (55 interact):

- **Air:** Firework burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Water:** Firework sinks through water (1,400 vs 1,000 kg/m³).
- **Oil:** Firework sinks through oil (1,400 vs 900 kg/m³).
- **Steam:** Firework falls through steam.
- **Lava:** Lava (1,200 °C) can set firework on fire (it ignites at 250 °C).
- **Fire:** Firework catches from the flame touching it. Firework falls through fire.
- **Smoke:** Firework falls through smoke.
- **Acid:** Acid eats firework: acidity 0.8 beats hardness 0.2. Firework sinks through acid (1,400 vs 1,100 kg/m³).
- **Hydrogen:** Firework falls through hydrogen.
- **Oxygen:** Firework burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Firework falls through oxygen. Oxygen makes burning firework hotter and faster.
- **Methane:** Firework falls through methane.
- **Alcohol:** Firework sinks through alcohol (1,400 vs 789 kg/m³).
- **Spark:** Firework catches from the flame touching it. Firework falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set firework on fire (it ignites at 250 °C).
- **Molten gold:** Molten gold (1,150 °C) can set firework on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set firework on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead (400 °C) can set firework on fire (it ignites at 250 °C).
- **Petrol:** Firework sinks through petrol (1,400 vs 740 kg/m³).
- **Molten wax:** Firework sinks through molten wax (1,400 vs 800 kg/m³).
- **Vinegar:** Firework sinks through vinegar (1,400 vs 1,010 kg/m³).
- **Bleach:** Firework sinks through bleach (1,400 vs 1,100 kg/m³).
- **Lye:** Firework sinks through lye (1,400 vs 1,100 kg/m³).
- **Liquid nitrogen:** Firework sinks through liquid nitrogen (1,400 vs 808 kg/m³).
- **Nitrogen:** Firework falls through nitrogen.
- **Carbon dioxide:** Firework falls through carbon dioxide.
- **Helium:** Firework falls through helium.
- **Propane:** Firework falls through propane.
- **Chlorine:** Firework falls through chlorine.
- **Sulfur dioxide:** Firework falls through sulfur dioxide.
- **Cloud:** Firework falls through cloud.
- **Caramel:** Firework sinks through caramel (1,400 vs 1,300 kg/m³).
- **Liquid oxygen:** Firework burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1). Firework sinks through liquid oxygen (1,400 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set firework on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass (1,450 °C) can set firework on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver (1,000 °C) can set firework on fire (it ignites at 250 °C).
- **Tar:** Firework sinks through tar (1,400 vs 1,150 kg/m³).
- **Molten plastic:** Firework sinks through molten plastic (1,400 vs 900 kg/m³).
- **Napalm:** Firework sinks through napalm (1,400 vs 900 kg/m³).
- **Hydrogen peroxide:** Firework burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning firework hotter and faster.
- **Lightning:** Firework catches from the flame touching it. Firework falls through lightning.
- **Plasma:** Firework catches from the flame touching it. Firework falls through plasma.
- **Rocket:** Firework catches from the flame touching it. Firework falls through rocket.
- **Ember:** Firework catches from the flame touching it. Firework falls through ember.
- **Saltpeter:** Firework burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning firework hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set firework on fire (it ignites at 250 °C).
- **Kerosene:** Firework sinks through kerosene (1,400 vs 800 kg/m³).
- **Acetone:** Firework sinks through acetone (1,400 vs 784 kg/m³).
- **Ammonia:** Firework falls through ammonia.
- **Ozone:** Firework burns: it catches fire at 250 °C next to ozone (oxidiser 1). Firework falls through ozone. Ozone makes burning firework hotter and faster.
- **Molten chocolate:** Firework sinks through molten chocolate (1,400 vs 1,250 kg/m³).
- **Acetylene:** Firework falls through acetylene.
- **Iodine vapour:** Firework falls through iodine vapour.
- **Argon:** Firework falls through argon.
- **Bromine vapour:** Firework falls through bromine vapour.
- **Soda:** Firework sinks through soda (1,400 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Rocket

A lit firework climbing fast. Rises in a straight line, trailing sparks, then bursts into embers.

- **State:** Energy, 0.5 kg/m³
- **Starts at:** 900 °C

With other elements (108 interact):

- **Sand:** Sand falls through rocket.
- **Water:** Rocket (900 °C) is hot enough to boil water into steam. Water falls through rocket.
- **Oil:** Oil catches from the flame touching it. Oil falls through rocket.
- **Ice:** Rocket (900 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through rocket.
- **Gravel:** Gravel falls through rocket.
- **Wood:** Wood catches from the flame touching it.
- **Ash:** Ash falls through rocket.
- **Acid:** Acid falls through rocket.
- **Hydrogen:** Hydrogen catches from the flame touching it.
- **Methane:** Methane catches from the flame touching it.
- **Alcohol:** Alcohol catches from the flame touching it. Alcohol falls through rocket.
- **Sawdust:** Sawdust catches from the flame touching it. Sawdust falls through rocket.
- **Salt:** Salt falls through rocket.
- **Sugar:** Sugar catches from the flame touching it. Sugar falls through rocket.
- **Dirt:** Dirt falls through rocket.
- **Snow:** Rocket (900 °C) is hot enough to melt snow into water. Snow falls through rocket.
- **TNT:** TNT explodes when a flame touches it.
- **Gunpowder:** Gunpowder explodes when a flame touches it. Gunpowder falls through rocket.
- **Nitro:** Nitro explodes when a flame touches it. Nitro falls through rocket.
- **Shards:** Shards falls through rocket.
- **Mercury:** Mercury falls through rocket.
- **Seed:** Seed catches from the flame touching it. Seed falls through rocket.
- **Plant:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper falls through rocket.
- **Dry plant:** Dry plant catches from the flame touching it.
- **Clay:** Clay falls through rocket.
- **Cement:** Cement falls through rocket.
- **Quicklime:** Quicklime falls through rocket.
- **Slaked lime:** Slaked lime falls through rocket.
- **Molten gold:** Molten gold falls through rocket.
- **Aluminium:** Rocket (900 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium falls through rocket.
- **Lead:** Rocket (900 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead falls through rocket.
- **Rust:** Rust falls through rocket.
- **Coal:** Coal catches from the flame touching it. Coal falls through rocket.
- **Charcoal:** Charcoal catches from the flame touching it. Charcoal falls through rocket.
- **Sulfur:** Sulfur catches from the flame touching it. Sulfur falls through rocket.
- **Petrol:** Petrol catches from the flame touching it. Petrol falls through rocket.
- **Wax:** Rocket (900 °C) is hot enough to melt wax into molten wax. Wax catches from the flame touching it.
- **Molten wax:** Molten wax catches from the flame touching it. Molten wax falls through rocket.
- **Paper:** Paper catches from the flame touching it.
- **Rubber:** Rubber catches from the flame touching it.
- **Flour:** Flour catches from the flame touching it. Flour falls through rocket.
- **Thermite:** Thermite falls through rocket.
- **Honey:** Honey falls through rocket.
- **Vinegar:** Vinegar falls through rocket.
- **Bleach:** Bleach falls through rocket.
- **Lye:** Lye falls through rocket.
- **Liquid nitrogen:** Rocket (900 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through rocket.
- **Propane:** Propane catches from the flame touching it.
- **Dry ice:** Rocket (900 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through rocket.
- **Grass seed:** Grass seed catches from the flame touching it. Grass seed falls through rocket.
- **Grass:** Grass catches from the flame touching it.
- **Acorn:** Acorn catches from the flame touching it. Acorn falls through rocket.
- **Tree:** Tree catches from the flame touching it.
- **Leaves:** Leaves catches from the flame touching it.
- **Flower:** Flower catches from the flame touching it.
- **Magnesium:** Magnesium catches from the flame touching it.
- **Caramel:** Caramel catches from the flame touching it. Caramel falls through rocket.
- **Chalk:** Chalk falls through rocket.
- **Liquid oxygen:** Rocket (900 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through rocket.
- **Molten iron:** Molten iron falls through rocket.
- **Molten glass:** Molten glass falls through rocket.
- **Molten silver:** Molten silver falls through rocket.
- **Cooked meat:** Cooked meat catches from the flame touching it.
- **Popcorn kernel:** Popcorn kernel falls through rocket.
- **Popcorn:** Popcorn catches from the flame touching it. Popcorn falls through rocket.
- **Tar:** Tar catches from the flame touching it. Tar falls through rocket.
- **Plastic:** Rocket (900 °C) is hot enough to melt plastic into molten plastic. Plastic catches from the flame touching it.
- **Molten plastic:** Molten plastic catches from the flame touching it. Molten plastic falls through rocket.
- **Pumice:** Pumice falls through rocket.
- **Napalm:** Napalm catches from the flame touching it. Napalm falls through rocket.
- **Hydrogen peroxide:** Hydrogen peroxide falls through rocket.
- **Fish:** Fish catches from the flame touching it.
- **Ant:** Ant catches from the flame touching it.
- **Bird:** Bird catches from the flame touching it.
- **Firework:** Firework catches from the flame touching it. Firework falls through rocket.
- **Saltpeter:** Saltpeter falls through rocket.
- **Tin:** Rocket (900 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin falls through rocket.
- **Kerosene:** Kerosene catches from the flame touching it. Kerosene falls through rocket.
- **Acetone:** Acetone catches from the flame touching it. Acetone falls through rocket.
- **Hail:** Rocket (900 °C) is hot enough to melt hail into water. Hail falls through rocket.
- **Bee:** Bee catches from the flame touching it.
- **Spider:** Spider catches from the flame touching it.
- **Termite:** Termite catches from the flame touching it.
- **Frog:** Frog catches from the flame touching it.
- **Mouse:** Mouse catches from the flame touching it.
- **Snake:** Snake catches from the flame touching it.
- **Cotton:** Cotton catches from the flame touching it. Cotton falls through rocket.
- **Chocolate:** Rocket (900 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through rocket.
- **Phosphorus:** Phosphorus catches from the flame touching it.
- **Calcium carbide:** Calcium carbide falls through rocket.
- **Acetylene:** Acetylene catches from the flame touching it.
- **Iodine:** Rocket (900 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through rocket.
- **Bromine:** Rocket (900 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through rocket.
- **Gallium:** Rocket (900 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through rocket.
- **Cactus seed:** Cactus seed catches from the flame touching it. Cactus seed falls through rocket.
- **Cactus:** Cactus catches from the flame touching it.
- **Smoke bomb:** Smoke bomb catches from the flame touching it. Smoke bomb falls through rocket.
- **Peat:** Peat catches from the flame touching it. Peat falls through rocket.
- **Soda:** Soda falls through rocket.
- **Fuse:** Fuse catches from the flame touching it.

No direct interaction with: Air, Wall, Steam, Stone, Fire, Smoke, Iron, Oxygen, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Obsidian, Diamond, Worm, Lightning, Plasma, Ember, Steel, Zinc, Uranium, Snail, Ammonia, Ozone, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ember

A bright burning fleck from a firework. Drifts down, swaying, and burns out. It can still light what it lands on.

- **State:** Energy, 0.3 kg/m³
- **Starts at:** 700 °C

With other elements (108 interact):

- **Sand:** Sand falls through ember.
- **Water:** Ember (700 °C) is hot enough to boil water into steam. Water falls through ember.
- **Oil:** Oil catches from the flame touching it. Oil falls through ember.
- **Ice:** Ember (700 °C) is hot enough to melt ice into water.
- **Lava:** Lava falls through ember.
- **Gravel:** Gravel falls through ember.
- **Wood:** Wood catches from the flame touching it.
- **Ash:** Ash falls through ember.
- **Acid:** Acid falls through ember.
- **Hydrogen:** Hydrogen catches from the flame touching it.
- **Methane:** Methane catches from the flame touching it.
- **Alcohol:** Alcohol catches from the flame touching it. Alcohol falls through ember.
- **Sawdust:** Sawdust catches from the flame touching it. Sawdust falls through ember.
- **Salt:** Salt falls through ember.
- **Sugar:** Sugar catches from the flame touching it. Sugar falls through ember.
- **Dirt:** Dirt falls through ember.
- **Snow:** Ember (700 °C) is hot enough to melt snow into water. Snow falls through ember.
- **TNT:** TNT explodes when a flame touches it.
- **Gunpowder:** Gunpowder explodes when a flame touches it. Gunpowder falls through ember.
- **Nitro:** Nitro explodes when a flame touches it. Nitro falls through ember.
- **Shards:** Shards falls through ember.
- **Mercury:** Mercury falls through ember.
- **Seed:** Seed catches from the flame touching it. Seed falls through ember.
- **Plant:** Plant catches from the flame touching it.
- **Molten copper:** Molten copper falls through ember.
- **Dry plant:** Dry plant catches from the flame touching it.
- **Clay:** Clay falls through ember.
- **Cement:** Cement falls through ember.
- **Quicklime:** Quicklime falls through ember.
- **Slaked lime:** Slaked lime falls through ember.
- **Molten gold:** Molten gold falls through ember.
- **Aluminium:** Ember (700 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium falls through ember.
- **Lead:** Ember (700 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead falls through ember.
- **Rust:** Rust falls through ember.
- **Coal:** Coal catches from the flame touching it. Coal falls through ember.
- **Charcoal:** Charcoal catches from the flame touching it. Charcoal falls through ember.
- **Sulfur:** Sulfur catches from the flame touching it. Sulfur falls through ember.
- **Petrol:** Petrol catches from the flame touching it. Petrol falls through ember.
- **Wax:** Ember (700 °C) is hot enough to melt wax into molten wax. Wax catches from the flame touching it.
- **Molten wax:** Molten wax catches from the flame touching it. Molten wax falls through ember.
- **Paper:** Paper catches from the flame touching it.
- **Rubber:** Rubber catches from the flame touching it.
- **Flour:** Flour catches from the flame touching it. Flour falls through ember.
- **Thermite:** Thermite falls through ember.
- **Honey:** Honey falls through ember.
- **Vinegar:** Vinegar falls through ember.
- **Bleach:** Bleach falls through ember.
- **Lye:** Lye falls through ember.
- **Liquid nitrogen:** Ember (700 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through ember.
- **Propane:** Propane catches from the flame touching it.
- **Dry ice:** Ember (700 °C) is hot enough to turn dry ice into carbon dioxide.
- **Baking soda:** Baking soda falls through ember.
- **Grass seed:** Grass seed catches from the flame touching it. Grass seed falls through ember.
- **Grass:** Grass catches from the flame touching it.
- **Acorn:** Acorn catches from the flame touching it. Acorn falls through ember.
- **Tree:** Tree catches from the flame touching it.
- **Leaves:** Leaves catches from the flame touching it.
- **Flower:** Flower catches from the flame touching it.
- **Magnesium:** Magnesium catches from the flame touching it.
- **Caramel:** Caramel catches from the flame touching it. Caramel falls through ember.
- **Chalk:** Chalk falls through ember.
- **Liquid oxygen:** Ember (700 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through ember.
- **Molten iron:** Molten iron falls through ember.
- **Molten glass:** Molten glass falls through ember.
- **Molten silver:** Molten silver falls through ember.
- **Cooked meat:** Cooked meat catches from the flame touching it.
- **Popcorn kernel:** Popcorn kernel falls through ember.
- **Popcorn:** Popcorn catches from the flame touching it. Popcorn falls through ember.
- **Tar:** Tar catches from the flame touching it. Tar falls through ember.
- **Plastic:** Ember (700 °C) is hot enough to melt plastic into molten plastic. Plastic catches from the flame touching it.
- **Molten plastic:** Molten plastic catches from the flame touching it. Molten plastic falls through ember.
- **Pumice:** Pumice falls through ember.
- **Napalm:** Napalm catches from the flame touching it. Napalm falls through ember.
- **Hydrogen peroxide:** Hydrogen peroxide falls through ember.
- **Fish:** Fish catches from the flame touching it.
- **Ant:** Ant catches from the flame touching it.
- **Bird:** Bird catches from the flame touching it.
- **Firework:** Firework catches from the flame touching it. Firework falls through ember.
- **Saltpeter:** Saltpeter falls through ember.
- **Tin:** Ember (700 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin falls through ember.
- **Kerosene:** Kerosene catches from the flame touching it. Kerosene falls through ember.
- **Acetone:** Acetone catches from the flame touching it. Acetone falls through ember.
- **Hail:** Ember (700 °C) is hot enough to melt hail into water. Hail falls through ember.
- **Bee:** Bee catches from the flame touching it.
- **Spider:** Spider catches from the flame touching it.
- **Termite:** Termite catches from the flame touching it.
- **Frog:** Frog catches from the flame touching it.
- **Mouse:** Mouse catches from the flame touching it.
- **Snake:** Snake catches from the flame touching it.
- **Cotton:** Cotton catches from the flame touching it. Cotton falls through ember.
- **Chocolate:** Ember (700 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through ember.
- **Phosphorus:** Phosphorus catches from the flame touching it.
- **Calcium carbide:** Calcium carbide falls through ember.
- **Acetylene:** Acetylene catches from the flame touching it.
- **Iodine:** Ember (700 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through ember.
- **Bromine:** Ember (700 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through ember.
- **Gallium:** Ember (700 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through ember.
- **Cactus seed:** Cactus seed catches from the flame touching it. Cactus seed falls through ember.
- **Cactus:** Cactus catches from the flame touching it.
- **Smoke bomb:** Smoke bomb catches from the flame touching it. Smoke bomb falls through ember.
- **Peat:** Peat catches from the flame touching it. Peat falls through ember.
- **Soda:** Soda falls through ember.
- **Fuse:** Fuse catches from the flame touching it.

No direct interaction with: Air, Wall, Steam, Stone, Fire, Smoke, Iron, Oxygen, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Obsidian, Diamond, Worm, Lightning, Plasma, Rocket, Steel, Zinc, Uranium, Snail, Ammonia, Ozone, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Saltpeter

White crystals that carry oxygen, a powder. Falls and piles, and dissolves in water. Fuel touching it burns fiercely.

- **State:** Powder, 2,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,100 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Feeds fire:** strength 0.9 (air is 0.21)
- **Dissolves in:** water, up to 30% of a cell; boiling leaves it as crystals

With other elements (96 interact):

- **Water:** Saltpeter dissolves into water: water is a solvent and each cell holds up to 30% saltpeter. Saltpeter sinks through water (2,100 vs 1,000 kg/m³).
- **Oil:** Saltpeter sinks through oil (2,100 vs 900 kg/m³). Saltpeter makes burning oil hotter and faster. Oil burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Ice:** Saltpeter melts ice: dissolved, it lowers the freezing point.
- **Steam:** Saltpeter falls through steam.
- **Fire:** Saltpeter falls through fire.
- **Smoke:** Saltpeter falls through smoke.
- **Wood:** Saltpeter makes burning wood hotter and faster. Wood burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Acid:** Saltpeter sinks through acid (2,100 vs 1,100 kg/m³).
- **Iron:** Iron slowly rusts into rust where saltpeter touches it.
- **Hydrogen:** Saltpeter falls through hydrogen. Saltpeter makes burning hydrogen hotter and faster. Hydrogen burns: it catches fire at 500 °C next to saltpeter (oxidiser 0.9).
- **Oxygen:** Saltpeter falls through oxygen.
- **Methane:** Saltpeter falls through methane. Saltpeter makes burning methane hotter and faster. Methane burns: it catches fire at 540 °C next to saltpeter (oxidiser 0.9).
- **Alcohol:** Saltpeter sinks through alcohol (2,100 vs 789 kg/m³). Saltpeter makes burning alcohol hotter and faster. Alcohol burns: it catches fire at 365 °C next to saltpeter (oxidiser 0.9).
- **Sawdust:** Saltpeter makes burning sawdust hotter and faster. Sawdust burns: it catches fire at 260 °C next to saltpeter (oxidiser 0.9).
- **Sugar:** Saltpeter makes burning sugar hotter and faster. Sugar burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9).
- **Snow:** Saltpeter melts snow: dissolved, it lowers the freezing point.
- **TNT:** Saltpeter makes burning tnt hotter and faster. TNT explodes at 300 °C; it needs no air.
- **Gunpowder:** Saltpeter makes burning gunpowder hotter and faster. Gunpowder explodes at 250 °C; it needs no air.
- **Nitro:** Saltpeter sinks through nitro (2,100 vs 1,600 kg/m³). Saltpeter makes burning nitro hotter and faster. Nitro explodes at 200 °C; it needs no air.
- **Spark:** Saltpeter falls through spark.
- **Seed:** Saltpeter makes burning seed hotter and faster. Seed burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Plant:** Saltpeter makes burning plant hotter and faster. Plant burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Dry plant:** Saltpeter makes burning dry plant hotter and faster. Dry plant burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9).
- **Coal:** Saltpeter makes burning coal hotter and faster. Coal burns: it catches fire at 450 °C next to saltpeter (oxidiser 0.9).
- **Charcoal:** Saltpeter makes burning charcoal hotter and faster. Charcoal burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9).
- **Sulfur:** Saltpeter makes burning sulfur hotter and faster. Sulfur burns: it catches fire at 232 °C next to saltpeter (oxidiser 0.9).
- **Petrol:** Saltpeter sinks through petrol (2,100 vs 740 kg/m³). Saltpeter makes burning petrol hotter and faster. Petrol burns: it catches fire at 280 °C next to saltpeter (oxidiser 0.9).
- **Wax:** Saltpeter makes burning wax hotter and faster. Wax burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Molten wax:** Saltpeter sinks through molten wax (2,100 vs 800 kg/m³). Saltpeter makes burning molten wax hotter and faster. Molten wax burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Paper:** Saltpeter makes burning paper hotter and faster. Paper burns: it catches fire at 233 °C next to saltpeter (oxidiser 0.9).
- **Rubber:** Saltpeter makes burning rubber hotter and faster. Rubber burns: it catches fire at 400 °C next to saltpeter (oxidiser 0.9).
- **Flour:** Saltpeter makes burning flour hotter and faster. Flour burns: it catches fire at 380 °C next to saltpeter (oxidiser 0.9).
- **Thermite:** Saltpeter makes burning thermite hotter and faster. Thermite burns: it catches fire at 900 °C next to saltpeter (oxidiser 0.9).
- **Honey:** Saltpeter sinks through honey (2,100 vs 1,420 kg/m³).
- **Vinegar:** Saltpeter sinks through vinegar (2,100 vs 1,010 kg/m³).
- **Bleach:** Saltpeter sinks through bleach (2,100 vs 1,100 kg/m³).
- **Lye:** Saltpeter sinks through lye (2,100 vs 1,100 kg/m³).
- **Liquid nitrogen:** Saltpeter sinks through liquid nitrogen (2,100 vs 808 kg/m³).
- **Nitrogen:** Saltpeter falls through nitrogen.
- **Carbon dioxide:** Saltpeter falls through carbon dioxide.
- **Helium:** Saltpeter falls through helium.
- **Propane:** Saltpeter falls through propane. Saltpeter makes burning propane hotter and faster. Propane burns: it catches fire at 470 °C next to saltpeter (oxidiser 0.9).
- **Chlorine:** Saltpeter falls through chlorine.
- **Sulfur dioxide:** Saltpeter falls through sulfur dioxide.
- **C4:** Saltpeter makes burning c4 hotter and faster. C4 explodes at 900 °C; it needs no air.
- **Grass seed:** Saltpeter makes burning grass seed hotter and faster. Grass seed burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Grass:** Saltpeter makes burning grass hotter and faster. Grass burns: it catches fire at 220 °C next to saltpeter (oxidiser 0.9).
- **Acorn:** Saltpeter makes burning acorn hotter and faster. Acorn burns: it catches fire at 260 °C next to saltpeter (oxidiser 0.9).
- **Tree:** Saltpeter makes burning tree hotter and faster. Tree burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Leaves:** Saltpeter makes burning leaves hotter and faster. Leaves burns: it catches fire at 230 °C next to saltpeter (oxidiser 0.9).
- **Flower:** Saltpeter makes burning flower hotter and faster. Flower burns: it catches fire at 220 °C next to saltpeter (oxidiser 0.9).
- **Cloud:** Saltpeter falls through cloud.
- **Magnesium:** Saltpeter makes burning magnesium hotter and faster. Magnesium burns: it catches fire at 650 °C next to saltpeter (oxidiser 0.9).
- **Caramel:** Saltpeter sinks through caramel (2,100 vs 1,300 kg/m³). Saltpeter makes burning caramel hotter and faster. Caramel burns: it catches fire at 400 °C next to saltpeter (oxidiser 0.9).
- **Liquid oxygen:** Saltpeter sinks through liquid oxygen (2,100 vs 1,141 kg/m³).
- **Cooked meat:** Saltpeter makes burning cooked meat hotter and faster. Cooked meat burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Popcorn:** Saltpeter makes burning popcorn hotter and faster. Popcorn burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Tar:** Saltpeter sinks through tar (2,100 vs 1,150 kg/m³). Saltpeter makes burning tar hotter and faster. Tar burns: it catches fire at 320 °C next to saltpeter (oxidiser 0.9).
- **Plastic:** Saltpeter makes burning plastic hotter and faster. Plastic burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9).
- **Molten plastic:** Saltpeter sinks through molten plastic (2,100 vs 900 kg/m³). Saltpeter makes burning molten plastic hotter and faster. Molten plastic burns: it catches fire at 350 °C next to saltpeter (oxidiser 0.9).
- **Diamond:** Saltpeter makes burning diamond hotter and faster. Diamond burns: it catches fire at 900 °C next to saltpeter (oxidiser 0.9).
- **Napalm:** Saltpeter sinks through napalm (2,100 vs 900 kg/m³). Saltpeter makes burning napalm hotter and faster. Napalm burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Hydrogen peroxide:** Saltpeter sinks through hydrogen peroxide (2,100 vs 1,450 kg/m³).
- **Fish:** Saltpeter makes burning fish hotter and faster. Fish burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Ant:** Saltpeter makes burning ant hotter and faster. Ant burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9).
- **Bird:** Saltpeter makes burning bird hotter and faster. Bird burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Lightning:** Saltpeter falls through lightning.
- **Plasma:** Saltpeter falls through plasma.
- **Firework:** Saltpeter makes burning firework hotter and faster. Firework burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Rocket:** Saltpeter falls through rocket.
- **Ember:** Saltpeter falls through ember.
- **Steel:** Steel slowly rusts into rust where saltpeter touches it.
- **Kerosene:** Saltpeter sinks through kerosene (2,100 vs 800 kg/m³). Saltpeter makes burning kerosene hotter and faster. Kerosene burns: it catches fire at 220 °C next to saltpeter (oxidiser 0.9).
- **Acetone:** Saltpeter sinks through acetone (2,100 vs 784 kg/m³). Saltpeter makes burning acetone hotter and faster. Acetone burns: it catches fire at 465 °C next to saltpeter (oxidiser 0.9).
- **Hail:** Saltpeter melts hail: dissolved, it lowers the freezing point.
- **Bee:** Saltpeter makes burning bee hotter and faster. Bee burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9).
- **Spider:** Saltpeter makes burning spider hotter and faster. Spider burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9).
- **Termite:** Saltpeter makes burning termite hotter and faster. Termite burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9).
- **Frog:** Saltpeter makes burning frog hotter and faster. Frog burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Mouse:** Saltpeter makes burning mouse hotter and faster. Mouse burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Snake:** Saltpeter makes burning snake hotter and faster. Snake burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Ammonia:** Saltpeter falls through ammonia.
- **Ozone:** Saltpeter falls through ozone.
- **Cotton:** Saltpeter makes burning cotton hotter and faster. Cotton burns: it catches fire at 255 °C next to saltpeter (oxidiser 0.9).
- **Molten chocolate:** Saltpeter sinks through molten chocolate (2,100 vs 1,250 kg/m³).
- **Phosphorus:** Saltpeter makes burning phosphorus hotter and faster. Phosphorus burns: it catches fire at 30 °C next to saltpeter (oxidiser 0.9).
- **Acetylene:** Saltpeter falls through acetylene. Saltpeter makes burning acetylene hotter and faster. Acetylene burns: it catches fire at 305 °C next to saltpeter (oxidiser 0.9).
- **Iodine vapour:** Saltpeter falls through iodine vapour.
- **Argon:** Saltpeter falls through argon.
- **Bromine vapour:** Saltpeter falls through bromine vapour.
- **Cactus seed:** Saltpeter makes burning cactus seed hotter and faster. Cactus seed burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9).
- **Cactus:** Saltpeter makes burning cactus hotter and faster. Cactus burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Smoke bomb:** Saltpeter makes burning smoke bomb hotter and faster. Smoke bomb burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9).
- **Peat:** Saltpeter makes burning peat hotter and faster. Peat burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9).
- **Soda:** Saltpeter sinks through soda (2,100 vs 1,010 kg/m³).
- **Fuse:** Saltpeter makes burning fuse hotter and faster. Fuse burns: it catches fire at 150 °C next to saltpeter (oxidiser 0.9).

No direct interaction with: Air, Wall, Sand, Lava, Stone, Gravel, Ash, Salt, Dirt, Glass, Shards, Wire, Battery, Mercury, Molten copper, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Dry ice, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Popcorn kernel, Pumice, Obsidian, Worm, Tin, Molten tin, Zinc, Uranium, Snail, Chocolate, Egg, Cooked egg, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Tin

A soft silvery metal. Stays put. It melts at a low heat into molten tin, and acid eats it, giving off hydrogen.

- **State:** Solid, 7,300 kg/m³
- **Melts:** at 232 °C, into molten tin
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (16 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt tin into molten tin.
- **Fire:** Fire (850 °C) is hot enough to melt tin into molten tin.
- **Acid:** Acid eats tin: acidity 0.8 beats hardness 0.3, giving off hydrogen.
- **Spark:** Spark (300 °C) is hot enough to melt tin into molten tin.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt tin into molten tin.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt tin into molten tin.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt tin into molten tin.
- **Molten lead:** Molten lead (400 °C) is hot enough to melt tin into molten tin.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt tin into molten tin.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt tin into molten tin.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt tin into molten tin.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt tin into molten tin.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt tin into molten tin.
- **Rocket:** Rocket (900 °C) is hot enough to melt tin into molten tin.
- **Ember:** Ember (700 °C) is hot enough to melt tin into molten tin.
- **Molten tin:** Molten tin (260 °C) is hot enough to melt tin into molten tin.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten tin

Melted tin, bright and runny. Flows and sinks through water. Sets back into tin as it cools.

- **State:** Liquid, 6,990 kg/m³
- **Starts at:** 260 °C
- **In liquids:** Sinks through liquids lighter than 6,990 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Freezes:** below 232 °C, into tin
- **Conducts:** electric charge, warming as pulses pass

With other elements (89 interact):

- **Water:** Molten tin sinks through water (6,990 vs 1,000 kg/m³). Molten tin (260 °C) is hot enough to boil water into steam.
- **Oil:** Molten tin sinks through oil (6,990 vs 900 kg/m³). Molten tin (260 °C) can set oil on fire (it ignites at 250 °C).
- **Ice:** Molten tin (260 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten tin into tin.
- **Steam:** Molten tin falls through steam.
- **Lava:** Molten tin sinks through lava (6,990 vs 2,600 kg/m³).
- **Fire:** Molten tin falls through fire.
- **Smoke:** Molten tin falls through smoke.
- **Acid:** Molten tin sinks through acid (6,990 vs 1,100 kg/m³).
- **Hydrogen:** Molten tin falls through hydrogen.
- **Oxygen:** Molten tin falls through oxygen.
- **Methane:** Molten tin falls through methane.
- **Alcohol:** Molten tin sinks through alcohol (6,990 vs 789 kg/m³).
- **Sawdust:** Molten tin (260 °C) can set sawdust on fire (it ignites at 260 °C).
- **Snow:** Molten tin (260 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten tin into tin.
- **Gunpowder:** Molten tin (260 °C) can set gunpowder on fire (it ignites at 250 °C).
- **Nitro:** Molten tin sinks through nitro (6,990 vs 1,600 kg/m³). Molten tin (260 °C) can set nitro on fire (it ignites at 200 °C).
- **Spark:** Molten tin falls through spark.
- **Mercury:** Mercury sinks through molten tin (13,534 vs 6,990 kg/m³).
- **Seed:** Molten tin (260 °C) can set seed on fire (it ignites at 250 °C).
- **Plant:** Molten tin (260 °C) can set plant on fire (it ignites at 250 °C).
- **Molten copper:** Molten copper sinks through molten tin (8,020 vs 6,990 kg/m³).
- **Dry plant:** Molten tin (260 °C) can set dry plant on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold sinks through molten tin (17,300 vs 6,990 kg/m³).
- **Molten aluminium:** Molten tin sinks through molten aluminium (6,990 vs 2,375 kg/m³).
- **Molten lead:** Molten lead sinks through molten tin (10,660 vs 6,990 kg/m³).
- **Sulfur:** Molten tin (260 °C) can set sulfur on fire (it ignites at 232 °C).
- **Petrol:** Molten tin sinks through petrol (6,990 vs 740 kg/m³).
- **Wax:** Molten tin (260 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Molten tin sinks through molten wax (6,990 vs 800 kg/m³).
- **Paper:** Molten tin (260 °C) can set paper on fire (it ignites at 233 °C).
- **Honey:** Molten tin sinks through honey (6,990 vs 1,420 kg/m³).
- **Vinegar:** Molten tin sinks through vinegar (6,990 vs 1,010 kg/m³).
- **Bleach:** Molten tin sinks through bleach (6,990 vs 1,100 kg/m³).
- **Lye:** Molten tin sinks through lye (6,990 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten tin sinks through liquid nitrogen (6,990 vs 808 kg/m³). Molten tin (260 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten tin into tin.
- **Nitrogen:** Molten tin falls through nitrogen.
- **Carbon dioxide:** Molten tin falls through carbon dioxide.
- **Helium:** Molten tin falls through helium.
- **Propane:** Molten tin falls through propane.
- **Chlorine:** Molten tin falls through chlorine.
- **Sulfur dioxide:** Molten tin falls through sulfur dioxide.
- **Dry ice:** Molten tin (260 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten tin into tin.
- **Grass seed:** Molten tin (260 °C) can set grass seed on fire (it ignites at 250 °C).
- **Grass:** Molten tin (260 °C) can set grass on fire (it ignites at 220 °C).
- **Acorn:** Molten tin (260 °C) can set acorn on fire (it ignites at 260 °C).
- **Leaves:** Molten tin (260 °C) can set leaves on fire (it ignites at 230 °C).
- **Flower:** Molten tin (260 °C) can set flower on fire (it ignites at 220 °C).
- **Cloud:** Molten tin falls through cloud.
- **Caramel:** Molten tin sinks through caramel (6,990 vs 1,300 kg/m³).
- **Liquid oxygen:** Molten tin sinks through liquid oxygen (6,990 vs 1,141 kg/m³). Molten tin (260 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten tin into tin.
- **Molten iron:** Molten tin sinks through molten iron (6,990 vs 6,980 kg/m³).
- **Molten glass:** Molten tin sinks through molten glass (6,990 vs 2,400 kg/m³).
- **Molten silver:** Molten silver sinks through molten tin (9,320 vs 6,990 kg/m³).
- **Tar:** Molten tin sinks through tar (6,990 vs 1,150 kg/m³).
- **Plastic:** Molten tin (260 °C) is hot enough to melt plastic into molten plastic.
- **Molten plastic:** Molten tin sinks through molten plastic (6,990 vs 900 kg/m³).
- **Napalm:** Molten tin sinks through napalm (6,990 vs 900 kg/m³). Molten tin (260 °C) can set napalm on fire (it ignites at 250 °C).
- **Hydrogen peroxide:** Molten tin sinks through hydrogen peroxide (6,990 vs 1,450 kg/m³).
- **Ant:** Molten tin (260 °C) can set ant on fire (it ignites at 200 °C).
- **Lightning:** Molten tin falls through lightning.
- **Plasma:** Molten tin falls through plasma.
- **Firework:** Molten tin (260 °C) can set firework on fire (it ignites at 250 °C).
- **Rocket:** Molten tin falls through rocket.
- **Ember:** Molten tin falls through ember.
- **Tin:** Molten tin (260 °C) is hot enough to melt tin into molten tin.
- **Kerosene:** Molten tin sinks through kerosene (6,990 vs 800 kg/m³). Molten tin (260 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Molten tin sinks through acetone (6,990 vs 784 kg/m³).
- **Hail:** Molten tin (260 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten tin into tin.
- **Bee:** Molten tin (260 °C) can set bee on fire (it ignites at 200 °C).
- **Spider:** Molten tin (260 °C) can set spider on fire (it ignites at 200 °C).
- **Termite:** Molten tin (260 °C) can set termite on fire (it ignites at 200 °C).
- **Ammonia:** Molten tin falls through ammonia.
- **Ozone:** Molten tin falls through ozone.
- **Cotton:** Molten tin (260 °C) can set cotton on fire (it ignites at 255 °C).
- **Chocolate:** Molten tin (260 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten tin sinks through molten chocolate (6,990 vs 1,250 kg/m³).
- **Phosphorus:** Molten tin (260 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Molten tin falls through acetylene.
- **Iodine:** Molten tin (260 °C) is hot enough to turn iodine into iodine vapour.
- **Iodine vapour:** Molten tin falls through iodine vapour.
- **Argon:** Molten tin falls through argon.
- **Bromine:** Molten tin sinks through bromine (6,990 vs 3,100 kg/m³). Molten tin (260 °C) is hot enough to boil bromine into bromine vapour.
- **Bromine vapour:** Molten tin falls through bromine vapour.
- **Gallium:** Molten tin (260 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Molten tin sinks through liquid gallium (6,990 vs 6,095 kg/m³).
- **Cactus seed:** Molten tin (260 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Smoke bomb:** Molten tin (260 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Soda:** Molten tin sinks through soda (6,990 vs 1,010 kg/m³).
- **Fuse:** Molten tin (260 °C) can set fuse on fire (it ignites at 150 °C).

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Wood, Ash, Iron, Salt, Sugar, Dirt, TNT, Glass, Shards, Wire, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Rubber, Flour, Thermite, Baking soda, C4, Tree, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Pumice, Obsidian, Diamond, Fish, Worm, Bird, Saltpeter, Steel, Zinc, Uranium, Snail, Frog, Mouse, Snake, Egg, Cooked egg, Lithium, Calcium carbide, Titanium, Platinum, Cactus, Peat, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Steel

Hard iron alloy. Stays put. Acid eats it slowly and water rusts it; in great heat it melts into molten iron.

- **State:** Solid, 7,850 kg/m³
- **Melts:** at 1,500 °C, into molten iron
- **Conducts:** electric charge, warming as pulses pass
- **Rusts:** slowly into rust where water or oxygen touches it
- **Hardness:** 0.75 (acid stronger than this eats it)

With other elements (10 interact):

- **Water:** Steel slowly rusts into rust where water touches it.
- **Acid:** Acid eats steel: acidity 0.8 beats hardness 0.75, giving off hydrogen.
- **Oxygen:** Steel slowly rusts into rust where oxygen touches it.
- **Liquid oxygen:** Steel slowly rusts into rust where liquid oxygen touches it.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt steel into molten iron.
- **Hydrogen peroxide:** Steel slowly rusts into rust where hydrogen peroxide touches it.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt steel into molten iron.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt steel into molten iron.
- **Saltpeter:** Steel slowly rusts into rust where saltpeter touches it.
- **Ozone:** Steel slowly rusts into rust where ozone touches it.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Tin, Molten tin, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Zinc

A bluish-grey metal. Stays put and carries charge. Acid fizzes it away, giving off hydrogen.

- **State:** Solid, 7,140 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats zinc: acidity 0.8 beats hardness 0.3, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Kerosene

A clear lamp fuel. Flows and floats on water. Once warm its vapour catches easily, and it burns steadily.

- **State:** Liquid, 800 kg/m³
- **In liquids:** Sinks through liquids lighter than 800 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 220 °C in air, 2 s per cell
- **Flash point:** 38 °C: above it, flames spread across it

With other elements (86 interact):

- **Air:** Kerosene burns: it catches fire at 220 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through kerosene (1,600 vs 800 kg/m³).
- **Water:** Water sinks through kerosene (1,000 vs 800 kg/m³).
- **Oil:** Oil sinks through kerosene (900 vs 800 kg/m³).
- **Steam:** Kerosene falls through steam.
- **Lava:** Lava sinks through kerosene (2,600 vs 800 kg/m³). Lava (1,200 °C) can set kerosene on fire (it ignites at 220 °C).
- **Gravel:** Gravel sinks through kerosene (2,000 vs 800 kg/m³).
- **Fire:** Kerosene catches from the flame touching it. Kerosene falls through fire.
- **Smoke:** Kerosene falls through smoke.
- **Acid:** Acid sinks through kerosene (1,100 vs 800 kg/m³).
- **Hydrogen:** Kerosene falls through hydrogen.
- **Oxygen:** Kerosene burns: it catches fire at 220 °C next to oxygen (oxidiser 1). Kerosene falls through oxygen. Oxygen makes burning kerosene hotter and faster.
- **Methane:** Kerosene falls through methane.
- **Alcohol:** Kerosene sinks through alcohol (800 vs 789 kg/m³).
- **Salt:** Salt sinks through kerosene (2,160 vs 800 kg/m³).
- **Sugar:** Sugar sinks through kerosene (1,590 vs 800 kg/m³).
- **Dirt:** Dirt sinks through kerosene (1,500 vs 800 kg/m³).
- **Gunpowder:** Gunpowder sinks through kerosene (1,700 vs 800 kg/m³).
- **Nitro:** Nitro sinks through kerosene (1,600 vs 800 kg/m³).
- **Shards:** Shards sinks through kerosene (2,500 vs 800 kg/m³).
- **Spark:** Kerosene catches from the flame touching it. Kerosene falls through spark.
- **Mercury:** Mercury sinks through kerosene (13,534 vs 800 kg/m³).
- **Seed:** Seed sinks through kerosene (1,100 vs 800 kg/m³).
- **Molten copper:** Molten copper sinks through kerosene (8,020 vs 800 kg/m³). Molten copper (1,200 °C) can set kerosene on fire (it ignites at 220 °C).
- **Clay:** Clay sinks through kerosene (1,700 vs 800 kg/m³).
- **Cement:** Cement sinks through kerosene (1,440 vs 800 kg/m³).
- **Quicklime:** Quicklime sinks through kerosene (1,200 vs 800 kg/m³).
- **Slaked lime:** Slaked lime sinks through kerosene (1,100 vs 800 kg/m³).
- **Molten gold:** Molten gold sinks through kerosene (17,300 vs 800 kg/m³). Molten gold (1,150 °C) can set kerosene on fire (it ignites at 220 °C).
- **Molten aluminium:** Molten aluminium sinks through kerosene (2,375 vs 800 kg/m³). Molten aluminium (750 °C) can set kerosene on fire (it ignites at 220 °C).
- **Molten lead:** Molten lead sinks through kerosene (10,660 vs 800 kg/m³). Molten lead (400 °C) can set kerosene on fire (it ignites at 220 °C).
- **Rust:** Rust sinks through kerosene (2,000 vs 800 kg/m³).
- **Coal:** Coal sinks through kerosene (1,350 vs 800 kg/m³).
- **Sulfur:** Sulfur sinks through kerosene (2,000 vs 800 kg/m³).
- **Petrol:** Kerosene sinks through petrol (800 vs 740 kg/m³).
- **Thermite:** Thermite sinks through kerosene (1,500 vs 800 kg/m³).
- **Honey:** Honey sinks through kerosene (1,420 vs 800 kg/m³).
- **Vinegar:** Vinegar sinks through kerosene (1,010 vs 800 kg/m³).
- **Bleach:** Bleach sinks through kerosene (1,100 vs 800 kg/m³).
- **Lye:** Lye sinks through kerosene (1,100 vs 800 kg/m³).
- **Liquid nitrogen:** Liquid nitrogen sinks through kerosene (808 vs 800 kg/m³).
- **Nitrogen:** Kerosene falls through nitrogen.
- **Carbon dioxide:** Kerosene falls through carbon dioxide.
- **Helium:** Kerosene falls through helium.
- **Propane:** Kerosene falls through propane.
- **Chlorine:** Kerosene falls through chlorine.
- **Sulfur dioxide:** Kerosene falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through kerosene (1,100 vs 800 kg/m³).
- **Grass seed:** Grass seed sinks through kerosene (1,100 vs 800 kg/m³).
- **Acorn:** Acorn sinks through kerosene (1,100 vs 800 kg/m³).
- **Cloud:** Kerosene falls through cloud.
- **Caramel:** Caramel sinks through kerosene (1,300 vs 800 kg/m³).
- **Chalk:** Chalk sinks through kerosene (1,500 vs 800 kg/m³).
- **Liquid oxygen:** Kerosene burns: it catches fire at 220 °C next to liquid oxygen (oxidiser 1). Liquid oxygen sinks through kerosene (1,141 vs 800 kg/m³).
- **Molten iron:** Molten iron sinks through kerosene (6,980 vs 800 kg/m³). Molten iron (1,600 °C) can set kerosene on fire (it ignites at 220 °C).
- **Molten glass:** Molten glass sinks through kerosene (2,400 vs 800 kg/m³). Molten glass (1,450 °C) can set kerosene on fire (it ignites at 220 °C).
- **Molten silver:** Molten silver sinks through kerosene (9,320 vs 800 kg/m³). Molten silver (1,000 °C) can set kerosene on fire (it ignites at 220 °C).
- **Popcorn kernel:** Popcorn kernel sinks through kerosene (1,200 vs 800 kg/m³).
- **Tar:** Tar sinks through kerosene (1,150 vs 800 kg/m³).
- **Molten plastic:** Molten plastic sinks through kerosene (900 vs 800 kg/m³).
- **Napalm:** Napalm sinks through kerosene (900 vs 800 kg/m³).
- **Hydrogen peroxide:** Kerosene burns: it catches fire at 220 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through kerosene (1,450 vs 800 kg/m³). Hydrogen peroxide makes burning kerosene hotter and faster.
- **Lightning:** Kerosene catches from the flame touching it. Kerosene falls through lightning.
- **Plasma:** Kerosene catches from the flame touching it. Kerosene falls through plasma.
- **Firework:** Firework sinks through kerosene (1,400 vs 800 kg/m³).
- **Rocket:** Kerosene catches from the flame touching it. Kerosene falls through rocket.
- **Ember:** Kerosene catches from the flame touching it. Kerosene falls through ember.
- **Saltpeter:** Kerosene burns: it catches fire at 220 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through kerosene (2,100 vs 800 kg/m³). Saltpeter makes burning kerosene hotter and faster.
- **Molten tin:** Molten tin sinks through kerosene (6,990 vs 800 kg/m³). Molten tin (260 °C) can set kerosene on fire (it ignites at 220 °C).
- **Acetone:** Kerosene sinks through acetone (800 vs 784 kg/m³).
- **Hail:** Hail sinks through kerosene (900 vs 800 kg/m³).
- **Ammonia:** Kerosene falls through ammonia.
- **Ozone:** Kerosene burns: it catches fire at 220 °C next to ozone (oxidiser 1). Kerosene falls through ozone. Ozone makes burning kerosene hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through kerosene (1,250 vs 800 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through kerosene (2,220 vs 800 kg/m³).
- **Acetylene:** Kerosene falls through acetylene.
- **Iodine:** Iodine sinks through kerosene (4,930 vs 800 kg/m³).
- **Iodine vapour:** Kerosene falls through iodine vapour.
- **Argon:** Kerosene falls through argon.
- **Bromine:** Bromine sinks through kerosene (3,100 vs 800 kg/m³).
- **Bromine vapour:** Kerosene falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through kerosene (6,095 vs 800 kg/m³).
- **Cactus seed:** Cactus seed sinks through kerosene (1,100 vs 800 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through kerosene (1,200 vs 800 kg/m³).
- **Peat:** Peat sinks through kerosene (900 vs 800 kg/m³).
- **Soda:** Soda sinks through kerosene (1,010 vs 800 kg/m³).

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Molten wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acetone

A sharp-smelling solvent. Flows thin and floats on water. It dissolves plastic, and its vapour catches from the smallest flame.

- **State:** Liquid, 784 kg/m³
- **In liquids:** Sinks through liquids lighter than 784 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 465 °C in air, 0.67 s per cell
- **Flash point:** -20 °C: above it, flames spread across it

With other elements (88 interact):

- **Air:** Acetone burns: it catches fire at 465 °C next to air (oxidiser 0.21).
- **Sand:** Sand sinks through acetone (1,600 vs 784 kg/m³).
- **Water:** Water sinks through acetone (1,000 vs 784 kg/m³).
- **Oil:** Oil sinks through acetone (900 vs 784 kg/m³).
- **Steam:** Acetone falls through steam.
- **Lava:** Lava sinks through acetone (2,600 vs 784 kg/m³). Lava (1,200 °C) can set acetone on fire (it ignites at 465 °C).
- **Gravel:** Gravel sinks through acetone (2,000 vs 784 kg/m³).
- **Fire:** Acetone catches from the flame touching it. Acetone falls through fire.
- **Smoke:** Acetone falls through smoke.
- **Acid:** Acid sinks through acetone (1,100 vs 784 kg/m³).
- **Hydrogen:** Acetone falls through hydrogen.
- **Oxygen:** Acetone burns: it catches fire at 465 °C next to oxygen (oxidiser 1). Acetone falls through oxygen. Oxygen makes burning acetone hotter and faster.
- **Methane:** Acetone falls through methane.
- **Alcohol:** Alcohol sinks through acetone (789 vs 784 kg/m³).
- **Salt:** Salt sinks through acetone (2,160 vs 784 kg/m³).
- **Sugar:** Sugar sinks through acetone (1,590 vs 784 kg/m³).
- **Dirt:** Dirt sinks through acetone (1,500 vs 784 kg/m³).
- **Gunpowder:** Gunpowder sinks through acetone (1,700 vs 784 kg/m³).
- **Nitro:** Nitro sinks through acetone (1,600 vs 784 kg/m³).
- **Shards:** Shards sinks through acetone (2,500 vs 784 kg/m³).
- **Spark:** Acetone catches from the flame touching it. Acetone falls through spark.
- **Mercury:** Mercury sinks through acetone (13,534 vs 784 kg/m³).
- **Seed:** Seed sinks through acetone (1,100 vs 784 kg/m³).
- **Molten copper:** Molten copper sinks through acetone (8,020 vs 784 kg/m³). Molten copper (1,200 °C) can set acetone on fire (it ignites at 465 °C).
- **Clay:** Clay sinks through acetone (1,700 vs 784 kg/m³).
- **Cement:** Cement sinks through acetone (1,440 vs 784 kg/m³).
- **Quicklime:** Quicklime sinks through acetone (1,200 vs 784 kg/m³).
- **Slaked lime:** Slaked lime sinks through acetone (1,100 vs 784 kg/m³).
- **Molten gold:** Molten gold sinks through acetone (17,300 vs 784 kg/m³). Molten gold (1,150 °C) can set acetone on fire (it ignites at 465 °C).
- **Molten aluminium:** Molten aluminium sinks through acetone (2,375 vs 784 kg/m³). Molten aluminium (750 °C) can set acetone on fire (it ignites at 465 °C).
- **Molten lead:** Molten lead sinks through acetone (10,660 vs 784 kg/m³).
- **Rust:** Rust sinks through acetone (2,000 vs 784 kg/m³).
- **Coal:** Coal sinks through acetone (1,350 vs 784 kg/m³).
- **Sulfur:** Sulfur sinks through acetone (2,000 vs 784 kg/m³).
- **Petrol:** Acetone sinks through petrol (784 vs 740 kg/m³).
- **Molten wax:** Molten wax sinks through acetone (800 vs 784 kg/m³).
- **Thermite:** Thermite sinks through acetone (1,500 vs 784 kg/m³).
- **Honey:** Honey sinks through acetone (1,420 vs 784 kg/m³).
- **Vinegar:** Vinegar sinks through acetone (1,010 vs 784 kg/m³).
- **Bleach:** Bleach sinks through acetone (1,100 vs 784 kg/m³).
- **Lye:** Lye sinks through acetone (1,100 vs 784 kg/m³).
- **Liquid nitrogen:** Liquid nitrogen sinks through acetone (808 vs 784 kg/m³).
- **Nitrogen:** Acetone falls through nitrogen.
- **Carbon dioxide:** Acetone falls through carbon dioxide.
- **Helium:** Acetone falls through helium.
- **Propane:** Acetone falls through propane.
- **Chlorine:** Acetone falls through chlorine.
- **Sulfur dioxide:** Acetone falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through acetone (1,100 vs 784 kg/m³).
- **Grass seed:** Grass seed sinks through acetone (1,100 vs 784 kg/m³).
- **Acorn:** Acorn sinks through acetone (1,100 vs 784 kg/m³).
- **Cloud:** Acetone falls through cloud.
- **Caramel:** Caramel sinks through acetone (1,300 vs 784 kg/m³).
- **Chalk:** Chalk sinks through acetone (1,500 vs 784 kg/m³).
- **Liquid oxygen:** Acetone burns: it catches fire at 465 °C next to liquid oxygen (oxidiser 1). Liquid oxygen sinks through acetone (1,141 vs 784 kg/m³).
- **Molten iron:** Molten iron sinks through acetone (6,980 vs 784 kg/m³). Molten iron (1,600 °C) can set acetone on fire (it ignites at 465 °C).
- **Molten glass:** Molten glass sinks through acetone (2,400 vs 784 kg/m³). Molten glass (1,450 °C) can set acetone on fire (it ignites at 465 °C).
- **Molten silver:** Molten silver sinks through acetone (9,320 vs 784 kg/m³). Molten silver (1,000 °C) can set acetone on fire (it ignites at 465 °C).
- **Popcorn kernel:** Popcorn kernel sinks through acetone (1,200 vs 784 kg/m³).
- **Tar:** Tar sinks through acetone (1,150 vs 784 kg/m³).
- **Plastic:** Acetone dissolves plastic.
- **Molten plastic:** Molten plastic sinks through acetone (900 vs 784 kg/m³).
- **Napalm:** Napalm sinks through acetone (900 vs 784 kg/m³).
- **Hydrogen peroxide:** Acetone burns: it catches fire at 465 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide sinks through acetone (1,450 vs 784 kg/m³). Hydrogen peroxide makes burning acetone hotter and faster.
- **Lightning:** Acetone catches from the flame touching it. Acetone falls through lightning.
- **Plasma:** Acetone catches from the flame touching it. Acetone falls through plasma.
- **Firework:** Firework sinks through acetone (1,400 vs 784 kg/m³).
- **Rocket:** Acetone catches from the flame touching it. Acetone falls through rocket.
- **Ember:** Acetone catches from the flame touching it. Acetone falls through ember.
- **Saltpeter:** Acetone burns: it catches fire at 465 °C next to saltpeter (oxidiser 0.9). Saltpeter sinks through acetone (2,100 vs 784 kg/m³). Saltpeter makes burning acetone hotter and faster.
- **Molten tin:** Molten tin sinks through acetone (6,990 vs 784 kg/m³).
- **Kerosene:** Kerosene sinks through acetone (800 vs 784 kg/m³).
- **Hail:** Hail sinks through acetone (900 vs 784 kg/m³).
- **Ammonia:** Acetone falls through ammonia.
- **Ozone:** Acetone burns: it catches fire at 465 °C next to ozone (oxidiser 1). Acetone falls through ozone. Ozone makes burning acetone hotter and faster.
- **Molten chocolate:** Molten chocolate sinks through acetone (1,250 vs 784 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through acetone (2,220 vs 784 kg/m³).
- **Acetylene:** Acetone falls through acetylene.
- **Iodine:** Iodine sinks through acetone (4,930 vs 784 kg/m³).
- **Iodine vapour:** Acetone falls through iodine vapour.
- **Argon:** Acetone falls through argon.
- **Bromine:** Bromine sinks through acetone (3,100 vs 784 kg/m³).
- **Bromine vapour:** Acetone falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through acetone (6,095 vs 784 kg/m³).
- **Cactus seed:** Cactus seed sinks through acetone (1,100 vs 784 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through acetone (1,200 vs 784 kg/m³).
- **Peat:** Peat sinks through acetone (900 vs 784 kg/m³).
- **Soda:** Soda sinks through acetone (1,010 vs 784 kg/m³).

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Hail

Hard balls of ice, a heavy powder. Falls fast and bounces into piles. Melts into water as it warms.

- **State:** Powder, 900 kg/m³
- **Starts at:** -5 °C
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, rests on heavier ones
- **Falls:** up to 180 cells/s
- **Melts:** at 0 °C, into water

With other elements (48 interact):

- **Water:** Hail (-5 °C) is cold enough to freeze water into ice.
- **Steam:** Hail falls through steam. Hail (-5 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to melt hail into water.
- **Lava:** Hail (-5 °C) is cold enough to freeze lava into stone. Lava (1,200 °C) is hot enough to melt hail into water.
- **Fire:** Hail falls through fire. Fire (850 °C) is hot enough to melt hail into water.
- **Smoke:** Hail falls through smoke. Smoke (150 °C) is hot enough to melt hail into water.
- **Hydrogen:** Hail falls through hydrogen.
- **Oxygen:** Hail falls through oxygen.
- **Methane:** Hail falls through methane.
- **Alcohol:** Hail sinks through alcohol (900 vs 789 kg/m³).
- **Salt:** Salt melts hail: dissolved, it lowers the freezing point.
- **Sugar:** Sugar melts hail: dissolved, it lowers the freezing point.
- **Spark:** Hail falls through spark. Spark (300 °C) is hot enough to melt hail into water.
- **Molten copper:** Hail (-5 °C) is cold enough to freeze molten copper into wire. Molten copper (1,200 °C) is hot enough to melt hail into water.
- **Molten gold:** Hail (-5 °C) is cold enough to freeze molten gold into gold. Molten gold (1,150 °C) is hot enough to melt hail into water.
- **Molten aluminium:** Hail (-5 °C) is cold enough to freeze molten aluminium into aluminium. Molten aluminium (750 °C) is hot enough to melt hail into water.
- **Molten lead:** Hail (-5 °C) is cold enough to freeze molten lead into lead. Molten lead (400 °C) is hot enough to melt hail into water.
- **Petrol:** Hail sinks through petrol (900 vs 740 kg/m³).
- **Molten wax:** Hail sinks through molten wax (900 vs 800 kg/m³). Hail (-5 °C) is cold enough to freeze molten wax into wax. Molten wax (80 °C) is hot enough to melt hail into water.
- **Liquid nitrogen:** Hail sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Nitrogen:** Hail falls through nitrogen.
- **Carbon dioxide:** Hail falls through carbon dioxide.
- **Helium:** Hail falls through helium.
- **Propane:** Hail falls through propane.
- **Chlorine:** Hail falls through chlorine.
- **Sulfur dioxide:** Hail falls through sulfur dioxide.
- **Baking soda:** Baking soda melts hail: dissolved, it lowers the freezing point.
- **Cloud:** Hail falls through cloud.
- **Caramel:** Caramel (190 °C) is hot enough to melt hail into water.
- **Molten iron:** Hail (-5 °C) is cold enough to freeze molten iron into iron. Molten iron (1,600 °C) is hot enough to melt hail into water.
- **Molten glass:** Hail (-5 °C) is cold enough to freeze molten glass into glass. Molten glass (1,450 °C) is hot enough to melt hail into water.
- **Molten silver:** Hail (-5 °C) is cold enough to freeze molten silver into silver. Molten silver (1,000 °C) is hot enough to melt hail into water.
- **Molten plastic:** Hail (-5 °C) is cold enough to freeze molten plastic into plastic. Molten plastic (200 °C) is hot enough to melt hail into water.
- **Lightning:** Hail falls through lightning. Lightning (3,000 °C) is hot enough to melt hail into water.
- **Plasma:** Hail falls through plasma. Plasma (3,000 °C) is hot enough to melt hail into water.
- **Rocket:** Hail falls through rocket. Rocket (900 °C) is hot enough to melt hail into water.
- **Ember:** Hail falls through ember. Ember (700 °C) is hot enough to melt hail into water.
- **Saltpeter:** Saltpeter melts hail: dissolved, it lowers the freezing point.
- **Molten tin:** Hail (-5 °C) is cold enough to freeze molten tin into tin. Molten tin (260 °C) is hot enough to melt hail into water.
- **Kerosene:** Hail sinks through kerosene (900 vs 800 kg/m³).
- **Acetone:** Hail sinks through acetone (900 vs 784 kg/m³).
- **Ammonia:** Hail falls through ammonia.
- **Ozone:** Hail falls through ozone.
- **Molten chocolate:** Hail (-5 °C) is cold enough to freeze molten chocolate into chocolate. Molten chocolate (45 °C) is hot enough to melt hail into water.
- **Acetylene:** Hail falls through acetylene.
- **Iodine vapour:** Hail falls through iodine vapour. Hail (-5 °C) is cold enough to condense iodine vapour into iodine. Iodine vapour (130 °C) is hot enough to melt hail into water.
- **Argon:** Hail falls through argon.
- **Bromine vapour:** Hail falls through bromine vapour. Hail (-5 °C) is cold enough to condense bromine vapour into bromine. Bromine vapour (70 °C) is hot enough to melt hail into water.
- **Liquid gallium:** Hail (-5 °C) is cold enough to freeze liquid gallium into gallium. Liquid gallium (35 °C) is hot enough to melt hail into water.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Uranium

A dense, radioactive metal. Stays put and keeps itself hot from its own decay, glowing dull red. It poisons living things it touches.

- **State:** Solid, 19,050 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Poisons:** living things it touches: they wither
- **Holds:** itself at 450 °C
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (7 interact):

- **Acid:** Acid eats uranium: acidity 0.8 beats hardness 0.6, giving off hydrogen.
- **Plant:** Uranium is toxic: plant touching it withers.
- **Grass:** Uranium is toxic: grass touching it withers.
- **Tree:** Uranium is toxic: tree touching it withers.
- **Leaves:** Uranium is toxic: leaves touching it withers.
- **Flower:** Uranium is toxic: flower touching it withers.
- **Cactus:** Uranium is toxic: cactus touching it withers.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Acorn, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bee

A buzzing bee. Flies about, visiting flowers and turning them into seeds, and breeds when it finds honey. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 200 °C in air, 0.17 s per cell, leaves ash
- **Habitat:** flies in open air; water drowns it
- **Eats:** flower, honey; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into dirt
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (23 interact):

- **Air:** Bee burns: it catches fire at 200 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set bee on fire (it ignites at 200 °C).
- **Fire:** Bee catches from the flame touching it.
- **Acid:** Acid eats bee: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Bee burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Oxygen makes burning bee hotter and faster.
- **Spark:** Bee catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set bee on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold (1,150 °C) can set bee on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set bee on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead (400 °C) can set bee on fire (it ignites at 200 °C).
- **Liquid oxygen:** Bee burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set bee on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass (1,450 °C) can set bee on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver (1,000 °C) can set bee on fire (it ignites at 200 °C).
- **Molten plastic:** Molten plastic (200 °C) can set bee on fire (it ignites at 200 °C).
- **Hydrogen peroxide:** Bee burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning bee hotter and faster.
- **Lightning:** Bee catches from the flame touching it.
- **Plasma:** Bee catches from the flame touching it.
- **Rocket:** Bee catches from the flame touching it.
- **Ember:** Bee catches from the flame touching it.
- **Saltpeter:** Bee burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning bee hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set bee on fire (it ignites at 200 °C).
- **Ozone:** Bee burns: it catches fire at 200 °C next to ozone (oxidiser 1). Ozone makes burning bee hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Spider

A hunting spider. Walks over the ground and climbs steps, catching ants, bees and termites, and breeds when fed. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 200 °C in air, 0.17 s per cell, leaves ash
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** ant, bee, termite; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into dirt
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (23 interact):

- **Air:** Spider burns: it catches fire at 200 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set spider on fire (it ignites at 200 °C).
- **Fire:** Spider catches from the flame touching it.
- **Acid:** Acid eats spider: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Spider burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Oxygen makes burning spider hotter and faster.
- **Spark:** Spider catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set spider on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold (1,150 °C) can set spider on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set spider on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead (400 °C) can set spider on fire (it ignites at 200 °C).
- **Liquid oxygen:** Spider burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set spider on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass (1,450 °C) can set spider on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver (1,000 °C) can set spider on fire (it ignites at 200 °C).
- **Molten plastic:** Molten plastic (200 °C) can set spider on fire (it ignites at 200 °C).
- **Hydrogen peroxide:** Spider burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning spider hotter and faster.
- **Lightning:** Spider catches from the flame touching it.
- **Plasma:** Spider catches from the flame touching it.
- **Rocket:** Spider catches from the flame touching it.
- **Ember:** Spider catches from the flame touching it.
- **Saltpeter:** Spider burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning spider hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set spider on fire (it ignites at 200 °C).
- **Ozone:** Spider burns: it catches fire at 200 °C next to ozone (oxidiser 1). Ozone makes burning spider hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Termite

A pale wood-eating insect. Walks over the ground, chewing wood and trees into sawdust and eating the sawdust, breeding as it eats. Water drowns it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 200 °C in air, 0.17 s per cell, leaves ash
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** wood, tree, sawdust, paper, dry plant; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into dirt
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (23 interact):

- **Air:** Termite burns: it catches fire at 200 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set termite on fire (it ignites at 200 °C).
- **Fire:** Termite catches from the flame touching it.
- **Acid:** Acid eats termite: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Termite burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Oxygen makes burning termite hotter and faster.
- **Spark:** Termite catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set termite on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold (1,150 °C) can set termite on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set termite on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead (400 °C) can set termite on fire (it ignites at 200 °C).
- **Liquid oxygen:** Termite burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set termite on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass (1,450 °C) can set termite on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver (1,000 °C) can set termite on fire (it ignites at 200 °C).
- **Molten plastic:** Molten plastic (200 °C) can set termite on fire (it ignites at 200 °C).
- **Hydrogen peroxide:** Termite burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning termite hotter and faster.
- **Lightning:** Termite catches from the flame touching it.
- **Plasma:** Termite catches from the flame touching it.
- **Rocket:** Termite catches from the flame touching it.
- **Ember:** Termite catches from the flame touching it.
- **Saltpeter:** Termite burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning termite hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set termite on fire (it ignites at 200 °C).
- **Ozone:** Termite burns: it catches fire at 200 °C next to ozone (oxidiser 1). Ozone makes burning termite hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Snail

A slow garden snail. Creeps over the ground, grazing plants, leaves, grass and flowers, and breeds as it eats. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,100 kg/m³
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** plant, leaves, grass, flower; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into dirt
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats snail: acidity 0.8 beats hardness 0.2.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Frog

A small green frog. Hops over the ground catching ants, bees, spiders, termites and snails, and breeds when fed. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 300 °C in air, 0.67 s per cell, leaves ash
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** ant, bee, spider, termite, snail; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into meat
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Frog burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set frog on fire (it ignites at 300 °C).
- **Fire:** Frog catches from the flame touching it.
- **Acid:** Acid eats frog: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Frog burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning frog hotter and faster.
- **Spark:** Frog catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set frog on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set frog on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set frog on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set frog on fire (it ignites at 300 °C).
- **Liquid oxygen:** Frog burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set frog on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set frog on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set frog on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Frog burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning frog hotter and faster.
- **Lightning:** Frog catches from the flame touching it.
- **Plasma:** Frog catches from the flame touching it.
- **Rocket:** Frog catches from the flame touching it.
- **Ember:** Frog catches from the flame touching it.
- **Saltpeter:** Frog burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning frog hotter and faster.
- **Ozone:** Frog burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning frog hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Mouse

A quick little mouse. Runs over the ground eating seeds, flour, popcorn, chocolate and cooked meat, and breeds when fed. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 300 °C in air, 1 s per cell, leaves ash
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** seed, grass seed, acorn, flour, popcorn, popcorn kernel, chocolate, cooked meat; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into meat
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Mouse burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set mouse on fire (it ignites at 300 °C).
- **Fire:** Mouse catches from the flame touching it.
- **Acid:** Acid eats mouse: acidity 0.8 beats hardness 0.1.
- **Oxygen:** Mouse burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning mouse hotter and faster.
- **Spark:** Mouse catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set mouse on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set mouse on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set mouse on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set mouse on fire (it ignites at 300 °C).
- **Liquid oxygen:** Mouse burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set mouse on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set mouse on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set mouse on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Mouse burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning mouse hotter and faster.
- **Lightning:** Mouse catches from the flame touching it.
- **Plasma:** Mouse catches from the flame touching it.
- **Rocket:** Mouse catches from the flame touching it.
- **Ember:** Mouse catches from the flame touching it.
- **Saltpeter:** Mouse burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning mouse hotter and faster.
- **Ozone:** Mouse burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning mouse hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Snake

A hunting snake. Slides over the ground catching mice and frogs, and breeds when fed. Water drowns it; heat or cold kill it.

- **State:** Solid, 1,000 kg/m³
- **Burns:** from 300 °C in air, 1 s per cell, leaves ash
- **Habitat:** walks over the ground and climbs steps; water drowns it
- **Eats:** mouse, frog, egg; fed, it breeds
- **Dies:** of heat over 55 °C or cold below −5 °C, into meat
- **Hardness:** 0.15 (acid stronger than this eats it)

With other elements (21 interact):

- **Air:** Snake burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set snake on fire (it ignites at 300 °C).
- **Fire:** Snake catches from the flame touching it.
- **Acid:** Acid eats snake: acidity 0.8 beats hardness 0.15.
- **Oxygen:** Snake burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning snake hotter and faster.
- **Spark:** Snake catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set snake on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set snake on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set snake on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set snake on fire (it ignites at 300 °C).
- **Liquid oxygen:** Snake burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set snake on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set snake on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set snake on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Snake burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning snake hotter and faster.
- **Lightning:** Snake catches from the flame touching it.
- **Plasma:** Snake catches from the flame touching it.
- **Rocket:** Snake catches from the flame touching it.
- **Ember:** Snake catches from the flame touching it.
- **Saltpeter:** Snake burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning snake hotter and faster.
- **Ozone:** Snake burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone makes burning snake hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ammonia

A sharp, choking gas and a base, lighter than air. Rises and spreads. It neutralises acid it touches into water, and kills plants.

- **State:** Gas, 0.73 kg/m³
- **In air:** Rises (lighter than air)
- **Poisons:** living things it touches: they wither

With other elements (77 interact):

- **Sand:** Sand falls through ammonia.
- **Water:** Water falls through ammonia.
- **Oil:** Oil falls through ammonia.
- **Lava:** Lava falls through ammonia.
- **Gravel:** Gravel falls through ammonia.
- **Ash:** Ash falls through ammonia.
- **Acid:** Ammonia and acid neutralise each other into water, and warm up. Acid and ammonia neutralise each other into water, and warm up. Acid falls through ammonia.
- **Alcohol:** Alcohol falls through ammonia.
- **Sawdust:** Sawdust falls through ammonia.
- **Salt:** Salt falls through ammonia.
- **Sugar:** Sugar falls through ammonia.
- **Dirt:** Dirt falls through ammonia.
- **Snow:** Snow falls through ammonia.
- **Gunpowder:** Gunpowder falls through ammonia.
- **Nitro:** Nitro falls through ammonia.
- **Shards:** Shards falls through ammonia.
- **Mercury:** Mercury falls through ammonia.
- **Seed:** Seed falls through ammonia.
- **Plant:** Ammonia is toxic: plant touching it withers.
- **Molten copper:** Molten copper falls through ammonia.
- **Clay:** Clay falls through ammonia.
- **Cement:** Cement falls through ammonia.
- **Quicklime:** Quicklime falls through ammonia.
- **Slaked lime:** Slaked lime falls through ammonia.
- **Molten gold:** Molten gold falls through ammonia.
- **Molten aluminium:** Molten aluminium falls through ammonia.
- **Molten lead:** Molten lead falls through ammonia.
- **Rust:** Rust falls through ammonia.
- **Coal:** Coal falls through ammonia.
- **Charcoal:** Charcoal falls through ammonia.
- **Sulfur:** Sulfur falls through ammonia.
- **Petrol:** Petrol falls through ammonia.
- **Molten wax:** Molten wax falls through ammonia.
- **Flour:** Flour falls through ammonia.
- **Thermite:** Thermite falls through ammonia.
- **Honey:** Honey falls through ammonia.
- **Vinegar:** Ammonia and vinegar neutralise each other into water, and warm up. Vinegar and ammonia neutralise each other into water, and warm up. Vinegar falls through ammonia.
- **Bleach:** Bleach falls through ammonia.
- **Lye:** Lye falls through ammonia.
- **Liquid nitrogen:** Liquid nitrogen falls through ammonia.
- **Baking soda:** Baking soda falls through ammonia.
- **Grass seed:** Grass seed falls through ammonia.
- **Grass:** Ammonia is toxic: grass touching it withers.
- **Acorn:** Acorn falls through ammonia.
- **Tree:** Ammonia is toxic: tree touching it withers.
- **Leaves:** Ammonia is toxic: leaves touching it withers.
- **Flower:** Ammonia is toxic: flower touching it withers.
- **Caramel:** Caramel falls through ammonia.
- **Chalk:** Chalk falls through ammonia.
- **Liquid oxygen:** Liquid oxygen falls through ammonia.
- **Molten iron:** Molten iron falls through ammonia.
- **Molten glass:** Molten glass falls through ammonia.
- **Molten silver:** Molten silver falls through ammonia.
- **Popcorn kernel:** Popcorn kernel falls through ammonia.
- **Popcorn:** Popcorn falls through ammonia.
- **Tar:** Tar falls through ammonia.
- **Molten plastic:** Molten plastic falls through ammonia.
- **Pumice:** Pumice falls through ammonia.
- **Napalm:** Napalm falls through ammonia.
- **Hydrogen peroxide:** Hydrogen peroxide falls through ammonia.
- **Firework:** Firework falls through ammonia.
- **Saltpeter:** Saltpeter falls through ammonia.
- **Molten tin:** Molten tin falls through ammonia.
- **Kerosene:** Kerosene falls through ammonia.
- **Acetone:** Acetone falls through ammonia.
- **Hail:** Hail falls through ammonia.
- **Cotton:** Cotton falls through ammonia.
- **Molten chocolate:** Molten chocolate falls through ammonia.
- **Calcium carbide:** Calcium carbide falls through ammonia.
- **Iodine:** Iodine falls through ammonia.
- **Bromine:** Bromine falls through ammonia.
- **Liquid gallium:** Liquid gallium falls through ammonia.
- **Cactus seed:** Cactus seed falls through ammonia.
- **Cactus:** Ammonia is toxic: cactus touching it withers.
- **Smoke bomb:** Smoke bomb falls through ammonia.
- **Peat:** Peat falls through ammonia.
- **Soda:** Soda falls through ammonia.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ozone

A pale blue gas of energised oxygen, heavier than air. Sinks slowly. It feeds fire even more fiercely than oxygen and poisons living things.

- **State:** Gas, 2.14 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Poisons:** living things it touches: they wither
- **Feeds fire:** strength 1 (air is 0.21)

With other elements (105 interact):

- **Sand:** Sand falls through ozone.
- **Water:** Water falls through ozone.
- **Oil:** Ozone makes burning oil hotter and faster. Oil burns: it catches fire at 250 °C next to ozone (oxidiser 1). Oil falls through ozone.
- **Lava:** Lava falls through ozone.
- **Gravel:** Gravel falls through ozone.
- **Wood:** Ozone makes burning wood hotter and faster. Wood burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Ash:** Ash falls through ozone.
- **Acid:** Acid falls through ozone.
- **Iron:** Iron slowly rusts into rust where ozone touches it.
- **Hydrogen:** Ozone makes burning hydrogen hotter and faster. Hydrogen burns: it catches fire at 500 °C next to ozone (oxidiser 1).
- **Methane:** Ozone makes burning methane hotter and faster. Methane burns: it catches fire at 540 °C next to ozone (oxidiser 1).
- **Alcohol:** Ozone makes burning alcohol hotter and faster. Alcohol burns: it catches fire at 365 °C next to ozone (oxidiser 1). Alcohol falls through ozone.
- **Sawdust:** Ozone makes burning sawdust hotter and faster. Sawdust burns: it catches fire at 260 °C next to ozone (oxidiser 1). Sawdust falls through ozone.
- **Salt:** Salt falls through ozone.
- **Sugar:** Ozone makes burning sugar hotter and faster. Sugar burns: it catches fire at 350 °C next to ozone (oxidiser 1). Sugar falls through ozone.
- **Dirt:** Dirt falls through ozone.
- **Snow:** Snow falls through ozone.
- **TNT:** Ozone makes burning tnt hotter and faster. TNT explodes at 300 °C; it needs no air.
- **Gunpowder:** Ozone makes burning gunpowder hotter and faster. Gunpowder explodes at 250 °C; it needs no air. Gunpowder falls through ozone.
- **Nitro:** Ozone makes burning nitro hotter and faster. Nitro explodes at 200 °C; it needs no air. Nitro falls through ozone.
- **Shards:** Shards falls through ozone.
- **Mercury:** Mercury falls through ozone.
- **Seed:** Ozone makes burning seed hotter and faster. Seed burns: it catches fire at 250 °C next to ozone (oxidiser 1). Seed falls through ozone.
- **Plant:** Ozone is toxic: plant touching it withers. Ozone makes burning plant hotter and faster. Plant burns: it catches fire at 250 °C next to ozone (oxidiser 1).
- **Molten copper:** Molten copper falls through ozone.
- **Dry plant:** Ozone makes burning dry plant hotter and faster. Dry plant burns: it catches fire at 200 °C next to ozone (oxidiser 1).
- **Clay:** Clay falls through ozone.
- **Cement:** Cement falls through ozone.
- **Quicklime:** Quicklime falls through ozone.
- **Slaked lime:** Slaked lime falls through ozone.
- **Molten gold:** Molten gold falls through ozone.
- **Molten aluminium:** Molten aluminium falls through ozone.
- **Molten lead:** Molten lead falls through ozone.
- **Rust:** Rust falls through ozone.
- **Coal:** Ozone makes burning coal hotter and faster. Coal burns: it catches fire at 450 °C next to ozone (oxidiser 1). Coal falls through ozone.
- **Charcoal:** Ozone makes burning charcoal hotter and faster. Charcoal burns: it catches fire at 350 °C next to ozone (oxidiser 1). Charcoal falls through ozone.
- **Sulfur:** Ozone makes burning sulfur hotter and faster. Sulfur burns: it catches fire at 232 °C next to ozone (oxidiser 1). Sulfur falls through ozone.
- **Petrol:** Ozone makes burning petrol hotter and faster. Petrol burns: it catches fire at 280 °C next to ozone (oxidiser 1). Petrol falls through ozone.
- **Wax:** Ozone makes burning wax hotter and faster. Wax burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Molten wax:** Ozone makes burning molten wax hotter and faster. Molten wax burns: it catches fire at 300 °C next to ozone (oxidiser 1). Molten wax falls through ozone.
- **Paper:** Ozone makes burning paper hotter and faster. Paper burns: it catches fire at 233 °C next to ozone (oxidiser 1).
- **Rubber:** Ozone makes burning rubber hotter and faster. Rubber burns: it catches fire at 400 °C next to ozone (oxidiser 1).
- **Flour:** Ozone makes burning flour hotter and faster. Flour burns: it catches fire at 380 °C next to ozone (oxidiser 1). Flour falls through ozone.
- **Thermite:** Ozone makes burning thermite hotter and faster. Thermite burns: it catches fire at 900 °C next to ozone (oxidiser 1). Thermite falls through ozone.
- **Honey:** Honey falls through ozone.
- **Vinegar:** Vinegar falls through ozone.
- **Bleach:** Bleach falls through ozone.
- **Lye:** Lye falls through ozone.
- **Liquid nitrogen:** Liquid nitrogen falls through ozone.
- **Propane:** Ozone makes burning propane hotter and faster. Propane burns: it catches fire at 470 °C next to ozone (oxidiser 1).
- **Baking soda:** Baking soda falls through ozone.
- **C4:** Ozone makes burning c4 hotter and faster. C4 explodes at 900 °C; it needs no air.
- **Grass seed:** Ozone makes burning grass seed hotter and faster. Grass seed burns: it catches fire at 250 °C next to ozone (oxidiser 1). Grass seed falls through ozone.
- **Grass:** Ozone is toxic: grass touching it withers. Ozone makes burning grass hotter and faster. Grass burns: it catches fire at 220 °C next to ozone (oxidiser 1).
- **Acorn:** Ozone makes burning acorn hotter and faster. Acorn burns: it catches fire at 260 °C next to ozone (oxidiser 1). Acorn falls through ozone.
- **Tree:** Ozone is toxic: tree touching it withers. Ozone makes burning tree hotter and faster. Tree burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Leaves:** Ozone is toxic: leaves touching it withers. Ozone makes burning leaves hotter and faster. Leaves burns: it catches fire at 230 °C next to ozone (oxidiser 1).
- **Flower:** Ozone is toxic: flower touching it withers. Ozone makes burning flower hotter and faster. Flower burns: it catches fire at 220 °C next to ozone (oxidiser 1).
- **Magnesium:** Ozone makes burning magnesium hotter and faster. Magnesium burns: it catches fire at 650 °C next to ozone (oxidiser 1).
- **Caramel:** Ozone makes burning caramel hotter and faster. Caramel burns: it catches fire at 400 °C next to ozone (oxidiser 1). Caramel falls through ozone.
- **Chalk:** Chalk falls through ozone.
- **Liquid oxygen:** Liquid oxygen falls through ozone.
- **Molten iron:** Molten iron falls through ozone.
- **Molten glass:** Molten glass falls through ozone.
- **Molten silver:** Molten silver falls through ozone.
- **Cooked meat:** Ozone makes burning cooked meat hotter and faster. Cooked meat burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Popcorn kernel:** Popcorn kernel falls through ozone.
- **Popcorn:** Ozone makes burning popcorn hotter and faster. Popcorn burns: it catches fire at 300 °C next to ozone (oxidiser 1). Popcorn falls through ozone.
- **Tar:** Ozone makes burning tar hotter and faster. Tar burns: it catches fire at 320 °C next to ozone (oxidiser 1). Tar falls through ozone.
- **Plastic:** Ozone makes burning plastic hotter and faster. Plastic burns: it catches fire at 350 °C next to ozone (oxidiser 1).
- **Molten plastic:** Ozone makes burning molten plastic hotter and faster. Molten plastic burns: it catches fire at 350 °C next to ozone (oxidiser 1). Molten plastic falls through ozone.
- **Pumice:** Pumice falls through ozone.
- **Diamond:** Ozone makes burning diamond hotter and faster. Diamond burns: it catches fire at 900 °C next to ozone (oxidiser 1).
- **Napalm:** Ozone makes burning napalm hotter and faster. Napalm burns: it catches fire at 250 °C next to ozone (oxidiser 1). Napalm falls through ozone.
- **Hydrogen peroxide:** Hydrogen peroxide falls through ozone.
- **Fish:** Ozone makes burning fish hotter and faster. Fish burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Ant:** Ozone makes burning ant hotter and faster. Ant burns: it catches fire at 200 °C next to ozone (oxidiser 1).
- **Bird:** Ozone makes burning bird hotter and faster. Bird burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Firework:** Ozone makes burning firework hotter and faster. Firework burns: it catches fire at 250 °C next to ozone (oxidiser 1). Firework falls through ozone.
- **Saltpeter:** Saltpeter falls through ozone.
- **Molten tin:** Molten tin falls through ozone.
- **Steel:** Steel slowly rusts into rust where ozone touches it.
- **Kerosene:** Ozone makes burning kerosene hotter and faster. Kerosene burns: it catches fire at 220 °C next to ozone (oxidiser 1). Kerosene falls through ozone.
- **Acetone:** Ozone makes burning acetone hotter and faster. Acetone burns: it catches fire at 465 °C next to ozone (oxidiser 1). Acetone falls through ozone.
- **Hail:** Hail falls through ozone.
- **Bee:** Ozone makes burning bee hotter and faster. Bee burns: it catches fire at 200 °C next to ozone (oxidiser 1).
- **Spider:** Ozone makes burning spider hotter and faster. Spider burns: it catches fire at 200 °C next to ozone (oxidiser 1).
- **Termite:** Ozone makes burning termite hotter and faster. Termite burns: it catches fire at 200 °C next to ozone (oxidiser 1).
- **Frog:** Ozone makes burning frog hotter and faster. Frog burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Mouse:** Ozone makes burning mouse hotter and faster. Mouse burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Snake:** Ozone makes burning snake hotter and faster. Snake burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Cotton:** Ozone makes burning cotton hotter and faster. Cotton burns: it catches fire at 255 °C next to ozone (oxidiser 1). Cotton falls through ozone.
- **Molten chocolate:** Molten chocolate falls through ozone.
- **Phosphorus:** Ozone makes burning phosphorus hotter and faster. Phosphorus burns: it catches fire at 30 °C next to ozone (oxidiser 1).
- **Calcium carbide:** Calcium carbide falls through ozone.
- **Acetylene:** Ozone makes burning acetylene hotter and faster. Acetylene burns: it catches fire at 305 °C next to ozone (oxidiser 1).
- **Iodine:** Iodine falls through ozone.
- **Bromine:** Bromine falls through ozone.
- **Liquid gallium:** Liquid gallium falls through ozone.
- **Cactus seed:** Ozone makes burning cactus seed hotter and faster. Cactus seed burns: it catches fire at 250 °C next to ozone (oxidiser 1). Cactus seed falls through ozone.
- **Cactus:** Ozone is toxic: cactus touching it withers. Ozone makes burning cactus hotter and faster. Cactus burns: it catches fire at 300 °C next to ozone (oxidiser 1).
- **Smoke bomb:** Ozone makes burning smoke bomb hotter and faster. Smoke bomb burns: it catches fire at 200 °C next to ozone (oxidiser 1). Smoke bomb falls through ozone.
- **Peat:** Ozone makes burning peat hotter and faster. Peat burns: it catches fire at 300 °C next to ozone (oxidiser 1). Peat falls through ozone.
- **Soda:** Soda falls through ozone.
- **Fuse:** Ozone makes burning fuse hotter and faster. Fuse burns: it catches fire at 150 °C next to ozone (oxidiser 1).

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Oxygen, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, Dry ice, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Silver, Meat, Obsidian, Worm, Lightning, Plasma, Rocket, Ember, Tin, Zinc, Uranium, Snail, Ammonia, Chocolate, Egg, Cooked egg, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Basalt, Granite, Sandstone. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cotton

Soft white fibre, a very light powder. Drifts as it falls and soaks up a lot of water. Dry, it catches fast and burns quickly.

- **State:** Powder, 150 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 35 cells/s
- **Burns:** from 255 °C in air, 0.67 s per cell, leaves ash
- **Flash point:** 60 °C: above it, flames spread across it
- **Soaks up:** water, up to 60% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.05 (acid stronger than this eats it)

With other elements (39 interact):

- **Air:** Cotton burns: it catches fire at 255 °C next to air (oxidiser 0.21).
- **Water:** Cotton soaks up water: it is porous and holds up to 60% water.
- **Steam:** Cotton falls through steam.
- **Lava:** Lava (1,200 °C) can set cotton on fire (it ignites at 255 °C).
- **Fire:** Cotton catches from the flame touching it. Cotton falls through fire.
- **Smoke:** Cotton falls through smoke.
- **Acid:** Acid eats cotton: acidity 0.8 beats hardness 0.05.
- **Hydrogen:** Cotton falls through hydrogen.
- **Oxygen:** Cotton burns: it catches fire at 255 °C next to oxygen (oxidiser 1). Cotton falls through oxygen. Oxygen makes burning cotton hotter and faster.
- **Methane:** Cotton falls through methane.
- **Spark:** Cotton catches from the flame touching it. Cotton falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set cotton on fire (it ignites at 255 °C).
- **Molten gold:** Molten gold (1,150 °C) can set cotton on fire (it ignites at 255 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set cotton on fire (it ignites at 255 °C).
- **Molten lead:** Molten lead (400 °C) can set cotton on fire (it ignites at 255 °C).
- **Nitrogen:** Cotton falls through nitrogen.
- **Carbon dioxide:** Cotton falls through carbon dioxide.
- **Helium:** Cotton falls through helium.
- **Propane:** Cotton falls through propane.
- **Chlorine:** Cotton falls through chlorine.
- **Sulfur dioxide:** Cotton falls through sulfur dioxide.
- **Cloud:** Cotton falls through cloud.
- **Liquid oxygen:** Cotton burns: it catches fire at 255 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set cotton on fire (it ignites at 255 °C).
- **Molten glass:** Molten glass (1,450 °C) can set cotton on fire (it ignites at 255 °C).
- **Molten silver:** Molten silver (1,000 °C) can set cotton on fire (it ignites at 255 °C).
- **Hydrogen peroxide:** Cotton burns: it catches fire at 255 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning cotton hotter and faster.
- **Lightning:** Cotton catches from the flame touching it. Cotton falls through lightning.
- **Plasma:** Cotton catches from the flame touching it. Cotton falls through plasma.
- **Rocket:** Cotton catches from the flame touching it. Cotton falls through rocket.
- **Ember:** Cotton catches from the flame touching it. Cotton falls through ember.
- **Saltpeter:** Cotton burns: it catches fire at 255 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning cotton hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set cotton on fire (it ignites at 255 °C).
- **Ammonia:** Cotton falls through ammonia.
- **Ozone:** Cotton burns: it catches fire at 255 °C next to ozone (oxidiser 1). Cotton falls through ozone. Ozone makes burning cotton hotter and faster.
- **Acetylene:** Cotton falls through acetylene.
- **Iodine vapour:** Cotton falls through iodine vapour.
- **Argon:** Cotton falls through argon.
- **Bromine vapour:** Cotton falls through bromine vapour.

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Chocolate

A dark, sweet block. Stays put. A little warmth melts it into molten chocolate.

- **State:** Solid, 1,300 kg/m³
- **Melts:** at 35 °C, into molten chocolate
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (24 interact):

- **Steam:** Steam (150 °C) is hot enough to melt chocolate into molten chocolate.
- **Lava:** Lava (1,200 °C) is hot enough to melt chocolate into molten chocolate.
- **Fire:** Fire (850 °C) is hot enough to melt chocolate into molten chocolate.
- **Smoke:** Smoke (150 °C) is hot enough to melt chocolate into molten chocolate.
- **Acid:** Acid eats chocolate: acidity 0.8 beats hardness 0.2.
- **Spark:** Spark (300 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten lead:** Molten lead (400 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten wax:** Molten wax (80 °C) is hot enough to melt chocolate into molten chocolate.
- **Caramel:** Caramel (190 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten plastic:** Molten plastic (200 °C) is hot enough to melt chocolate into molten chocolate.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt chocolate into molten chocolate.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt chocolate into molten chocolate.
- **Rocket:** Rocket (900 °C) is hot enough to melt chocolate into molten chocolate.
- **Ember:** Ember (700 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten tin:** Molten tin (260 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate (45 °C) is hot enough to melt chocolate into molten chocolate.
- **Iodine vapour:** Iodine vapour (130 °C) is hot enough to melt chocolate into molten chocolate.
- **Bromine vapour:** Bromine vapour (70 °C) is hot enough to melt chocolate into molten chocolate.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Titanium, Platinum, Argon, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten chocolate

Melted chocolate, a thick sweet sauce. Oozes slowly and sinks through water. Sets back into chocolate as it cools.

- **State:** Liquid, 1,250 kg/m³
- **Starts at:** 45 °C
- **In liquids:** Sinks through liquids lighter than 1,250 kg/m³, floats on heavier ones
- **Falls:** up to 40 cells/s
- **Freezes:** below 35 °C, into chocolate

With other elements (82 interact):

- **Sand:** Sand sinks through molten chocolate (1,600 vs 1,250 kg/m³).
- **Water:** Molten chocolate sinks through water (1,250 vs 1,000 kg/m³).
- **Oil:** Molten chocolate sinks through oil (1,250 vs 900 kg/m³).
- **Ice:** Molten chocolate (45 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze molten chocolate into chocolate.
- **Steam:** Molten chocolate falls through steam.
- **Lava:** Lava sinks through molten chocolate (2,600 vs 1,250 kg/m³).
- **Gravel:** Gravel sinks through molten chocolate (2,000 vs 1,250 kg/m³).
- **Fire:** Molten chocolate falls through fire.
- **Smoke:** Molten chocolate falls through smoke.
- **Acid:** Molten chocolate sinks through acid (1,250 vs 1,100 kg/m³).
- **Hydrogen:** Molten chocolate falls through hydrogen.
- **Oxygen:** Molten chocolate falls through oxygen.
- **Methane:** Molten chocolate falls through methane.
- **Alcohol:** Molten chocolate sinks through alcohol (1,250 vs 789 kg/m³).
- **Salt:** Salt sinks through molten chocolate (2,160 vs 1,250 kg/m³).
- **Sugar:** Sugar sinks through molten chocolate (1,590 vs 1,250 kg/m³).
- **Dirt:** Dirt sinks through molten chocolate (1,500 vs 1,250 kg/m³).
- **Snow:** Molten chocolate (45 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze molten chocolate into chocolate.
- **Gunpowder:** Gunpowder sinks through molten chocolate (1,700 vs 1,250 kg/m³).
- **Nitro:** Nitro sinks through molten chocolate (1,600 vs 1,250 kg/m³).
- **Shards:** Shards sinks through molten chocolate (2,500 vs 1,250 kg/m³).
- **Spark:** Molten chocolate falls through spark.
- **Mercury:** Mercury sinks through molten chocolate (13,534 vs 1,250 kg/m³).
- **Molten copper:** Molten copper sinks through molten chocolate (8,020 vs 1,250 kg/m³).
- **Clay:** Clay sinks through molten chocolate (1,700 vs 1,250 kg/m³).
- **Cement:** Cement sinks through molten chocolate (1,440 vs 1,250 kg/m³).
- **Molten gold:** Molten gold sinks through molten chocolate (17,300 vs 1,250 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through molten chocolate (2,375 vs 1,250 kg/m³).
- **Molten lead:** Molten lead sinks through molten chocolate (10,660 vs 1,250 kg/m³).
- **Rust:** Rust sinks through molten chocolate (2,000 vs 1,250 kg/m³).
- **Coal:** Coal sinks through molten chocolate (1,350 vs 1,250 kg/m³).
- **Sulfur:** Sulfur sinks through molten chocolate (2,000 vs 1,250 kg/m³).
- **Petrol:** Molten chocolate sinks through petrol (1,250 vs 740 kg/m³).
- **Molten wax:** Molten chocolate sinks through molten wax (1,250 vs 800 kg/m³).
- **Thermite:** Thermite sinks through molten chocolate (1,500 vs 1,250 kg/m³).
- **Honey:** Honey sinks through molten chocolate (1,420 vs 1,250 kg/m³).
- **Vinegar:** Molten chocolate sinks through vinegar (1,250 vs 1,010 kg/m³).
- **Bleach:** Molten chocolate sinks through bleach (1,250 vs 1,100 kg/m³).
- **Lye:** Molten chocolate sinks through lye (1,250 vs 1,100 kg/m³).
- **Liquid nitrogen:** Molten chocolate sinks through liquid nitrogen (1,250 vs 808 kg/m³). Molten chocolate (45 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze molten chocolate into chocolate.
- **Nitrogen:** Molten chocolate falls through nitrogen.
- **Carbon dioxide:** Molten chocolate falls through carbon dioxide.
- **Helium:** Molten chocolate falls through helium.
- **Propane:** Molten chocolate falls through propane.
- **Chlorine:** Molten chocolate falls through chlorine.
- **Sulfur dioxide:** Molten chocolate falls through sulfur dioxide.
- **Dry ice:** Molten chocolate (45 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze molten chocolate into chocolate.
- **Cloud:** Molten chocolate falls through cloud.
- **Caramel:** Caramel sinks through molten chocolate (1,300 vs 1,250 kg/m³).
- **Chalk:** Chalk sinks through molten chocolate (1,500 vs 1,250 kg/m³).
- **Liquid oxygen:** Molten chocolate sinks through liquid oxygen (1,250 vs 1,141 kg/m³). Molten chocolate (45 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze molten chocolate into chocolate.
- **Molten iron:** Molten iron sinks through molten chocolate (6,980 vs 1,250 kg/m³).
- **Molten glass:** Molten glass sinks through molten chocolate (2,400 vs 1,250 kg/m³).
- **Molten silver:** Molten silver sinks through molten chocolate (9,320 vs 1,250 kg/m³).
- **Tar:** Molten chocolate sinks through tar (1,250 vs 1,150 kg/m³).
- **Molten plastic:** Molten chocolate sinks through molten plastic (1,250 vs 900 kg/m³).
- **Napalm:** Molten chocolate sinks through napalm (1,250 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through molten chocolate (1,450 vs 1,250 kg/m³).
- **Lightning:** Molten chocolate falls through lightning.
- **Plasma:** Molten chocolate falls through plasma.
- **Firework:** Firework sinks through molten chocolate (1,400 vs 1,250 kg/m³).
- **Rocket:** Molten chocolate falls through rocket.
- **Ember:** Molten chocolate falls through ember.
- **Saltpeter:** Saltpeter sinks through molten chocolate (2,100 vs 1,250 kg/m³).
- **Molten tin:** Molten tin sinks through molten chocolate (6,990 vs 1,250 kg/m³).
- **Kerosene:** Molten chocolate sinks through kerosene (1,250 vs 800 kg/m³).
- **Acetone:** Molten chocolate sinks through acetone (1,250 vs 784 kg/m³).
- **Hail:** Molten chocolate (45 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze molten chocolate into chocolate.
- **Ammonia:** Molten chocolate falls through ammonia.
- **Ozone:** Molten chocolate falls through ozone.
- **Chocolate:** Molten chocolate (45 °C) is hot enough to melt chocolate into molten chocolate.
- **Phosphorus:** Molten chocolate (45 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide sinks through molten chocolate (2,220 vs 1,250 kg/m³).
- **Acetylene:** Molten chocolate falls through acetylene.
- **Iodine:** Iodine sinks through molten chocolate (4,930 vs 1,250 kg/m³).
- **Iodine vapour:** Molten chocolate falls through iodine vapour.
- **Argon:** Molten chocolate falls through argon.
- **Bromine:** Bromine sinks through molten chocolate (3,100 vs 1,250 kg/m³).
- **Bromine vapour:** Molten chocolate falls through bromine vapour.
- **Gallium:** Molten chocolate (45 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium sinks through molten chocolate (6,095 vs 1,250 kg/m³).
- **Soda:** Molten chocolate sinks through soda (1,250 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Stone, Wood, Ash, Iron, Sawdust, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Egg, Cooked egg, Lithium, Titanium, Platinum, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Egg

A raw egg. Stays put. Warm it and it cooks; left in water it slowly rots.

- **State:** Solid, 1,030 kg/m³
- **Bakes:** at 70 °C into cooked egg; there is no way back
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Egg slowly rots into dirt where water touches it.
- **Acid:** Acid eats egg: acidity 0.8 beats hardness 0.2.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cooked egg

A cooked egg, white and yellow. Stays put. Overdone it chars into charcoal; left in water it slowly rots.

- **State:** Solid, 1,000 kg/m³
- **Bakes:** at 250 °C into charcoal; there is no way back
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Cooked egg slowly rots into dirt where water touches it.
- **Acid:** Acid eats cooked egg: acidity 0.8 beats hardness 0.2.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Phosphorus

Waxy white phosphorus. Stays put. In barely warm air it bursts into flame by itself, so it is kept under water, where it is safe.

- **State:** Solid, 1,820 kg/m³
- **Burns:** from 30 °C in air, 1 s per cell, leaves smoke
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (30 interact):

- **Air:** Phosphorus burns: it catches fire at 30 °C next to air (oxidiser 0.21).
- **Steam:** Steam (150 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Lava:** Lava (1,200 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Fire:** Phosphorus catches from the flame touching it.
- **Smoke:** Smoke (150 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Oxygen:** Phosphorus burns: it catches fire at 30 °C next to oxygen (oxidiser 1). Oxygen makes burning phosphorus hotter and faster.
- **Spark:** Phosphorus catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten gold:** Molten gold (1,150 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten lead:** Molten lead (400 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten wax:** Molten wax (80 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Caramel:** Caramel (190 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Liquid oxygen:** Phosphorus burns: it catches fire at 30 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten glass:** Molten glass (1,450 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten silver:** Molten silver (1,000 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Molten plastic:** Molten plastic (200 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Hydrogen peroxide:** Phosphorus burns: it catches fire at 30 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning phosphorus hotter and faster.
- **Lightning:** Phosphorus catches from the flame touching it.
- **Plasma:** Phosphorus catches from the flame touching it.
- **Rocket:** Phosphorus catches from the flame touching it.
- **Ember:** Phosphorus catches from the flame touching it.
- **Saltpeter:** Phosphorus burns: it catches fire at 30 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning phosphorus hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Ozone:** Phosphorus burns: it catches fire at 30 °C next to ozone (oxidiser 1). Ozone makes burning phosphorus hotter and faster.
- **Molten chocolate:** Molten chocolate (45 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Iodine vapour:** Iodine vapour (130 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Bromine vapour:** Bromine vapour (70 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Liquid gallium:** Liquid gallium (35 °C) can set phosphorus on fire (it ignites at 30 °C).

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Egg, Cooked egg, Lithium, Calcium carbide, Acetylene, Iodine, Titanium, Platinum, Argon, Bromine, Gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lithium

The lightest metal, soft and silvery. Stays put. Water touching it fizzes steadily into lye and hydrogen, more gently than sodium.

- **State:** Solid, 534 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Lithium reacts steadily with water, making lye and hydrogen.
- **Acid:** Acid eats lithium: acidity 0.8 beats hardness 0.1, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Calcium carbide

Grey-black lumps, a heavy powder. Falls and piles. Water makes it hiss out acetylene gas, leaving slaked lime.

- **State:** Powder, 2,220 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,220 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (46 interact):

- **Water:** Calcium carbide and water make acetylene gas, leaving slaked lime. Calcium carbide sinks through water (2,220 vs 1,000 kg/m³).
- **Oil:** Calcium carbide sinks through oil (2,220 vs 900 kg/m³).
- **Steam:** Calcium carbide falls through steam.
- **Fire:** Calcium carbide falls through fire.
- **Smoke:** Calcium carbide falls through smoke.
- **Acid:** Calcium carbide sinks through acid (2,220 vs 1,100 kg/m³).
- **Hydrogen:** Calcium carbide falls through hydrogen.
- **Oxygen:** Calcium carbide falls through oxygen.
- **Methane:** Calcium carbide falls through methane.
- **Alcohol:** Calcium carbide sinks through alcohol (2,220 vs 789 kg/m³).
- **Nitro:** Calcium carbide sinks through nitro (2,220 vs 1,600 kg/m³).
- **Spark:** Calcium carbide falls through spark.
- **Petrol:** Calcium carbide sinks through petrol (2,220 vs 740 kg/m³).
- **Molten wax:** Calcium carbide sinks through molten wax (2,220 vs 800 kg/m³).
- **Honey:** Calcium carbide sinks through honey (2,220 vs 1,420 kg/m³).
- **Vinegar:** Calcium carbide sinks through vinegar (2,220 vs 1,010 kg/m³).
- **Bleach:** Calcium carbide sinks through bleach (2,220 vs 1,100 kg/m³).
- **Lye:** Calcium carbide sinks through lye (2,220 vs 1,100 kg/m³).
- **Liquid nitrogen:** Calcium carbide sinks through liquid nitrogen (2,220 vs 808 kg/m³).
- **Nitrogen:** Calcium carbide falls through nitrogen.
- **Carbon dioxide:** Calcium carbide falls through carbon dioxide.
- **Helium:** Calcium carbide falls through helium.
- **Propane:** Calcium carbide falls through propane.
- **Chlorine:** Calcium carbide falls through chlorine.
- **Sulfur dioxide:** Calcium carbide falls through sulfur dioxide.
- **Cloud:** Calcium carbide falls through cloud.
- **Caramel:** Calcium carbide sinks through caramel (2,220 vs 1,300 kg/m³).
- **Liquid oxygen:** Calcium carbide sinks through liquid oxygen (2,220 vs 1,141 kg/m³).
- **Tar:** Calcium carbide sinks through tar (2,220 vs 1,150 kg/m³).
- **Molten plastic:** Calcium carbide sinks through molten plastic (2,220 vs 900 kg/m³).
- **Napalm:** Calcium carbide sinks through napalm (2,220 vs 900 kg/m³).
- **Hydrogen peroxide:** Calcium carbide sinks through hydrogen peroxide (2,220 vs 1,450 kg/m³).
- **Lightning:** Calcium carbide falls through lightning.
- **Plasma:** Calcium carbide falls through plasma.
- **Rocket:** Calcium carbide falls through rocket.
- **Ember:** Calcium carbide falls through ember.
- **Kerosene:** Calcium carbide sinks through kerosene (2,220 vs 800 kg/m³).
- **Acetone:** Calcium carbide sinks through acetone (2,220 vs 784 kg/m³).
- **Ammonia:** Calcium carbide falls through ammonia.
- **Ozone:** Calcium carbide falls through ozone.
- **Molten chocolate:** Calcium carbide sinks through molten chocolate (2,220 vs 1,250 kg/m³).
- **Acetylene:** Calcium carbide falls through acetylene.
- **Iodine vapour:** Calcium carbide falls through iodine vapour.
- **Argon:** Calcium carbide falls through argon.
- **Bromine vapour:** Calcium carbide falls through bromine vapour.
- **Soda:** Calcium carbide sinks through soda (2,220 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acetylene

A fuel gas, about as heavy as air. Drifts and spreads. It catches from any flame and burns hotter than any other fuel, as in a cutting torch.

- **State:** Gas, 1.1 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 305 °C in air, 0.17 s per cell, leaves steam
- **Flash point:** -18 °C: above it, flames spread across it

With other elements (80 interact):

- **Air:** Acetylene burns: it catches fire at 305 °C next to air (oxidiser 0.21).
- **Sand:** Sand falls through acetylene.
- **Water:** Water falls through acetylene.
- **Oil:** Oil falls through acetylene.
- **Lava:** Lava falls through acetylene. Lava (1,200 °C) can set acetylene on fire (it ignites at 305 °C).
- **Gravel:** Gravel falls through acetylene.
- **Fire:** Acetylene catches from the flame touching it.
- **Ash:** Ash falls through acetylene.
- **Acid:** Acid falls through acetylene.
- **Oxygen:** Acetylene burns: it catches fire at 305 °C next to oxygen (oxidiser 1). Oxygen makes burning acetylene hotter and faster.
- **Alcohol:** Alcohol falls through acetylene.
- **Sawdust:** Sawdust falls through acetylene.
- **Salt:** Salt falls through acetylene.
- **Sugar:** Sugar falls through acetylene.
- **Dirt:** Dirt falls through acetylene.
- **Snow:** Snow falls through acetylene.
- **Gunpowder:** Gunpowder falls through acetylene.
- **Nitro:** Nitro falls through acetylene.
- **Shards:** Shards falls through acetylene.
- **Spark:** Acetylene catches from the flame touching it.
- **Mercury:** Mercury falls through acetylene.
- **Seed:** Seed falls through acetylene.
- **Molten copper:** Molten copper falls through acetylene. Molten copper (1,200 °C) can set acetylene on fire (it ignites at 305 °C).
- **Clay:** Clay falls through acetylene.
- **Cement:** Cement falls through acetylene.
- **Quicklime:** Quicklime falls through acetylene.
- **Slaked lime:** Slaked lime falls through acetylene.
- **Molten gold:** Molten gold falls through acetylene. Molten gold (1,150 °C) can set acetylene on fire (it ignites at 305 °C).
- **Molten aluminium:** Molten aluminium falls through acetylene. Molten aluminium (750 °C) can set acetylene on fire (it ignites at 305 °C).
- **Molten lead:** Molten lead falls through acetylene. Molten lead (400 °C) can set acetylene on fire (it ignites at 305 °C).
- **Rust:** Rust falls through acetylene.
- **Coal:** Coal falls through acetylene.
- **Charcoal:** Charcoal falls through acetylene.
- **Sulfur:** Sulfur falls through acetylene.
- **Petrol:** Petrol falls through acetylene.
- **Molten wax:** Molten wax falls through acetylene.
- **Flour:** Flour falls through acetylene.
- **Thermite:** Thermite falls through acetylene.
- **Honey:** Honey falls through acetylene.
- **Vinegar:** Vinegar falls through acetylene.
- **Bleach:** Bleach falls through acetylene.
- **Lye:** Lye falls through acetylene.
- **Liquid nitrogen:** Liquid nitrogen falls through acetylene.
- **Baking soda:** Baking soda falls through acetylene.
- **Grass seed:** Grass seed falls through acetylene.
- **Acorn:** Acorn falls through acetylene.
- **Caramel:** Caramel falls through acetylene.
- **Chalk:** Chalk falls through acetylene.
- **Liquid oxygen:** Acetylene burns: it catches fire at 305 °C next to liquid oxygen (oxidiser 1). Liquid oxygen falls through acetylene.
- **Molten iron:** Molten iron falls through acetylene. Molten iron (1,600 °C) can set acetylene on fire (it ignites at 305 °C).
- **Molten glass:** Molten glass falls through acetylene. Molten glass (1,450 °C) can set acetylene on fire (it ignites at 305 °C).
- **Molten silver:** Molten silver falls through acetylene. Molten silver (1,000 °C) can set acetylene on fire (it ignites at 305 °C).
- **Popcorn kernel:** Popcorn kernel falls through acetylene.
- **Popcorn:** Popcorn falls through acetylene.
- **Tar:** Tar falls through acetylene.
- **Molten plastic:** Molten plastic falls through acetylene.
- **Pumice:** Pumice falls through acetylene.
- **Napalm:** Napalm falls through acetylene.
- **Hydrogen peroxide:** Acetylene burns: it catches fire at 305 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide falls through acetylene. Hydrogen peroxide makes burning acetylene hotter and faster.
- **Lightning:** Acetylene catches from the flame touching it.
- **Plasma:** Acetylene catches from the flame touching it.
- **Firework:** Firework falls through acetylene.
- **Rocket:** Acetylene catches from the flame touching it.
- **Ember:** Acetylene catches from the flame touching it.
- **Saltpeter:** Acetylene burns: it catches fire at 305 °C next to saltpeter (oxidiser 0.9). Saltpeter falls through acetylene. Saltpeter makes burning acetylene hotter and faster.
- **Molten tin:** Molten tin falls through acetylene.
- **Kerosene:** Kerosene falls through acetylene.
- **Acetone:** Acetone falls through acetylene.
- **Hail:** Hail falls through acetylene.
- **Ozone:** Acetylene burns: it catches fire at 305 °C next to ozone (oxidiser 1). Ozone makes burning acetylene hotter and faster.
- **Cotton:** Cotton falls through acetylene.
- **Molten chocolate:** Molten chocolate falls through acetylene.
- **Calcium carbide:** Calcium carbide falls through acetylene.
- **Iodine:** Iodine falls through acetylene.
- **Bromine:** Bromine falls through acetylene.
- **Liquid gallium:** Liquid gallium falls through acetylene.
- **Cactus seed:** Cactus seed falls through acetylene.
- **Smoke bomb:** Smoke bomb falls through acetylene.
- **Peat:** Peat falls through acetylene.
- **Soda:** Soda falls through acetylene.

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Hydrogen, Methane, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Iodine vapour, Titanium, Platinum, Argon, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Iodine

Dark violet crystals, a heavy powder. Falls and piles. Gently heated it turns straight into a violet vapour, which settles back into crystals as it cools.

- **State:** Powder, 4,930 kg/m³
- **In liquids:** Sinks through liquids lighter than 4,930 kg/m³, rests on heavier ones
- **Falls:** up to 170 cells/s
- **Sublimes:** at 114 °C, into iodine vapour
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (56 interact):

- **Water:** Iodine sinks through water (4,930 vs 1,000 kg/m³).
- **Oil:** Iodine sinks through oil (4,930 vs 900 kg/m³).
- **Steam:** Iodine falls through steam. Steam (150 °C) is hot enough to turn iodine into iodine vapour.
- **Lava:** Iodine sinks through lava (4,930 vs 2,600 kg/m³). Lava (1,200 °C) is hot enough to turn iodine into iodine vapour.
- **Fire:** Iodine falls through fire. Fire (850 °C) is hot enough to turn iodine into iodine vapour.
- **Smoke:** Iodine falls through smoke. Smoke (150 °C) is hot enough to turn iodine into iodine vapour.
- **Acid:** Iodine sinks through acid (4,930 vs 1,100 kg/m³).
- **Hydrogen:** Iodine falls through hydrogen.
- **Oxygen:** Iodine falls through oxygen.
- **Methane:** Iodine falls through methane.
- **Alcohol:** Iodine sinks through alcohol (4,930 vs 789 kg/m³).
- **Nitro:** Iodine sinks through nitro (4,930 vs 1,600 kg/m³).
- **Spark:** Iodine falls through spark. Spark (300 °C) is hot enough to turn iodine into iodine vapour.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to turn iodine into iodine vapour.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to turn iodine into iodine vapour.
- **Molten aluminium:** Iodine sinks through molten aluminium (4,930 vs 2,375 kg/m³). Molten aluminium (750 °C) is hot enough to turn iodine into iodine vapour.
- **Molten lead:** Molten lead (400 °C) is hot enough to turn iodine into iodine vapour.
- **Petrol:** Iodine sinks through petrol (4,930 vs 740 kg/m³).
- **Molten wax:** Iodine sinks through molten wax (4,930 vs 800 kg/m³).
- **Honey:** Iodine sinks through honey (4,930 vs 1,420 kg/m³).
- **Vinegar:** Iodine sinks through vinegar (4,930 vs 1,010 kg/m³).
- **Bleach:** Iodine sinks through bleach (4,930 vs 1,100 kg/m³).
- **Lye:** Iodine sinks through lye (4,930 vs 1,100 kg/m³).
- **Liquid nitrogen:** Iodine sinks through liquid nitrogen (4,930 vs 808 kg/m³).
- **Nitrogen:** Iodine falls through nitrogen.
- **Carbon dioxide:** Iodine falls through carbon dioxide.
- **Helium:** Iodine falls through helium.
- **Propane:** Iodine falls through propane.
- **Chlorine:** Iodine falls through chlorine.
- **Sulfur dioxide:** Iodine falls through sulfur dioxide.
- **Cloud:** Iodine falls through cloud.
- **Caramel:** Iodine sinks through caramel (4,930 vs 1,300 kg/m³). Caramel (190 °C) is hot enough to turn iodine into iodine vapour.
- **Liquid oxygen:** Iodine sinks through liquid oxygen (4,930 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) is hot enough to turn iodine into iodine vapour.
- **Molten glass:** Iodine sinks through molten glass (4,930 vs 2,400 kg/m³). Molten glass (1,450 °C) is hot enough to turn iodine into iodine vapour.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to turn iodine into iodine vapour.
- **Tar:** Iodine sinks through tar (4,930 vs 1,150 kg/m³).
- **Molten plastic:** Iodine sinks through molten plastic (4,930 vs 900 kg/m³). Molten plastic (200 °C) is hot enough to turn iodine into iodine vapour.
- **Napalm:** Iodine sinks through napalm (4,930 vs 900 kg/m³).
- **Hydrogen peroxide:** Iodine sinks through hydrogen peroxide (4,930 vs 1,450 kg/m³).
- **Lightning:** Iodine falls through lightning. Lightning (3,000 °C) is hot enough to turn iodine into iodine vapour.
- **Plasma:** Iodine falls through plasma. Plasma (3,000 °C) is hot enough to turn iodine into iodine vapour.
- **Rocket:** Iodine falls through rocket. Rocket (900 °C) is hot enough to turn iodine into iodine vapour.
- **Ember:** Iodine falls through ember. Ember (700 °C) is hot enough to turn iodine into iodine vapour.
- **Molten tin:** Molten tin (260 °C) is hot enough to turn iodine into iodine vapour.
- **Kerosene:** Iodine sinks through kerosene (4,930 vs 800 kg/m³).
- **Acetone:** Iodine sinks through acetone (4,930 vs 784 kg/m³).
- **Ammonia:** Iodine falls through ammonia.
- **Ozone:** Iodine falls through ozone.
- **Molten chocolate:** Iodine sinks through molten chocolate (4,930 vs 1,250 kg/m³).
- **Acetylene:** Iodine falls through acetylene.
- **Iodine vapour:** Iodine falls through iodine vapour. Iodine vapour (130 °C) is hot enough to turn iodine into iodine vapour.
- **Argon:** Iodine falls through argon.
- **Bromine:** Iodine sinks through bromine (4,930 vs 3,100 kg/m³).
- **Bromine vapour:** Iodine falls through bromine vapour.
- **Soda:** Iodine sinks through soda (4,930 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Titanium, Platinum, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Iodine vapour

A heavy violet vapour. Sinks and pools low. As it cools it settles back into iodine crystals.

- **State:** Gas, 11 kg/m³
- **Starts at:** 130 °C
- **In air:** Sinks slowly (heavier than air)
- **Condenses:** below 114 °C, into iodine

With other elements (77 interact):

- **Sand:** Sand falls through iodine vapour.
- **Water:** Iodine vapour (130 °C) is hot enough to boil water into steam. Water falls through iodine vapour.
- **Oil:** Oil falls through iodine vapour.
- **Ice:** Iodine vapour (130 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to condense iodine vapour into iodine.
- **Lava:** Lava falls through iodine vapour.
- **Gravel:** Gravel falls through iodine vapour.
- **Ash:** Ash falls through iodine vapour.
- **Acid:** Acid falls through iodine vapour.
- **Alcohol:** Alcohol falls through iodine vapour.
- **Sawdust:** Sawdust falls through iodine vapour.
- **Salt:** Salt falls through iodine vapour.
- **Sugar:** Sugar falls through iodine vapour.
- **Dirt:** Dirt falls through iodine vapour.
- **Snow:** Iodine vapour (130 °C) is hot enough to melt snow into water. Snow falls through iodine vapour. Snow (-5 °C) is cold enough to condense iodine vapour into iodine.
- **Gunpowder:** Gunpowder falls through iodine vapour.
- **Nitro:** Nitro falls through iodine vapour.
- **Shards:** Shards falls through iodine vapour.
- **Mercury:** Mercury falls through iodine vapour.
- **Seed:** Seed falls through iodine vapour.
- **Molten copper:** Molten copper falls through iodine vapour.
- **Clay:** Clay falls through iodine vapour.
- **Cement:** Cement falls through iodine vapour.
- **Quicklime:** Quicklime falls through iodine vapour.
- **Slaked lime:** Slaked lime falls through iodine vapour.
- **Molten gold:** Molten gold falls through iodine vapour.
- **Molten aluminium:** Molten aluminium falls through iodine vapour.
- **Molten lead:** Molten lead falls through iodine vapour.
- **Rust:** Rust falls through iodine vapour.
- **Coal:** Coal falls through iodine vapour.
- **Charcoal:** Charcoal falls through iodine vapour.
- **Sulfur:** Sulfur falls through iodine vapour.
- **Petrol:** Petrol falls through iodine vapour.
- **Wax:** Iodine vapour (130 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Molten wax falls through iodine vapour.
- **Flour:** Flour falls through iodine vapour.
- **Thermite:** Thermite falls through iodine vapour.
- **Honey:** Honey falls through iodine vapour.
- **Vinegar:** Vinegar falls through iodine vapour.
- **Bleach:** Bleach falls through iodine vapour.
- **Lye:** Lye falls through iodine vapour.
- **Liquid nitrogen:** Iodine vapour (130 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through iodine vapour. Liquid nitrogen (-196 °C) is cold enough to condense iodine vapour into iodine.
- **Dry ice:** Iodine vapour (130 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to condense iodine vapour into iodine.
- **Baking soda:** Baking soda falls through iodine vapour.
- **Grass seed:** Grass seed falls through iodine vapour.
- **Acorn:** Acorn falls through iodine vapour.
- **Caramel:** Caramel falls through iodine vapour.
- **Chalk:** Chalk falls through iodine vapour.
- **Liquid oxygen:** Iodine vapour (130 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through iodine vapour. Liquid oxygen (-183 °C) is cold enough to condense iodine vapour into iodine.
- **Molten iron:** Molten iron falls through iodine vapour.
- **Molten glass:** Molten glass falls through iodine vapour.
- **Molten silver:** Molten silver falls through iodine vapour.
- **Popcorn kernel:** Popcorn kernel falls through iodine vapour.
- **Popcorn:** Popcorn falls through iodine vapour.
- **Tar:** Tar falls through iodine vapour.
- **Molten plastic:** Molten plastic falls through iodine vapour.
- **Pumice:** Pumice falls through iodine vapour.
- **Napalm:** Napalm falls through iodine vapour.
- **Hydrogen peroxide:** Hydrogen peroxide falls through iodine vapour.
- **Firework:** Firework falls through iodine vapour.
- **Saltpeter:** Saltpeter falls through iodine vapour.
- **Molten tin:** Molten tin falls through iodine vapour.
- **Kerosene:** Kerosene falls through iodine vapour.
- **Acetone:** Acetone falls through iodine vapour.
- **Hail:** Iodine vapour (130 °C) is hot enough to melt hail into water. Hail falls through iodine vapour. Hail (-5 °C) is cold enough to condense iodine vapour into iodine.
- **Cotton:** Cotton falls through iodine vapour.
- **Chocolate:** Iodine vapour (130 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through iodine vapour.
- **Phosphorus:** Iodine vapour (130 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide falls through iodine vapour.
- **Iodine:** Iodine vapour (130 °C) is hot enough to turn iodine into iodine vapour. Iodine falls through iodine vapour.
- **Bromine:** Iodine vapour (130 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through iodine vapour.
- **Gallium:** Iodine vapour (130 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through iodine vapour.
- **Cactus seed:** Cactus seed falls through iodine vapour.
- **Smoke bomb:** Smoke bomb falls through iodine vapour.
- **Peat:** Peat falls through iodine vapour.
- **Soda:** Soda falls through iodine vapour.

No direct interaction with: Air, Wall, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Egg, Cooked egg, Lithium, Acetylene, Titanium, Platinum, Argon, Bromine vapour, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Titanium

A light, very strong grey metal. Stays put. Acid cannot eat it, and it barely conducts heat.

- **State:** Solid, 4,500 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Platinum

A very heavy, silvery noble metal. Stays put and nothing eats it. Hydrogen touching it catches and burns into steam.

- **State:** Solid, 21,450 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (1 interact):

- **Hydrogen:** Platinum makes hydrogen catch and burn into steam on its surface.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Argon

A heavy inert gas. Sinks and pools low. It never reacts, and it smothers flames by shutting out the air.

- **State:** Gas, 1.66 kg/m³
- **In air:** Sinks slowly (heavier than air)

With other elements (71 interact):

- **Sand:** Sand falls through argon.
- **Water:** Water falls through argon.
- **Oil:** Oil falls through argon.
- **Lava:** Lava falls through argon.
- **Gravel:** Gravel falls through argon.
- **Ash:** Ash falls through argon.
- **Acid:** Acid falls through argon.
- **Alcohol:** Alcohol falls through argon.
- **Sawdust:** Sawdust falls through argon.
- **Salt:** Salt falls through argon.
- **Sugar:** Sugar falls through argon.
- **Dirt:** Dirt falls through argon.
- **Snow:** Snow falls through argon.
- **Gunpowder:** Gunpowder falls through argon.
- **Nitro:** Nitro falls through argon.
- **Shards:** Shards falls through argon.
- **Mercury:** Mercury falls through argon.
- **Seed:** Seed falls through argon.
- **Molten copper:** Molten copper falls through argon.
- **Clay:** Clay falls through argon.
- **Cement:** Cement falls through argon.
- **Quicklime:** Quicklime falls through argon.
- **Slaked lime:** Slaked lime falls through argon.
- **Molten gold:** Molten gold falls through argon.
- **Molten aluminium:** Molten aluminium falls through argon.
- **Molten lead:** Molten lead falls through argon.
- **Rust:** Rust falls through argon.
- **Coal:** Coal falls through argon.
- **Charcoal:** Charcoal falls through argon.
- **Sulfur:** Sulfur falls through argon.
- **Petrol:** Petrol falls through argon.
- **Molten wax:** Molten wax falls through argon.
- **Flour:** Flour falls through argon.
- **Thermite:** Thermite falls through argon.
- **Honey:** Honey falls through argon.
- **Vinegar:** Vinegar falls through argon.
- **Bleach:** Bleach falls through argon.
- **Lye:** Lye falls through argon.
- **Liquid nitrogen:** Liquid nitrogen falls through argon.
- **Baking soda:** Baking soda falls through argon.
- **Grass seed:** Grass seed falls through argon.
- **Acorn:** Acorn falls through argon.
- **Caramel:** Caramel falls through argon.
- **Chalk:** Chalk falls through argon.
- **Liquid oxygen:** Liquid oxygen falls through argon.
- **Molten iron:** Molten iron falls through argon.
- **Molten glass:** Molten glass falls through argon.
- **Molten silver:** Molten silver falls through argon.
- **Popcorn kernel:** Popcorn kernel falls through argon.
- **Popcorn:** Popcorn falls through argon.
- **Tar:** Tar falls through argon.
- **Molten plastic:** Molten plastic falls through argon.
- **Pumice:** Pumice falls through argon.
- **Napalm:** Napalm falls through argon.
- **Hydrogen peroxide:** Hydrogen peroxide falls through argon.
- **Firework:** Firework falls through argon.
- **Saltpeter:** Saltpeter falls through argon.
- **Molten tin:** Molten tin falls through argon.
- **Kerosene:** Kerosene falls through argon.
- **Acetone:** Acetone falls through argon.
- **Hail:** Hail falls through argon.
- **Cotton:** Cotton falls through argon.
- **Molten chocolate:** Molten chocolate falls through argon.
- **Calcium carbide:** Calcium carbide falls through argon.
- **Iodine:** Iodine falls through argon.
- **Bromine:** Bromine falls through argon.
- **Liquid gallium:** Liquid gallium falls through argon.
- **Cactus seed:** Cactus seed falls through argon.
- **Smoke bomb:** Smoke bomb falls through argon.
- **Peat:** Peat falls through argon.
- **Soda:** Soda falls through argon.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Bromine vapour, Gallium, Cactus, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bromine

A dark red, poisonous liquid, very heavy. Flows and sinks through water. Warmed, it boils into a choking red vapour, and it kills plants.

- **State:** Liquid, 3,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 3,100 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Boils:** at 59 °C, into bromine vapour
- **Poisons:** living things it touches: they wither

With other elements (64 interact):

- **Water:** Bromine sinks through water (3,100 vs 1,000 kg/m³).
- **Oil:** Bromine sinks through oil (3,100 vs 900 kg/m³).
- **Steam:** Bromine falls through steam. Steam (150 °C) is hot enough to boil bromine into bromine vapour.
- **Lava:** Bromine sinks through lava (3,100 vs 2,600 kg/m³). Lava (1,200 °C) is hot enough to boil bromine into bromine vapour.
- **Fire:** Bromine puts out the fire, flashing into bromine vapour. Bromine falls through fire. Fire (850 °C) is hot enough to boil bromine into bromine vapour.
- **Smoke:** Bromine falls through smoke. Smoke (150 °C) is hot enough to boil bromine into bromine vapour.
- **Acid:** Bromine sinks through acid (3,100 vs 1,100 kg/m³).
- **Hydrogen:** Bromine falls through hydrogen.
- **Oxygen:** Bromine falls through oxygen.
- **Methane:** Bromine falls through methane.
- **Alcohol:** Bromine sinks through alcohol (3,100 vs 789 kg/m³).
- **Nitro:** Bromine sinks through nitro (3,100 vs 1,600 kg/m³).
- **Spark:** Bromine falls through spark. Spark (300 °C) is hot enough to boil bromine into bromine vapour.
- **Mercury:** Mercury sinks through bromine (13,534 vs 3,100 kg/m³).
- **Plant:** Bromine is toxic: plant touching it withers.
- **Molten copper:** Molten copper sinks through bromine (8,020 vs 3,100 kg/m³). Molten copper (1,200 °C) is hot enough to boil bromine into bromine vapour.
- **Molten gold:** Molten gold sinks through bromine (17,300 vs 3,100 kg/m³). Molten gold (1,150 °C) is hot enough to boil bromine into bromine vapour.
- **Molten aluminium:** Bromine sinks through molten aluminium (3,100 vs 2,375 kg/m³). Molten aluminium (750 °C) is hot enough to boil bromine into bromine vapour.
- **Molten lead:** Molten lead sinks through bromine (10,660 vs 3,100 kg/m³). Molten lead (400 °C) is hot enough to boil bromine into bromine vapour.
- **Petrol:** Bromine sinks through petrol (3,100 vs 740 kg/m³).
- **Molten wax:** Bromine sinks through molten wax (3,100 vs 800 kg/m³). Molten wax (80 °C) is hot enough to boil bromine into bromine vapour.
- **Honey:** Bromine sinks through honey (3,100 vs 1,420 kg/m³).
- **Vinegar:** Bromine sinks through vinegar (3,100 vs 1,010 kg/m³).
- **Bleach:** Bromine sinks through bleach (3,100 vs 1,100 kg/m³).
- **Lye:** Bromine sinks through lye (3,100 vs 1,100 kg/m³).
- **Liquid nitrogen:** Bromine sinks through liquid nitrogen (3,100 vs 808 kg/m³).
- **Nitrogen:** Bromine falls through nitrogen.
- **Carbon dioxide:** Bromine falls through carbon dioxide.
- **Helium:** Bromine falls through helium.
- **Propane:** Bromine falls through propane.
- **Chlorine:** Bromine falls through chlorine.
- **Sulfur dioxide:** Bromine falls through sulfur dioxide.
- **Grass:** Bromine is toxic: grass touching it withers.
- **Tree:** Bromine is toxic: tree touching it withers.
- **Leaves:** Bromine is toxic: leaves touching it withers.
- **Flower:** Bromine is toxic: flower touching it withers.
- **Cloud:** Bromine falls through cloud.
- **Caramel:** Bromine sinks through caramel (3,100 vs 1,300 kg/m³). Caramel (190 °C) is hot enough to boil bromine into bromine vapour.
- **Liquid oxygen:** Bromine sinks through liquid oxygen (3,100 vs 1,141 kg/m³).
- **Molten iron:** Molten iron sinks through bromine (6,980 vs 3,100 kg/m³). Molten iron (1,600 °C) is hot enough to boil bromine into bromine vapour.
- **Molten glass:** Bromine sinks through molten glass (3,100 vs 2,400 kg/m³). Molten glass (1,450 °C) is hot enough to boil bromine into bromine vapour.
- **Molten silver:** Molten silver sinks through bromine (9,320 vs 3,100 kg/m³). Molten silver (1,000 °C) is hot enough to boil bromine into bromine vapour.
- **Tar:** Bromine sinks through tar (3,100 vs 1,150 kg/m³).
- **Molten plastic:** Bromine sinks through molten plastic (3,100 vs 900 kg/m³). Molten plastic (200 °C) is hot enough to boil bromine into bromine vapour.
- **Napalm:** Bromine sinks through napalm (3,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Bromine sinks through hydrogen peroxide (3,100 vs 1,450 kg/m³).
- **Lightning:** Bromine falls through lightning. Lightning (3,000 °C) is hot enough to boil bromine into bromine vapour.
- **Plasma:** Bromine falls through plasma. Plasma (3,000 °C) is hot enough to boil bromine into bromine vapour.
- **Rocket:** Bromine falls through rocket. Rocket (900 °C) is hot enough to boil bromine into bromine vapour.
- **Ember:** Bromine falls through ember. Ember (700 °C) is hot enough to boil bromine into bromine vapour.
- **Molten tin:** Molten tin sinks through bromine (6,990 vs 3,100 kg/m³). Molten tin (260 °C) is hot enough to boil bromine into bromine vapour.
- **Kerosene:** Bromine sinks through kerosene (3,100 vs 800 kg/m³).
- **Acetone:** Bromine sinks through acetone (3,100 vs 784 kg/m³).
- **Ammonia:** Bromine falls through ammonia.
- **Ozone:** Bromine falls through ozone.
- **Molten chocolate:** Bromine sinks through molten chocolate (3,100 vs 1,250 kg/m³).
- **Acetylene:** Bromine falls through acetylene.
- **Iodine:** Iodine sinks through bromine (4,930 vs 3,100 kg/m³).
- **Iodine vapour:** Bromine falls through iodine vapour. Iodine vapour (130 °C) is hot enough to boil bromine into bromine vapour.
- **Argon:** Bromine falls through argon.
- **Bromine vapour:** Bromine falls through bromine vapour. Bromine vapour (70 °C) is hot enough to boil bromine into bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through bromine (6,095 vs 3,100 kg/m³).
- **Cactus:** Bromine is toxic: cactus touching it withers.
- **Soda:** Bromine sinks through soda (3,100 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Seed, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Titanium, Platinum, Gallium, Cactus seed, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bromine vapour

A choking red-brown vapour, very heavy. Sinks and pools low, kills plants, and condenses back into bromine as it cools.

- **State:** Gas, 7.6 kg/m³
- **Starts at:** 70 °C
- **In air:** Sinks slowly (heavier than air)
- **Condenses:** below 59 °C, into bromine
- **Poisons:** living things it touches: they wither

With other elements (83 interact):

- **Sand:** Sand falls through bromine vapour.
- **Water:** Water falls through bromine vapour.
- **Oil:** Oil falls through bromine vapour.
- **Ice:** Bromine vapour (70 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to condense bromine vapour into bromine.
- **Lava:** Lava falls through bromine vapour.
- **Gravel:** Gravel falls through bromine vapour.
- **Ash:** Ash falls through bromine vapour.
- **Acid:** Acid falls through bromine vapour.
- **Alcohol:** Alcohol falls through bromine vapour.
- **Sawdust:** Sawdust falls through bromine vapour.
- **Salt:** Salt falls through bromine vapour.
- **Sugar:** Sugar falls through bromine vapour.
- **Dirt:** Dirt falls through bromine vapour.
- **Snow:** Bromine vapour (70 °C) is hot enough to melt snow into water. Snow falls through bromine vapour. Snow (-5 °C) is cold enough to condense bromine vapour into bromine.
- **Gunpowder:** Gunpowder falls through bromine vapour.
- **Nitro:** Nitro falls through bromine vapour.
- **Shards:** Shards falls through bromine vapour.
- **Mercury:** Mercury falls through bromine vapour.
- **Seed:** Seed falls through bromine vapour.
- **Plant:** Bromine vapour is toxic: plant touching it withers.
- **Molten copper:** Molten copper falls through bromine vapour.
- **Clay:** Clay falls through bromine vapour.
- **Cement:** Cement falls through bromine vapour.
- **Quicklime:** Quicklime falls through bromine vapour.
- **Slaked lime:** Slaked lime falls through bromine vapour.
- **Molten gold:** Molten gold falls through bromine vapour.
- **Molten aluminium:** Molten aluminium falls through bromine vapour.
- **Molten lead:** Molten lead falls through bromine vapour.
- **Rust:** Rust falls through bromine vapour.
- **Coal:** Coal falls through bromine vapour.
- **Charcoal:** Charcoal falls through bromine vapour.
- **Sulfur:** Sulfur falls through bromine vapour.
- **Petrol:** Petrol falls through bromine vapour.
- **Wax:** Bromine vapour (70 °C) is hot enough to melt wax into molten wax.
- **Molten wax:** Molten wax falls through bromine vapour.
- **Flour:** Flour falls through bromine vapour.
- **Thermite:** Thermite falls through bromine vapour.
- **Honey:** Honey falls through bromine vapour.
- **Vinegar:** Vinegar falls through bromine vapour.
- **Bleach:** Bleach falls through bromine vapour.
- **Lye:** Lye falls through bromine vapour.
- **Liquid nitrogen:** Bromine vapour (70 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen falls through bromine vapour. Liquid nitrogen (-196 °C) is cold enough to condense bromine vapour into bromine.
- **Dry ice:** Bromine vapour (70 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to condense bromine vapour into bromine.
- **Baking soda:** Baking soda falls through bromine vapour.
- **Grass seed:** Grass seed falls through bromine vapour.
- **Grass:** Bromine vapour is toxic: grass touching it withers.
- **Acorn:** Acorn falls through bromine vapour.
- **Tree:** Bromine vapour is toxic: tree touching it withers.
- **Leaves:** Bromine vapour is toxic: leaves touching it withers.
- **Flower:** Bromine vapour is toxic: flower touching it withers.
- **Caramel:** Caramel falls through bromine vapour.
- **Chalk:** Chalk falls through bromine vapour.
- **Liquid oxygen:** Bromine vapour (70 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen falls through bromine vapour. Liquid oxygen (-183 °C) is cold enough to condense bromine vapour into bromine.
- **Molten iron:** Molten iron falls through bromine vapour.
- **Molten glass:** Molten glass falls through bromine vapour.
- **Molten silver:** Molten silver falls through bromine vapour.
- **Popcorn kernel:** Popcorn kernel falls through bromine vapour.
- **Popcorn:** Popcorn falls through bromine vapour.
- **Tar:** Tar falls through bromine vapour.
- **Molten plastic:** Molten plastic falls through bromine vapour.
- **Pumice:** Pumice falls through bromine vapour.
- **Napalm:** Napalm falls through bromine vapour.
- **Hydrogen peroxide:** Hydrogen peroxide falls through bromine vapour.
- **Firework:** Firework falls through bromine vapour.
- **Saltpeter:** Saltpeter falls through bromine vapour.
- **Molten tin:** Molten tin falls through bromine vapour.
- **Kerosene:** Kerosene falls through bromine vapour.
- **Acetone:** Acetone falls through bromine vapour.
- **Hail:** Bromine vapour (70 °C) is hot enough to melt hail into water. Hail falls through bromine vapour. Hail (-5 °C) is cold enough to condense bromine vapour into bromine.
- **Cotton:** Cotton falls through bromine vapour.
- **Chocolate:** Bromine vapour (70 °C) is hot enough to melt chocolate into molten chocolate.
- **Molten chocolate:** Molten chocolate falls through bromine vapour.
- **Phosphorus:** Bromine vapour (70 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Calcium carbide:** Calcium carbide falls through bromine vapour.
- **Iodine:** Iodine falls through bromine vapour.
- **Bromine:** Bromine vapour (70 °C) is hot enough to boil bromine into bromine vapour. Bromine falls through bromine vapour.
- **Gallium:** Bromine vapour (70 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium falls through bromine vapour.
- **Cactus seed:** Cactus seed falls through bromine vapour.
- **Cactus:** Bromine vapour is toxic: cactus touching it withers.
- **Smoke bomb:** Smoke bomb falls through bromine vapour.
- **Peat:** Peat falls through bromine vapour.
- **Soda:** Soda falls through bromine vapour.

No direct interaction with: Air, Wall, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Plastic, Obsidian, Diamond, Fish, Ant, Worm, Bird, Lightning, Plasma, Rocket, Ember, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Egg, Cooked egg, Lithium, Acetylene, Iodine vapour, Titanium, Platinum, Argon, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gallium

A soft silvery metal. Stays put, but the warmth of a hand melts it into liquid gallium.

- **State:** Solid, 5,910 kg/m³
- **Melts:** at 30 °C, into liquid gallium
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (25 interact):

- **Steam:** Steam (150 °C) is hot enough to melt gallium into liquid gallium.
- **Lava:** Lava (1,200 °C) is hot enough to melt gallium into liquid gallium.
- **Fire:** Fire (850 °C) is hot enough to melt gallium into liquid gallium.
- **Smoke:** Smoke (150 °C) is hot enough to melt gallium into liquid gallium.
- **Acid:** Acid eats gallium: acidity 0.8 beats hardness 0.3, giving off hydrogen.
- **Spark:** Spark (300 °C) is hot enough to melt gallium into liquid gallium.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt gallium into liquid gallium.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt gallium into liquid gallium.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt gallium into liquid gallium.
- **Molten lead:** Molten lead (400 °C) is hot enough to melt gallium into liquid gallium.
- **Molten wax:** Molten wax (80 °C) is hot enough to melt gallium into liquid gallium.
- **Caramel:** Caramel (190 °C) is hot enough to melt gallium into liquid gallium.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt gallium into liquid gallium.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt gallium into liquid gallium.
- **Molten silver:** Molten silver (1,000 °C) is hot enough to melt gallium into liquid gallium.
- **Molten plastic:** Molten plastic (200 °C) is hot enough to melt gallium into liquid gallium.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt gallium into liquid gallium.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt gallium into liquid gallium.
- **Rocket:** Rocket (900 °C) is hot enough to melt gallium into liquid gallium.
- **Ember:** Ember (700 °C) is hot enough to melt gallium into liquid gallium.
- **Molten tin:** Molten tin (260 °C) is hot enough to melt gallium into liquid gallium.
- **Molten chocolate:** Molten chocolate (45 °C) is hot enough to melt gallium into liquid gallium.
- **Iodine vapour:** Iodine vapour (130 °C) is hot enough to melt gallium into liquid gallium.
- **Bromine vapour:** Bromine vapour (70 °C) is hot enough to melt gallium into liquid gallium.
- **Liquid gallium:** Liquid gallium (35 °C) is hot enough to melt gallium into liquid gallium.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Liquid oxygen, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Titanium, Platinum, Argon, Bromine, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Liquid gallium

Melted gallium, a cool silvery liquid. Flows and sinks through water. Sets back into gallium just below body warmth.

- **State:** Liquid, 6,095 kg/m³
- **Starts at:** 35 °C
- **In liquids:** Sinks through liquids lighter than 6,095 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Freezes:** below 30 °C, into gallium
- **Conducts:** electric charge, warming as pulses pass

With other elements (63 interact):

- **Water:** Liquid gallium sinks through water (6,095 vs 1,000 kg/m³).
- **Oil:** Liquid gallium sinks through oil (6,095 vs 900 kg/m³).
- **Ice:** Liquid gallium (35 °C) is hot enough to melt ice into water. Ice (-20 °C) is cold enough to freeze liquid gallium into gallium.
- **Steam:** Liquid gallium falls through steam.
- **Lava:** Liquid gallium sinks through lava (6,095 vs 2,600 kg/m³).
- **Fire:** Liquid gallium falls through fire.
- **Smoke:** Liquid gallium falls through smoke.
- **Acid:** Liquid gallium sinks through acid (6,095 vs 1,100 kg/m³).
- **Hydrogen:** Liquid gallium falls through hydrogen.
- **Oxygen:** Liquid gallium falls through oxygen.
- **Methane:** Liquid gallium falls through methane.
- **Alcohol:** Liquid gallium sinks through alcohol (6,095 vs 789 kg/m³).
- **Snow:** Liquid gallium (35 °C) is hot enough to melt snow into water. Snow (-5 °C) is cold enough to freeze liquid gallium into gallium.
- **Nitro:** Liquid gallium sinks through nitro (6,095 vs 1,600 kg/m³).
- **Spark:** Liquid gallium falls through spark.
- **Mercury:** Mercury sinks through liquid gallium (13,534 vs 6,095 kg/m³).
- **Molten copper:** Molten copper sinks through liquid gallium (8,020 vs 6,095 kg/m³).
- **Molten gold:** Molten gold sinks through liquid gallium (17,300 vs 6,095 kg/m³).
- **Molten aluminium:** Liquid gallium sinks through molten aluminium (6,095 vs 2,375 kg/m³).
- **Molten lead:** Molten lead sinks through liquid gallium (10,660 vs 6,095 kg/m³).
- **Petrol:** Liquid gallium sinks through petrol (6,095 vs 740 kg/m³).
- **Molten wax:** Liquid gallium sinks through molten wax (6,095 vs 800 kg/m³).
- **Honey:** Liquid gallium sinks through honey (6,095 vs 1,420 kg/m³).
- **Vinegar:** Liquid gallium sinks through vinegar (6,095 vs 1,010 kg/m³).
- **Bleach:** Liquid gallium sinks through bleach (6,095 vs 1,100 kg/m³).
- **Lye:** Liquid gallium sinks through lye (6,095 vs 1,100 kg/m³).
- **Liquid nitrogen:** Liquid gallium sinks through liquid nitrogen (6,095 vs 808 kg/m³). Liquid gallium (35 °C) is hot enough to boil liquid nitrogen into nitrogen. Liquid nitrogen (-196 °C) is cold enough to freeze liquid gallium into gallium.
- **Nitrogen:** Liquid gallium falls through nitrogen.
- **Carbon dioxide:** Liquid gallium falls through carbon dioxide.
- **Helium:** Liquid gallium falls through helium.
- **Propane:** Liquid gallium falls through propane.
- **Chlorine:** Liquid gallium falls through chlorine.
- **Sulfur dioxide:** Liquid gallium falls through sulfur dioxide.
- **Dry ice:** Liquid gallium (35 °C) is hot enough to turn dry ice into carbon dioxide. Dry ice (-79 °C) is cold enough to freeze liquid gallium into gallium.
- **Cloud:** Liquid gallium falls through cloud.
- **Caramel:** Liquid gallium sinks through caramel (6,095 vs 1,300 kg/m³).
- **Liquid oxygen:** Liquid gallium sinks through liquid oxygen (6,095 vs 1,141 kg/m³). Liquid gallium (35 °C) is hot enough to boil liquid oxygen into oxygen. Liquid oxygen (-183 °C) is cold enough to freeze liquid gallium into gallium.
- **Molten iron:** Molten iron sinks through liquid gallium (6,980 vs 6,095 kg/m³).
- **Molten glass:** Liquid gallium sinks through molten glass (6,095 vs 2,400 kg/m³).
- **Molten silver:** Molten silver sinks through liquid gallium (9,320 vs 6,095 kg/m³).
- **Tar:** Liquid gallium sinks through tar (6,095 vs 1,150 kg/m³).
- **Molten plastic:** Liquid gallium sinks through molten plastic (6,095 vs 900 kg/m³).
- **Napalm:** Liquid gallium sinks through napalm (6,095 vs 900 kg/m³).
- **Hydrogen peroxide:** Liquid gallium sinks through hydrogen peroxide (6,095 vs 1,450 kg/m³).
- **Lightning:** Liquid gallium falls through lightning.
- **Plasma:** Liquid gallium falls through plasma.
- **Rocket:** Liquid gallium falls through rocket.
- **Ember:** Liquid gallium falls through ember.
- **Molten tin:** Molten tin sinks through liquid gallium (6,990 vs 6,095 kg/m³).
- **Kerosene:** Liquid gallium sinks through kerosene (6,095 vs 800 kg/m³).
- **Acetone:** Liquid gallium sinks through acetone (6,095 vs 784 kg/m³).
- **Hail:** Liquid gallium (35 °C) is hot enough to melt hail into water. Hail (-5 °C) is cold enough to freeze liquid gallium into gallium.
- **Ammonia:** Liquid gallium falls through ammonia.
- **Ozone:** Liquid gallium falls through ozone.
- **Molten chocolate:** Liquid gallium sinks through molten chocolate (6,095 vs 1,250 kg/m³).
- **Phosphorus:** Liquid gallium (35 °C) can set phosphorus on fire (it ignites at 30 °C).
- **Acetylene:** Liquid gallium falls through acetylene.
- **Iodine vapour:** Liquid gallium falls through iodine vapour.
- **Argon:** Liquid gallium falls through argon.
- **Bromine:** Liquid gallium sinks through bromine (6,095 vs 3,100 kg/m³).
- **Bromine vapour:** Liquid gallium falls through bromine vapour.
- **Gallium:** Liquid gallium (35 °C) is hot enough to melt gallium into liquid gallium.
- **Soda:** Liquid gallium sinks through soda (6,095 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, TNT, Gunpowder, Glass, Shards, Wire, Battery, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Saltpeter, Tin, Steel, Zinc, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cactus seed

Tiny dark seeds, a powder. Falls and sinks in water. On damp soil or sand it sprouts into a cactus.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 140 cells/s
- **Burns:** from 250 °C in air, 0.67 s per cell, leaves ash
- **Grows:** into cactus on damp soil (wet dirt or sand), even under a puddle

With other elements (49 interact):

- **Air:** Cactus seed burns: it catches fire at 250 °C next to air (oxidiser 0.21).
- **Water:** Cactus seed sinks through water (1,100 vs 1,000 kg/m³).
- **Oil:** Cactus seed sinks through oil (1,100 vs 900 kg/m³).
- **Steam:** Cactus seed falls through steam.
- **Lava:** Lava (1,200 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Fire:** Cactus seed catches from the flame touching it. Cactus seed falls through fire.
- **Smoke:** Cactus seed falls through smoke.
- **Hydrogen:** Cactus seed falls through hydrogen.
- **Oxygen:** Cactus seed burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Cactus seed falls through oxygen. Oxygen makes burning cactus seed hotter and faster.
- **Methane:** Cactus seed falls through methane.
- **Alcohol:** Cactus seed sinks through alcohol (1,100 vs 789 kg/m³).
- **Spark:** Cactus seed catches from the flame touching it. Cactus seed falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Molten gold:** Molten gold (1,150 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Molten lead:** Molten lead (400 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Petrol:** Cactus seed sinks through petrol (1,100 vs 740 kg/m³).
- **Molten wax:** Cactus seed sinks through molten wax (1,100 vs 800 kg/m³).
- **Vinegar:** Cactus seed sinks through vinegar (1,100 vs 1,010 kg/m³).
- **Liquid nitrogen:** Cactus seed sinks through liquid nitrogen (1,100 vs 808 kg/m³).
- **Nitrogen:** Cactus seed falls through nitrogen.
- **Carbon dioxide:** Cactus seed falls through carbon dioxide.
- **Helium:** Cactus seed falls through helium.
- **Propane:** Cactus seed falls through propane.
- **Chlorine:** Cactus seed falls through chlorine.
- **Sulfur dioxide:** Cactus seed falls through sulfur dioxide.
- **Cloud:** Cactus seed falls through cloud.
- **Liquid oxygen:** Cactus seed burns: it catches fire at 250 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Molten glass:** Molten glass (1,450 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Molten silver:** Molten silver (1,000 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Molten plastic:** Cactus seed sinks through molten plastic (1,100 vs 900 kg/m³).
- **Napalm:** Cactus seed sinks through napalm (1,100 vs 900 kg/m³).
- **Hydrogen peroxide:** Cactus seed burns: it catches fire at 250 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning cactus seed hotter and faster.
- **Lightning:** Cactus seed catches from the flame touching it. Cactus seed falls through lightning.
- **Plasma:** Cactus seed catches from the flame touching it. Cactus seed falls through plasma.
- **Rocket:** Cactus seed catches from the flame touching it. Cactus seed falls through rocket.
- **Ember:** Cactus seed catches from the flame touching it. Cactus seed falls through ember.
- **Saltpeter:** Cactus seed burns: it catches fire at 250 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning cactus seed hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set cactus seed on fire (it ignites at 250 °C).
- **Kerosene:** Cactus seed sinks through kerosene (1,100 vs 800 kg/m³).
- **Acetone:** Cactus seed sinks through acetone (1,100 vs 784 kg/m³).
- **Ammonia:** Cactus seed falls through ammonia.
- **Ozone:** Cactus seed burns: it catches fire at 250 °C next to ozone (oxidiser 1). Cactus seed falls through ozone. Ozone makes burning cactus seed hotter and faster.
- **Acetylene:** Cactus seed falls through acetylene.
- **Iodine vapour:** Cactus seed falls through iodine vapour.
- **Argon:** Cactus seed falls through argon.
- **Bromine vapour:** Cactus seed falls through bromine vapour.
- **Soda:** Cactus seed sinks through soda (1,100 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cactus

A fat, spiny desert plant. Grows slowly and stores water, losing it so slowly that it outlasts a drought, and it flowers at its tips.

- **State:** Solid, 950 kg/m³
- **Burns:** from 300 °C in air, 2 s per cell, leaves ash
- **Flowers:** each stem ends in flower
- **Thrifty:** loses water very slowly, so it outlasts a drought
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (29 interact):

- **Air:** Cactus burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set cactus on fire (it ignites at 300 °C).
- **Fire:** Cactus catches from the flame touching it.
- **Acid:** Acid eats cactus: acidity 0.8 beats hardness 0.2.
- **Oxygen:** Cactus burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning cactus hotter and faster.
- **Salt:** Salt is toxic: cactus touching it withers.
- **Spark:** Cactus catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set cactus on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set cactus on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set cactus on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set cactus on fire (it ignites at 300 °C).
- **Bleach:** Bleach is toxic: cactus touching it withers.
- **Chlorine:** Chlorine is toxic: cactus touching it withers.
- **Sulfur dioxide:** Sulfur dioxide is toxic: cactus touching it withers.
- **Liquid oxygen:** Cactus burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set cactus on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set cactus on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set cactus on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Cactus burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning cactus hotter and faster.
- **Lightning:** Cactus catches from the flame touching it.
- **Plasma:** Cactus catches from the flame touching it.
- **Rocket:** Cactus catches from the flame touching it.
- **Ember:** Cactus catches from the flame touching it.
- **Saltpeter:** Cactus burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning cactus hotter and faster.
- **Uranium:** Uranium is toxic: cactus touching it withers.
- **Ammonia:** Ammonia is toxic: cactus touching it withers.
- **Ozone:** Cactus burns: it catches fire at 300 °C next to ozone (oxidiser 1). Ozone is toxic: cactus touching it withers. Ozone makes burning cactus hotter and faster.
- **Bromine:** Bromine is toxic: cactus touching it withers.
- **Bromine vapour:** Bromine vapour is toxic: cactus touching it withers.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Gallium, Liquid gallium, Cactus seed, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Smoke bomb

A packed grey powder. Falls and piles. Lit, it smoulders slowly at a low heat, pouring out thick smoke.

- **State:** Powder, 1,200 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,200 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Burns:** from 200 °C in air, 6.67 s per cell, leaves smoke
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (53 interact):

- **Air:** Smoke bomb burns: it catches fire at 200 °C next to air (oxidiser 0.21).
- **Water:** Smoke bomb sinks through water (1,200 vs 1,000 kg/m³).
- **Oil:** Smoke bomb sinks through oil (1,200 vs 900 kg/m³).
- **Steam:** Smoke bomb falls through steam.
- **Lava:** Lava (1,200 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Fire:** Smoke bomb catches from the flame touching it. Smoke bomb falls through fire.
- **Smoke:** Smoke bomb falls through smoke.
- **Acid:** Acid eats smoke bomb: acidity 0.8 beats hardness 0.2. Smoke bomb sinks through acid (1,200 vs 1,100 kg/m³).
- **Hydrogen:** Smoke bomb falls through hydrogen.
- **Oxygen:** Smoke bomb burns: it catches fire at 200 °C next to oxygen (oxidiser 1). Smoke bomb falls through oxygen. Oxygen makes burning smoke bomb hotter and faster.
- **Methane:** Smoke bomb falls through methane.
- **Alcohol:** Smoke bomb sinks through alcohol (1,200 vs 789 kg/m³).
- **Spark:** Smoke bomb catches from the flame touching it. Smoke bomb falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Molten gold:** Molten gold (1,150 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Molten lead:** Molten lead (400 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Petrol:** Smoke bomb sinks through petrol (1,200 vs 740 kg/m³).
- **Molten wax:** Smoke bomb sinks through molten wax (1,200 vs 800 kg/m³).
- **Vinegar:** Smoke bomb sinks through vinegar (1,200 vs 1,010 kg/m³).
- **Bleach:** Smoke bomb sinks through bleach (1,200 vs 1,100 kg/m³).
- **Lye:** Smoke bomb sinks through lye (1,200 vs 1,100 kg/m³).
- **Liquid nitrogen:** Smoke bomb sinks through liquid nitrogen (1,200 vs 808 kg/m³).
- **Nitrogen:** Smoke bomb falls through nitrogen.
- **Carbon dioxide:** Smoke bomb falls through carbon dioxide.
- **Helium:** Smoke bomb falls through helium.
- **Propane:** Smoke bomb falls through propane.
- **Chlorine:** Smoke bomb falls through chlorine.
- **Sulfur dioxide:** Smoke bomb falls through sulfur dioxide.
- **Cloud:** Smoke bomb falls through cloud.
- **Liquid oxygen:** Smoke bomb burns: it catches fire at 200 °C next to liquid oxygen (oxidiser 1). Smoke bomb sinks through liquid oxygen (1,200 vs 1,141 kg/m³).
- **Molten iron:** Molten iron (1,600 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Molten glass:** Molten glass (1,450 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Molten silver:** Molten silver (1,000 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Tar:** Smoke bomb sinks through tar (1,200 vs 1,150 kg/m³).
- **Molten plastic:** Smoke bomb sinks through molten plastic (1,200 vs 900 kg/m³). Molten plastic (200 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Napalm:** Smoke bomb sinks through napalm (1,200 vs 900 kg/m³).
- **Hydrogen peroxide:** Smoke bomb burns: it catches fire at 200 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning smoke bomb hotter and faster.
- **Lightning:** Smoke bomb catches from the flame touching it. Smoke bomb falls through lightning.
- **Plasma:** Smoke bomb catches from the flame touching it. Smoke bomb falls through plasma.
- **Rocket:** Smoke bomb catches from the flame touching it. Smoke bomb falls through rocket.
- **Ember:** Smoke bomb catches from the flame touching it. Smoke bomb falls through ember.
- **Saltpeter:** Smoke bomb burns: it catches fire at 200 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning smoke bomb hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set smoke bomb on fire (it ignites at 200 °C).
- **Kerosene:** Smoke bomb sinks through kerosene (1,200 vs 800 kg/m³).
- **Acetone:** Smoke bomb sinks through acetone (1,200 vs 784 kg/m³).
- **Ammonia:** Smoke bomb falls through ammonia.
- **Ozone:** Smoke bomb burns: it catches fire at 200 °C next to ozone (oxidiser 1). Smoke bomb falls through ozone. Ozone makes burning smoke bomb hotter and faster.
- **Acetylene:** Smoke bomb falls through acetylene.
- **Iodine vapour:** Smoke bomb falls through iodine vapour.
- **Argon:** Smoke bomb falls through argon.
- **Bromine vapour:** Smoke bomb falls through bromine vapour.
- **Soda:** Smoke bomb sinks through soda (1,200 vs 1,010 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Peat

Dark, fibrous bog soil, a powder. Falls and piles and soaks up a lot of water. Dried out, it smoulders for a very long time.

- **State:** Powder, 900 kg/m³
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, rests on heavier ones
- **Falls:** up to 140 cells/s
- **Burns:** from 300 °C in air, 13.33 s per cell, leaves ash
- **Soaks up:** water, up to 50% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (44 interact):

- **Air:** Peat burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Water:** Peat soaks up water: it is porous and holds up to 50% water.
- **Steam:** Peat falls through steam.
- **Lava:** Lava (1,200 °C) can set peat on fire (it ignites at 300 °C).
- **Fire:** Peat catches from the flame touching it. Peat falls through fire.
- **Smoke:** Peat falls through smoke.
- **Acid:** Acid eats peat: acidity 0.8 beats hardness 0.2.
- **Hydrogen:** Peat falls through hydrogen.
- **Oxygen:** Peat burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Peat falls through oxygen. Oxygen makes burning peat hotter and faster.
- **Methane:** Peat falls through methane.
- **Alcohol:** Peat sinks through alcohol (900 vs 789 kg/m³).
- **Spark:** Peat catches from the flame touching it. Peat falls through spark.
- **Molten copper:** Molten copper (1,200 °C) can set peat on fire (it ignites at 300 °C).
- **Molten gold:** Molten gold (1,150 °C) can set peat on fire (it ignites at 300 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set peat on fire (it ignites at 300 °C).
- **Molten lead:** Molten lead (400 °C) can set peat on fire (it ignites at 300 °C).
- **Petrol:** Peat sinks through petrol (900 vs 740 kg/m³).
- **Molten wax:** Peat sinks through molten wax (900 vs 800 kg/m³).
- **Liquid nitrogen:** Peat sinks through liquid nitrogen (900 vs 808 kg/m³).
- **Nitrogen:** Peat falls through nitrogen.
- **Carbon dioxide:** Peat falls through carbon dioxide.
- **Helium:** Peat falls through helium.
- **Propane:** Peat falls through propane.
- **Chlorine:** Peat falls through chlorine.
- **Sulfur dioxide:** Peat falls through sulfur dioxide.
- **Cloud:** Peat falls through cloud.
- **Liquid oxygen:** Peat burns: it catches fire at 300 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set peat on fire (it ignites at 300 °C).
- **Molten glass:** Molten glass (1,450 °C) can set peat on fire (it ignites at 300 °C).
- **Molten silver:** Molten silver (1,000 °C) can set peat on fire (it ignites at 300 °C).
- **Hydrogen peroxide:** Peat burns: it catches fire at 300 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning peat hotter and faster.
- **Lightning:** Peat catches from the flame touching it. Peat falls through lightning.
- **Plasma:** Peat catches from the flame touching it. Peat falls through plasma.
- **Rocket:** Peat catches from the flame touching it. Peat falls through rocket.
- **Ember:** Peat catches from the flame touching it. Peat falls through ember.
- **Saltpeter:** Peat burns: it catches fire at 300 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning peat hotter and faster.
- **Kerosene:** Peat sinks through kerosene (900 vs 800 kg/m³).
- **Acetone:** Peat sinks through acetone (900 vs 784 kg/m³).
- **Ammonia:** Peat falls through ammonia.
- **Ozone:** Peat burns: it catches fire at 300 °C next to ozone (oxidiser 1). Peat falls through ozone. Ozone makes burning peat hotter and faster.
- **Acetylene:** Peat falls through acetylene.
- **Iodine vapour:** Peat falls through iodine vapour.
- **Argon:** Peat falls through argon.
- **Bromine vapour:** Peat falls through bromine vapour.

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Molten tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Iodine, Titanium, Platinum, Bromine, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Basalt, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Basalt

Dark volcanic rock, very hard. Stays put. Great heat melts it into lava.

- **State:** Solid, 3,000 kg/m³
- **Melts:** at 1,100 °C, into lava
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (7 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt basalt into lava.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt basalt into lava.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt basalt into lava.
- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt basalt into lava.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt basalt into lava.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt basalt into lava.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt basalt into lava.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Granite, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Granite

Speckled pink and grey rock, very hard. Stays put. Only very great heat melts it into lava.

- **State:** Solid, 2,750 kg/m³
- **Melts:** at 1,250 °C, into lava
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (4 interact):

- **Molten iron:** Molten iron (1,600 °C) is hot enough to melt granite into lava.
- **Molten glass:** Molten glass (1,450 °C) is hot enough to melt granite into lava.
- **Lightning:** Lightning (3,000 °C) is hot enough to melt granite into lava.
- **Plasma:** Plasma (3,000 °C) is hot enough to melt granite into lava.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Sandstone, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sandstone

Sand pressed into soft rock. Stays put. A blast crumbles it back into sand.

- **State:** Solid, 2,300 kg/m³
- **Shatters:** into sand when a blast hits it
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats sandstone: acidity 0.8 beats hardness 0.6.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk, Liquid oxygen, Molten iron, Molten glass, Silver, Molten silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Molten plastic, Pumice, Obsidian, Diamond, Napalm, Hydrogen peroxide, Fish, Ant, Worm, Bird, Lightning, Plasma, Firework, Rocket, Ember, Saltpeter, Tin, Molten tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Ozone, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Soda, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Soda

Fizzy water full of dissolved carbon dioxide. Flows like water. Warmed, it fizzes out its gas and goes flat.

- **State:** Liquid, 1,010 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,010 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Bakes:** at 35 °C into water, giving off carbon dioxide; there is no way back

With other elements (83 interact):

- **Sand:** Sand sinks through soda (1,600 vs 1,010 kg/m³).
- **Water:** Soda sinks through water (1,010 vs 1,000 kg/m³).
- **Oil:** Soda sinks through oil (1,010 vs 900 kg/m³).
- **Steam:** Soda falls through steam.
- **Lava:** Lava sinks through soda (2,600 vs 1,010 kg/m³).
- **Gravel:** Gravel sinks through soda (2,000 vs 1,010 kg/m³).
- **Fire:** Soda falls through fire.
- **Smoke:** Soda falls through smoke.
- **Acid:** Acid sinks through soda (1,100 vs 1,010 kg/m³).
- **Hydrogen:** Soda falls through hydrogen.
- **Oxygen:** Soda falls through oxygen.
- **Methane:** Soda falls through methane.
- **Alcohol:** Soda sinks through alcohol (1,010 vs 789 kg/m³).
- **Salt:** Salt sinks through soda (2,160 vs 1,010 kg/m³).
- **Sugar:** Sugar sinks through soda (1,590 vs 1,010 kg/m³).
- **Dirt:** Dirt sinks through soda (1,500 vs 1,010 kg/m³).
- **Gunpowder:** Gunpowder sinks through soda (1,700 vs 1,010 kg/m³).
- **Nitro:** Nitro sinks through soda (1,600 vs 1,010 kg/m³).
- **Shards:** Shards sinks through soda (2,500 vs 1,010 kg/m³).
- **Spark:** Soda falls through spark.
- **Mercury:** Mercury sinks through soda (13,534 vs 1,010 kg/m³).
- **Seed:** Seed sinks through soda (1,100 vs 1,010 kg/m³).
- **Molten copper:** Molten copper sinks through soda (8,020 vs 1,010 kg/m³).
- **Clay:** Clay sinks through soda (1,700 vs 1,010 kg/m³).
- **Cement:** Cement sinks through soda (1,440 vs 1,010 kg/m³).
- **Quicklime:** Quicklime sinks through soda (1,200 vs 1,010 kg/m³).
- **Slaked lime:** Slaked lime sinks through soda (1,100 vs 1,010 kg/m³).
- **Molten gold:** Molten gold sinks through soda (17,300 vs 1,010 kg/m³).
- **Molten aluminium:** Molten aluminium sinks through soda (2,375 vs 1,010 kg/m³).
- **Molten lead:** Molten lead sinks through soda (10,660 vs 1,010 kg/m³).
- **Rust:** Rust sinks through soda (2,000 vs 1,010 kg/m³).
- **Coal:** Coal sinks through soda (1,350 vs 1,010 kg/m³).
- **Sulfur:** Sulfur sinks through soda (2,000 vs 1,010 kg/m³).
- **Petrol:** Soda sinks through petrol (1,010 vs 740 kg/m³).
- **Molten wax:** Soda sinks through molten wax (1,010 vs 800 kg/m³).
- **Thermite:** Thermite sinks through soda (1,500 vs 1,010 kg/m³).
- **Honey:** Honey sinks through soda (1,420 vs 1,010 kg/m³).
- **Bleach:** Bleach sinks through soda (1,100 vs 1,010 kg/m³).
- **Lye:** Lye sinks through soda (1,100 vs 1,010 kg/m³).
- **Liquid nitrogen:** Soda sinks through liquid nitrogen (1,010 vs 808 kg/m³).
- **Nitrogen:** Soda falls through nitrogen.
- **Carbon dioxide:** Soda falls through carbon dioxide.
- **Helium:** Soda falls through helium.
- **Propane:** Soda falls through propane.
- **Chlorine:** Soda falls through chlorine.
- **Sulfur dioxide:** Soda falls through sulfur dioxide.
- **Baking soda:** Baking soda sinks through soda (1,100 vs 1,010 kg/m³).
- **Grass seed:** Grass seed sinks through soda (1,100 vs 1,010 kg/m³).
- **Acorn:** Acorn sinks through soda (1,100 vs 1,010 kg/m³).
- **Cloud:** Soda falls through cloud.
- **Caramel:** Caramel sinks through soda (1,300 vs 1,010 kg/m³).
- **Chalk:** Chalk sinks through soda (1,500 vs 1,010 kg/m³).
- **Liquid oxygen:** Liquid oxygen sinks through soda (1,141 vs 1,010 kg/m³).
- **Molten iron:** Molten iron sinks through soda (6,980 vs 1,010 kg/m³).
- **Molten glass:** Molten glass sinks through soda (2,400 vs 1,010 kg/m³).
- **Molten silver:** Molten silver sinks through soda (9,320 vs 1,010 kg/m³).
- **Popcorn kernel:** Popcorn kernel sinks through soda (1,200 vs 1,010 kg/m³).
- **Tar:** Tar sinks through soda (1,150 vs 1,010 kg/m³).
- **Molten plastic:** Soda sinks through molten plastic (1,010 vs 900 kg/m³).
- **Napalm:** Soda sinks through napalm (1,010 vs 900 kg/m³).
- **Hydrogen peroxide:** Hydrogen peroxide sinks through soda (1,450 vs 1,010 kg/m³).
- **Lightning:** Soda falls through lightning.
- **Plasma:** Soda falls through plasma.
- **Firework:** Firework sinks through soda (1,400 vs 1,010 kg/m³).
- **Rocket:** Soda falls through rocket.
- **Ember:** Soda falls through ember.
- **Saltpeter:** Saltpeter sinks through soda (2,100 vs 1,010 kg/m³).
- **Molten tin:** Molten tin sinks through soda (6,990 vs 1,010 kg/m³).
- **Kerosene:** Soda sinks through kerosene (1,010 vs 800 kg/m³).
- **Acetone:** Soda sinks through acetone (1,010 vs 784 kg/m³).
- **Ammonia:** Soda falls through ammonia.
- **Ozone:** Soda falls through ozone.
- **Molten chocolate:** Molten chocolate sinks through soda (1,250 vs 1,010 kg/m³).
- **Calcium carbide:** Calcium carbide sinks through soda (2,220 vs 1,010 kg/m³).
- **Acetylene:** Soda falls through acetylene.
- **Iodine:** Iodine sinks through soda (4,930 vs 1,010 kg/m³).
- **Iodine vapour:** Soda falls through iodine vapour.
- **Argon:** Soda falls through argon.
- **Bromine:** Bromine sinks through soda (3,100 vs 1,010 kg/m³).
- **Bromine vapour:** Soda falls through bromine vapour.
- **Liquid gallium:** Liquid gallium sinks through soda (6,095 vs 1,010 kg/m³).
- **Cactus seed:** Cactus seed sinks through soda (1,100 vs 1,010 kg/m³).
- **Smoke bomb:** Smoke bomb sinks through soda (1,200 vs 1,010 kg/m³).

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Vinegar, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Silver, Meat, Cooked meat, Popcorn, Plastic, Pumice, Obsidian, Diamond, Fish, Ant, Worm, Bird, Tin, Steel, Zinc, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Cotton, Chocolate, Egg, Cooked egg, Phosphorus, Lithium, Titanium, Platinum, Gallium, Cactus, Peat, Basalt, Granite, Sandstone, Fuse. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fuse

A slow-burning cord. Stays put. Lit at one end, it burns steadily along its whole length like a rope, and sets off any explosive at the far end, even C4.

- **State:** Solid, 900 kg/m³
- **Burns:** from 150 °C in air, 0.4 s per cell, leaves ash
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (26 interact):

- **Air:** Fuse burns: it catches fire at 150 °C next to air (oxidiser 0.21).
- **Steam:** Steam (150 °C) can set fuse on fire (it ignites at 150 °C).
- **Lava:** Lava (1,200 °C) can set fuse on fire (it ignites at 150 °C).
- **Fire:** Fuse catches from the flame touching it.
- **Smoke:** Smoke (150 °C) can set fuse on fire (it ignites at 150 °C).
- **Acid:** Acid eats fuse: acidity 0.8 beats hardness 0.2.
- **Oxygen:** Fuse burns: it catches fire at 150 °C next to oxygen (oxidiser 1). Oxygen makes burning fuse hotter and faster.
- **Spark:** Fuse catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set fuse on fire (it ignites at 150 °C).
- **Molten gold:** Molten gold (1,150 °C) can set fuse on fire (it ignites at 150 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set fuse on fire (it ignites at 150 °C).
- **Molten lead:** Molten lead (400 °C) can set fuse on fire (it ignites at 150 °C).
- **Caramel:** Caramel (190 °C) can set fuse on fire (it ignites at 150 °C).
- **Liquid oxygen:** Fuse burns: it catches fire at 150 °C next to liquid oxygen (oxidiser 1).
- **Molten iron:** Molten iron (1,600 °C) can set fuse on fire (it ignites at 150 °C).
- **Molten glass:** Molten glass (1,450 °C) can set fuse on fire (it ignites at 150 °C).
- **Molten silver:** Molten silver (1,000 °C) can set fuse on fire (it ignites at 150 °C).
- **Molten plastic:** Molten plastic (200 °C) can set fuse on fire (it ignites at 150 °C).
- **Hydrogen peroxide:** Fuse burns: it catches fire at 150 °C next to hydrogen peroxide (oxidiser 0.8). Hydrogen peroxide makes burning fuse hotter and faster.
- **Lightning:** Fuse catches from the flame touching it.
- **Plasma:** Fuse catches from the flame touching it.
- **Rocket:** Fuse catches from the flame touching it.
- **Ember:** Fuse catches from the flame touching it.
- **Saltpeter:** Fuse burns: it catches fire at 150 °C next to saltpeter (oxidiser 0.9). Saltpeter makes burning fuse hotter and faster.
- **Molten tin:** Molten tin (260 °C) can set fuse on fire (it ignites at 150 °C).
- **Ozone:** Fuse burns: it catches fire at 150 °C next to ozone (oxidiser 1). Ozone makes burning fuse hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk, Silver, Meat, Cooked meat, Popcorn kernel, Popcorn, Tar, Plastic, Pumice, Obsidian, Diamond, Napalm, Fish, Ant, Worm, Bird, Firework, Tin, Steel, Zinc, Kerosene, Acetone, Hail, Uranium, Bee, Spider, Termite, Snail, Frog, Mouse, Snake, Ammonia, Cotton, Chocolate, Molten chocolate, Egg, Cooked egg, Phosphorus, Lithium, Calcium carbide, Acetylene, Iodine, Iodine vapour, Titanium, Platinum, Argon, Bromine, Bromine vapour, Gallium, Liquid gallium, Cactus seed, Cactus, Smoke bomb, Peat, Basalt, Granite, Sandstone, Soda. They still exchange heat by touch, and the heavier one ends up below when they can move.
