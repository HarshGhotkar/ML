from pathlib import Path
env_file = Path(".env.aws")
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            v = v.strip()
            has_q = v.startswith('"') or v.startswith("'") or v.endswith('"') or v.endswith("'")
            print("Key:", k, "| Length:", len(v), "| Prefix:", v[:4], "| HasQuotes:", has_q)
else:
    print(".env.aws not found")
