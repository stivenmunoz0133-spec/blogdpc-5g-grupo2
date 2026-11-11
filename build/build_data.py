# -*- coding: utf-8 -*-
"""Genera blog/assets/js/data.js a partir de los archivos reales (VOSviewer, análisis, simulador)."""
import json, runpy, os
import pandas as pd

R = '/home/claude/ABET_5G/'
C = runpy.run_path(R + 'blog/build/contenido.py')
T = runpy.run_path(R + 'analisis/textos.py')

m = pd.read_csv(R + 'datos/map_file_final.txt', sep='\t', encoding='utf-8-sig')
m.columns = ['id', 'label', 'x', 'y', 'cl', 'links', 'tls', 'occ', 'year', 'cit', 'ncit']
d = pd.read_csv(R + 'analisis/200_enlaces.csv')
el = pd.read_csv(R + 'analisis/terminos_eliminados.csv')
tend = json.load(open(R + 'analisis/tendencias.json'))
k = pd.read_csv(R + 'minicaso/resultados/kpis.csv')
val = pd.read_csv(R + 'minicaso/resultados/validacion.csv')
top = json.load(open(R + 'analisis/top_citados.json'))

tot = int(m.occ.sum())
clusters = []
for c in (1, 2, 3):
    g = m[m.cl == c]
    clusters.append(dict(id=c, nombre=T['CLUSTERS'][c]['nombre'], color=T['CLUSTERS'][c]['color'],
                         n=int(len(g)), occ=int(g.occ.sum()),
                         texto=T['CLUSTERS'][c]['texto'].format(n=len(g), occ_pct=round(100 * g.occ.sum() / tot, 1)),
                         top=g.sort_values('occ', ascending=False).label.head(12).tolist()))

palabras = []
for i, w in enumerate(d.palabra.unique(), 1):
    g = d[d.palabra == w]; r = m[m.label == w].iloc[0]
    vals = dict(occ=r.occ, links=r.links, tls=r.tls, pct=round(100 * g.fuerza.sum() / r.tls, 1),
                t1=g.enlace.iloc[0], f1=g.fuerza.iloc[0], t10=g.enlace.iloc[-1], f10=g.fuerza.iloc[-1])
    palabras.append(dict(n=i, palabra=w, cluster=int(r.cl), occ=int(r.occ), links=int(r.links), tls=int(r.tls),
                         anio=round(float(r.year), 2), citas=round(float(r.cit), 2),
                         img=f'assets/img/redes/{i:02d}_{w.replace(" ", "_")}.webp',
                         enlaces=[dict(t=e, c=int(cc), f=int(f)) for e, cc, f in zip(g.enlace, g.cluster_enlace, g.fuerza)],
                         analisis=T['PALABRAS'][w]['p'].format(**vals), conclusion=T['PALABRAS'][w]['c'].format(**vals)))

terminos = [dict(t=r.label, c=int(r.cl), o=int(r.occ), l=int(r.links), s=int(r.tls), x=round(r.x, 4), y=round(r.y, 4))
            for r in m.itertuples()]

kb = k.rename(columns={"cumple_obj_%": "cumple"})
mc = [dict(esc=r.escenario, rho=round(r.carga_total, 2), pol=r.politica, serv=r.servicio,
           media=round(r.lat_media_ms, 4), p99=round(r.lat_p99_ms, 4),
           p99999=None if pd.isna(r.lat_p99_999_ms) else round(r.lat_p99_999_ms, 4),
           jitter=round(r.jitter_ms, 4), thr=round(r.throughput_mbps, 3), bler=round(r.bler_obs, 5),
           cumple=round(r.cumple, 4), n=int(r.paquetes)) for r in kb.itertuples()]

DATA = dict(
    kpi=dict(docs=20000, articulos=10048, ponencias=9952, terminos_ini=318755, umbral=168, pasan=498,
             relevancia=299, finales=172, eliminados=int(len(el)), clusters=3, enlaces=13116, tls=534855,
             analisis=200, thesaurus=38),
    clusters=clusters, palabras=palabras, terminos=terminos,
    eliminados=[dict(t=r['Término'], o=int(r.Ocurrencias), c=r.Criterio.split(' (')[0]) for _, r in el.iterrows()],
    tendencias=tend, minicaso=mc,
    validacion=[dict(rho=r.rho_embb, caso=r.politica, serv=r.servicio, sim=round(r.T_sim_ms, 4),
                     teo=round(r.T_teoria_ms, 4), err=round(r['error_%'], 2)) for _, r in val.iterrows()],
    citados=[dict(a=t['Authors'], t=t['Title'], y=t['Year'], s=t['Source title'], c=int(t['Cited by']), doi=t['DOI'])
             for t in top if any(x in (t['Title'] or '').lower() for x in
                                 ('antenna', 'isac', 'wireless', '6g', 'vanet', 'channel coding', 'source-channel'))],
    glosario=C['GLOSARIO'], entradas=C['ENTRADAS'], equipo=C['EQUIPO'], plan=C['PLAN'], reflexion=C['REFLEXION'],
    lecciones=C['LECCIONES'], uso_ia=C['USO_IA'], faq=C['FAQ'], quiz=C['QUIZ'], referencias=C['REFERENCIAS'],
)
os.makedirs(R + 'blog/assets/js', exist_ok=True)
with open(R + 'blog/assets/js/data.js', 'w', encoding='utf-8') as f:
    f.write('/* Datos generados por build/build_data.py a partir de los archivos de VOSviewer y del simulador. */\n')
    f.write('window.DATA = ' + json.dumps(DATA, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('ok', os.path.getsize(R + 'blog/assets/js/data.js') // 1024, 'KB; citados', len(DATA['citados']))
