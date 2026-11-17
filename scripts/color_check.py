import sys
import numpy as np
from PIL import Image

def cells(path, grid=4):
    img = Image.open(path).convert("RGB").resize((320, 240)).convert("HSV")
    hsv = np.asarray(img).astype(float) / 255.0
    h, w = hsv.shape[:2]
    out = []
    for y in range(grid):
        for x in range(grid):
            c = hsv[y * h // grid:(y + 1) * h // grid, x * w // grid:(x + 1) * w // grid]
            out.append((c[..., 1].mean(), c[..., 2].mean()))
    return np.array(out)

ref = sys.argv[1]
ren = sys.argv[2]
d = cells(ren) - cells(ref)
for name, col in (("saturation", 0), ("brightness", 1)):
    worst = d[np.abs(d[:, col]).argmax(), col]
    print(f"{name}: mean delta {d[:, col].mean():+.3f}, worst cell {worst:+.3f}")
