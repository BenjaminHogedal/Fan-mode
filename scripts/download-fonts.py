"""Hent og selvhost de tre Google Fonts; kræver kun netværk ved regenerering."""
import pathlib
import re
import urllib.request
root = pathlib.Path(__file__).resolve().parents[1] / 'public' / 'fonts'
root.mkdir(parents=True, exist_ok=True)
fonts = [('Bebas+Neue:wght@400', 'bebas-neue', 'bebasneue'), ('Space+Grotesk:wght@300..700', 'space-grotesk', 'spacegrotesk')]
fonts += [(f'Barlow+Condensed:wght@{weight}', f'barlow-condensed-{weight}', 'barlowcondensed') for weight in [500, 600, 700]]
for family, filename, license_dir in fonts:
    req = urllib.request.Request('https://fonts.googleapis.com/css2?family=' + family + '&display=swap', headers={'User-Agent': 'Mozilla/5.0'})
    css = urllib.request.urlopen(req).read().decode()
    url = re.findall(r'url\((https://[^)]+)\)', css)[-1]
    extension = '.woff2' if 'woff2' in url else '.ttf'
    (root / (filename + extension)).write_bytes(urllib.request.urlopen(url).read())
    license_path = root / (license_dir + '-OFL.txt')
    if not license_path.exists():
        license_path.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/' + license_dir + '/OFL.txt').read())
    print(filename + extension)
