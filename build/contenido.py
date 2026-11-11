# -*- coding: utf-8 -*-
"""Contenido editorial del blog (textos propios del Grupo 2). Las cifras se insertan desde los datos."""

GLOSARIO = {
 "5G": "Quinta generación de redes móviles. Ofrece mayor velocidad, menor latencia y más dispositivos conectados que 4G.",
 "eMBB": "Enhanced Mobile Broadband: banda ancha móvil mejorada. Es el servicio de 5G para video, descargas y navegación a alta velocidad.",
 "URLLC": "Ultra-Reliable Low-Latency Communications: comunicaciones ultraconfiables y de baja latencia. Exige entregar paquetes pequeños en menos de 1 ms con 99,999 % de éxito.",
 "mMTC": "Massive Machine-Type Communications: conexión masiva de dispositivos sencillos (sensores, medidores) con poco consumo.",
 "latencia": "Tiempo que tarda un paquete de datos en llegar de un punto a otro de la red. Se mide en milisegundos (ms).",
 "jitter": "Variación de la latencia entre paquetes. Un jitter alto hace que la comunicación sea irregular.",
 "throughput": "Cantidad de datos que se entregan con éxito por unidad de tiempo, por ejemplo en Mbit/s.",
 "BLER": "Block Error Rate: fracción de bloques de datos que llegan con errores y deben retransmitirse.",
 "SNR": "Signal-to-Noise Ratio: relación entre la potencia de la señal y la del ruido. A mayor SNR, menos errores.",
 "MIMO": "Multiple-Input Multiple-Output: uso de varias antenas en el transmisor y el receptor para enviar varios flujos de datos a la vez.",
 "mmWave": "Ondas milimétricas: frecuencias muy altas (decenas de GHz) que dan mucho ancho de banda pero tienen poco alcance.",
 "network slicing": "Segmentación de red: dividir una misma red física en varias redes virtuales («rebanadas»), cada una con garantías propias.",
 "edge computing": "Computación en el borde: procesar los datos cerca del usuario (en la antena o la central) en lugar de en una nube lejana.",
 "IoT": "Internet de las cosas: objetos cotidianos y máquinas conectados a internet que envían y reciben datos.",
 "HARQ": "Hybrid Automatic Repeat reQuest: mecanismo que retransmite y combina bloques con error. Mejora la confiabilidad a costa de latencia.",
 "slot": "Intervalo de tiempo de la rejilla de 5G NR (14 símbolos OFDM). Con 30 kHz de separación de subportadora dura 0,5 ms.",
 "mini-slot": "Fragmento de slot de 2, 4 o 7 símbolos que permite transmitir mensajes URLLC sin esperar al slot completo.",
 "OFDM": "Orthogonal Frequency-Division Multiplexing: técnica que divide el canal en muchas subportadoras estrechas. Es la base de 4G y 5G.",
 "VOSviewer": "Software gratuito de la Universidad de Leiden para construir y visualizar mapas bibliométricos de co-ocurrencia.",
 "Scopus": "Base de datos de resúmenes y citas de literatura científica revisada por pares, de Elsevier.",
 "co-ocurrencia": "Aparición conjunta de dos términos en un mismo documento. Es la base de los enlaces del mapa.",
 "fuerza de asociación": "Número de documentos en que dos términos aparecen juntos. Es el grosor del enlace en VOSviewer.",
 "clúster": "Grupo de términos que aparecen juntos con más frecuencia entre sí que con el resto. VOSviewer lo pinta de un color.",
 "apropiación": "Preemption: en 5G NR, interrumpir una transmisión eMBB en curso para enviar de inmediato un paquete URLLC.",
 "percentil 99": "Valor por debajo del cual queda el 99 % de las mediciones. Muestra el peor caso típico, no el promedio.",
}

ENTRADAS = [  # organización cronológica (entradas secuenciales del trabajo)
 ("2026-11-05", "Planeación", "Lectura de la guía E1 y de los anexos, pregunta guía, roles y cronograma.", "#plan"),
 ("2026-11-08", "Búsqueda en Scopus", "Cadena \"5G\", filtros 2016–2025 y exportación de 20 000 registros.", "#metodologia"),
 ("2026-11-11", "Mapa en VOSviewer", "Umbral de 168 ocurrencias (498 términos), depuración y mapa de 172 términos.", "#mapa"),
 ("2026-11-11", "Análisis de 200 enlaces", "Teorema ZamoraCluster: 20 palabras × 10 enlaces, con narrativas.", "#analisis"),
 ("2026-11-11", "Mini-caso técnico", "Simulación de latencia eMBB vs URLLC con tres políticas de scheduler.", "#minicaso"),
 ("2026-11-11", "Reflexión", "Qué aprendimos, qué sesgos encontramos y cómo lo haríamos mejor.", "#reflexion"),
]

