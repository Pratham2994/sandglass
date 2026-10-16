# Sandglass master list

Generated from the game code by `npm run master-list`. Do not edit by hand: change the element data in `src/sim/elements.ts` (or the rules in `src/sim/chem.ts`) and run the script again.

94 elements. Every pair of elements is listed below, in both directions, with what happens and why.

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
| Iron | metals | solid | 7,870 | 20 °C |  |  |  |
| Hydrogen | gases | gas | 0.09 | 20 °C |  |  | from 500 °C |
| Oxygen | gases | gas | 1.43 | 20 °C |  |  |  |
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
| Glass | solids | solid | 2,500 | 20 °C |  |  |  |
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
| Flour | fuels | powder | 600 | 20 °C |  |  | from 380 °C |
| Thermite | fuels | powder | 1,500 | 20 °C |  |  | from 900 °C |
| Honey | liquids | liquid | 1,420 | 20 °C |  |  |  |
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
| Caramel | liquids | liquid | 1,300 | 190 °C |  |  | from 400 °C |
| Marble | building | solid | 2,700 | 20 °C |  |  |  |
| Chalk | powders | powder | 1,500 | 20 °C |  |  |  |

## Elements

### Wall

An indestructible solid. Never moves. Nothing melts, burns or eats it; use it for containers and floors.

- **State:** Solid, 2,500 kg/m³
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sand

A fine, heavy powder. Falls, piles into slopes and sinks through lighter liquids. Very hard to melt or eat away.

- **State:** Powder, 1,600 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,600 kg/m³, rests on heavier ones
- **Falls:** up to 165 cells/s
- **Bakes:** at 1,450 °C into glass; there is no way back
- **Soaks up:** water, up to 30% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (26 interact):

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

No direct interaction with: Air, Wall, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Water

A runny liquid. Flows and settles flat. Boils into steam when hot, freezes into ice when cold, and cools what it touches.

- **State:** Liquid, 1,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,000 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Boils:** at 100 °C, into steam
- **Freezes:** below 0 °C, into ice
- **Conducts:** only when it carries salt; current then splits it into hydrogen and oxygen
- **Dissolves:** soluble powders (salt, sugar), up to each one’s limit; saltier is heavier

With other elements (62 interact):

- **Sand:** Sand soaks up water: it is porous and holds up to 30% water. Sand sinks through water (1,600 vs 1,000 kg/m³).
- **Oil:** Water sinks through oil (1,000 vs 900 kg/m³).
- **Ice:** Ice (-20 °C) is cold enough to freeze water into ice.
- **Steam:** Water falls through steam. Steam (150 °C) is hot enough to boil water into steam.
- **Lava:** Lava sinks through water (2,600 vs 1,000 kg/m³). Lava (1,200 °C) is hot enough to boil water into steam.
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

No direct interaction with: Air, Wall, Stone, Wood, Ash, TNT, Glass, Wire, Battery, Plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Charcoal, Wax, Rubber, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Oil

A thick, slow liquid. Floats on water. Burns into smoke once hot enough.

- **State:** Liquid, 900 kg/m³
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, floats on heavier ones
- **Falls:** up to 120 cells/s
- **Burns:** from 250 °C in air, 4 s per cell, leaves smoke
- **Flash point:** 55 °C: above it, flames spread across it

With other elements (53 interact):

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

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ice

Frozen water, a cold solid. Stays put. Chills what it touches and melts back into water as it warms.

- **State:** Solid, 917 kg/m³
- **Starts at:** -20 °C
- **Melts:** at 0 °C, into water

With other elements (15 interact):

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

No direct interaction with: Air, Wall, Sand, Oil, Stone, Gravel, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Steam

Hot water vapour. Rises and spreads. Turns back into water as it cools, so it rains.

- **State:** Gas, 0.6 kg/m³
- **Starts at:** 150 °C
- **In air:** Rises (lighter than air)
- **Condenses:** below 100 °C, into water

With other elements (47 interact):

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

No direct interaction with: Air, Wall, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lava

Molten rock, extremely hot. Flows slowly and glows. Sets fuel alight, boils water, and cools into stone (or gravel where nothing holds it up).

- **State:** Liquid, 2,600 kg/m³
- **Starts at:** 1,200 °C
- **In liquids:** Sinks through liquids lighter than 2,600 kg/m³, floats on heavier ones
- **Falls:** up to 90 cells/s
- **Freezes:** below 1,000 °C, into stone

With other elements (65 interact):

- **Water:** Lava sinks through water (2,600 vs 1,000 kg/m³). Lava (1,200 °C) is hot enough to boil water into steam.
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

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Glass, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Stone

