# Sandglass master list

Generated from the game code by `npm run master-list`. Do not edit by hand: change the element data in `src/sim/elements.ts` (or the rules in `src/sim/chem.ts`) and run the script again.

24 elements. Every pair of elements is listed below, in both directions, with what happens and why.

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
| Neutralisation | An acid touches a base | Both become water |

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
| Iron | solids | solid | 7,870 | 20 °C |  |  |  |
| Hydrogen | gases | gas | 0.09 | 20 °C |  |  | from 500 °C |
| Oxygen | gases | gas | 1.43 | 20 °C |  |  |  |
| Methane | gases | gas | 0.66 | 20 °C |  |  | from 540 °C |
| Alcohol | liquids | liquid | 789 | 20 °C |  |  | from 365 °C |
| Sawdust | powders | powder | 250 | 20 °C |  |  | from 260 °C |
| Salt | powders | powder | 2,160 | 20 °C |  |  |  |
| Sugar | powders | powder | 1,590 | 20 °C |  |  | from 350 °C |
| Dirt | powders | powder | 1,500 | 20 °C |  |  |  |
| Snow | powders | powder | 300 | -5 °C | melts at 0 °C → water |  |  |

## Elements

### Wall

An indestructible solid. Never moves. Nothing melts, burns or eats it; use it for containers and floors.

- **State:** Solid, 2,500 kg/m³
- **Hardness:** 1 (acid stronger than this eats it)

With other elements (0 interact):


No direct interaction with: Air, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sand

A fine, heavy powder. Falls, piles into slopes and sinks through lighter liquids. Very hard to melt or eat away.

- **State:** Powder, 1,600 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,600 kg/m³, rests on heavier ones
- **Falls:** up to 165 cells/s
- **Soaks up:** water, up to 30% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.95 (acid stronger than this eats it)

With other elements (10 interact):

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

No direct interaction with: Air, Wall, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Water

A runny liquid. Flows and settles flat. Boils into steam when hot, freezes into ice when cold, and cools what it touches.

- **State:** Liquid, 1,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,000 kg/m³, floats on heavier ones
- **Falls:** up to 165 cells/s
- **Boils:** at 100 °C, into steam
- **Freezes:** below 0 °C, into ice
- **Dissolves:** soluble powders (salt, sugar), up to each one’s limit; saltier is heavier

With other elements (18 interact):

- **Sand:** Sand soaks up water: it is porous and holds up to 30% water. Sand sinks through water (1,600 vs 1,000 kg/m³).
- **Oil:** Water sinks through oil (1,000 vs 900 kg/m³).
- **Ice:** Ice (-20 °C) is cold enough to freeze water into ice.
- **Steam:** Water falls through steam. Steam (150 °C) is hot enough to boil water into steam.
- **Lava:** Lava sinks through water (2,600 vs 1,000 kg/m³). Lava (1,200 °C) is hot enough to boil water into steam.
- **Gravel:** Gravel sinks through water (2,000 vs 1,000 kg/m³).
- **Fire:** Water falls through fire. Fire (850 °C) is hot enough to boil water into steam.
- **Smoke:** Water falls through smoke. Smoke (150 °C) is hot enough to boil water into steam.
- **Acid:** Acid sinks through water (1,100 vs 1,000 kg/m³).
- **Hydrogen:** Water falls through hydrogen.
- **Oxygen:** Water falls through oxygen.
- **Methane:** Water falls through methane.
- **Alcohol:** Water sinks through alcohol (1,000 vs 789 kg/m³).
- **Sawdust:** Sawdust soaks up water: it is porous and holds up to 60% water.
- **Salt:** Salt dissolves into water: water is a solvent and each cell holds up to 40% salt. Salt sinks through water (2,160 vs 1,000 kg/m³).
- **Sugar:** Sugar dissolves into water: water is a solvent and each cell holds up to 70% sugar. Sugar sinks through water (1,590 vs 1,000 kg/m³).
- **Dirt:** Dirt soaks up water: it is porous and holds up to 50% water. Dirt sinks through water (1,500 vs 1,000 kg/m³).
- **Snow:** Snow (-5 °C) is cold enough to freeze water into ice.

No direct interaction with: Air, Wall, Stone, Wood, Ash, Iron. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Oil

A thick, slow liquid. Floats on water. Burns into smoke once hot enough.

- **State:** Liquid, 900 kg/m³
- **In liquids:** Sinks through liquids lighter than 900 kg/m³, floats on heavier ones
- **Falls:** up to 120 cells/s
- **Burns:** from 250 °C in air, 4 s per cell, leaves smoke

With other elements (16 interact):

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

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ice

Frozen water, a cold solid. Stays put. Chills what it touches and melts back into water as it warms.