EQUIPO = [
 ("Stiven Muñoz", "2224110", "Responsable de búsqueda", "Cadena en Scopus, criterios de inclusión y exclusión, VOSviewer, depuración de términos y análisis bibliométrico (ID1 e ID2)."),
 ("Minuk Lee", "220408", "Responsable del mini-caso", "Planteamiento, código en Python, validación analítica, resultados y discusión del mini-caso (ID3)."),
 ("Elkin Largo", "182334", "Responsable de divulgación", "Blog, video, referencias IEEE e integración del informe en Word (ID5 y Anexo B)."),
]

PLAN = {
 "pregunta": "¿Cuáles son las líneas de investigación que dominan hoy la literatura sobre 5G y, en particular, qué condiciones permiten que una misma red ofrezca a la vez banda ancha (eMBB) y comunicaciones ultraconfiables de baja latencia (URLLC)? Nos interesa porque es el punto en que la teoría de comunicaciones digitales del curso (modulación, BER, SNR, capacidad) se convierte en decisiones de diseño de redes reales.",
 "estrategias": [
   "Búsqueda en Scopus (vía biblioteca virtual UIS) con la cadena del Anexo A, filtros 2016–2025, artículos y ponencias; IEEE Xplore y ScienceDirect para complementar.",
   "Mapa de co-ocurrencia en VOSviewer (título y resumen, conteo binario), thesaurus de sinónimos y depuración manual con criterios explícitos.",
   "Regla ZamoraCluster para repartir 200 enlaces entre clústeres; tablas de fuerza de asociación y narrativas por palabra y por clúster.",
   "Mini-caso reproducible en Python, validado contra fórmulas de teoría de colas.",
   "Bitácora compartida de decisiones y uso declarado de asistentes de IA.",
 ],
 "cronograma": [("5 nov", "Lectura de la guía, plan y roles"), ("8 nov", "Búsqueda y exportación en Scopus"), ("10–11 nov", "VOSviewer, depuración y análisis de 200 enlaces"), ("11 nov", "Mini-caso"), ("11–14 nov", "Blog, video, informe Word y reflexión")],
 "riesgos": [
   ("El límite de exportación de Scopus (20 000 registros) sesga la muestra hacia lo más reciente", "Declararlo como limitación; alternativa: exportar por rangos de año."),
   ("Términos genéricos o ruidosos en el mapa", "Thesaurus y tabla de eliminados con criterio."),
   ("Errores de interpretación de la guía (umbral de VOSviewer)", "Releer el Anexo A y verificar con capturas."),
   ("Cifras inventadas o mal copiadas", "Todas las cifras salen de scripts sobre los archivos de VOSviewer y del simulador."),
 ],
}

