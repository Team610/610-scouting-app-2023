import random
import json

data = []

N_ROUNDS = 30
for i in range(N_ROUNDS):
    teams = random.sample(range(1, 21), 6)
    cp = lambda : random.randint(0, 2)
    climb_pts = [cp(), cp(), cp(), cp(), cp(), cp()]
    for a, team in enumerate(teams):
        m = {}
        m['team'] = team
        m['match'] = i
        m['autoClimb'] = cp()
        m['teleopClimb'] = climb_pts[a]
        m['numPartners'] = sum([x for x in climb_pts[0:3] if x > 0]) if a < 3 else sum([x for x in climb_pts[3:6] if x > 0])
        cycle_count = random.randint(1, 5)
        auto_cycles = random.randint(0, 2)
        cycles = []
        blue_pos = range(27)
        red_pos = range(27)
        for j in range(cycle_count):
            t = {}
            t['x'] = random.randint(0, 90)
            t['y'] = random.randint(0, 90)
            t['teleop'] = False if j < auto_cycles else True
            t['scoringPosition'] = blue_pos.pop(random.randint(0, len(blue_pos) - 1)) if a < 3 else red_pos.pop(random.randint(0, len(red_pos) - 1))
            cycles.append(t)
        m['cycles'] = cycles
        data.append(m)

with open("data/sampleMatch.json",'w') as fw:
    json.dump(data,fw) 