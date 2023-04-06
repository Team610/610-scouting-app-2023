import random
import json

data = []

N_ROUNDS = 30
for i in range(N_ROUNDS):
    teams = random.sample(range(1, 21), 6)
    cp = lambda : random.randint(0, 2)
    ranBoolean = lambda : random.randint(0,1)
    climb_pts = [cp(), cp(), cp(), cp(), cp(), cp()]
    for a, team in enumerate(teams):
        m = {}
        m['team'] = team
        m['match'] = str(i)
        m['autoClimb'] = cp()
        m['teleopClimb'] = climb_pts[a]
        m['numPartners'] = sum([x for x in climb_pts[0:3] if x > 0]) if a < 3 else sum([x for x in climb_pts[3:6] if x > 0])
        m['park'] = ranBoolean() == 1
        m['mobility'] = ranBoolean() == 1
        cycle_count = random.randint(1, 5)
        auto_cycles = random.randint(0, 2)
        cycles = []
        blue_pos = list(range(27))
        red_pos = list(range(27))
        for j in range(cycle_count):
            t = {}
            t['teleop'] = False if j < auto_cycles else True
            t['substation'] = random.choice(["red bottom", "red middle", "red top", "blue bottom", "blue middle", "blue top", "shelf", "gate", "floor"])
            t['level'] = random.randint(0, 3)
            t['link'] = ranBoolean() == 1
            t['object'] = "cube" if random.randint(0, 2) == 0 else "cone"
            cycles.append(t)
        m['cycles'] = cycles
        m['enemies'] = [teams[x] for x in [3, 4, 5]] if a < 3 else [teams[x] for x in [0, 1, 2]]
        m['defended'] = []
        for i in range(random.randint(0, 2)):
            m['defended'].append({"team": str(random.choice(m['enemies'])), "time": random.randint(0, 10)})
        m['allies'] = [teams[x] for x in [3, 4, 5] if x != a] if a > 2 else [teams[x] for x in [0, 1, 2] if x != a]
        data.append(m)

with open("data/sampleMatch.json",'w') as fw:
    json.dump(data,fw) 