REFLEXION = [
 ("Estrategias que funcionaron",
  "Lo que más nos sirvió fue convertir cada paso de la guía en un archivo verificable. La cadena de búsqueda, el thesaurus, la lista de términos eliminados con su criterio, los archivos de mapa y red de VOSviewer y el código del simulador quedaron guardados. Así, cada cifra del blog se puede rastrear hasta un dato. También funcionó leer el mapa de afuera hacia adentro: primero los clústeres, luego las palabras más grandes y al final los enlaces. Eso nos dio un esquema antes de entrar en detalle. Por último, validar el simulador contra fórmulas cerradas de teoría de colas nos obligó a entender el modelo, en lugar de confiar en que «la gráfica se ve bien»."),
 ("Obstáculos y cómo los resolvimos",
  "El primer mapa estaba mal planteado: entendimos el umbral del Anexo A como «mínimo 495 ocurrencias», cuando lo que pide es elegir el mínimo de ocurrencias con el que pasen unos 500 términos. Además, el texto de la ventana de VOSviewer no se actualiza hasta confirmar el valor, y la captura mostraba la cifra del valor por defecto. Lo corregimos rehaciendo el mapa: 168 ocurrencias, 498 términos. El segundo obstáculo fue que Scopus exporta como máximo 20 000 registros, así que solo quedaron documentos de 2024 a 2027. Lo declaramos como limitación. El tercero fue la depuración: 127 de los 299 términos eran genéricos, unidades o variantes. Si no se quitan, el análisis termina hablando de *approach* o *model* en lugar de 5G."),
 ("Sesgos identificados",
  "Encontramos tres. (1) De muestra: con el tope de exportación, el corpus representa sobre todo 2025–2026 y no la evolución de 2016–2025. (2) De cadena: buscar solo \"5G\" trae artículos de otras áreas (por ejemplo, materiales absorbentes de microondas que solo mencionan la banda 5G). Una cadena más específica, como la del Anexo A con PHY, MAC o RAN, reduciría ese ruido. (3) De interpretación: elegir 20 palabras «relevantes» es una decisión nuestra. Para hacerla más objetiva, usamos las ocurrencias como primer criterio y documentamos la justificación."),
 ("Cómo verificamos la calidad de la información",
  "Contrastamos los requisitos técnicos (1 ms para URLLC, 4 ms para eMBB, 99,999 % para 32 bytes) con el informe ITU-R M.2410 y con revisiones académicas. Verificamos las cifras del mapa contra los archivos exportados por VOSviewer con scripts, no copiándolas a mano. El simulador se validó contra la teoría, con un error mediano de 0,55 %. Las referencias tienen DOI o enlace oficial."),
 ("Cómo aplicamos lo aprendido en el mini-caso y qué mejoraríamos",
  "El análisis mostró que el enlace más fuerte de *urllc* es *embb*, y que alrededor aparecen *reliability*, *network slicing* y *resource allocation*. Eso nos llevó a preguntar qué política de *scheduler* permite que convivan. La respuesta (apropiación más una codificación robusta) conecta los tres clústeres: red (scheduler), capa física (BLER, SNR) y radio (mini-slots). Como mejora, obtendríamos la BLER de curvas reales BLER–SNR y modelaríamos la pérdida de los recursos eMBB interrumpidos."),
 ("Qué haremos diferente la próxima vez",
  "Hacer una búsqueda piloto pequeña y revisar 20 o 30 resúmenes antes de exportar, para ajustar la cadena. Confirmar con el profesor cualquier parámetro ambiguo antes de producir resultados. Y exportar por rangos de año desde el principio cuando el número de resultados supere el límite de la base de datos."),
]

LECCIONES = [
 "Formular una pregunta guía antes de buscar ahorra horas de lectura sin rumbo.",
 "Dejar trazabilidad (datos, scripts, decisiones) convierte un trabajo en algo que otros pueden revisar y reproducir.",
 "Validar un modelo contra un caso conocido antes de usarlo para decidir.",
 "Leer la guía con la misma atención que un requisito técnico: un parámetro mal interpretado invalida todo lo que viene después.",
 "Usar la IA como asistente que se verifica, no como fuente.",
]

USO_IA = ("En este trabajo usamos un asistente de IA (Claude, de Anthropic) para organizar el flujo de trabajo, automatizar pasos repetitivos "
          "(capturas de VOSviewer, conteos sobre el CSV), proponer borradores de redacción y programar el sitio y el simulador. "
          "Todas las cifras provienen de los archivos de Scopus y VOSviewer o de la ejecución del simulador, y el grupo las revisó. "
          "Las decisiones de interpretación y las conclusiones son responsabilidad del Grupo 2. El chatbot de este blog no usa un modelo "
          "de lenguaje externo: responde con reglas a partir del contenido publicado, así que no expone claves ni envía datos de los visitantes.")