- **State:** Solid, 917 kg/m³
- **Starts at:** -20 °C
- **Melts:** at 0 °C, into water

With other elements (5 interact):

- **Water:** Ice (-20 °C) is cold enough to freeze water into ice.
- **Steam:** Ice (-20 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to melt ice into water.
- **Lava:** Ice (-20 °C) is cold enough to freeze lava into stone. Lava (1,200 °C) is hot enough to melt ice into water.
- **Fire:** Fire (850 °C) is hot enough to melt ice into water.
- **Smoke:** Smoke (150 °C) is hot enough to melt ice into water.

No direct interaction with: Air, Wall, Sand, Oil, Stone, Gravel, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Steam

Hot water vapour. Rises and spreads. Turns back into water as it cools, so it rains.

- **State:** Gas, 0.6 kg/m³
- **Starts at:** 150 °C
- **In air:** Rises (lighter than air)
- **Condenses:** below 100 °C, into water

With other elements (14 interact):

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

No direct interaction with: Air, Wall, Stone, Fire, Smoke, Wood, Iron, Hydrogen, Oxygen, Methane. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Lava

Molten rock, extremely hot. Flows slowly and glows. Sets fuel alight, boils water, and cools into stone (or gravel where nothing holds it up).

- **State:** Liquid, 2,600 kg/m³
- **Starts at:** 1,200 °C
- **In liquids:** Sinks through liquids lighter than 2,600 kg/m³
- **Falls:** up to 90 cells/s
- **Freezes:** below 1,000 °C, into stone

With other elements (17 interact):

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

No direct interaction with: Air, Wall, Sand, Ash, Iron, Salt, Dirt. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Stone

Solid rock. Stays put. Glows as it heats and melts back into lava.

- **State:** Solid, 2,600 kg/m³
- **Melts:** at 1,000 °C, into lava
- **Hardness:** 0.85 (acid stronger than this eats it)

With other elements (1 interact):

- **Lava:** Lava (1,200 °C) is hot enough to melt stone into lava.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Gravel, Fire, Smoke, Wood, Ash, Acid, Iron, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Gravel

Loose rock, a heavy powder. Falls and piles. Forms where lava sets with nothing under it, and melts back into lava.

- **State:** Powder, 2,000 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,000 kg/m³, rests on heavier ones
- **Falls:** up to 170 cells/s
- **Melts:** at 1,000 °C, into lava
- **Hardness:** 0.8 (acid stronger than this eats it)

With other elements (11 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Stone, Wood, Ash, Iron, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Fire

Loose flames. Rise and burn out quickly. Light anything flammable they touch; a lasting fire needs fuel and air.

- **State:** Energy, 0.3 kg/m³
- **Starts at:** 850 °C

With other elements (17 interact):

- **Sand:** Sand falls through fire.
- **Water:** Fire (850 °C) is hot enough to boil water into steam. Water falls through fire.
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

No direct interaction with: Air, Wall, Steam, Stone, Smoke, Iron, Oxygen. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Smoke

What burning leaves behind, a warm gas. Rises and drifts off the top. Does not feed fire, so it smothers flames in a closed space.

- **State:** Gas, 0.7 kg/m³
- **Starts at:** 150 °C
- **In air:** Rises (lighter than air)

With other elements (14 interact):

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

No direct interaction with: Air, Wall, Steam, Stone, Fire, Wood, Iron, Hydrogen, Oxygen, Methane. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Wood

A solid fuel. Stays put. Catches fire where it touches air once hot enough, and burns down to a little ash.

- **State:** Solid, 700 kg/m³
- **Burns:** from 300 °C in air, 2.5 s per cell, leaves ash
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (5 interact):

- **Air:** Wood burns: it catches fire at 300 °C next to air (oxidiser 0.21).
- **Lava:** Lava (1,200 °C) can set wood on fire (it ignites at 300 °C).
- **Fire:** Wood catches from the flame touching it.
- **Acid:** Acid eats wood: acidity 0.8 beats hardness 0.3.
- **Oxygen:** Wood burns: it catches fire at 300 °C next to oxygen (oxidiser 1). Oxygen makes burning wood hotter and faster.

No direct interaction with: Wall, Sand, Water, Oil, Ice, Steam, Stone, Gravel, Smoke, Ash, Iron, Hydrogen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Ash

A very light powder left by fire. Drifts as it falls. Floats on water.

- **State:** Powder, 600 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 45 cells/s
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (7 interact):

- **Steam:** Ash falls through steam.
- **Fire:** Ash falls through fire.
- **Smoke:** Ash falls through smoke.
- **Acid:** Acid eats ash: acidity 0.8 beats hardness 0.2.
- **Hydrogen:** Ash falls through hydrogen.
- **Oxygen:** Ash falls through oxygen.
- **Methane:** Ash falls through methane.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Lava, Stone, Gravel, Wood, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Acid

A corrosive liquid. Flows like water. Eats metal, wood and soft rock and is used up as it does; metal gives off hydrogen.

- **State:** Liquid, 1,100 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,100 kg/m³, floats on heavier ones
- **Falls:** up to 160 cells/s
- **Eats:** metal, rock and wood softer than 0.8, weakening as it fills

With other elements (19 interact):

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

No direct interaction with: Air, Wall, Ice, Stone, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Iron

A dense metal. Stays put and moves heat quickly. Acid eats it, giving off hydrogen.

- **State:** Solid, 7,870 kg/m³
- **Hardness:** 0.55 (acid stronger than this eats it)

With other elements (1 interact):

- **Acid:** Acid eats iron: acidity 0.8 beats hardness 0.55, giving off hydrogen.

No direct interaction with: Air, Wall, Sand, Water, Oil, Ice, Steam, Lava, Stone, Gravel, Fire, Smoke, Wood, Ash, Hydrogen, Oxygen, Methane, Alcohol, Sawdust, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Hydrogen

The lightest gas. Shoots upwards. Burns in a flash into steam when hot and touching air or oxygen.

- **State:** Gas, 0.09 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 500 °C in air, 0.1 s per cell, leaves steam

With other elements (16 interact):

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

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Methane. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Oxygen

A gas slightly heavier than air. Sinks and pools low. Makes fire burn hotter and use its fuel faster.

- **State:** Gas, 1.43 kg/m³
- **In air:** Sinks slowly (heavier than air)
- **Feeds fire:** strength 1 (air is 0.21)

With other elements (16 interact):

- **Sand:** Sand falls through oxygen.
- **Water:** Water falls through oxygen.
- **Oil:** Oxygen makes burning oil hotter and faster. Oil burns: it catches fire at 250 °C next to oxygen (oxidiser 1). Oil falls through oxygen.
- **Lava:** Lava falls through oxygen.
- **Gravel:** Gravel falls through oxygen.
- **Wood:** Oxygen makes burning wood hotter and faster. Wood burns: it catches fire at 300 °C next to oxygen (oxidiser 1).
- **Ash:** Ash falls through oxygen.
- **Acid:** Acid falls through oxygen.
- **Hydrogen:** Oxygen makes burning hydrogen hotter and faster. Hydrogen burns: it catches fire at 500 °C next to oxygen (oxidiser 1).
- **Methane:** Oxygen makes burning methane hotter and faster. Methane burns: it catches fire at 540 °C next to oxygen (oxidiser 1).
- **Alcohol:** Oxygen makes burning alcohol hotter and faster. Alcohol burns: it catches fire at 365 °C next to oxygen (oxidiser 1). Alcohol falls through oxygen.
- **Sawdust:** Oxygen makes burning sawdust hotter and faster. Sawdust burns: it catches fire at 260 °C next to oxygen (oxidiser 1). Sawdust falls through oxygen.
- **Salt:** Salt falls through oxygen.
- **Sugar:** Oxygen makes burning sugar hotter and faster. Sugar burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Sugar falls through oxygen.
- **Dirt:** Dirt falls through oxygen.
- **Snow:** Snow falls through oxygen.

No direct interaction with: Air, Wall, Ice, Steam, Stone, Fire, Smoke, Iron. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Methane

Natural gas, lighter than air. Rises. Burns hot into steam when it meets heat and air.

- **State:** Gas, 0.66 kg/m³
- **In air:** Rises (lighter than air)
- **Burns:** from 540 °C in air, 0.17 s per cell, leaves steam

With other elements (16 interact):

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

No direct interaction with: Wall, Ice, Steam, Stone, Smoke, Wood, Iron, Hydrogen. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Alcohol

A thin, light liquid. Floats on water. Catches fire easily and burns clean into steam.

- **State:** Liquid, 789 kg/m³
- **In liquids:** Floats on heavier ones
- **Falls:** up to 165 cells/s
- **Burns:** from 365 °C in air, 2 s per cell, leaves steam

With other elements (16 interact):

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

No direct interaction with: Wall, Ice, Stone, Wood, Ash, Iron, Sawdust, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sawdust

Fine wood dust, a very light powder. Drifts and floats on water. Catches fire easily and burns fast.

- **State:** Powder, 250 kg/m³
- **In liquids:** Rests on heavier ones
- **Falls:** up to 55 cells/s
- **Burns:** from 260 °C in air, 2.5 s per cell, leaves ash
- **Soaks up:** water, up to 60% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.1 (acid stronger than this eats it)

With other elements (10 interact):

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

No direct interaction with: Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Iron, Alcohol, Salt, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Salt

White crystals, a powder. Falls and piles. Dissolves into water, making it heavier; boiling the water leaves the salt behind.

- **State:** Powder, 2,160 kg/m³
- **In liquids:** Sinks through liquids lighter than 2,160 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Dissolves in:** water, up to 40% of a cell; boiling leaves it as crystals

With other elements (10 interact):

- **Water:** Salt dissolves into water: water is a solvent and each cell holds up to 40% salt. Salt sinks through water (2,160 vs 1,000 kg/m³).
- **Oil:** Salt sinks through oil (2,160 vs 900 kg/m³).
- **Steam:** Salt falls through steam.
- **Fire:** Salt falls through fire.
- **Smoke:** Salt falls through smoke.
- **Acid:** Salt sinks through acid (2,160 vs 1,100 kg/m³).
- **Hydrogen:** Salt falls through hydrogen.
- **Oxygen:** Salt falls through oxygen.
- **Methane:** Salt falls through methane.
- **Alcohol:** Salt sinks through alcohol (2,160 vs 789 kg/m³).

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Sugar, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Sugar

Sweet crystals, a powder. Falls and piles. Dissolves into water even more than salt does, and burns when hot.

- **State:** Powder, 1,590 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,590 kg/m³, rests on heavier ones
- **Falls:** up to 155 cells/s
- **Burns:** from 350 °C in air, 1.5 s per cell, leaves smoke
- **Dissolves in:** water, up to 70% of a cell; boiling leaves it as crystals
- **Hardness:** 0.2 (acid stronger than this eats it)

With other elements (12 interact):

- **Air:** Sugar burns: it catches fire at 350 °C next to air (oxidiser 0.21).
- **Water:** Sugar dissolves into water: water is a solvent and each cell holds up to 70% sugar. Sugar sinks through water (1,590 vs 1,000 kg/m³).
- **Oil:** Sugar sinks through oil (1,590 vs 900 kg/m³).
- **Steam:** Sugar falls through steam.
- **Lava:** Lava (1,200 °C) can set sugar on fire (it ignites at 350 °C).
- **Fire:** Sugar catches from the flame touching it. Sugar falls through fire.
- **Smoke:** Sugar falls through smoke.
- **Acid:** Acid eats sugar: acidity 0.8 beats hardness 0.2. Sugar sinks through acid (1,590 vs 1,100 kg/m³).
- **Hydrogen:** Sugar falls through hydrogen.
- **Oxygen:** Sugar burns: it catches fire at 350 °C next to oxygen (oxidiser 1). Sugar falls through oxygen. Oxygen makes burning sugar hotter and faster.
- **Methane:** Sugar falls through methane.
- **Alcohol:** Sugar sinks through alcohol (1,590 vs 789 kg/m³).

No direct interaction with: Wall, Sand, Ice, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Dirt, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Dirt

Earth, a heavy powder. Falls and piles. Soaks up a lot of water and turns into dark, sticky mud.

- **State:** Powder, 1,500 kg/m³
- **In liquids:** Sinks through liquids lighter than 1,500 kg/m³, rests on heavier ones
- **Falls:** up to 160 cells/s
- **Soaks up:** water, up to 50% of a cell; wet, it holds steeper slopes and will not burn
- **Hardness:** 0.3 (acid stronger than this eats it)

With other elements (10 interact):

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

No direct interaction with: Air, Wall, Sand, Ice, Lava, Stone, Gravel, Wood, Ash, Iron, Sawdust, Salt, Sugar, Snow. They still exchange heat by touch, and the heavier one ends up below when they can move.

### Snow

Loose frozen flakes, a very light powder. Drifts down and settles in soft piles. Melts into water as it warms.

- **State:** Powder, 300 kg/m³
- **Starts at:** -5 °C
- **In liquids:** Rests on heavier ones
- **Falls:** up to 35 cells/s
- **Melts:** at 0 °C, into water

With other elements (8 interact):

- **Water:** Snow (-5 °C) is cold enough to freeze water into ice.
- **Steam:** Snow falls through steam. Snow (-5 °C) is cold enough to condense steam into water. Steam (150 °C) is hot enough to melt snow into water.
- **Lava:** Snow (-5 °C) is cold enough to freeze lava into stone. Lava (1,200 °C) is hot enough to melt snow into water.
- **Fire:** Snow falls through fire. Fire (850 °C) is hot enough to melt snow into water.
- **Smoke:** Snow falls through smoke. Smoke (150 °C) is hot enough to melt snow into water.
- **Hydrogen:** Snow falls through hydrogen.
- **Oxygen:** Snow falls through oxygen.
- **Methane:** Snow falls through methane.

No direct interaction with: Air, Wall, Sand, Oil, Ice, Stone, Gravel, Wood, Ash, Acid, Iron, Alcohol, Sawdust, Salt, Sugar, Dirt. They still exchange heat by touch, and the heavier one ends up below when they can move.