Solid rock. Stays put. Glows as it heats and melts back into lava.

- **State:** Solid, 2,600 kg/m³
- **Melts:** at 1,000 °C, into lava
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (3 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt stone into lava.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt stone into lava.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt stone into lava.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gravel

Loose rock, a heavy powder. Falls and piles. Forms where lava sets with nothing under it, and melts back into lava.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 170 cells/s
- **Melts:** at 1,000 °C, into lava
- **Hardness:** 0.8 (acid stronger than this eats it)

With other elements (30 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Stone, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fire

Loose flames. Rise and burn out quickly. Light anything flammable they touch; a lasting fire needs fuel and air.

- **State:** Energy, 0.3 kg/m³
- **Starts at:** 850 °C

With other elements (63 interact):

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

No direct interaction with: Air, Wall, Steam, Stone, Smoke, Iron, Oxygen, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Smoke

What burning leaves behind, a warm gas. Rises and drifts off the top. Does not feed fire, so it smothers flames in a closed space.

- **State:** Gas, 0.7 kg/m³
- **Starts at:** 150 °C
- **In air:** Rises (lighter than air)

With other elements (47 interact):

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

No direct interaction with: Air, Wall, Steam, Stone, Fire, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wood

A solid fuel. Stays put. Catches fire where it touches air once hot enough, and burns down to a little ash.

- **State:** Solid, 700 kg/m³
- **Burns:** from 300 °C in air, 2.5 s per cell, leaves ash
- **Bakes:** at 400 °C into charcoal, giving off smoke; there is no way back
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (10 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ash

A very light powder left by fire. Drifts as it falls. Floats on water.

- **State:** Powder, 600 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 45 cells/s
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (15 interact):

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

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Lava, Stone, Gravel, Wood, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acid

A corrosive liquid. Flows like water. Eats metal, wood and soft rock and is used up as it does; metal gives off hydrogen.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Eats:** metal, rock and wood softer than 0.8, weakening as it fills

With other elements (75 interact):

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

No direct interaction with: Air, Wall, Ice, Stone, Snow, Glass, Seed, Brick, Gold, Charcoal, Dry ice, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Iron

A dense metal. Stays put and moves heat quickly. Acid eats it, giving off hydrogen.

- **State:** Solid, 7,870 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Rusts:** slowly into rust where water or oxygen touches it
- **Hardness:** 0.55 (acid stronger than this eats it)

With other elements (3 interact):

- **Water:** Iron slowly rusts into rust where water touches it.
- **Acid:** Acid eats iron: acidity 0.8 beats hardness 0.55, giving off hydrogen.
- **Oxygen:** Iron slowly rusts into rust where oxygen touches it.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Hydrogen

The lightest gas. Shoots upwards. Burns in a flash into steam when hot and touching air or oxygen.

- **State:** Gas, 0.09 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 500 °C in air, 0.1 s per cell, leaves steam

With other elements (48 interact):

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

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Methane, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Oxygen

A gas slightly heavier than air. Sinks and pools low. Makes fire burn hotter and use its fuel faster.

- **State:** Gas, 1.43 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Feeds fire:** strength 1 (air is 0.21)

With other elements (61 interact):

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
- **Liquid nitrogen:** Liquid nitrogen falls through oxygen.
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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Glass, Spark, Wire, Battery, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, Dry ice, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Methane

Natural gas, lighter than air. Rises. Burns hot into steam when it meets heat and air.

- **State:** Gas, 0.66 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 540 °C in air, 0.17 s per cell, leaves steam

With other elements (48 interact):

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

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Hydrogen, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Alcohol

A thin, light liquid. Floats on water. Catches fire easily and burns clean into steam.

- **State:** Liquid, 789 kg/m³
- **In liquids:** Sinks through liquids lighter than 789 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 365 °C in air, 2 s per cell, leaves steam
- **Flash point:** 13 °C: above it, flames spread across it

With other elements (53 interact):

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

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sawdust

Fine wood dust, a very light powder. Drifts and floats on water. Catches fire easily and burns fast.

- **State:** Powder, 250 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 55 cells/s
- **Burns:** from 260 °C in air, 2.5 s per cell, leaves ash
- **Soaks up:** water, up to 60% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (22 interact):

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

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Salt

White crystals, a powder. Falls and piles. Dissolves into water, making it heavier; boiling the water leaves the salt behind.

- **State:** Powder, 2,160 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,160 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Poisons:** living things it touches: they wither
- **Dissolves in:** water, up to 40% of a cell; boiling leaves it as crystals

With other elements (34 interact):

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

No direct interaction with: Air, Wall, Sand, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Sugar, Dirt, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sugar

Sweet crystals, a powder. Falls and piles. Dissolves into water even more than salt does, and burns when hot.

- **State:** Powder, 1,590 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,590 kg/m³, rests on heavier ones
- **Falls:** up to 155 cells/s
- **Burns:** from 350 °C in air, 1.5 s per cell, leaves smoke
- **Bakes:** at 186 °C into caramel; there is no way back
- **Dissolves in:** water, up to 70% of a cell; boiling leaves it as crystals
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (34 interact):

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

No direct interaction with: Wall, Sand, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Dirt, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dirt

Earth, a heavy powder. Falls and piles. Soaks up a lot of water and turns into dark, sticky mud.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Soaks up:** water, up to 50% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (26 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Snow

Loose frozen flakes, a very light powder. Drifts down and settles in soft piles. Melts into water as it warms.

- **State:** Powder, 300 kg/m³
- **Starts at:** -5 °C
- **In liquids:** Rests on heavier ones
- **Falls:** up to 35 cells/s
- **Melts:** at 0 °C, into water

With other elements (25 interact):

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

No direct interaction with: Air, Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Alcohol, Sawdust, Dirt, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### TNT

A packed explosive block. Stays put. Heat or a flame sets it off: the whole block blasts outwards, throwing what is nearby.

- **State:** Solid, 1,650 kg/m³
- **Explodes:** from 300 °C or a flame; blast radius 7 cells
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (10 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gunpowder

A dark explosive powder. Falls and piles. Lit, it goes off grain by grain in quick small bangs.

- **State:** Powder, 1,700 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,700 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Explodes:** from 250 °C or a flame; blast radius 2 cells
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (33 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Nitro

An oily explosive liquid. Flows slowly. Goes off when heated, lit, or dropped hard.

- **State:** Liquid, 1,600 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,600 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Explodes:** from 200 °C or a flame, or when it lands hard; blast radius 6 cells

With other elements (40 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Wood, Ash, Iron, Sawdust, Sugar, Dirt, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Coal, Charcoal, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Glass

A clear, brittle solid. Stays put and lets you see through it. Shatters into shards when a blast hits it.

- **State:** Solid, 2,500 kg/m³
- **Shatters:** into shards when a blast hits it
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Shards

Broken glass, a sharp powder. Falls and piles in glittering heaps.

- **State:** Powder, 2,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,500 kg/m³, rests on heavier ones
- **Falls:** up to 170 cells/s
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (28 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Spark

A flash of electric charge. Jumps into any conductor it touches and runs along it; on its own it fades at once.

- **State:** Energy, 0.1 kg/m³
- **Starts at:** 300 °C

With other elements (61 interact):

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

No direct interaction with: Air, Wall, Steam, Stone, Fire, Smoke, Iron, Oxygen, Glass, Wire, Battery, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wire

Thin copper. Stays put and carries charge from end to end, warming as current runs through it.

- **State:** Solid, 8,960 kg/m³
- **Melts:** at 1,085 °C, into molten copper
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.45 (acid stronger than this eats it)

With other elements (4 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt wire into molten copper.
- **Acid:** Acid eats wire: acidity 0.8 beats hardness 0.45, giving off hydrogen.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt wire into molten copper.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt wire into molten copper.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Battery

A power source. Stays put and sends a pulse of charge into any conductor touching it, about four times a second.

- **State:** Solid, 2,500 kg/m³
- **Powers:** touching conductors with a pulse every 0.25 s
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats battery: acidity 0.8 beats hardness 0.6, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Mercury

A liquid metal, very heavy. Flows and sinks through almost everything. Carries charge like a wire.

- **State:** Liquid, 13,534 kg/m³
- **In liquids:** Sinks through liquids lighter than 13,534 kg/m³, floats on heavier ones
- **Falls:** up to 170 cells/s
- **Conducts:** electric charge, warming as pulses pass

With other elements (32 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Seed

A small seed, a light powder. Falls, sinks in water and rests. On damp soil (wet dirt or sand), it sprouts into a plant, even under a puddle.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 140 cells/s
- **Burns:** from 250 °C in air, 1 s per cell, leaves ash
- **Grows:** into plant on damp soil (wet dirt or sand), even under a puddle

With other elements (27 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Plant

A living green plant. Its roots drink from damp soil or water and pass it up the stem; it grows while it has water and puts out leaves. Dried out, it withers. Burns, and acid eats it.

- **State:** Solid, 900 kg/m³
- **Burns:** from 250 °C in air, 1.5 s per cell, leaves ash
- **Flowers:** each stem ends in flower
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.15 (acid stronger than this eats it)

With other elements (14 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten copper

Melted wire, bright and very hot. Flows and sinks through lighter liquids. Carries charge, sets fuel alight, and sets back into wire as it cools.

- **State:** Liquid, 8,020 kg/m³
- **Starts at:** 1,200 °C
- **In liquids:** Sinks through liquids lighter than 8,020 kg/m³, floats on heavier ones
- **Falls:** up to 140 cells/s
- **Freezes:** below 1,085 °C, into wire
- **Conducts:** electric charge, warming as pulses pass

With other elements (65 interact):

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

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Glass, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dry plant

A plant that ran out of water, dry and brown. Stays put. Catches fire very easily and burns fast, leaving ash.

- **State:** Solid, 300 kg/m³
- **Burns:** from 200 °C in air, 0.67 s per cell, leaves ash
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (11 interact):

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

No direct interaction with: Wall, Sand, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Clay

Fine, sticky earth, a heavy powder. Falls and piles, and soaks up water. Fired in great heat, it bakes hard into brick.

- **State:** Powder, 1,700 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,700 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Bakes:** at 900 °C into brick; there is no way back
- **Soaks up:** water, up to 40% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (27 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Brick

Fired clay, a solid block. Stays put and shrugs off heat. A strong blast breaks it into gravel.

- **State:** Solid, 1,900 kg/m³
- **Shatters:** into gravel when a blast hits it
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cement

Grey building powder. Falls and piles. Water touching it is taken in, and it sets hard into concrete.

- **State:** Powder, 1,440 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,440 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Sets:** with water into concrete
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (26 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Concrete

Set cement, a hard grey solid. Stays put. Acid eats it slowly, and a big blast cracks it into gravel.

- **State:** Solid, 2,400 kg/m³
- **Shatters:** into gravel when a blast hits it
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats concrete: acidity 0.8 beats hardness 0.6.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Limestone

Pale sedimentary rock. Stays put. Acid fizzes it away into carbon dioxide, and great heat bakes it into quicklime.

- **State:** Solid, 2,700 kg/m³
- **Bakes:** at 900 °C into quicklime, giving off carbon dioxide; there is no way back
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats limestone: acidity 0.8 beats hardness 0.4, fizzing out carbon dioxide.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Quicklime

Burnt lime, a white caustic powder and a strong base. Falls and piles. Water makes it seethe into slaked lime, hot enough to boil.

- **State:** Powder, 1,200 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,200 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Sets:** with water into slaked lime, getting very hot
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (24 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Slaked lime

A soft white powder and a base. Falls and piles. It neutralises acids into water.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 140 cells/s
- **Hardness:** 0.25 (acid stronger than this eats it)

With other elements (22 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gold

A soft, very heavy yellow metal. Stays put. Acid cannot touch it; it carries charge and heat superbly, and melts into molten gold.

- **State:** Solid, 19,300 kg/m³
- **Melts:** at 1,064 °C, into molten gold
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (3 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt gold into molten gold.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt gold into molten gold.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt gold into molten gold.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten gold

Melted gold, glowing and very heavy. Flows and sinks through almost everything. Sets back into gold as it cools.

- **State:** Liquid, 17,300 kg/m³
- **Starts at:** 1,150 °C
- **In liquids:** Sinks through liquids lighter than 17,300 kg/m³
- **Falls:** up to 170 cells/s
- **Freezes:** below 1,064 °C, into gold
- **Conducts:** electric charge, warming as pulses pass

With other elements (65 interact):

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

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt, Glass, Shards, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Rust, Sodium, Baking soda, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Aluminium

A light silvery metal. Stays put. Acid eats it, giving off hydrogen, and it melts at a modest heat into molten aluminium.

- **State:** Solid, 2,700 kg/m³
- **Melts:** at 660 °C, into molten aluminium
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (6 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt aluminium into molten aluminium.
- **Fire:** Fire (850 °C) is hot enough to melt aluminium into molten aluminium.
- **Acid:** Acid eats aluminium: acidity 0.8 beats hardness 0.4, giving off hydrogen.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt aluminium into molten aluminium.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt aluminium into molten aluminium.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten aluminium

Melted aluminium, dull red and runny. Flows and sinks through water. Sets back into aluminium as it cools.

- **State:** Liquid, 2,375 kg/m³
- **Starts at:** 750 °C
- **In liquids:** Sinks through liquids lighter than 2,375 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Freezes:** below 660 °C, into aluminium
- **Conducts:** electric charge, warming as pulses pass

With other elements (60 interact):

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

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Ash, Iron, Salt, Dirt, Glass, Wire, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Rust, Sodium, Thermite, Baking soda, C4, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lead

A dull, very heavy grey metal. Stays put. It melts easily into molten lead, and acid eats it slowly.

- **State:** Solid, 11,340 kg/m³
- **Melts:** at 327 °C, into molten lead
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.6 (acid stronger than this eats it)

With other elements (7 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt lead into molten lead.
- **Fire:** Fire (850 °C) is hot enough to melt lead into molten lead.
- **Acid:** Acid eats lead: acidity 0.8 beats hardness 0.6, giving off hydrogen.
- **Molten copper:** Molten copper (1,200 °C) is hot enough to melt lead into molten lead.
- **Molten gold:** Molten gold (1,150 °C) is hot enough to melt lead into molten lead.
- **Molten aluminium:** Molten aluminium (750 °C) is hot enough to melt lead into molten lead.
- **Molten lead:** Molten lead (400 °C) is hot enough to melt lead into molten lead.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten lead

Melted lead, hot and very heavy. Flows and sinks through almost everything. Sets back into lead as it cools.

- **State:** Liquid, 10,660 kg/m³
- **Starts at:** 400 °C
- **In liquids:** Sinks through liquids lighter than 10,660 kg/m³, floats on heavier ones
- **Falls:** up to 170 cells/s
- **Freezes:** below 327 °C, into lead
- **Conducts:** electric charge, warming as pulses pass

With other elements (56 interact):

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

No direct interaction with: Air, Wall, Sand, Stone, Gravel, Ash, Iron, Salt, Dirt, Glass, Shards, Wire, Battery, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Rust, Sodium, Coal, Thermite, Baking soda, C4, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Rust

Flaky red iron oxide, a powder. Falls and piles. It forms where water or oxygen slowly eats at iron.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (27 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sodium

A soft, light silvery metal. Stays put. Water touching it makes it fizz violently into lye and burning hydrogen.

- **State:** Solid, 968 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Sodium reacts violently with water: it becomes lye and hydrogen, hot enough to set the hydrogen alight.
- **Acid:** Acid eats sodium: acidity 0.8 beats hardness 0.1, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Coal

Black lumps of fossil fuel, a heavy powder. Falls and piles. Hard to light, but once going it burns hot for a very long time.

- **State:** Powder, 1,350 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,350 kg/m³, rests on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 450 °C in air, 15 s per cell, leaves ash
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (30 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Molten lead, Rust, Sodium, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Charcoal

Charred wood, a light black powder. Falls and piles. It catches more easily than coal and glows hot for a long time.

- **State:** Powder, 400 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 100 cells/s
- **Burns:** from 350 °C in air, 8.33 s per cell, leaves ash
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (20 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sulfur

Yellow crystals, a powder. Falls and piles. It burns with a blue flame into choking sulfur dioxide.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Burns:** from 232 °C in air, 1.5 s per cell, leaves sulfur dioxide
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (33 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Petrol

A thin, volatile fuel. Flows freely and floats on water. Its vapour catches from the smallest flame, so a pool goes up at once.

- **State:** Liquid, 740 kg/m³
- **In liquids:** Floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 280 °C in air, 1 s per cell
- **Flash point:** -43 °C: above it, flames spread across it

With other elements (53 interact):

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

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wax

Soft, pale wax. Stays put. It melts at a gentle heat into molten wax and burns slowly, like a candle.

- **State:** Solid, 900 kg/m³
- **Melts:** at 60 °C, into molten wax
- **Burns:** from 300 °C in air, 5 s per cell
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (14 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Molten wax

Melted wax, warm and runny. Flows and floats on water. It sets back into wax as it cools, and burns once it gets hot.

- **State:** Liquid, 800 kg/m³
- **Starts at:** 80 °C
- **In liquids:** Sinks through liquids lighter than 800 kg/m³, floats on heavier ones
- **Falls:** up to 120 cells/s
- **Freezes:** below 60 °C, into wax
- **Burns:** from 300 °C in air, 3.33 s per cell
- **Flash point:** 200 °C: above it, flames spread across it

With other elements (57 interact):

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

No direct interaction with: Wall, Stone, Wood, Ash, Iron, Sawdust, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Paper, Rubber, Flour, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Paper

Thin sheets of wood pulp. Stays put. It catches at the lightest flame and burns up quickly into ash.

- **State:** Solid, 700 kg/m³
- **Burns:** from 233 °C in air, 0.67 s per cell, leaves ash
- **Rots:** slowly into dirt where water touches it
- **Hardness:** 0.05 (acid stronger than this eats it)

With other elements (11 interact):

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

No direct interaction with: Wall, Sand, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Rubber

Tough black rubber. Stays put and never carries charge. Hard to light, but it burns long and hot.

- **State:** Solid, 1,100 kg/m³
- **Burns:** from 400 °C in air, 6.67 s per cell, leaves ash
- **Hardness:** 0.4 (acid stronger than this eats it)

With other elements (10 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Flour

Fine white powder, very light. Drifts as it falls. It catches easily and burns fast where air reaches it, but soaks up water into a paste that will not burn.

- **State:** Powder, 600 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 70 cells/s
- **Burns:** from 380 °C in air, 0.33 s per cell, leaves ash
- **Flash point:** 50 °C: above it, flames spread across it
- **Soaks up:** water, up to 30% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (22 interact):

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

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Thermite

A grey-red metal powder that carries its own oxygen. Falls and piles. A flame will not light it, but great heat does, and it burns white-hot with no air, leaving iron.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Burns:** from 900 °C in air, 2 s per cell, leaves iron
- **Burns without air:** it carries its own oxygen
- **A flame:** will not light it; it needs 900 °C
- **Hardness:** 0.9 (acid stronger than this eats it)

With other elements (30 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Honey

Thick golden syrup. Oozes very slowly and sinks through water. Sticky and sweet; it does not burn.

- **State:** Liquid, 1,420 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,420 kg/m³, floats on heavier ones
- **Falls:** up to 40 cells/s

With other elements (45 interact):

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

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Coal, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Vinegar

A weak acid, mostly water. Flows like water. Too weak to eat metal, but it fizzes with baking soda and neutralises bases.

- **State:** Liquid, 1,010 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,010 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s

With other elements (52 interact):

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

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bleach

A strong cleaning base. Flows like water. Mixed with any acid it gives off poisonous chlorine gas.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Poisons:** living things it touches: they wither

With other elements (51 interact):

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

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Dry plant, Brick, Concrete, Limestone, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Lye, Dry ice, Baking soda, C4, Grass seed, Acorn, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lye

A caustic alkaline liquid. Flows like water. It neutralises acid into water, warming as it does.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s

With other elements (46 interact):

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

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Bleach, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Liquid nitrogen

Nitrogen cooled to a liquid, bitterly cold. Flows and boils away fast into nitrogen gas, freezing whatever it touches.

- **State:** Liquid, 808 kg/m³
- **Starts at:** -196 °C
- **In liquids:** Sinks through liquids lighter than 808 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Boils:** at -196 °C, into nitrogen

With other elements (52 interact):

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
- **Oxygen:** Liquid nitrogen falls through oxygen.
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

No direct interaction with: Air, Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Charcoal, Wax, Paper, Rubber, Flour, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Nitrogen

The inert gas that makes up most of air. Drifts slowly upwards. It feeds no fire, so it smothers flames it surrounds.

- **State:** Gas, 1.17 kg/m³
- **In air:** Rises (lighter than air)
- **Condenses:** below -196 °C, into liquid nitrogen

With other elements (44 interact):

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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Carbon dioxide

A heavy, colourless gas. Sinks and pools low like water. It feeds no fire, so it smothers flames; cooled hard it freezes into dry ice.

- **State:** Gas, 1.98 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Condenses:** below -78 °C, into dry ice

With other elements (44 interact):

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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Helium

A very light, inert gas. Rises fast and gathers at the top. It never burns or reacts.

- **State:** Gas, 0.18 kg/m³
- **In air:** Rises (lighter than air)

With other elements (44 interact):

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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Propane

A fuel gas, heavier than air. Sinks and pools in low places. Its vapour catches from any flame and burns hot into steam.

- **State:** Gas, 1.88 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Burns:** from 470 °C in air, 0.2 s per cell, leaves steam
- **Flash point:** -104 °C: above it, flames spread across it

With other elements (48 interact):

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

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Hydrogen, Methane, TNT, Glass, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Chlorine

A poisonous yellow-green gas, very heavy. Sinks and pools low. It kills plants and turns water it touches into acid.

- **State:** Gas, 3.2 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **In water:** dissolves and turns the water into acid
- **Poisons:** living things it touches: they wither

With other elements (49 interact):

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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Sulfur dioxide, Dry ice, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sulfur dioxide

A choking gas, much heavier than air. Sinks and pools low. It turns water it touches into acid and kills plants.

- **State:** Gas, 2.6 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **In water:** dissolves and turns the water into acid
- **Poisons:** living things it touches: they wither

With other elements (49 interact):

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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Dry ice, C4, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dry ice

Frozen carbon dioxide, very cold. Stays put and turns straight into gas without melting, chilling everything nearby.

- **State:** Solid, 1,560 kg/m³
- **Starts at:** -79 °C
- **Sublimes:** at -78 °C, into carbon dioxide

With other elements (12 interact):

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

No direct interaction with: Air, Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Baking soda

A mild white powder and a base. Falls and piles. Acid makes it fizz into carbon dioxide, and it dissolves a little in water.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Dissolves in:** water, up to 20% of a cell; boiling leaves it as crystals

With other elements (24 interact):

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

No direct interaction with: Air, Wall, Sand, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### C4

A putty-like plastic explosive. Stays put. A flame alone will not set it off, but a spark or great heat does, with a huge blast.

- **State:** Solid, 1,600 kg/m³
- **Explodes:** from 900 °C or a flame; blast radius 6 cells
- **A flame:** will not light it; it needs 900 °C or a spark
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (6 interact):

- **Air:** C4 explodes at 900 °C; it needs no air.
- **Lava:** Lava (1,200 °C) can set c4 on fire (it ignites at 900 °C).
- **Acid:** Acid eats c4: acidity 0.8 beats hardness 0.3.
- **Oxygen:** C4 explodes at 900 °C; it needs no air. Oxygen makes burning c4 hotter and faster.
- **Molten copper:** Molten copper (1,200 °C) can set c4 on fire (it ignites at 900 °C).
- **Molten gold:** Molten gold (1,150 °C) can set c4 on fire (it ignites at 900 °C).

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Grass seed

Tiny pale seeds, a light powder. Falls and sinks in water. On damp soil it sprouts into a short tuft of grass.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 120 cells/s
- **Burns:** from 250 °C in air, 0.67 s per cell, leaves ash
- **Grows:** into grass on damp soil (wet dirt or sand), even under a puddle

With other elements (27 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Grass

Short living blades. Stays put and drinks from damp soil. Dried out it withers into dry plant, and it burns easily.

- **State:** Solid, 600 kg/m³
- **Burns:** from 220 °C in air, 0.67 s per cell, leaves ash
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (14 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acorn

A heavy brown seed, a powder. Falls and sinks in water. On damp soil it sprouts into a tall, branching tree.

- **State:** Powder, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Burns:** from 260 °C in air, 1 s per cell, leaves ash
- **Grows:** into tree on damp soil (wet dirt or sand), even under a puddle

With other elements (27 interact):

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

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Honey, Bleach, Lye, Dry ice, Baking soda, C4, Grass seed, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Tree

A living woody trunk. Grows tall and branches, drinking from damp soil and putting out leaves. Dead and dry, it is plain wood.

- **State:** Solid, 750 kg/m³
- **Burns:** from 300 °C in air, 2.5 s per cell, leaves ash
- **Leaves:** grows leaves beside its branches
- **Lives:** on water drawn from damp soil; dried out, it withers into wood
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (14 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Leaves

Living green leaves on a tree. Stay put and take water from the branch. Dried out they wither, and they burn easily.

- **State:** Solid, 500 kg/m³
- **Burns:** from 230 °C in air, 0.5 s per cell, leaves ash
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (14 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Flower

A bright bloom at the tip of a plant. Stays put and takes water from the stem. Dried out it withers, and it burns easily.

- **State:** Solid, 400 kg/m³
- **Burns:** from 220 °C in air, 0.33 s per cell, leaves ash
- **Lives:** on water drawn from damp soil; dried out, it withers into dry plant
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (14 interact):

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

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cloud

A drifting mass of droplets, a gas. Rises slowly and spreads. It rains, or snows when below freezing, until it runs dry.

- **State:** Gas, 1.1 kg/m³
- **In air:** Rises (lighter than air)
- **Rains:** water, or snow below 0 °C, until it runs dry

With other elements (44 interact):

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

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane, TNT, Glass, Spark, Wire, Battery, Plant, Dry plant, Brick, Concrete, Limestone, Gold, Aluminium, Lead, Sodium, Wax, Paper, Rubber, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, C4, Grass, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Heater

A hot plate. Stays put and holds itself at a steady high heat, warming whatever touches it.

- **State:** Solid, 3,000 kg/m³
- **Holds:** itself at 300 °C
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Cooler

A cold plate. Stays put and holds itself far below freezing, chilling whatever touches it.

- **State:** Solid, 3,000 kg/m³
- **Holds:** itself at -60 °C
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Clone

A copying block. Stays put. It learns the first element that touches it and keeps making more of it in the space around.

- **State:** Solid, 3,000 kg/m³
- **Copies:** the first element that touches it into the space around
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Void

A hole in the world. Stays put and deletes anything that touches it, except walls and other devices.

- **State:** Solid, 3,000 kg/m³
- **Deletes:** anything that touches it, except walls and devices
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Fan, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fan

A blower. Stays put and pushes a steady stream of air upwards, lifting gases, flames and light powders.

- **State:** Solid, 3,000 kg/m³
- **Blows:** air upwards above it
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Bulb, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Bulb

A light bulb filament. Stays put and carries charge; current heats it until it glows, and it fades when the power stops.

- **State:** Solid, 3,000 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Glows:** when current heats it, fading when the power stops
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Magnesium, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Magnesium

A light silvery metal. Stays put. Once very hot it burns with a blinding white flame, hot enough to set off thermite.

- **State:** Solid, 1,740 kg/m³
- **Burns:** from 650 °C in air, 2 s per cell, leaves ash
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.35 (acid stronger than this eats it)

With other elements (9 interact):

- **Air:** Magnesium burns: it catches fire at 650 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set magnesium on fire (it ignites at 650 °C).
- **Fire:** Magnesium catches from the flame touching it.
- **Acid:** Acid eats magnesium: acidity 0.8 beats hardness 0.35, giving off hydrogen.
- **Oxygen:** Magnesium burns: it catches fire at 650 °C next to oxygen (oxidiser 1). Oxygen makes burning magnesium hotter and faster.
- **Spark:** Magnesium catches from the flame touching it.
- **Molten copper:** Molten copper (1,200 °C) can set magnesium on fire (it ignites at 650 °C).
- **Molten gold:** Molten gold (1,150 °C) can set magnesium on fire (it ignites at 650 °C).
- **Molten aluminium:** Molten aluminium (750 °C) can set magnesium on fire (it ignites at 650 °C).

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Wood, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Potassium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Potassium

A very soft, light metal. Stays put. Water touching it makes it burst into lye and burning hydrogen, even more fiercely than sodium.

- **State:** Solid, 862 kg/m³
- **Conducts:** electric charge, warming as pulses pass
- **Hardness:** 0.05 (acid stronger than this eats it)

With other elements (2 interact):

- **Water:** Potassium bursts in water: it becomes lye and hydrogen, hot enough to set the hydrogen alight.
- **Acid:** Acid eats potassium: acidity 0.8 beats hardness 0.05, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Caramel, Marble, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Caramel

Melted, browned sugar. Oozes very slowly. It burns once it gets very hot.

- **State:** Liquid, 1,300 kg/m³
- **Starts at:** 190 °C
- **In liquids:** Sinks through liquids lighter than 1,300 kg/m³, floats on heavier ones
- **Falls:** up to 30 cells/s
- **Burns:** from 400 °C in air, 3.33 s per cell, leaves ash

With other elements (51 interact):

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

No direct interaction with: Wall, Stone, Wood, Ash, Iron, Sawdust, TNT, Glass, Wire, Battery, Seed, Plant, Dry plant, Brick, Concrete, Limestone, Quicklime, Slaked lime, Gold, Aluminium, Lead, Sodium, Charcoal, Paper, Rubber, Flour, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Marble

Polished white rock, a carbonate. Stays put. Acid fizzes it away into carbon dioxide, and great heat bakes it into quicklime.

- **State:** Solid, 2,700 kg/m³
- **Bakes:** at 900 °C into quicklime, giving off carbon dioxide; there is no way back
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Hardness:** 0.5 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats marble: acidity 0.8 beats hardness 0.5, fizzing out carbon dioxide.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Spark, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Petrol, Wax, Molten wax, Paper, Rubber, Flour, Thermite, Honey, Vinegar, Bleach, Lye, Liquid nitrogen, Nitrogen, Carbon dioxide, Helium, Propane, Chlorine, Sulfur dioxide, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Cloud, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Caramel, Chalk. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Chalk

Soft white carbonate, a powder. Falls and piles. Acid fizzes it away into carbon dioxide.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 150 cells/s
- **Fizzes:** into carbon dioxide when acid eats or neutralises it
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (26 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow, TNT, Gunpowder, Nitro, Glass, Shards, Wire, Battery, Mercury, Seed, Plant, Molten copper, Dry plant, Clay, Brick, Cement, Concrete, Limestone, Quicklime, Slaked lime, Gold, Molten gold, Aluminium, Molten aluminium, Lead, Molten lead, Rust, Sodium, Coal, Charcoal, Sulfur, Wax, Paper, Rubber, Flour, Thermite, Dry ice, Baking soda, C4, Grass seed, Grass, Acorn, Tree, Leaves, Flower, Heater, Cooler, Clone, Void, Fan, Bulb, Magnesium, Potassium, Marble. They still exchange heat by touch, and the heavier one ends up below when they can move.