FAQ = [
 (["que es 5g","5g","quinta generacion"], "5G es la quinta generación de redes móviles. Además de más velocidad (eMBB), permite comunicaciones de muy baja latencia (URLLC) y conectar millones de dispositivos (mMTC).", "#que-es"),
 (["urllc","baja latencia","ultraconfiable"], "URLLC son las comunicaciones ultraconfiables y de baja latencia de 5G. Según ITU-R M.2410 deben entregar paquetes de 32 bytes en 1 ms con 99,999 % de éxito.", "#que-es"),
 (["embb","banda ancha"], "eMBB es la banda ancha móvil mejorada: el servicio de alta velocidad de 5G. Su requisito de latencia en plano de usuario es de 4 ms.", "#que-es"),
 (["mmtc","masivo","sensores"], "mMTC es la conexión masiva de dispositivos sencillos, como sensores y medidores.", "#que-es"),
 (["cuantos documentos","documentos","scopus","corpus"], "Analizamos 20 000 documentos de Scopus (10 048 artículos y 9 952 ponencias) recuperados con la cadena \"5G\".", "#metodologia"),
 (["cadena","busqueda","filtros"], "La cadena fue \"5G\", con años 2016–2025 y tipos artículo y ponencia de conferencia. Por el tope de exportación de Scopus, el CSV quedó con documentos de 2024 a 2027.", "#metodologia"),
 (["umbral","ocurrencias","minimo"], "Elegimos un mínimo de 168 ocurrencias, con el que 498 términos superan el umbral, el valor más cercano a 500 que pide el Anexo A.", "#metodologia"),
 (["depuracion","eliminados","eliminaste","eliminaron"], "De 299 términos seleccionados por relevancia eliminamos 127: 90 por generalidad, 15 por ruido, 14 por irrelevancia y 8 por redundancia. El mapa final tiene 172 términos.", "#metodologia"),
 (["thesaurus","sinonimos"], "Usamos un thesaurus con 38 equivalencias, por ejemplo millimeter wave → mmwave y unmanned aerial vehicle → uav.", "#metodologia"),
 (["cluster","clusteres","grupos"], "El mapa tiene 3 clústeres: red y servicios (95 términos), antenas y radiofrecuencia (51) y capa física (26).", "#mapa"),
 (["zamoracluster","teorema","200 enlaces","20 palabras"], "Con 3 clústeres, W = ⌊20/3⌋ = 6 y R = 20, así que los clústeres 1 y 2 llevan 7 palabras y el 3 lleva 6: 20 palabras × 10 enlaces = 200 enlaces.", "#analisis"),
 (["enlace mas fuerte","mas fuerte","fuerza"], "El enlace más fuerte de todo el mapa es antenna–gain, con fuerza 1 591. En el clúster de red destaca urllc–embb (277).", "#analisis"),
 (["antena","antenna"], "antenna es el término con mayor fuerza total del mapa (27 551) y el centro del clúster de antenas y radiofrecuencia.", "#analisis"),
 (["iot","internet de las cosas"], "iot aparece en 2 497 documentos. Su enlace más fuerte es con architecture (544) y destaca su relación con security (446).", "#analisis"),
 (["snr","senal a ruido"], "snr es una palabra puente: 7 de sus 10 enlaces más fuertes son con otros clústeres. Su relación con bit error rate (217) es la clásica de la capa física.", "#analisis"),
 (["tendencia","tendencias","crece","6g"], "Dentro del corpus, la proporción de documentos 5G que mencionan 6G subió de 13,8 % (2024) a 22,1 % (2026), y la de IA de 20,2 % a 23,4 %.", "#tendencias"),
 (["mini caso","minicaso","simulacion","simulador"], "El mini-caso simula una celda 5G con eMBB y URLLC y tres políticas (FIFO, prioridad y apropiación). Solo la apropiación con BLER 10⁻⁵ cumple 1 ms con 99,999 %.", "#minicaso"),
 (["fifo"], "Con FIFO, la latencia p99 de URLLC supera 1 ms desde una carga de 0,52 y llega a 6,8 ms con carga 0,92.", "#minicaso"),
 (["apropiacion","preemption","preem"], "La apropiación permite que un paquete URLLC interrumpa al eMBB en curso. En la simulación, ningún paquete URLLC superó 1 ms y a eMBB le costó como máximo 0,03 ms de latencia media.", "#minicaso"),
 (["validacion","teoria de colas","valido"], "El simulador se validó contra Pollaczek–Khinchine, Cobham, la fórmula de prioridad apropiativa y el percentil 99 de M/M/1. Error mediano: 0,55 %.", "#minicaso"),
 (["bler","error de bloque"], "La BLER es la fracción de bloques con error. eMBB suele trabajar con 10 % y URLLC necesita 10⁻⁵. Con BLER 0,1, ni la apropiación alcanza el 99,999 %.", "#minicaso"),
 (["vosviewer"], "VOSviewer es un software de la Universidad de Leiden para mapas bibliométricos. Usamos la versión 1.6.21 con título y resumen y conteo binario.", "#metodologia"),
 (["equipo","integrantes","quienes"], "Grupo 2: Stiven Muñoz (búsqueda), Minuk Lee (mini-caso) y Elkin Largo (divulgación).", "#equipo"),
 (["referencias","fuentes","bibliografia","ieee"], "Las referencias están en formato IEEE en la sección Fuentes consultadas, con DOI o enlace oficial.", "#referencias"),
 (["ia","inteligencia artificial","chatgpt","claude"], "Declaramos el uso de un asistente de IA para automatizar pasos y redactar borradores. Las cifras salen de los datos y el grupo las revisó. Más detalles en la sección de reflexión.", "#reflexion"),
 (["limitacion","limitaciones","sesgo"], "Las principales limitaciones son el tope de 20 000 registros de Scopus (sesgo hacia 2024–2027), el ruido de la cadena \"5G\" y las simplificaciones del simulador.", "#reflexion"),
 (["video","youtube","presentacion"], "La presentación oral en video está en la sección Video.", "#video"),
]

QUIZ = [
 ("¿Cuántos términos superaron el umbral de 168 ocurrencias en VOSviewer?", ["172", "299", "498", "318 755"], 2, "498 términos superaron el umbral; luego se eligieron 299 por relevancia y quedaron 172 tras la depuración."),
 ("¿Cuántos clústeres formó el mapa final?", ["2", "3", "5", "20"], 1, "Tres: red y servicios (rojo), antenas y radiofrecuencia (verde) y capa física (azul)."),
 ("¿Cuál es el enlace más fuerte de todo el mapa?", ["urllc–embb", "iot–security", "antenna–gain", "snr–bit error rate"], 2, "antenna–gain, con fuerza 1 591: ganancia es la primera métrica que se reporta al presentar una antena."),
 ("Según ITU-R M.2410, ¿cuál es el requisito de latencia en plano de usuario para URLLC?", ["1 ms", "4 ms", "10 ms", "20 ms"], 0, "1 ms para URLLC; para eMBB son 4 ms."),
 ("En el mini-caso, ¿qué política cumplió el 99,999 % de paquetes URLLC en menos de 1 ms?", ["FIFO", "Prioridad no apropiativa", "Apropiación con BLER 10⁻⁵", "Apropiación con BLER 0,1"], 2, "Solo la apropiación con una codificación robusta (BLER 10⁻⁵). Con BLER 0,1 falla cerca del 0,1 % de los paquetes."),
 ("¿Por qué el corpus solo tiene documentos de 2024 a 2027?", ["Porque 5G empezó en 2024", "Por el tope de exportación de 20 000 registros de Scopus", "Porque VOSviewer elimina años", "Por el thesaurus"], 1, "Scopus exporta como máximo 20 000 registros; al ordenar por fecha quedaron los más recientes. Lo declaramos como limitación."),
]

REFERENCIAS = [
 ("ITU-R, “Minimum requirements related to technical performance for IMT-2020 radio interface(s),” Report ITU-R M.2410-0, Nov. 2017.", "https://www.itu.int/pub/R-REP-M.2410-2017"),
 ("3GPP, “NR; Physical layer procedures for control,” TS 38.213.", "https://www.3gpp.org/DynaReport/38213.htm"),
 ("3GPP, “NR; Physical channels and modulation,” TS 38.211.", "https://www.3gpp.org/DynaReport/38211.htm"),
 ("3GPP, “Study on scenarios and requirements for next generation access technologies,” TR 38.913.", "https://www.3gpp.org/DynaReport/38913.htm"),
 ("N. J. van Eck and L. Waltman, “Software survey: VOSviewer, a computer program for bibliometric mapping,” <i>Scientometrics</i>, vol. 84, no. 2, pp. 523–538, 2010, doi: 10.1007/s11192-009-0146-3.", "https://doi.org/10.1007/s11192-009-0146-3"),
 ("L. Kleinrock, <i>Queueing Systems, Vol. 1: Theory</i>. New York, NY, USA: Wiley, 1975.", "https://www.wiley.com/"),
 ("L. Kleinrock, <i>Queueing Systems, Vol. 2: Computer Applications</i>. New York, NY, USA: Wiley, 1976.", "https://www.wiley.com/"),
 ("P. Popovski <i>et al.</i>, “Wireless access in ultra-reliable low-latency communication (URLLC),” <i>IEEE Trans. Commun.</i>, vol. 67, no. 8, pp. 5783–5801, 2019, doi: 10.1109/TCOMM.2019.2914652.", "https://doi.org/10.1109/TCOMM.2019.2914652"),
 ("M. Bennis, M. Debbah, and H. V. Poor, “Ultrareliable and low-latency wireless communication: Tail, risk, and scale,” <i>Proc. IEEE</i>, vol. 106, no. 10, pp. 1834–1853, 2018, doi: 10.1109/JPROC.2018.2867029.", "https://doi.org/10.1109/JPROC.2018.2867029"),
 ("Elsevier, “Scopus,” base de datos bibliográfica, consultada vía Biblioteca Virtual UIS, nov. 2026.", "https://www.scopus.com"),
 ("Z. Comas-González, I. Echeverri-Ocampo, R. Zamora-Musa, J. Vélez, R. Sarmiento, and M. Orellana, “Tendencias recientes de la educación virtual y su fuerte conexión con los entornos inmersivos,” <i>Revista Espacios</i>, vol. 38, no. 15, p. 4, 2017.", "https://www.revistaespacios.com/a17v38n15/17381504.html"),
 ("Universidad de Leiden, “VOSviewer – Visualizing scientific landscapes,” versión 1.6.21.", "https://www.vosviewer.com"),
]
