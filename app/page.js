"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Package, Plus, Search, Download, X, Check, Trash2, ArrowLeft, Image as ImageIcon, Upload, Sparkles, Building2, Layers, ListChecks, Loader2, AlertCircle, QrCode, Send, MessageCircle, Mail, Phone, Copy, ExternalLink, GitCompare, Link2, Link2Off, Award, BookOpen, TrendingUp } from 'lucide-react';

// Load jsQR dynamically from CDN (runtime doesn't support npm import)
let jsQRLib = null;
const loadJsQR = () => {
  if (jsQRLib) return Promise.resolve(jsQRLib);
  if (window.jsQR) { jsQRLib = window.jsQR; return Promise.resolve(jsQRLib); }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js';
    script.onload = () => { jsQRLib = window.jsQR; resolve(jsQRLib); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// ===== DECO TRENDS 2026–2027 =====
// Basado en Anthropologie (Damson Madder, Homes & Gardens), H&M Home Spring 2026
// (Riviera 60s/70s), y tendencias generales de interiorismo 2026
const DECO_TRENDS = [
  {
    id: 'soft-reset',
    name: 'Soft Reset',
    subtitle: 'Anti-gris · Anti-minimalismo frío',
    color: '#C88A6E',
    bg: 'linear-gradient(165deg, #F5E6D8 0%, #E5C4A8 100%)',
    text: '#3A2418',
    summary: 'El movimiento más fuerte de 2026: adiós al gris millennial y al minimalismo frío. La casa recupera calidez, humanidad, curvas de madera, pops de color y acentos vintage.',
    whyMatters: 'Después de 10 años de "quiet luxury" y paletas grises, el mercado está pidiendo interiores que se sientan vividos, cálidos y personales. El cliente ya no quiere una casa que parece Airbnb.',
    palette: ['Crema cálida', 'Terracota suave', 'Madera nogal', 'Blanco roto', 'Verde salvia'],
    references: ['Anthropologie Enero 2026 drop', 'Studio McGee heritage era', 'Pinterest "warm minimalism"'],
    kalaConnection: ['vestigio', 'ritual', 'cha'],
    signals: [
      'Formas curvas en muebles y objetos',
      'Madera cálida (roble, nogal, haya)',
      'Textiles gruesos: lino, lana, bouclé',
      'Objetos que "se sienten hechos a mano"',
      'Paleta nude, crema, terracota',
    ],
  },
  {
    id: 'elevated-whimsical',
    name: 'Elevated Whimsical',
    subtitle: 'Whimsy con diseño · Patrones con alma',
    color: '#B85C4A',
    bg: 'linear-gradient(175deg, #F5D7A8 0%, #E89565 60%, #C24A3A 100%)',
    text: '#2A1410',
    summary: 'Whimsy con peso editorial. Tomates, sardinas, dibujos a mano, bandejitas con forma de lata. Patrones lúdicos pero confiados, no infantiles. Anthropologie x Damson Madder es el gold standard.',
    whyMatters: 'La Gen Z adulta y millennial tardío buscan personalidad sin caer en el kitsch. Esta estética les da "objeto coleccionable" con valor decorativo, perfecto para Instagram y regalo.',
    palette: ['Rojo tomate', 'Amarillo mostaza', 'Azul francia', 'Verde oliva', 'Rosa viejo'],
    references: ['Anthropologie x Damson Madder', 'Joanna Gaines Magnolia Spring 2026', 'IKEA OMMJÄNGE'],
    kalaConnection: ['cosecha', 'diario', 'verano'],
    signals: [
      'Motivos botánicos estilizados (tomate, limón, higo)',
      'Gráficos dibujados a mano, nunca perfectos',
      'Cerámica hand-painted con patrones',
      'Paleta viva pero "pasada por el tiempo"',
      'Colaboraciones con ilustradoras/es',
    ],
  },
  {
    id: 'riviera-revival',
    name: 'Riviera Revival',
    subtitle: 'Mediterráneo 60s/70s · H&M Home SS26',
    color: '#D4925F',
    bg: 'linear-gradient(165deg, #F8E5C6 0%, #E8B080 50%, #B07040 100%)',
    text: '#2A1810',
    summary: 'Glamour Riviera de los 60s y 70s filtrado por contemporaneidad. Rosas cálidos, neutros livianos, mid-century con toque 70s. Cerámicas lacadas, cristalería coloreada, lino fresco.',
    whyMatters: 'Es la tendencia dominante de H&M Home SS26 y ya se replicó en toda Europa. Trae las vacaciones mediterráneas a la casa de todo el año. Conecta con el boom del "slow living" y las cenas al aire libre.',
    palette: ['Rosa cálido', 'Coral apagado', 'Azul Mediterráneo', 'Amarillo Provence', 'Crema Riviera'],
    references: ['H&M Home Spring 2026', 'Sézane homeware', 'Visvim home capsule'],
    kalaConnection: ['verano', 'vestigio', 'concise'],
    signals: [
      'Cristalería coloreada translúcida',
      'Cerámica con acabado lacado brillante',
      'Textiles a rayas finas (estilo cabana)',
      'Madera clara con acentos de metal dorado',
      'Florales suaves tipo acuarela',
    ],
  },
  {
    id: 'found-luxury',
    name: 'Found Luxury',
    subtitle: 'Post-quiet luxury · Lo vivido es lujo',
    color: '#6B4E3D',
    bg: 'linear-gradient(200deg, #8C6F58 0%, #4A342A 100%)',
    text: '#F0E0CC',
    summary: 'El sucesor del quiet luxury. Lujo que viene de objetos con historia, imperfecciones, materiales nobles envejecidos. No se compra — se encuentra. Cuero gastado, bronce oxidado, madera con marcas.',
    whyMatters: 'La gente con poder adquisitivo ya no quiere "cosas nuevas caras". Quiere cosas que parecen haber existido siempre. Es la respuesta al agotamiento del minimalismo pulido.',
    palette: ['Marrón cuero', 'Verde botella', 'Dorado mate envejecido', 'Negro cálido', 'Bordeaux profundo'],
    references: ['Jenna Lyons Soho Loft', 'Astier de Villatte', 'Frama Copenhague', 'Heidi Caillier for Lulu & Georgia'],
    kalaConnection: ['raiz', 'concise', 'cha'],
    signals: [
      'Metales oxidados (latón, bronce, cobre envejecido)',
      'Cuero con pátina, nunca brillante',
      'Vidrio soplado a mano con imperfecciones',
      'Cerámica con kintsugi o reparaciones visibles',
      'Textiles densos: terciopelo apagado, lana gruesa',
    ],
  },
  {
    id: 'ritual-ceramico',
    name: 'Ritual Cerámico',
    subtitle: 'Wabi-sabi contemporáneo · Stoneware',
    color: '#6A7A5A',
    bg: 'linear-gradient(175deg, #E8DCC8 0%, #A8B598 60%, #5A6848 100%)',
    text: '#1F2518',
    summary: 'Cerámica artesanal como protagonista deco. Esmaltes mates reactivos, bordes irregulares, formas bajas tipo bol. Kinto, Astier de Villatte y ceramistas independientes marcan el norte.',
    whyMatters: 'El boom del matcha (+350% búsquedas 2024-2025), el movimiento slow ritual post-pandemia, y el crecimiento del mercado de cerámica artesanal hacen que esta estética crezca rápido en beauty y home fragrance.',
    palette: ['Crema cálida', 'Matcha oscuro', 'Terracota ahumada', 'Hojicha', 'Blanco leche'],
    references: ['Postcard Teas', 'Kinto', 'Astier de Villatte', 'Ippodo', 'L:A Bruket'],
    kalaConnection: ['cha', 'cosecha', 'ritual'],
    signals: [
      'Stoneware / gres artesanal (nunca porcelana brillante)',
      'Esmaltes MATES reactivos con textura',
      'Formas bajas y anchas tipo bol (80-150ml)',
      'Bordes irregulares, imperfección controlada',
      'Paleta monocromática tierra con un solo acento',
    ],
  },
];

// ===== COLECCIONES 2027 =====
const COLLECTIONS = [
  {
    id: 'vestigio',
    name: 'Vestigio',
    subtitle: 'Gourmand tostado',
    color: '#A86A3A',
    bg: 'linear-gradient(175deg, #F0E2CC 0%, #E5C4A0 100%)',
    text: '#3A241A',
    description: 'Dulzura adulta. Pistacho, cacao amargo, caramelo salado, almendra tostada, higo verde. Paleta cálida terracota/caramelo.',
    keywords: ['chocolate','cacao','vainilla','pistacho','caramelo','almendra','higo','miel','dulce','gourmand'],
    manifesto: 'La pastelería vista desde adentro. Cacao amargo, no chocolate de leche. Pistacho tostado, no dulce. Caramelo salado, no azucarado. Dulzura con textura, con tiempo, con memoria.',
    trend2027: 'El gourmand dejó de ser "vainilla para adolescentes". En 2026-2027 el gourmand adulto (cacao, pistacho, malta, sal) domina las ventas del segmento niche. Impulsado por Kayali Yum, Phlur Missing Person, Ariana Grande Cloud — pero con versión sofisticada.',
    searchFor: [
      'Envases tipo apothecary color caramelo/ámbar',
      'Vidrio color ámbar oscuro o terracota',
      'Etiquetas tipo kraft texturado',
      'Tapas de madera oscura o latón envejecido',
      'Formas curvas, amables, nunca agresivas',
      'Velas en cerámica color terracota',
    ],
    avoid: [
      'Blancos puros, grises fríos, azules',
      'Vidrio transparente cristalino',
      'Tapas plateadas brillantes',
      'Formas angulares minimalistas (eso es Concise)',
      'Cualquier cosa que grite "dulce infantil"',
      'Rosas, fucsias, colores pastel',
    ],
    tensionsWith: 'Concise (ambos son premium pero Vestigio es cálido vs Concise frío) y Diario (comparten caramelo pero Diario es más accesible/glossy).',
    exampleProducts: 'Difusor ámbar con tapa madera · Vela terracota mate 250g · Body oil en vidrio caramelo · Jabón barra tipo brownie',
    livesIn: 'Un comedor cálido con madera nogal, mantel de lino crudo, cerámica mediterránea en la mesa. Luz de tarde filtrada. Un bowl con higos y almendras sobre la mesada. La casa donde cenan amigos los domingos.',
    decoTrends: ['soft-reset', 'riviera-revival'],
  },
  {
    id: 'ritual',
    name: 'Ritual',
    subtitle: 'Neuro-aromática',
    color: '#6A7A6A',
    bg: 'linear-gradient(190deg, #EDEEE3 0%, #CFD5C8 100%)',
    text: '#2C362E',
    description: 'Aromas funcionales: dormir, enfocar, enraizar, activar, alegría. Estética minimal, sage, colores neutros.',
    keywords: ['lavanda','romero','menta','yuzu','mandarina','aromaterapia','relax','wellness'],
    manifesto: 'Cinco funciones, cinco momentos del día. No es aromaterapia de spa hotel — es ciencia olfativa aplicada. Dormir, Enfocar, Enraizar, Activar, Alegría.',
    trend2027: 'La neuro-aromaterapia funcional es la tendencia más fuerte 2025-2027 en wellness. Impulsada por Vyrao, The Nue Co, Goop, Sensorial Tech. Los consumidores ya no buscan "un perfume lindo" sino un aroma que los haga sentir algo específico. Mercado en crecimiento exponencial.',
    searchFor: [
      'Envases minimalistas color sage, crema, blanco roto',
      'Vidrio smokey o mate',
      'Tapas de bambú, madera clara, cerámica',
      'Formas limpias pero suaves',
      'Etiquetas tipográficas sin ilustraciones',
      'Roll-ons, pulse points, pocket spray',
      'Inhaladores olfativos portátiles (formato nuevo!)',
    ],
    avoid: [
      'Estética "spa genérico" (turquesa, verde agua)',
      'Ilustraciones de hojitas estereotipadas',
      'Tipografías redondas cursivas',
      'Dorados, colores saturados',
      'Cualquier cosa que grite "perfume"',
      'Velas (en Ritual preferimos difusión pasiva o roll-on)',
    ],
    tensionsWith: 'Chá (ambos son wellness pero Ritual es funcional mientras Chá es ceremonial) y Cosecha (ambos verdes pero Cosecha es huerta vivencial).',
    exampleProducts: 'Roll-on "Dormir" 10ml · Pillow mist · Inhalador olfativo de bolsillo · Pulse point oil · Pocket candle de viaje',
    livesIn: 'Un dormitorio con sábanas de lino crudo, madera clara, una sola planta, cero clutter. Un escritorio minimal con cuaderno y roll-on sobre la mesa. La casa de alguien que practica yoga por la mañana y lee antes de dormir.',
    decoTrends: ['soft-reset', 'ritual-ceramico'],
  },
  {
    id: 'raiz',
    name: 'Raíz',
    subtitle: 'Eco-somática',
    color: '#4A5A3E',
    bg: 'linear-gradient(200deg, #2E3A2E 0%, #1A2520 100%)',
    text: '#E4DCC8',
    description: 'Bosque oscuro, maderas añejas, tierra mojada, petrichor, raíces, palo santo.',
    keywords: ['madera','bosque','tierra','musgo','vetiver','cedro','palo santo','petrichor','oscuro'],
    manifesto: 'El olor de la tierra después de la lluvia. El tronco húmedo en un bosque patagónico. Raíces, humo lejano, musgo. Territorio, no decoración.',
    trend2027: 'La eco-somática es tendencia 2026-2027 como respuesta anti-gourmand y anti-floral. Petrichor, moss, damp wood son los nuevos buzz words del nicho (D.S. & Durga, Comme des Garçons, Boy Smells). Conecta con eco-anxiety y necesidad de reconexión con naturaleza real (no idealizada).',
    searchFor: [
      'Envases color verde oscuro, negro mate, marrón profundo',
      'Vidrio negro opaco o verde botella',
      'Terminaciones texturadas, nunca lisas brillantes',
      'Formas sólidas, pesadas, que "anclen"',
      'Tapas de madera cruda, piedra, concreto',
      'Cajas cartón rústico, tipografía impresa gruesa',
      'Inciensos, resinas, velas con madera',
    ],
    avoid: [
      'Cualquier cosa delicada, floral, dulce',
      'Tipografía fina elegante (va a Concise)',
      'Dorados o metales brillantes',
      'Formas curvas femeninas',
      'Colores cálidos alegres',
      'Cualquier cosa que parezca "spa"',
    ],
    tensionsWith: 'Concise (Concise es oscuro pero floral; Raíz es oscuro pero terrenal, nunca floral).',
    exampleProducts: 'Difusor en frasco vidrio negro · Vela en vasija concreto · Incienso varilla · Solid perfume en tin metal oxidado · Room spray "petrichor"',
    livesIn: 'Un living con piso de madera oscura, mesa de roble macizo, cuero gastado, una biblioteca densa. Ventanas al fondo, luz baja, vinilos girando. La casa de alguien que colecciona piedras, mapas viejos, y lee poesía.',
    decoTrends: ['found-luxury', 'soft-reset'],
  },
  {
    id: 'concise',
    name: 'Concise',
    subtitle: 'Florales oscuros · Premium',
    color: '#8B2838',
    bg: 'linear-gradient(210deg, #8B2838 0%, #5A1F28 60%, #3A1520 100%)',
    text: '#F4E8DC',
    description: 'Línea flagship premium. Rosa+cuero, jazmín+oud, tuberosa+cardamomo, azafrán. Vidrio mate, tapa dorada, burgundy.',
    keywords: ['rosa','jazmin','oud','cuero','azafran','tuberosa','florales oscuros','premium','nocturno','edp'],
    manifesto: 'El flagship. Florales que no son dulces. Rosas con cuero, jazmines con oud, tuberosas con cardamomo. Burgundy profundo, crema, dorado mate.',
    trend2027: 'Los florales oscuros con facetas especiadas/cuero son tendencia fuerte 2026-2027 (Kayali Vanilla 28, Maison Francis Kurkdjian, Tom Ford Noir). Azafrán como nota protagonista creció 400% en ventas 2024-2025. La gen-Z premium compra estos en vez de los clásicos florales blancos.',
    searchFor: [
      'Vidrio MATE (no brillante) color burgundy, cream, amber oscuro',
      'Tapas doradas MATE (nunca brillantes) o negro piano',
      'Formas editoriales tipo Le Labo / Byredo',
      'Cajas rígidas con cinta de satin',
      'Tipografía serif editorial clásica',
      'Etiquetas minimalistas casi-apothecary',
      'Atomizadores de alta calidad (no spray de plástico)',
    ],
    avoid: [
      'Cualquier cosa que parezca "perfume de farmacia"',
      'Formas divertidas o juveniles',
      'Colores brillantes, pastel, saturados',
      'Plásticos visibles',
      'Dorado brillante cromado',
      'Tapas fantasiosas con formas decorativas',
    ],
    tensionsWith: 'Vestigio (ambos cálidos/oscuros pero Concise es más editorial/flagship vs Vestigio más gourmand/sensorial).',
    exampleProducts: 'EDP 50ml en vidrio mate burgundy · Vela premium 300g · Body oil editorial · Solid perfume en estuche metálico · Mini edp 10ml coleccionable',
    livesIn: 'Un dormitorio burgundy con terciopelo gastado, lámpara cálida, escritorio lacado negro. Un espejo dorado envejecido, un ramo de peonías oscuras sobre una cómoda. La casa de alguien que viaja por trabajo y lee The New Yorker.',
    decoTrends: ['found-luxury', 'riviera-revival'],
  },
  {
    id: 'cosecha',
    name: 'Cosecha',
    subtitle: 'Huerta',
    color: '#7A9A5A',
    bg: 'linear-gradient(175deg, #EFE8D3 0%, #C8D6B0 100%)',
    text: '#2C3A24',
    description: 'Huerta argentina: hoja de tomate, albahaca, menta silvestre, ruibarbo.',
    keywords: ['tomate','albahaca','menta','hierba','verde','huerta','vegetal'],
    manifesto: 'La huerta argentina. Hoja de tomate fresca, albahaca del domingo, menta que cortás al pasar, ruibarbo. Verde vivido, no verde estilizado.',
    trend2027: 'Las notas "green vegetal" (tomato leaf, fig leaf, basil) son tendencia 2026 en nicho (D.S. & Durga Debaser, Boy Smells Cedar Stack, Aerin Cuir de Gardenia). Creció el interés por aromas "de jardín real" vs "floral genérico". Conecta con movimiento slow-food, farm-to-table, huerta urbana.',
    searchFor: [
      'Envases color verde salvia, verde oliva, crema',
      'Vidrio verde oscuro o ámbar claro',
      'Ilustraciones botánicas delicadas (si las hay)',
      'Materiales naturales: terracota, cerámica, madera',
      'Etiquetas con papel texturado',
      'Formas simples, frescas, ligeras',
    ],
    avoid: [
      'Verdes saturados fluo',
      'Estética tropical playera (eso es Verano)',
      'Cualquier cosa que remita a "spa menta eucalipto"',
      'Colores oscuros tierra (eso es Raíz)',
      'Dorados',
      'Florales (aunque sean verdes)',
    ],
    tensionsWith: 'Ritual (Ritual es funcional/minimal, Cosecha es vivencial/sensorial) y Chá (ambos verdes pero Chá es ceremonial).',
    exampleProducts: 'Room spray "Hoja de tomate" · Vela pequeña cerámica 150g · Hand cream en tubo de aluminio · Jabón artesanal barra · Body mist fresco',
    livesIn: 'Una cocina con luz de ventana grande, cerámica hand-painted con tomates y limones, un mantel a rayas, hierbas frescas en frascos. La casa de alguien que planta albahaca en el balcón y hace pan los domingos.',
    decoTrends: ['elevated-whimsical', 'ritual-ceramico'],
  },
  {
    id: 'diario',
    name: 'Diario',
    subtitle: 'Línea hermana · Daily',
    color: '#8A5A3A',
    bg: 'linear-gradient(135deg, #F4EFE3 0%, #E8D5C5 50%, #C9B5A0 100%)',
    text: '#2A1D14',
    description: 'Tres aromas ancla: Cacao, Manteca, Algodón. Cotidiano, accesible, coleccionable.',
    keywords: ['daily','cacao','manteca','algodon','body mist','roll on','cotidiano'],
    manifesto: 'La vida diaria. Cacao, Manteca, Algodón — tres aromas ancla pensados para capear y usar todos los días. Accesible, repetible, coleccionable. Estética glossy contemporánea.',
    trend2027: 'La "skinification" / "perfume layering" es LA tendencia 2026-2027 (Rhode, Sol de Janeiro, Summer Fridays, Glossier You). 65% de la gen-Z mezcla varios aromas simultáneamente. Body mists, hair mists, roll-ons en formatos coleccionables por debajo de USD 30 están explotando.',
    searchFor: [
      'Envases glossy contemporáneos (estética Rhode/Glossier)',
      'Vidrio grueso traslúcido color caramelo, manteca, celeste',
      'Tapas simples color matching',
      'Roll-ons, body mists, hair mists',
      'Empaques apilables, coleccionables',
      'Formatos chicos y medianos (30-100ml)',
      'Precios con piso bajo, muchos SKUs',
    ],
    avoid: [
      'Cualquier cosa que parezca "perfume premium"',
      'Oscuridad, formalidad, editorial',
      'Dorados mates (eso es Concise)',
      'Terracota y beige desaturado (eso es Vestigio)',
      'Formas complejas',
      'Precios altos',
    ],
    tensionsWith: 'Vestigio (comparten cacao pero Diario es glossy-juvenil vs Vestigio adulto-apothecary) y Concise (Diario democratiza lo que Concise eleva).',
    exampleProducts: 'Body mist 100ml · Hair perfume 50ml · Roll-on 10ml · Mini-vela 60g · Hand cream tubo',
    livesIn: 'Un tocador o bañera con frasquitos apilables de colores pastel, espejo redondo, ropa linda sobre la silla. Un bolso con roll-ons para el día. La casa de alguien que layerea aromas y comparte morning routines en TikTok.',
    decoTrends: ['elevated-whimsical', 'soft-reset'],
  },
  {
    id: 'verano',
    name: 'Verano \'27',
    subtitle: 'Limited · Drop estacional',
    color: '#C85A3C',
    bg: 'linear-gradient(165deg, #F5C97A 0%, #E5994C 50%, #C85A3C 100%)',
    text: '#2A180A',
    description: 'Cápsula summer drop. Coco, monoï, bronceador, vainilla quemada, sal, frutas tropicales.',
    keywords: ['coco','verano','bronceador','playa','sol','tropical','maracuya','mango'],
    manifesto: 'Cápsula de verano. Hero del drop: "Bronceador" (coco + monoï + vainilla). No es colección permanente — es limited edition con fecha de entrada y salida.',
    trend2027: 'Los summer drops estacionales son formato estándar 2026-2027 (Sol de Janeiro, Tarte, Summer Fridays, DedCool). El "bronceador scent" (coconut + monoi + salt + tiare) es el aroma más replicado del último verano y sigue creciendo. Corto ciclo de vida = hype + urgencia.',
    searchFor: [
      'Envases brillantes, colores saturados cálidos',
      'Naranjas, dorados, corales, amarillos',
      'Packaging divertido, alegre, estacional',
      'Body mists grandes formato tipo beach',
      'Aceites corporales con efecto glow',
      'Empaques transparentes con color',
      'Formatos coleccionables edición limitada',
    ],
    avoid: [
      'Cualquier cosa sobria o minimalista',
      'Estética editorial seria',
      'Oscuridad, negros, burgundy',
      'Aromas cálidos especiados (no es Vestigio)',
      'Cualquier intento de ser atemporal',
      'Precios premium',
    ],
    tensionsWith: 'Ninguna importante — Verano es drop cerrado, no compite con las colecciones permanentes.',
    exampleProducts: 'Body mist "Bronceador" 150ml · Aceite corporal glow · Hair mist coco · Roll-on coleccionable de 4 aromas · Vela edition limitada',
    livesIn: 'Un balcón o patio con textil a rayas cabana, cerámica amarilla y coral, toallas de lino. Una playa en Mar del Plata o Punta del Este. La temporada corta, intensa, brillante que vuelve cada verano.',
    decoTrends: ['riviera-revival', 'elevated-whimsical'],
  },
  {
    id: 'cha',
    name: 'Chá',
    subtitle: 'Ritual del té',
    color: '#4A5D3A',
    bg: 'linear-gradient(175deg, #F0E6D2 0%, #E8DCC8 100%)',
    text: '#2B2420',
    description: 'El té como ceremonia. 5 aromas: Matcha, Chai, Earl Grey, Hojicha, White Tea. Wellness premium, entre Ritual y Concise.',
    keywords: ['matcha','chai','earl grey','hojicha','white tea','te','tea','ceremonia','ritual','cardamomo','bergamota'],
    manifesto: 'El té como ceremonia, no como sabor. Cada aroma es una escena: "El desayuno silencioso", "El tren de Jaipur", "El estudio con lluvia". El producto es la pausa, no el perfume.',
    trend2027: 'El "tea-inspired fragrance" crece 2026-2027 impulsado por el boom del matcha (búsquedas +350% 2024-2025), el movimiento "slow ritual" post-pandemia, y marcas como Postcard Teas, Kinto, L:A Bruket que cruzaron beauty con home. Formato "ritual kit" (caja con varios productos coherentes) es tendencia fuerte de gifting premium.',
    searchFor: [
      'Cerámica GRES artesanal (stoneware), nunca porcelana',
      'Esmaltes MATES reactivos, con textura',
      'Bordes irregulares, imperfección controlada',
      'Paleta tierra: crema cálida, terracota, sage, hojicha',
      'Formas bajas y anchas tipo bol (80-150ml)',
      'Tubos cerámicos para inciensos',
      'Muselina y lino crudo para bath tea bags',
      'Madera clara (roble, haya) para bandejas',
    ],
    avoid: [
      'Porcelana blanca brillante tipo "fine china"',
      'Bordes perfectos, simetría industrial',
      'Mugs occidentales con orejita grande',
      'Decoraciones florales saturadas',
      'Dorados brillantes, plateados',
      'Cualquier cosa que parezca de Temu',
      'Esmaltes sintéticos de colores puros',
    ],
    tensionsWith: 'Ritual (ambos wellness pero Chá es ceremonial-cálido vs Ritual funcional-minimal) y Cosecha (ambos verdes pero Chá es té/ceremonia vs Cosecha huerta).',
    exampleProducts: 'Ritual Kit (caja completa) · Difusor 150ml vidrio ámbar mate · Vela gres con mecha madera · Incienso varillas · Bath tea bags · Taza artesanal solo o en kit',
    livesIn: 'Una cocina matinal con cerámica gres artesanal sobre una bandeja de roble, una taza humeante, incienso encendido al lado. Un rincón de meditación con una sola silla de madera y una planta baja. La casa de alguien que hace pausas reales.',
    decoTrends: ['ritual-ceramico', 'found-luxury'],
  },
  {
    id: 'unassigned',
    name: 'Sin asignar',
    subtitle: 'Pendiente de decidir',
    color: '#888',
    bg: '#EFEAE0',
    text: '#2a2a2a',
    description: '',
    keywords: [],
    manifesto: '',
    trend2027: '',
    searchFor: [],
    avoid: [],
    tensionsWith: '',
    exampleProducts: '',
  },
];

// ===== INSPO ALBUMS =====
// Álbumes de inspiración con fotos + notas, y análisis con IA
const ALBUM_PREFIX = 'kala-inspo:album:';
const ALBUMS_INDEX = 'kala-inspo:albums';
const ALBUM_ITEM_PREFIX = 'kala-inspo:item:';

async function loadAlbumsIndex() {
  try {
    const raw = await storageGet(ALBUMS_INDEX);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

async function saveAlbumsIndex(ids) {
  return storageSet(ALBUMS_INDEX, JSON.stringify(ids));
}

async function loadAlbum(id) {
  try {
    const raw = await storageGet(ALBUM_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

async function saveAlbum(album) {
  await storageSet(ALBUM_PREFIX + album.id, JSON.stringify(album));
  const ids = await loadAlbumsIndex();
  if (!ids.includes(album.id)) {
    ids.push(album.id);
    await saveAlbumsIndex(ids);
  }
  return true;
}

async function deleteAlbum(id) {
  const album = await loadAlbum(id);
  if (album?.items) {
    for (const itemId of album.items) {
      try { await storageDelete(ALBUM_ITEM_PREFIX + itemId); } catch {}
    }
  }
  await storageDelete(ALBUM_PREFIX + id);
  const ids = await loadAlbumsIndex();
  await saveAlbumsIndex(ids.filter(x => x !== id));
  return true;
}

async function loadAlbumItem(itemId) {
  try {
    const raw = await storageGet(ALBUM_ITEM_PREFIX + itemId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

async function saveAlbumItem(item) {
  return storageSet(ALBUM_ITEM_PREFIX + item.id, JSON.stringify(item));
}

async function deleteAlbumItem(albumId, itemId) {
  await storageDelete(ALBUM_ITEM_PREFIX + itemId);
  const album = await loadAlbum(albumId);
  if (album) {
    album.items = (album.items || []).filter(x => x !== itemId);
    album.updatedAt = new Date().toISOString();
    await saveAlbum(album);
  }
  return true;
}

async function loadAlbumItems(album) {
  if (!album?.items) return [];
  const items = [];
  for (const id of album.items) {
    const item = await loadAlbumItem(id);
    if (item) items.push(item);
  }
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ===== AI · CONCEPT GENERATION FROM ALBUM =====
async function generateAlbumConcept(album, items) {
  const collectionsContext = COLLECTIONS
    .filter(c => c.id !== 'unassigned')
    .map(c => `- ${c.name} (${c.subtitle}): ${c.description}`)
    .join('\n');

  const itemsContext = items.map((it, i) =>
    `Imagen ${i + 1}${it.note ? ` — Nota del equipo: "${it.note}"` : ''}${it.source ? ` — Fuente: ${it.source}` : ''}`
  ).join('\n');

  const userContent = [];
  userContent.push({
    type: 'text',
    text: `Sos la Directora Creativa de Kala Aromas. El equipo armó un álbum de inspiración llamado "${album.name}"${album.description ? ` con la siguiente intención: "${album.description}"` : ''}. Hay ${items.length} imagen${items.length === 1 ? '' : 'es'} en el álbum.

DESCRIPCIÓN DE CADA IMAGEN SEGÚN EL EQUIPO:
${itemsContext || 'Sin notas adicionales.'}

LAS 8 COLECCIONES DE AROMAS 2027 (para cruzar):
${collectionsContext}

Tu tarea: analizar las imágenes visualmente y generar un concepto editorial del álbum, como si fuera una tendencia o colección nueva que emerge de esta curaduría. Identificar qué colecciones de aromas Kala se activan y cómo se cruzan con este universo visual.

Respondé SOLO con JSON válido (sin markdown, sin texto extra) con esta estructura exacta:

{
  "conceptName": "Nombre poético-editorial de 1-3 palabras que sintetice el álbum, en tono Kala (ej: 'Huerta de Invierno', 'Tarde Provenzal', 'Silencio Dorado')",
  "conceptTagline": "Una frase de no más de 12 palabras que capture la esencia",
  "manifesto": "3-4 oraciones tipo manifiesto editorial explicando qué universo emerge. Cálido, concreto, evocativo.",
  "visualPatterns": {
    "palette": ["Color 1 con nombre evocativo", "Color 2", "Color 3", "Color 4", "Color 5"],
    "materials": ["Material dominante 1", "Material 2", "Material 3"],
    "forms": "Descripción de 1-2 oraciones sobre las formas y siluetas predominantes",
    "textures": "Descripción de 1-2 oraciones sobre las texturas y terminaciones"
  },
  "emergingTrend": "2-3 oraciones identificando qué tendencia emerge o se refuerza. Conectarlo con referentes reales (Anthropologie, H&M Home, Damson Madder, Le Labo, etc.) si aplica.",
  "aromaticConnection": [
    {
      "collectionId": "id de la colección",
      "collectionName": "Nombre",
      "why": "1-2 oraciones explicando por qué este álbum se cruza con esta colección, y qué elemento concreto lo conecta"
    }
  ],
  "sourcingRecommendations": [
    "Recomendación concreta 1 para buscar/comprar en Expo o a proveedores",
    "Recomendación 2",
    "Recomendación 3",
    "Recomendación 4"
  ],
  "warnings": "Si ves incoherencias en el álbum (imágenes que no encajan con el resto), contradicciones con el brand Kala, o riesgos de copiar demasiado literal a alguna marca, ponelo acá. Si todo bien, null."
}

IMPORTANTE:
- "aromaticConnection" debe tener entre 1 y 3 colecciones, las más relevantes.
- Si el álbum es demasiado disperso o no emerge un concepto claro, decilo honestamente en "warnings".
- No inventes conexiones forzadas — si solo encaja con 1 colección, poné solo 1.`
  });

  // Attach images
  for (const item of items) {
    if (item.photo) {
      try {
        const base64Data = item.photo.split(',')[1];
        const mediaType = item.photo.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        if (base64Data) {
          userContent.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } });
        }
      } catch (e) { /* skip */ }
    }
  }

  let response;
  try {
    response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3500,
        messages: [{ role: 'user', content: userContent }],
      })
    });
  } catch (netErr) {
    throw new Error('Sin conexión o API bloqueada. Probá desde desktop o deployando a dominio propio.');
  }

  if (!response.ok) {
    let detail = '';
    try { detail = (await response.text()).slice(0, 300); } catch {}
    throw new Error(`API respondió ${response.status}. ${detail}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find(b => b.type === 'text');
  if (!textBlock) throw new Error('La IA no devolvió texto');

  let cleaned = textBlock.text.trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`JSON inválido. Respuesta: ${cleaned.slice(0, 150)}…`);
  }
}

const CATEGORIES = [
  'Difusor', 'Perfume', 'Body Mist', 'Vela', 'Jabón', 'Crema',
  'Envase / Frasco', 'Tapa / Pump', 'Caja / Packaging', 'Varilla',
  'Accesorio deco', 'Textil', 'Materia prima', 'Otro'
];

const PRIORITIES = [
  { id: 'must', label: 'Comprar', short: 'Confirmados', color: '#2C7A3E', icon: '★★★' },
  { id: 'maybe', label: 'Tal vez', short: 'Pendientes', color: '#C88A2E', icon: '★★' },
  { id: 'no', label: 'Descartar', short: 'Descartados', color: '#B23A3A', icon: '★' },
  { id: 'pending', label: 'Sin decidir', short: 'Sin decidir', color: '#888', icon: '…' },
];

const formatCurrency = (n, currency = 'USD') => {
  if (n === '' || n === null || n === undefined || isNaN(n)) return '—';
  const num = parseFloat(n);
  return `${currency === 'USD' ? 'US$' : currency === 'CNY' ? '¥' : '$'}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const suggestCollection = (name, category, notes) => {
  const text = `${name || ''} ${category || ''} ${notes || ''}`.toLowerCase();
  for (const col of COLLECTIONS) {
    if (col.id === 'unassigned') continue;
    for (const kw of col.keywords) {
      if (text.includes(kw)) return col.id;
    }
  }
  return 'unassigned';
};

// ===== QR DATA PARSING =====
// Parses various formats: WeChat ID, vCard, URL, plain text, email, phone
const parseQRData = (data) => {
  const result = { wechatId: '', whatsappEmail: '', phone: '', supplier: '', website: '', rawData: data };

  // vCard format
  if (data.startsWith('BEGIN:VCARD')) {
    const lines = data.split(/\r?\n/);
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith('fn:') || lower.startsWith('n:')) {
        const name = line.split(':').slice(1).join(':').trim().replace(/;/g, ' ').replace(/\s+/g, ' ').trim();
        if (name && !result.supplier) result.supplier = name;
      } else if (lower.startsWith('org:')) {
        const org = line.split(':').slice(1).join(':').trim();
        result.supplier = org; // prefer org over name
      } else if (lower.includes('tel')) {
        result.phone = line.split(':').slice(1).join(':').trim();
      } else if (lower.includes('email') || lower.startsWith('email:')) {
        result.whatsappEmail = line.split(':').slice(1).join(':').trim();
      } else if (lower.startsWith('url:') || lower.includes('url;')) {
        result.website = line.split(':').slice(1).join(':').trim();
      } else if (lower.includes('x-wechat') || lower.includes('wechat')) {
        result.wechatId = line.split(':').slice(1).join(':').trim();
      }
    }
    return result;
  }

  // WeChat Official QR (usually starts with "http://weixin.qq.com/r/" or similar)
  if (data.includes('weixin.qq.com') || data.includes('wechat') || data.includes('u.wechat.com')) {
    result.rawData = data;
    result.wechatId = data;
    return result;
  }

  // Email
  if (data.startsWith('mailto:')) {
    result.whatsappEmail = data.replace('mailto:', '');
    return result;
  }
  if (data.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
    result.whatsappEmail = data;
    return result;
  }

  // Phone (tel: or WhatsApp)
  if (data.startsWith('tel:')) {
    result.phone = data.replace('tel:', '');
    return result;
  }
  if (data.startsWith('https://wa.me/') || data.startsWith('https://api.whatsapp.com/')) {
    const match = data.match(/[\+]?\d+/);
    if (match) result.whatsappEmail = match[0];
    return result;
  }

  // URL / Website
  if (data.startsWith('http://') || data.startsWith('https://')) {
    result.website = data;
    return result;
  }

  // Plain text, probably the WeChat ID
  result.wechatId = data;
  return result;
};

// ===== STORAGE =====
const PRODUCT_PREFIX = 'kala-expo:product:';
const INDEX_KEY = 'kala-expo:index';
const GROUPS_KEY = 'kala-expo:groups';

// Unified storage API: works with window.storage (Claude artifact) or localStorage fallback
async function storageGet(key) {
  try {
    if (typeof window !== 'undefined' && window.storage?.get) {
      const r = await window.storage.get(key, true);
      return r?.value ?? null;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return null;
}

async function storageSet(key, value) {
  try {
    if (typeof window !== 'undefined' && window.storage?.set) {
      await window.storage.set(key, value, true);
      return true;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
    return true;
  }
  return false;
}

async function storageDelete(key) {
  try {
    if (typeof window !== 'undefined' && window.storage?.delete) {
      await window.storage.delete(key, true);
      return true;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
    return true;
  }
  return false;
}

async function saveProduct(product) {
  try {
    await storageSet(PRODUCT_PREFIX + product.id, JSON.stringify(product));
    let index = [];
    try {
      const raw = await storageGet(INDEX_KEY);
      if (raw) index = JSON.parse(raw);
    } catch (e) {}
    if (!index.includes(product.id)) {
      index.push(product.id);
      await storageSet(INDEX_KEY, JSON.stringify(index));
    }
    return true;
  } catch (e) { console.error('saveProduct', e); return false; }
}

async function loadAllProducts() {
  try {
    const raw = await storageGet(INDEX_KEY);
    if (!raw) return [];
    const index = JSON.parse(raw);
    const products = [];
    for (const id of index) {
      try {
        const r = await storageGet(PRODUCT_PREFIX + id);
        if (r) products.push(JSON.parse(r));
      } catch (e) {}
    }
    return products;
  } catch (e) { return []; }
}

async function deleteProductFromStore(id) {
  try {
    await storageDelete(PRODUCT_PREFIX + id);
    const raw = await storageGet(INDEX_KEY);
    if (raw) {
      const index = JSON.parse(raw).filter(x => x !== id);
      await storageSet(INDEX_KEY, JSON.stringify(index));
    }
    return true;
  } catch (e) { return false; }
}

// ===== AI =====
async function getAIRecommendation(product) {
  const collectionsContext = COLLECTIONS
    .filter(c => c.id !== 'unassigned')
    .map(c => `- **${c.name}** [id: ${c.id}] — ${c.subtitle}\n  ${c.description}`)
    .join('\n\n');

  const userContent = [];
  userContent.push({
    type: 'text',
    text: `Sos el Director Creativo y Olfativo de Kala Aromas, marca argentina de aromas para cuerpo y hogar fundada en 2010. Estás evaluando un producto en una Expo en China para decidir si incorporarlo a las 7 colecciones 2027 que acabamos de definir.

## CONTEXTO DE MARCA (importante para tu análisis)

Kala Aromas es una marca de origen argentino con 87k seguidores en Instagram, fuerte presencia en retail deco/beauty, y una línea actual mezcla de aromas florales, frutales y gourmand. En 2027 se relanza con una arquitectura narrativa: cada aroma es una HISTORIA (una escena, un lugar, un momento) no una lista de notas. Los referentes estéticos son Le Labo, Byredo, D.S. & Durga, Diptyque, Maison Margiela Replica — nicho editorial premium pero accesible. Se evita lo genérico, lo "spa hotel", lo empalagoso.

La arquitectura de colecciones:

${collectionsContext}

## TU ANÁLISIS

Analizá el producto (foto + datos) con el máximo nivel de criterio. Aplicá los 5 CRITERIOS de clasificación y dentro de cada uno explicá lo que OBSERVÁS concretamente (no adjetivos genéricos, datos observables):

### 1. Criterio Estético
- Silueta del envase (squat, tall, oval, cilíndrico, flat, escultórico, clásico, etc.)
- Estilo (editorial-minimal, retro-apothecary, contemporary-glossy, industrial, artesanal, etc.)
- Tipografía visible si hay (serif editorial, sans geométrica, script, etc.)
- Qué colección tiene esta estética

### 2. Criterio Olfativo
- Qué tipo de aroma debería llevar este envase (qué esperás oler al abrirlo, basado en color + forma + nicho)
- Familia olfativa probable (gourmand, floral oscuro, eco-somática, herbal, tropical, etc.)
- Si ya tiene aroma declarado, evaluá si el aroma es coherente con la estética o hay tensión
- Qué colección tiene esta frecuencia olfativa

### 3. Criterio Material
- Material del envase (vidrio mate/brillante, plástico, cerámica, metal, cartón, madera, resina, etc.)
- Terminación percibida (matte, glossy, rubberized, soft-touch, textured, etc.)
- Calidad aparente (alta, media, baja) y qué implica para el posicionamiento
- Qué colección acepta este material

### 4. Criterio Cromático
- Paleta exacta (no "marrón" → "terracota quemado", "burgundy vino tinto", "sage salvia seco")
- Contraste entre envase + tapa + etiqueta
- Tono emocional del color (cálido, sereno, vibrante, profundo, etéreo)
- Qué colección resuena con esta paleta

### 5. Criterio Posicionamiento
- Rango de precio (piso/medio/techo) y qué implica dado el MOQ
- Tipo de consumidor (daily/premium/collector/teen/wellness)
- Oportunidad de margen (alto/medio/bajo según costo vs valor percibido)
- Riesgo operativo (MOQ muy alto sin rotación segura, etc.)
- Qué colección acepta este posicionamiento

## DATOS DEL PRODUCTO A ANALIZAR

- Nombre: ${product.name || 'sin nombre'}
- Categoría: ${product.category || 'no especificada'}
- Proveedor: ${product.supplier || 'desconocido'}
- Notas del comprador: ${product.notes || 'ninguna'}
- Costo unitario: ${formatCurrency(product.unitCost, product.currency)}
- MOQ: ${product.minOrder || 'no especificado'}
- Total mínimo a invertir: ${product.unitCost && product.minOrder ? formatCurrency(parseFloat(product.unitCost) * parseFloat(product.minOrder), product.currency) : 'no calculable'}

## RESPUESTA

Después de aplicar los 5 criterios, elegí la colección GANADORA (la que domina más criterios o la que mejor resuelve las tensiones). Un producto puede tener estética Concise pero aroma Vestigio — en ese caso explicá cómo resolvés la tensión.

Respondé SOLO con JSON válido (sin markdown, sin texto extra) con esta estructura exacta:

{
  "collection": "id_coleccion_principal",
  "collectionName": "Nombre Colección",
  "confidence": "alta|media|baja",
  "criteria": {
    "aesthetic": { "observation": "observación concreta 1-2 oraciones con detalles específicos de lo que ves", "collectionId": "id" },
    "olfactory": { "observation": "qué aroma debería tener, familia olfativa, coherencia con estética", "collectionId": "id" },
    "material": { "observation": "material, terminación, calidad aparente, implicancia de posicionamiento", "collectionId": "id" },
    "chromatic": { "observation": "paleta exacta con nombres específicos, tono emocional", "collectionId": "id" },
    "positioning": { "observation": "rango de precio, consumidor target, margen, riesgo operativo", "collectionId": "id" }
  },
  "reasoning": "3-4 oraciones sintetizando por qué la colección principal es la ganadora. Si hay tensión entre criterios, explicá cómo la resolviste. Mencioná qué producto del catálogo actual de Kala podría complementar o superponerse (si aplica).",
  "suggestedNotes": ["nota olfativa 1", "nota olfativa 2", "nota olfativa 3"],
  "storyLine": "una frase tipo historia de Kala — un lugar concreto, una hora, una escena (ej: 'La pastelería de Sicilia, diez de la mañana.' o 'El saco de cuero de la madre.')",
  "strategicNote": "1-2 oraciones con una consideración estratégica (ej: 'Buen candidato para el drop Verano 27 si el aroma se ajusta. Con este MOQ conviene validar rotación primero.' o 'Podría reemplazar al frasco actual de la línea Honey Nectarine si el costo justifica el upgrade.')",
  "warning": "si ves un problema real (MOQ demasiado alto, estética que choca con el brand, costo que no justifica el posicionamiento, producto redundante con algo ya en catálogo), escribilo. Si todo bien, null."
}`
  });

  if (product.photo) {
    try {
      const base64Data = product.photo.split(',')[1];
      const mediaType = product.photo.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      if (base64Data) {
        userContent.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } });
      }
    } catch (e) {
      console.warn('Could not attach image:', e);
    }
  }

  let response;
  try {
    response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3500,
        messages: [{ role: 'user', content: userContent }],
      })
    });
  } catch (netErr) {
    throw new Error('Sin conexión o la API no respondió. Revisá internet. (En app de Claude móvil la API está bloqueada — usá desktop o dominio propio.)');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.text();
      detail = body.slice(0, 300);
    } catch {}
    throw new Error(`API respondió ${response.status}. ${detail ? `Detalle: ${detail}` : ''}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find(b => b.type === 'text');
  if (!textBlock) throw new Error('La IA no devolvió texto');

  let cleaned = textBlock.text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`No se pudo leer la respuesta como JSON. Respuesta: ${cleaned.slice(0, 150)}…`);
  }
}

// Local fallback: multi-criteria keyword-based analysis
// Not as smart as AI (doesn't see photo) but gives structured breakdown
const LOCAL_CRITERIA_MAPS = {
  aesthetic: {
    vestigio: ['artesanal', 'rustico', 'rústico', 'vintage', 'cálido', 'calido', 'tostado', 'nostalgico', 'nostálgico', 'hogareño', 'terracota'],
    ritual: ['minimal', 'minimalista', 'limpio', 'zen', 'neutral', 'elegante simple', 'sereno'],
    raiz: ['crudo', 'natural', 'salvaje', 'oscuro', 'sombra', 'profundo', 'orgánico', 'organico'],
    concise: ['editorial', 'sofisticado', 'premium', 'mate', 'dorado', 'lujoso', 'flagship', 'elegante', 'vidrio mate', 'tapa dorada'],
    cosecha: ['fresco', 'botanico', 'botánico', 'hojas', 'huerta', 'verde'],
    diario: ['daily', 'accesible', 'glossy', 'pastel', 'divertido', 'juvenil', 'tipo rhode'],
    verano: ['vibrante', 'tropical', 'verano', 'playero', 'summer'],
  },
  olfactory: {
    vestigio: ['chocolate', 'cacao', 'vainilla', 'pistacho', 'caramelo', 'almendra', 'miel', 'dulce', 'gourmand', 'tostado', 'pan', 'manteca', 'café', 'cafe', 'higo'],
    ritual: ['lavanda', 'romero', 'menta', 'eucalipto', 'yuzu', 'mandarina', 'té verde', 'te verde', 'wellness', 'relax', 'dormir', 'calma'],
    raiz: ['madera', 'bosque', 'tierra', 'musgo', 'vetiver', 'cedro', 'palo santo', 'petrichor', 'humo', 'incienso', 'sándalo', 'sandalo'],
    concise: ['rosa', 'jazmin', 'jazmín', 'oud', 'cuero', 'azafrán', 'azafran', 'tuberosa', 'nocturno', 'oriental', 'pachuli', 'pachulí'],
    cosecha: ['tomate', 'albahaca', 'hierba', 'hierbas', 'higo verde', 'vegetal', 'ruibarbo', 'pimiento'],
    diario: ['cotidiano', 'algodón', 'algodon', 'almizcle', 'ropa limpia'],
    verano: ['coco', 'bronceador', 'playa', 'monoi', 'monoï', 'tropical', 'maracuyá', 'maracuya', 'mango', 'piña', 'pina', 'sol'],
  },
  material: {
    vestigio: ['cartón', 'carton', 'kraft', 'reciclado', 'papel', 'madera natural'],
    ritual: ['cerámica', 'ceramica', 'bambú', 'bambu', 'lino', 'piedra blanca'],
    raiz: ['madera', 'madera oscura', 'piedra', 'cemento', 'hormigón', 'hormigon', 'arcilla'],
    concise: ['vidrio mate', 'vidrio', 'metal dorado', 'dorado', 'metal', 'cristal', 'velvet', 'terciopelo'],
    cosecha: ['cerámica', 'ceramica', 'barro', 'arcilla', 'terracota'],
    diario: ['plastico', 'plástico', 'silicona', 'pet', 'liviano'],
    verano: ['aluminio', 'plástico', 'plastico', 'liviano', 'aluminum'],
  },
  chromatic: {
    vestigio: ['terracota', 'caramelo', 'marrón', 'marron', 'ocre', 'beige', 'camel', 'nude', 'crema tostada'],
    ritual: ['sage', 'verde salvia', 'gris', 'blanco roto', 'off-white', 'champagne'],
    raiz: ['verde oscuro', 'negro', 'marrón oscuro', 'marron oscuro', 'bosque', 'carbón', 'carbon'],
    concise: ['burgundy', 'vino', 'bordó', 'bordo', 'granate', 'dorado', 'crema', 'bordeaux'],
    cosecha: ['verde', 'verde oliva', 'oliva', 'salvia', 'lima'],
    diario: ['pastel', 'rosa', 'celeste', 'amarillo suave', 'crema', 'lila'],
    verano: ['naranja', 'coral', 'amarillo', 'turquesa', 'azul cielo', 'rojo'],
  },
};

function scoreCriterion(text, criterionName) {
  const map = LOCAL_CRITERIA_MAPS[criterionName];
  const scores = {};
  for (const [collectionId, keywords] of Object.entries(map)) {
    let matchedWords = [];
    for (const kw of keywords) {
      if (text.includes(kw)) matchedWords.push(kw);
    }
    scores[collectionId] = { count: matchedWords.length, matched: matchedWords };
  }
  // Find best
  let best = null;
  let bestCount = 0;
  for (const [id, s] of Object.entries(scores)) {
    if (s.count > bestCount) {
      bestCount = s.count;
      best = id;
    }
  }
  return { best, bestScore: bestCount, matchedWords: best ? scores[best].matched : [] };
}

function getPositioningLocal(product) {
  const cat = (product.category || '').toLowerCase();
  const cost = parseFloat(product.unitCost) || 0;
  const currency = product.currency || 'USD';
  // Rough USD conversion
  const costUSD = currency === 'CNY' ? cost * 0.14 : currency === 'ARS' ? cost * 0.001 : cost;

  if (cat.includes('perfume') && costUSD >= 4) {
    return { collectionId: 'concise', note: 'Perfume con costo medio/alto: encaja en línea premium Concise.' };
  }
  if (cat.includes('difusor') && costUSD >= 3) {
    return { collectionId: 'concise', note: 'Difusor premium por precio y categoría.' };
  }
  if (cat.includes('body mist') || cat.includes('roll on') || cat.includes('crema')) {
    return { collectionId: 'diario', note: 'Formato para cuerpo/daily: encaja en línea Diario.' };
  }
  if (cat.includes('vela')) {
    return { collectionId: costUSD >= 3 ? 'concise' : 'vestigio', note: 'Vela — colección según el precio y el aroma inferido.' };
  }
  if (cat.includes('jabón') || cat.includes('jabon')) {
    return { collectionId: 'diario', note: 'Jabón — típicamente daily, puede escalar según ingredientes.' };
  }
  return { collectionId: null, note: 'No se pudo inferir posicionamiento sin más datos.' };
}

function getLocalRecommendation(product) {
  const text = `${product.name || ''} ${product.category || ''} ${product.notes || ''}`.toLowerCase();

  // Score each criterion
  const aesthetic = scoreCriterion(text, 'aesthetic');
  const olfactory = scoreCriterion(text, 'olfactory');
  const material = scoreCriterion(text, 'material');
  const chromatic = scoreCriterion(text, 'chromatic');
  const positioning = getPositioningLocal(product);

  // Overall winner: collection with highest combined score
  const allScores = {};
  const addScore = (id, pts) => {
    if (!id) return;
    allScores[id] = (allScores[id] || 0) + pts;
  };
  addScore(aesthetic.best, aesthetic.bestScore * 2);
  addScore(olfactory.best, olfactory.bestScore * 3); // olfactory weighs more
  addScore(material.best, material.bestScore);
  addScore(chromatic.best, chromatic.bestScore * 2);
  addScore(positioning.collectionId, 2);

  let winner = null;
  let winnerScore = 0;
  for (const [id, s] of Object.entries(allScores)) {
    if (s > winnerScore) { winnerScore = s; winner = id; }
  }

  const winnerCol = COLLECTIONS.find(c => c.id === winner);

  if (!winnerCol) {
    return {
      collection: 'unassigned',
      collectionName: 'Sin asignar',
      confidence: 'baja',
      reasoning: 'No se detectaron palabras clave suficientes para sugerir una colección. Completá más detalles (nombre, notas, categoría) o asignala vos según tu criterio estético.',
      criteria: null,
      suggestedNotes: [],
      storyLine: null,
      warning: 'Sugerencia local basada en palabras clave. La IA (que sí mira la foto) podría dar una mejor recomendación desde desktop.',
      isLocal: true,
    };
  }

  const buildObs = (label, result, fallbackMsg) => {
    if (result.bestScore > 0 && result.matchedWords.length) {
      return `Palabras clave detectadas: ${result.matchedWords.slice(0, 3).join(', ')}.`;
    }
    return fallbackMsg;
  };

  const criteria = {
    aesthetic: {
      observation: buildObs('estético', aesthetic, 'Sin datos estéticos (cargá descripción o notas con palabras tipo "mate", "editorial", "minimal", etc.)'),
      collectionId: aesthetic.best || 'unassigned',
    },
    olfactory: {
      observation: buildObs('olfativo', olfactory, 'Sin datos olfativos (cargá notas con aromas o ingredientes).'),
      collectionId: olfactory.best || 'unassigned',
    },
    material: {
      observation: buildObs('material', material, 'Material no especificado en los datos.'),
      collectionId: material.best || 'unassigned',
    },
    chromatic: {
      observation: buildObs('cromático', chromatic, 'Color no especificado en nombre ni notas.'),
      collectionId: chromatic.best || 'unassigned',
    },
    positioning: {
      observation: positioning.note,
      collectionId: positioning.collectionId || 'unassigned',
    },
  };

  return {
    collection: winnerCol.id,
    collectionName: winnerCol.name,
    confidence: winnerScore >= 6 ? 'media' : 'baja',
    reasoning: `Análisis basado en palabras clave detectadas en nombre, categoría y notas. La colección ${winnerCol.name} suma el mayor puntaje (${winnerScore} pts) combinando los 5 criterios. ${winnerCol.description}`,
    criteria,
    suggestedNotes: winnerCol.keywords.slice(0, 3),
    storyLine: null,
    warning: 'Sugerencia LOCAL basada en palabras clave. No mira la foto ni sugiere historia creativa. Para análisis visual completo, usá la IA desde desktop o deployá la app a un dominio propio.',
    isLocal: true,
  };
}

// ===== MAIN APP =====
export default function KalaExpoApp() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCollection, setFilterCollection] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupByCollection, setGroupByCollection] = useState(true);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadAllProducts();
      setProducts(loaded);
      setLoading(false);
    })();
  }, []);

  const refresh = async () => setProducts(await loadAllProducts());

  const handleSave = async (product) => {
    await saveProduct(product);
    await refresh();
    setView('list');
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await deleteProductFromStore(id);
    await refresh();
    setView('list');
    setEditingProduct(null);
  };

  const filtered = products.filter(p => {
    if (filterCollection !== 'all' && p.collection !== filterCollection) return false;
    if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(p.name || '').toLowerCase().includes(q) &&
          !(p.supplier || '').toLowerCase().includes(q) &&
          !(p.notes || '').toLowerCase().includes(q) &&
          !(p.code || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontStyle: 'italic', color: '#3D1D4E' }}>Kala</div>
          <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginTop: 12 }}>Cargando…</div>
        </div>
      </div>
    );
  }

  if (view === 'add' || view === 'edit') {
    return <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => { setView('list'); setEditingProduct(null); }} onDelete={editingProduct ? () => handleDelete(editingProduct.id) : null} />;
  }
  if (view === 'status') {
    return <StatusView products={products} onBack={() => setView('list')} onEdit={(p) => { setEditingProduct(p); setView('edit'); }} />;
  }
  if (view === 'dashboard') {
    return <Dashboard products={products} onBack={() => setView('list')} />;
  }
  if (view === 'collections') {
    return <CollectionsGuide onBack={() => setView('list')} />;
  }
  if (view === 'deco') {
    return <DecoTrendsView onBack={() => setView('list')} />;
  }
  if (view === 'inspo') {
    return (
      <>
        <InspoBoards
          onBack={() => setView('list')}
          onOpenAlbum={(id) => { setActiveAlbumId(id); setView('album'); }}
          onNewAlbum={() => setShowNewAlbumForm(true)}
        />
        {showNewAlbumForm && (
          <NewAlbumForm
            onSave={(id) => {
              setShowNewAlbumForm(false);
              setActiveAlbumId(id);
              setView('album');
            }}
            onCancel={() => setShowNewAlbumForm(false)}
          />
        )}
      </>
    );
  }
  if (view === 'album' && activeAlbumId) {
    return (
      <AlbumDetail
        albumId={activeAlbumId}
        onBack={() => { setActiveAlbumId(null); setView('inspo'); }}
        onDeleted={() => { setActiveAlbumId(null); setView('inspo'); }}
      />
    );
  }

  const stats = { total: products.length, must: products.filter(p => p.priority === 'must').length };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0F0F0F', paddingBottom: 100 }}>
      <header style={{ padding: '16px 16px 14px', borderBottom: '1px solid rgba(15,15,15,0.08)', background: '#FAF6EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 500, color: '#3D1D4E', lineHeight: 1 }}>
              Kala <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#1D2B4A' }}>Expo China</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginTop: 4, fontFamily: 'ui-monospace, monospace' }}>
              {stats.total} productos · {stats.must} para comprar
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button onClick={() => setView('collections')} style={headerBtnSecondary}>
              <BookOpen size={13} /> Guía
            </button>
            <button onClick={() => setView('deco')} style={headerBtnSecondary}>
              <TrendingUp size={13} /> Deco
            </button>
            <button onClick={() => setView('inspo')} style={headerBtnSecondary}>
              <ImageIcon size={13} /> Inspo
            </button>
            <button onClick={() => setView('status')} style={headerBtnSecondary}>
              <ListChecks size={13} /> Listas
            </button>
            <button onClick={() => setView('dashboard')} style={headerBtnPrimary}>Dashboard</button>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar por nombre, proveedor, código…" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1px solid rgba(15,15,15,0.15)', background: '#FFF', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          <FilterPill active={filterCollection === 'all'} onClick={() => setFilterCollection('all')}>Todas</FilterPill>
          {COLLECTIONS.map(c => (
            <FilterPill key={c.id} active={filterCollection === c.id} onClick={() => setFilterCollection(c.id)} color={c.color}>{c.name}</FilterPill>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <FilterPill active={filterPriority === 'all'} onClick={() => setFilterPriority('all')} small>Todo</FilterPill>
          {PRIORITIES.map(p => (
            <FilterPill key={p.id} active={filterPriority === p.id} onClick={() => setFilterPriority(p.id)} color={p.color} small>{p.icon} {p.label}</FilterPill>
          ))}
        </div>

        {filtered.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setGroupByCollection(!groupByCollection)} style={{ background: 'transparent', border: 'none', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3D1D4E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'ui-monospace, monospace' }}>
              <Layers size={13} /> {groupByCollection ? 'Ver lista plana' : 'Agrupar por colección'}
            </button>
          </div>
        )}
      </header>

      <div style={{ padding: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <Package size={40} color="#CCC" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic', color: '#666', marginBottom: 8 }}>
              {products.length === 0 ? 'Ningún producto todavía' : 'Sin resultados'}
            </div>
            <div style={{ fontSize: 13, color: '#999' }}>
              {products.length === 0 ? 'Tocá el + para sumar tu primer producto' : 'Probá con otro filtro'}
            </div>
          </div>
        ) : groupByCollection ? (
          <GroupedProductList products={filtered} onEdit={(p) => { setEditingProduct(p); setView('edit'); }} />
        ) : (
          <FlatProductGrid products={filtered} onEdit={(p) => { setEditingProduct(p); setView('edit'); }} />
        )}
      </div>

      <button onClick={() => { setEditingProduct(null); setView('add'); }} style={{ position: 'fixed', bottom: 24, right: 20, width: 64, height: 64, borderRadius: '50%', background: '#3D1D4E', color: '#F4EFE3', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px -4px rgba(61,29,78,0.4), 0 4px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
        <Plus size={28} strokeWidth={2.2} />
      </button>
    </div>
  );
}

function FilterPill({ children, active, onClick, color, small }) {
  return (
    <button onClick={onClick} style={{ whiteSpace: 'nowrap', padding: small ? '5px 10px' : '6px 12px', borderRadius: 100, border: `1px solid ${active ? (color || '#3D1D4E') : 'rgba(15,15,15,0.15)'}`, background: active ? (color || '#3D1D4E') : 'transparent', color: active ? '#FFF' : '#333', fontSize: small ? 11 : 12, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.05em', cursor: 'pointer', flexShrink: 0 }}>
      {children}
    </button>
  );
}

function GroupedProductList({ products, onEdit }) {
  const byCollection = COLLECTIONS.map(c => ({ ...c, items: products.filter(p => p.collection === c.id) })).filter(c => c.items.length > 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {byCollection.map(c => (
        <div key={c.id}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: `2px solid ${c.color}` }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontStyle: 'italic', color: c.color, lineHeight: 1 }}>{c.name}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginTop: 3, fontFamily: 'ui-monospace, monospace' }}>{c.subtitle}</div>
            </div>
            <div style={{ fontSize: 11, color: '#888', fontFamily: 'ui-monospace, monospace' }}>{c.items.length}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {c.items.map(p => <ProductCard key={p.id} product={p} onClick={() => onEdit(p)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlatProductGrid({ products, onEdit }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {products.map(p => <ProductCard key={p.id} product={p} onClick={() => onEdit(p)} />)}
    </div>
  );
}

function ProductCard({ product, onClick }) {
  const col = COLLECTIONS.find(c => c.id === product.collection) || COLLECTIONS[COLLECTIONS.length - 1];
  const prio = PRIORITIES.find(p => p.id === product.priority) || PRIORITIES[3];
  return (
    <div onClick={onClick} style={{ background: '#FFF', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid rgba(15,15,15,0.06)' }}>
      <div style={{ aspectRatio: '1', background: product.photo ? '#F0F0F0' : '#F5F1E8', position: 'relative', overflow: 'hidden' }}>
        {product.photo ? (
          <img src={product.photo} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC' }}><ImageIcon size={32} /></div>
        )}
        {product.supplierPhoto && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFF', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            <img src={product.supplierPhoto} alt="prov" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', padding: '3px 8px', borderRadius: 100, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: col.color, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
          {col.name}
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8, background: prio.color, color: '#FFF', padding: '3px 6px', borderRadius: 6, fontSize: 9, fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
          {prio.icon}
        </div>
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 500, lineHeight: 1.2, marginBottom: 4, color: '#0F0F0F', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name || 'Sin nombre'}
        </div>
        {product.supplier && (
          <div style={{ fontSize: 10, color: '#888', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: 4 }}>
            {product.supplier}{product.booth ? ` · ${product.booth}` : ''}
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#3D1D4E' }}>
          {formatCurrency(product.unitCost, product.currency)}
          {product.minOrder && <span style={{ fontSize: 10, color: '#888', fontWeight: 400, marginLeft: 6 }}>· MOQ {product.minOrder}</span>}
        </div>
      </div>
    </div>
  );
}

// ===== QR READER (photo-based, works inside iframes) =====
function QRScanner({ onResult, onCancel }) {
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const processQRImage = async (file) => {
    setProcessing(true);
    setErrorMsg('');
    try {
      const jsQRfn = await loadJsQR();
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          // Scale down very large images for faster QR detection
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = maxDim / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          const code = jsQRfn(imageData.data, imageData.width, imageData.height);
          setProcessing(false);
          if (code) {
            onResult(code.data);
          } else {
            setErrorMsg('No se pudo detectar un QR en esta foto. Probá acercándote más al código, con buena luz, y que el QR ocupe la mayor parte del cuadro.');
          }
        };
        img.onerror = () => {
          setProcessing(false);
          setErrorMsg('No se pudo leer la imagen.');
        };
        img.src = ev.target.result;
      };
      reader.onerror = () => {
        setProcessing(false);
        setErrorMsg('Error leyendo el archivo.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setProcessing(false);
      setErrorMsg('No se pudo cargar el lector de QR. Revisá tu conexión.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processQRImage(file);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0F0F0F', paddingBottom: 40 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF6EB' }}>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Cancelar</span>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontStyle: 'italic', color: '#3D1D4E' }}>Leer QR del proveedor</div>
        <div style={{ width: 80 }} />
      </header>

      <div style={{ padding: '32px 20px', maxWidth: 500, margin: '0 auto' }}>
        {/* Icon + headline */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(29,43,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <QrCode size={40} color="#1D2B4A" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontStyle: 'italic', fontWeight: 400, color: '#1D2B4A', marginBottom: 10, lineHeight: 1.1 }}>
            Sacale foto al QR
          </h2>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5, maxWidth: 360, margin: '0 auto' }}>
            Apuntá con la cámara al QR de la tarjeta o WeChat del proveedor. La app lee los datos y los carga solos en el formulario.
          </p>
        </div>

        {processing ? (
          <div style={{ padding: 40, textAlign: 'center', background: '#FFF', borderRadius: 14, border: '1px solid rgba(15,15,15,0.08)' }}>
            <Loader2 size={32} color="#3D1D4E" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 14, color: '#3D1D4E', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Buscando QR en la foto…</div>
          </div>
        ) : (
          <>
            {/* PRIMARY: take photo */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '22px 16px',
                background: 'linear-gradient(135deg, #1D2B4A 0%, #3D1D4E 100%)',
                color: '#F4EFE3',
                border: 'none',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 12,
                boxShadow: '0 6px 20px -6px rgba(29,43,74,0.4)',
              }}
            >
              <Camera size={24} strokeWidth={1.6} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.02em' }}>Tomar foto del QR</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>Abre la cámara del celular</div>
              </div>
            </button>

            {/* SECONDARY: gallery */}
            <button
              onClick={() => galleryInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '16px',
                background: '#FFF',
                color: '#333',
                border: '1px solid rgba(15,15,15,0.15)',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <Upload size={18} strokeWidth={1.6} />
              <span style={{ fontSize: 14 }}>Subir desde galería</span>
            </button>

            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </>
        )}

        {errorMsg && (
          <div style={{ marginTop: 20, padding: 14, background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 10, fontSize: 13, color: '#B23A3A', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ lineHeight: 1.5 }}>{errorMsg}</span>
          </div>
        )}

        {/* Tips */}
        <div style={{ marginTop: 32, padding: 16, background: 'rgba(61,29,78,0.04)', borderRadius: 12, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3D1D4E', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 8 }}>
            Consejos para mejor lectura
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <li style={{ marginBottom: 4 }}>El QR tiene que ocupar la mayor parte del cuadro</li>
            <li style={{ marginBottom: 4 }}>Evitá reflejos y sombras sobre el código</li>
            <li style={{ marginBottom: 4 }}>Si es un QR de WeChat en pantalla, sacale foto a la pantalla</li>
            <li>Si no lee, aumentá el zoom antes de tomar la foto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== PRODUCT FORM =====
function ProductForm({ product, onSave, onCancel, onDelete }) {
  const [name, setName] = useState(product?.name || '');
  const [photo, setPhoto] = useState(product?.photo || '');
  const [supplierPhoto, setSupplierPhoto] = useState(product?.supplierPhoto || '');
  const [category, setCategory] = useState(product?.category || '');
  const [supplier, setSupplier] = useState(product?.supplier || '');
  const [code, setCode] = useState(product?.code || '');
  const [booth, setBooth] = useState(product?.booth || '');
  const [wechatId, setWechatId] = useState(product?.wechatId || '');
  const [whatsappEmail, setWhatsappEmail] = useState(product?.whatsappEmail || '');
  const [phone, setPhone] = useState(product?.phone || '');
  const [website, setWebsite] = useState(product?.website || '');
  const [unitCost, setUnitCost] = useState(product?.unitCost || '');
  const [currency, setCurrency] = useState(product?.currency || 'USD');
  const [minOrder, setMinOrder] = useState(product?.minOrder || '');
  const [leadTime, setLeadTime] = useState(product?.leadTime || '');
  const [collection, setCollection] = useState(product?.collection || 'unassigned');
  const [priority, setPriority] = useState(product?.priority || 'pending');
  const [notes, setNotes] = useState(product?.notes || '');
  const [aiRecommendation, setAiRecommendation] = useState(product?.aiRecommendation || null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [showSendMenu, setShowSendMenu] = useState(false);
  const productPhotoRef = useRef(null);
  const productCamRef = useRef(null);
  const supplierPhotoRef = useRef(null);
  const supplierCamRef = useRef(null);

  useEffect(() => {
    if (collection === 'unassigned' && (name || category || notes)) {
      const suggested = suggestCollection(name, category, notes);
      if (suggested !== 'unassigned') setCollection(suggested);
    }
  }, [name, category, notes]);

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 1200;
        let { width, height } = img;
        if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const askAI = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await getAIRecommendation({ name, photo, category, supplier, notes, unitCost, currency, minOrder });
      setAiRecommendation(result);
      if (collection === 'unassigned' && result.collection) setCollection(result.collection);
    } catch (e) {
      console.error('AI error', e);
      setAiError(e.message || 'Error desconocido');
    }
    setAiLoading(false);
  };

  const useLocalSuggestion = () => {
    const local = getLocalRecommendation({ name, category, notes });
    setAiRecommendation(local);
    setAiError(null);
    if (collection === 'unassigned' && local.collection !== 'unassigned') {
      setCollection(local.collection);
    }
  };

  const handleQRResult = (data) => {
    setShowQRScanner(false);
    const parsed = parseQRData(data);
    setQrResult(parsed);
    // Auto-fill fields if empty
    if (!supplier && parsed.supplier) setSupplier(parsed.supplier);
    if (!wechatId && parsed.wechatId) setWechatId(parsed.wechatId);
    if (!whatsappEmail && parsed.whatsappEmail) setWhatsappEmail(parsed.whatsappEmail);
    if (!phone && parsed.phone) setPhone(parsed.phone);
    if (!website && parsed.website) setWebsite(parsed.website);
  };

  const sendViaWeChat = () => {
    const message = buildWeChatMessage();
    // Copy message to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
    }
    // Try to open WeChat via URL scheme (works on iOS/Android if installed)
    const weixinUrl = `weixin://`;
    window.location.href = weixinUrl;
    // Download photo
    if (photo) {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = photo;
        a.download = `${name || 'producto'}.jpg`;
        a.click();
      }, 500);
    }
    setShowSendMenu(false);
  };

  const copyProductInfo = () => {
    const message = buildWeChatMessage();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        alert('Mensaje copiado. Pegalo en WeChat y adjuntá la foto.');
      });
    }
    setShowSendMenu(false);
  };

  const downloadPhoto = () => {
    if (!photo) return;
    const a = document.createElement('a');
    a.href = photo;
    a.download = `${name || 'producto'}-${code || Date.now()}.jpg`;
    a.click();
    setShowSendMenu(false);
  };

  const buildWeChatMessage = () => {
    return `Hi! I'm interested in this product from your booth ${booth || ''}:

📦 ${name}
${code ? `Code: ${code}\n` : ''}${category ? `Category: ${category}\n` : ''}${unitCost ? `Price seen: ${formatCurrency(unitCost, currency)}\n` : ''}${minOrder ? `MOQ: ${minOrder}\n` : ''}
Could you please confirm:
- Current price
- MOQ
- Lead time
- Available customizations

Thank you!
— Kala Aromas (Argentina)`;
  };

  const handleSubmit = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    await onSave({
      id: product?.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name, photo, supplierPhoto, category, supplier, code, booth,
      wechatId, whatsappEmail, phone, website,
      unitCost, currency, minOrder, leadTime, collection, priority, notes, aiRecommendation,
      createdAt: product?.createdAt || now, updatedAt: now,
    });
    setSaving(false);
  };

  if (showQRScanner) {
    return <QRScanner onResult={handleQRResult} onCancel={() => setShowQRScanner(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0F0F0F', paddingBottom: 140 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#FAF6EB', zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Volver</span>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontStyle: 'italic', color: '#3D1D4E' }}>{product ? 'Editar' : 'Nuevo producto'}</div>
        {onDelete ? <button onClick={onDelete} style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: '#B23A3A' }}><Trash2 size={18} /></button> : <div style={{ width: 32 }} />}
      </header>

      <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
        {/* PRODUCT PHOTO */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Foto del producto</label>
          {photo ? (
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#EEE' }}>
              <img src={photo} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => setPhoto('')} style={photoDeleteBtn}><X size={16} /></button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => productCamRef.current?.click()} style={photoUploadBtn('#3D1D4E')}>
                <Camera size={32} strokeWidth={1.4} />
                <span style={photoUploadLabel}>Tomar foto</span>
              </button>
              <button onClick={() => productPhotoRef.current?.click()} style={photoUploadBtn('#888')}>
                <Upload size={32} strokeWidth={1.4} />
                <span style={photoUploadLabel}>Galería</span>
              </button>
            </div>
          )}
          <input ref={productCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && compressImage(e.target.files[0], setPhoto)} style={{ display: 'none' }} />
          <input ref={productPhotoRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && compressImage(e.target.files[0], setPhoto)} style={{ display: 'none' }} />
        </div>

        {/* SUPPLIER PHOTO */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>
            <Building2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Foto del proveedor / stand / tarjeta
          </label>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8, marginTop: -2 }}>
            Sacale foto a la tarjeta, al cartel del stand o al representante.
          </div>
          {supplierPhoto ? (
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#EEE' }}>
              <img src={supplierPhoto} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              <button onClick={() => setSupplierPhoto('')} style={photoDeleteBtn}><X size={16} /></button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => supplierCamRef.current?.click()} style={{ ...photoUploadBtn('#1D2B4A'), aspectRatio: 'unset', height: 100 }}>
                <Camera size={24} strokeWidth={1.4} />
                <span style={{ ...photoUploadLabel, fontSize: 10 }}>Tomar foto</span>
              </button>
              <button onClick={() => supplierPhotoRef.current?.click()} style={{ ...photoUploadBtn('#888'), aspectRatio: 'unset', height: 100 }}>
                <Upload size={24} strokeWidth={1.4} />
                <span style={{ ...photoUploadLabel, fontSize: 10 }}>Galería</span>
              </button>
            </div>
          )}
          <input ref={supplierCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && compressImage(e.target.files[0], setSupplierPhoto)} style={{ display: 'none' }} />
          <input ref={supplierPhotoRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && compressImage(e.target.files[0], setSupplierPhoto)} style={{ display: 'none' }} />
        </div>

        <Field label="Nombre del producto *">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Difusor vidrio ámbar 200ml" style={inputStyle} />
        </Field>

        <Field label="Categoría">
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Elegir…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        {/* ===== SUPPLIER BLOCK ===== */}
        <div style={{ background: 'rgba(29,43,74,0.05)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1D2B4A', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
              Proveedor y contacto
            </div>
            <button
              onClick={() => setShowQRScanner(true)}
              style={{ background: '#1D2B4A', color: '#FFF', border: 'none', padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            >
              <QrCode size={14} /> Escanear QR
            </button>
          </div>

          {qrResult && (
            <div style={{ marginBottom: 12, padding: 10, background: '#E8F5E9', borderRadius: 8, fontSize: 12, color: '#2C7A3E', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Check size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>QR escaneado</strong> — los datos se cargaron abajo. Revisalos y ajustá si hace falta.
                <button onClick={() => setQrResult(null)} style={{ background: 'transparent', border: 'none', color: '#2C7A3E', fontSize: 11, marginTop: 4, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Ver data cruda</button>
                {qrResult && qrResult.rawData && (
                  <div style={{ marginTop: 6, padding: 8, background: '#FFF', borderRadius: 6, fontSize: 10, color: '#666', wordBreak: 'break-all', fontFamily: 'ui-monospace, monospace' }}>
                    {qrResult.rawData}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <Field label="Proveedor" compact>
              <input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nombre empresa" style={inputStyle} />
            </Field>
            <Field label="Stand" compact>
              <input value={booth} onChange={e => setBooth(e.target.value)} placeholder="Nº" style={inputStyle} />
            </Field>
          </div>

          <div style={{ marginTop: 8 }}>
            <Field label={<><MessageCircle size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />WeChat ID</>} compact>
              <input value={wechatId} onChange={e => setWechatId(e.target.value)} placeholder="ID o número de WeChat" style={inputStyle} />
            </Field>
          </div>

          <div style={{ marginTop: 8 }}>
            <Field label={<><Mail size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />WhatsApp / Email</>} compact>
              <input value={whatsappEmail} onChange={e => setWhatsappEmail(e.target.value)} placeholder="+86... o email@empresa.com" style={inputStyle} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
            <Field label={<><Phone size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Teléfono</>} compact>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Tel" style={inputStyle} />
            </Field>
            <Field label="Código proveedor" compact>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="SKU / modelo" style={inputStyle} />
            </Field>
          </div>

          {website && (
            <div style={{ marginTop: 10, padding: 8, background: '#FFF', borderRadius: 6, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={12} color="#888" />
              <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: '#1D2B4A', wordBreak: 'break-all' }}>{website}</a>
            </div>
          )}
        </div>

        {/* PRECIOS */}
        <div style={{ background: 'rgba(61,29,78,0.05)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3D1D4E', marginBottom: 10, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
            Precio y cantidades
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <Field label="Costo unitario" compact>
              <input type="number" inputMode="decimal" step="0.01" value={unitCost} onChange={e => setUnitCost(e.target.value)} placeholder="0.00" style={inputStyle} />
            </Field>
            <Field label="Moneda" compact>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
                <option value="USD">USD</option>
                <option value="CNY">CNY (¥)</option>
                <option value="ARS">ARS</option>
              </select>
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
            <Field label="MOQ" compact>
              <input type="number" inputMode="numeric" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="500" style={inputStyle} />
            </Field>
            <Field label="Lead time" compact>
              <input value={leadTime} onChange={e => setLeadTime(e.target.value)} placeholder="30 días" style={inputStyle} />
            </Field>
          </div>
          {unitCost && minOrder && (
            <div style={{ marginTop: 10, padding: 10, background: '#FFF', borderRadius: 8, fontSize: 13, color: '#333' }}>
              <strong>Total mínimo:</strong> {formatCurrency(parseFloat(unitCost) * parseFloat(minOrder), currency)}
            </div>
          )}
        </div>

        {/* AI */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={askAI} disabled={!name || aiLoading} style={{ width: '100%', padding: '14px 16px', background: !name ? '#CCC' : (aiRecommendation ? 'rgba(61,29,78,0.08)' : 'linear-gradient(135deg, #3D1D4E 0%, #5A2D6E 100%)'), color: !name ? '#888' : (aiRecommendation ? '#3D1D4E' : '#F4EFE3'), border: aiRecommendation ? '1px solid rgba(61,29,78,0.25)' : 'none', borderRadius: 12, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', cursor: !name || aiLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {aiLoading ? (<><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analizando…</>) : (<><Sparkles size={16} /> {aiRecommendation ? 'Consultar de nuevo a Kala AI' : 'Preguntarle a Kala AI'}</>)}
          </button>

          {aiError && (
            <div style={{ marginTop: 10, padding: 12, background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 10, fontSize: 12, color: '#B23A3A' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>La IA visual no está disponible</div>
                  <div style={{ fontSize: 11, opacity: 0.9, lineHeight: 1.5, wordBreak: 'break-word', marginBottom: 6 }}>
                    {aiError}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.75, lineHeight: 1.5, fontStyle: 'italic' }}>
                    Tip: la IA visual funciona en desktop (claude.ai) o si deployás la app a dominio propio. Desde la app de Claude en iPhone puede estar limitada. Mientras tanto, podés usar el análisis local por palabras clave, que sí funciona offline.
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button onClick={askAI} style={{ padding: '10px', background: '#FFF', border: '1px solid #F5C5C5', color: '#B23A3A', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  Reintentar IA
                </button>
                <button onClick={useLocalSuggestion} style={{ padding: '10px', background: '#3D1D4E', border: 'none', color: '#F4EFE3', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  Análisis local
                </button>
              </div>
            </div>
          )}

          {aiRecommendation && (
            <div style={{ marginTop: 12, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(61,29,78,0.15)', background: '#FFF' }}>
              <div style={{ padding: '12px 14px', background: aiRecommendation.isLocal ? 'linear-gradient(135deg, rgba(200,138,46,0.08) 0%, rgba(200,138,46,0.02) 100%)' : 'linear-gradient(135deg, rgba(61,29,78,0.06) 0%, rgba(61,29,78,0.02) 100%)', borderBottom: '1px solid rgba(61,29,78,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} color={aiRecommendation.isLocal ? '#C88A2E' : '#3D1D4E'} />
                <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: aiRecommendation.isLocal ? '#C88A2E' : '#3D1D4E', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
                  {aiRecommendation.isLocal ? 'Sugerencia local' : 'Kala AI recomienda'}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: '#888', fontStyle: 'italic' }}>Confianza: {aiRecommendation.confidence}</span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontStyle: 'italic', color: COLLECTIONS.find(c => c.id === aiRecommendation.collection)?.color || '#3D1D4E', lineHeight: 1, marginBottom: 8 }}>
                  {aiRecommendation.collectionName}
                </div>
                <div style={{ fontSize: 13, color: '#333', lineHeight: 1.55, marginBottom: 14 }}>{aiRecommendation.reasoning}</div>

                {/* CRITERIA BREAKDOWN */}
                {aiRecommendation.criteria && (
                  <div style={{ marginBottom: 14, padding: 12, background: '#FAF6EB', borderRadius: 10, border: '1px solid rgba(15,15,15,0.06)' }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3D1D4E', marginBottom: 10, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
                      Análisis por criterio
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { key: 'aesthetic', label: 'Estético' },
                        { key: 'olfactory', label: 'Olfativo' },
                        { key: 'material', label: 'Material' },
                        { key: 'chromatic', label: 'Cromático' },
                        { key: 'positioning', label: 'Posicionamiento' },
                      ].map(({ key, label }) => {
                        const crit = aiRecommendation.criteria[key];
                        if (!crit) return null;
                        const critCol = COLLECTIONS.find(c => c.id === crit.collectionId);
                        const isMainMatch = crit.collectionId === aiRecommendation.collection;
                        return (
                          <div key={key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 90, flexShrink: 0 }}>
                              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', fontFamily: 'ui-monospace, monospace', fontWeight: 600, lineHeight: 1.3 }}>
                                {label}
                              </div>
                              {critCol && (
                                <div style={{ marginTop: 4, display: 'inline-block', padding: '2px 7px', borderRadius: 100, background: critCol.color, color: '#FFF', fontSize: 9, fontWeight: 600, fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '0.01em' }}>
                                  {critCol.name}{isMainMatch ? ' ✓' : ''}
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1, fontSize: 12, color: '#333', lineHeight: 1.45, paddingTop: 1 }}>
                              {crit.observation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {aiRecommendation.suggestedNotes?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 6, fontFamily: 'ui-monospace, monospace' }}>Notas sugeridas</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {aiRecommendation.suggestedNotes.map((n, i) => (
                        <span key={i} style={{ padding: '4px 10px', background: 'rgba(61,29,78,0.08)', color: '#3D1D4E', borderRadius: 100, fontSize: 11 }}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}
                {aiRecommendation.storyLine && (
                  <div style={{ padding: 10, background: '#FAF6EB', borderRadius: 8, borderLeft: '3px solid #3D1D4E', fontSize: 13, fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#333', marginBottom: 12 }}>
                    "{aiRecommendation.storyLine}"
                  </div>
                )}
                {aiRecommendation.strategicNote && (
                  <div style={{ padding: 10, background: 'rgba(29,43,74,0.06)', borderRadius: 8, borderLeft: '3px solid #1D2B4A', fontSize: 12, color: '#1D2B4A', marginBottom: 12, lineHeight: 1.5 }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1D2B4A', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 4, opacity: 0.8 }}>Nota estratégica</div>
                    {aiRecommendation.strategicNote}
                  </div>
                )}
                {aiRecommendation.warning && (
                  <div style={{ padding: 10, background: '#FFF8E8', borderRadius: 8, borderLeft: '3px solid #C88A2E', fontSize: 12, color: '#6B4518', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 2 }} /><span>{aiRecommendation.warning}</span>
                  </div>
                )}
                {collection !== aiRecommendation.collection && (
                  <button onClick={() => setCollection(aiRecommendation.collection)} style={{ marginTop: 12, width: '100%', padding: '9px 12px', background: '#3D1D4E', color: '#F4EFE3', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Check size={13} /> Aplicar esta sugerencia
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <Field label="Colección 2027">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {COLLECTIONS.map(c => (
              <button key={c.id} type="button" onClick={() => setCollection(c.id)} style={{ padding: '10px 12px', borderRadius: 10, border: collection === c.id ? `2px solid ${c.color}` : '1px solid rgba(15,15,15,0.12)', background: collection === c.id ? c.color : '#FFF', color: collection === c.id ? '#FFF' : '#333', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', fontWeight: 500, lineHeight: 1 }}>{c.name}</div>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginTop: 3, fontFamily: 'ui-monospace, monospace' }}>{c.subtitle}</div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Decisión">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {PRIORITIES.map(p => (
              <button key={p.id} type="button" onClick={() => setPriority(p.id)} style={{ padding: '10px 6px', borderRadius: 10, border: priority === p.id ? `2px solid ${p.color}` : '1px solid rgba(15,15,15,0.12)', background: priority === p.id ? p.color : '#FFF', color: priority === p.id ? '#FFF' : '#555', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ fontSize: 10 }}>{p.icon}</div>
                <div>{p.label}</div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Notas">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Materiales, alternativas, observaciones…" rows={3} style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
        </Field>

        {/* SEND VIA WECHAT */}
        {photo && name && (
          <div style={{ marginTop: 20, padding: 14, background: 'linear-gradient(135deg, rgba(7,193,96,0.08) 0%, rgba(7,193,96,0.04) 100%)', border: '1px solid rgba(7,193,96,0.25)', borderRadius: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#07C160', marginBottom: 10, fontFamily: 'ui-monospace, monospace', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageCircle size={13} /> Enviar al proveedor
            </div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>
              Compartí la foto + datos del producto con el proveedor vía WeChat, para que no se olvide qué le estás consultando.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <button onClick={sendViaWeChat} style={{ padding: '11px', background: '#07C160', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <MessageCircle size={14} /> Abrir WeChat
              </button>
              <button onClick={copyProductInfo} style={{ padding: '11px', background: '#FFF', color: '#07C160', border: '1px solid rgba(7,193,96,0.4)', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Copy size={14} /> Copiar mensaje
              </button>
            </div>
            <button onClick={downloadPhoto} style={{ marginTop: 8, width: '100%', padding: '9px', background: 'transparent', color: '#07C160', border: '1px dashed rgba(7,193,96,0.35)', borderRadius: 10, fontSize: 11, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Download size={13} /> Descargar foto para enviar
            </button>
            <div style={{ marginTop: 10, fontSize: 10, color: '#888', lineHeight: 1.5 }}>
              "Abrir WeChat" copia el mensaje y descarga la foto. Pegá el texto y adjuntá la foto al chat del proveedor.
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 16, background: 'linear-gradient(to top, #FAF6EB 60%, transparent)', zIndex: 10 }}>
        <button onClick={handleSubmit} disabled={!name || saving} style={{ width: '100%', padding: '16px', background: name ? '#3D1D4E' : '#CCC', color: '#F4EFE3', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, letterSpacing: '0.05em', cursor: name ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {saving ? 'Guardando…' : (<><Check size={18} /> {product ? 'Guardar cambios' : 'Guardar producto'}</>)}
        </button>
      </div>
    </div>
  );
}

function StatusView({ products, onBack, onEdit }) {
  const [tab, setTab] = useState('must');
  const byStatus = PRIORITIES.reduce((acc, p) => { acc[p.id] = products.filter(pr => pr.priority === p.id); return acc; }, {});
  const currentList = byStatus[tab] || [];
  const currentPrio = PRIORITIES.find(p => p.id === tab);
  const grouped = COLLECTIONS.map(c => ({ ...c, items: currentList.filter(p => p.collection === c.id) })).filter(c => c.items.length > 0);
  const totalCost = currentList.reduce((s, p) => s + (parseFloat(p.unitCost || 0) * parseFloat(p.minOrder || 1)), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 40 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', background: '#FAF6EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
            <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Volver</span>
          </button>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#3D1D4E' }}>Listados</div>
          <div style={{ width: 32 }} />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {PRIORITIES.map(p => {
            const count = byStatus[p.id]?.length || 0;
            const active = tab === p.id;
            return (
              <button key={p.id} onClick={() => setTab(p.id)} style={{ flex: '1 0 auto', padding: '10px 12px', borderRadius: 10, border: active ? `2px solid ${p.color}` : '1px solid rgba(15,15,15,0.12)', background: active ? p.color : '#FFF', color: active ? '#FFF' : '#555', cursor: 'pointer', textAlign: 'center', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{p.short}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 300, lineHeight: 1, marginTop: 4 }}>{count}</div>
              </button>
            );
          })}
        </div>
      </header>

      <div style={{ padding: 16 }}>
        {tab === 'must' && currentList.length > 0 && (
          <div style={{ marginBottom: 20, padding: 16, background: '#2C7A3E', color: '#FFF', borderRadius: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8, fontFamily: 'ui-monospace, monospace', marginBottom: 4 }}>Total estimado para comprar</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, lineHeight: 1 }}>
              US$ {totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 6 }}>Sumando MOQ × costo unitario de cada producto confirmado</div>
          </div>
        )}

        {currentList.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>{currentPrio?.icon}</div>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, marginBottom: 6 }}>Todavía no hay productos acá</div>
            <div style={{ fontSize: 12 }}>Los productos con decisión "{currentPrio?.label}" van a aparecer en esta lista</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {grouped.map(c => (
              <div key={c.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${c.color}` }}>
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: c.color, lineHeight: 1 }}>{c.name}</div>
                    <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{c.subtitle}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>{c.items.length}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.items.map(p => (
                    <div key={p.id} onClick={() => onEdit(p)} style={{ display: 'flex', gap: 12, padding: 10, background: '#FFF', borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(15,15,15,0.05)' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F5F1E8' }}>
                        {p.photo ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC' }}><ImageIcon size={20} /></div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 500, lineHeight: 1.2, marginBottom: 3 }}>{p.name || 'Sin nombre'}</div>
                        {p.supplier && <div style={{ fontSize: 10, color: '#888', fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{p.supplier}{p.booth ? ` · ${p.booth}` : ''}</div>}
                        <div style={{ fontSize: 12, color: '#3D1D4E', fontWeight: 600 }}>
                          {formatCurrency(p.unitCost, p.currency)}
                          {p.minOrder && <span style={{ color: '#888', fontWeight: 400, fontSize: 11, marginLeft: 6 }}>× {p.minOrder} = {formatCurrency(parseFloat(p.unitCost || 0) * parseFloat(p.minOrder || 0), p.currency)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== INSPO BOARDS (álbumes curados por el equipo) =====
function InspoBoards({ onBack, onOpenAlbum, onNewAlbum }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const ids = await loadAlbumsIndex();
      const loaded = [];
      for (const id of ids) {
        const a = await loadAlbum(id);
        if (a) loaded.push(a);
      }
      loaded.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      setAlbums(loaded);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 40 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#FAF6EB', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Volver</span>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#3D1D4E' }}>Inspiración</div>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: '20px 16px 12px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10, color: '#3D1D4E' }}>
          Tus álbumes de <em style={{ fontStyle: 'italic' }}>inspo</em>
        </h2>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.55, marginBottom: 20 }}>
          Creá un álbum, subí fotos que te inspiren (de Instagram, Expo, libros, walks), escribí notas. Cuando tengas varias imágenes, Kala AI te genera un concepto de colección y te dice con qué aromas se cruza.
        </p>
      </div>

      <div style={{ padding: '0 16px 20px', maxWidth: 700, margin: '0 auto' }}>
        <button
          onClick={onNewAlbum}
          style={{
            width: '100%',
            padding: '18px 20px',
            background: 'linear-gradient(135deg, #3D1D4E 0%, #1D2B4A 100%)',
            color: '#FFF',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(61,29,78,0.2)',
          }}
        >
          <Plus size={18} /> Crear álbum nuevo
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
          <Loader2 size={24} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : albums.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(61,29,78,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ImageIcon size={28} color="#3D1D4E" />
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic', color: '#3D1D4E', marginBottom: 8 }}>
            Empezá tu primer álbum
          </div>
          <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
            Nombralo como vos quieras — "Cocinas domingueras", "Ceramistas argentinos", "Tipografías 2027". La IA después descubre el concepto mirando tus fotos.
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 16px 40px', maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} onClick={() => onOpenAlbum(album.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlbumCard({ album, onClick }) {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [itemCount, setItemCount] = useState(album.items?.length || 0);

  useEffect(() => {
    (async () => {
      if (album.items?.length > 0) {
        // Pick most recent as cover
        for (const id of album.items) {
          const item = await loadAlbumItem(id);
          if (item?.photo) {
            setCoverPhoto(item.photo);
            break;
          }
        }
      }
    })();
  }, [album.id]);

  const hasConcept = !!album.concept?.conceptName;

  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: 0,
        border: 'none',
        borderRadius: 14,
        background: '#FFF',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ aspectRatio: '1 / 1', background: coverPhoto ? `url(${coverPhoto}) center/cover` : 'linear-gradient(135deg, #F0EAD8, #DCD0B8)', position: 'relative' }}>
        {!coverPhoto && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A89A82' }}>
            <ImageIcon size={32} />
          </div>
        )}
        {hasConcept && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(61,29,78,0.9)', color: '#FFF', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={9} /> IA
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 500, color: '#222', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {album.name}
        </div>
        {hasConcept && (
          <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 11, color: '#3D1D4E', lineHeight: 1.3 }}>
            "{album.concept.conceptName}"
          </div>
        )}
        <div style={{ fontSize: 10, color: '#999', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 'auto' }}>
          {itemCount} {itemCount === 1 ? 'foto' : 'fotos'}
        </div>
      </div>
    </button>
  );
}

// ===== ALBUM DETAIL (ver fotos, subir, generar concepto) =====
function AlbumDetail({ albumId, onBack, onDeleted }) {
  const [album, setAlbum] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempDesc, setTempDesc] = useState('');
  const [noteForNewPhoto, setNoteForNewPhoto] = useState('');
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [aiError, setAiError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { load(); }, [albumId]);

  async function load() {
    const a = await loadAlbum(albumId);
    if (!a) { onBack(); return; }
    setAlbum(a);
    setTempName(a.name);
    setTempDesc(a.description || '');
    const its = await loadAlbumItems(a);
    setItems(its);
    setLoading(false);
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const photo = await compressImage(file, 1400, 0.72);
      setPendingPhoto(photo);
      setShowNoteModal(true);
    } catch (err) {
      alert('No se pudo procesar la imagen: ' + err.message);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function confirmAddItem() {
    if (!pendingPhoto) return;
    const item = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      photo: pendingPhoto,
      note: noteForNewPhoto.trim(),
      source: '',
      createdAt: new Date().toISOString(),
    };
    await saveAlbumItem(item);
    const updated = { ...album, items: [...(album.items || []), item.id], updatedAt: new Date().toISOString() };
    await saveAlbum(updated);
    setAlbum(updated);
    setItems([item, ...items]);
    setPendingPhoto(null);
    setNoteForNewPhoto('');
    setShowNoteModal(false);
  }

  async function handleDeleteItem(itemId) {
    if (!confirm('¿Borrar esta foto?')) return;
    await deleteAlbumItem(albumId, itemId);
    setItems(items.filter(x => x.id !== itemId));
    setAlbum({ ...album, items: album.items.filter(x => x !== itemId) });
  }

  async function handleSaveName() {
    if (!tempName.trim()) return;
    const updated = { ...album, name: tempName.trim(), description: tempDesc.trim(), updatedAt: new Date().toISOString() };
    await saveAlbum(updated);
    setAlbum(updated);
    setEditingName(false);
  }

  async function handleGenerateConcept() {
    if (items.length < 2) {
      alert('Necesitás al menos 2 fotos para que la IA pueda identificar patrones.');
      return;
    }
    setGenerating(true);
    setAiError(null);
    try {
      const concept = await generateAlbumConcept(album, items);
      const updated = { ...album, concept, conceptGeneratedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      await saveAlbum(updated);
      setAlbum(updated);
    } catch (err) {
      setAiError(err.message);
    }
    setGenerating(false);
  }

  async function handleDeleteAlbum() {
    if (!confirm(`¿Borrar el álbum "${album.name}" y todas sus fotos? No se puede deshacer.`)) return;
    await deleteAlbum(albumId);
    onDeleted();
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  }

  const concept = album.concept;

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 100 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#FAF6EB', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Álbumes</span>
        </button>
        <button onClick={handleDeleteAlbum} style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: '#B23A3A' }} title="Borrar álbum">
          <Trash2 size={18} />
        </button>
      </header>

      <div style={{ padding: '18px 16px 0', maxWidth: 700, margin: '0 auto' }}>
        {editingName ? (
          <div style={{ marginBottom: 18 }}>
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              placeholder="Nombre del álbum"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(15,15,15,0.2)', fontSize: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic', background: '#FFF', marginBottom: 8, boxSizing: 'border-box' }}
              autoFocus
            />
            <textarea
              value={tempDesc}
              onChange={e => setTempDesc(e.target.value)}
              placeholder="Descripción opcional — qué querés explorar con este álbum"
              rows={2}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(15,15,15,0.2)', fontSize: 13, fontFamily: 'inherit', background: '#FFF', marginBottom: 10, resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSaveName} style={{ flex: 1, padding: '10px', background: '#3D1D4E', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Guardar</button>
              <button onClick={() => { setEditingName(false); setTempName(album.name); setTempDesc(album.description || ''); }} style={{ padding: '10px 16px', background: 'transparent', color: '#666', border: '1px solid rgba(15,15,15,0.2)', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 18 }}>
            <div onClick={() => setEditingName(true)} style={{ cursor: 'pointer' }}>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.02em', color: '#3D1D4E', lineHeight: 1.1, marginBottom: 4 }}>
                {album.name}
              </h1>
              {album.description && (
                <p style={{ fontSize: 13, color: '#777', lineHeight: 1.5 }}>
                  {album.description}
                </p>
              )}
            </div>
            <div style={{ fontSize: 10, color: '#999', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6 }}>
              {items.length} {items.length === 1 ? 'foto' : 'fotos'} · <span onClick={() => setEditingName(true)} style={{ cursor: 'pointer', color: '#3D1D4E', textDecoration: 'underline' }}>Editar</span>
            </div>
          </div>
        )}
      </div>

      {/* Concept display or CTA */}
      <div style={{ padding: '0 16px', maxWidth: 700, margin: '0 auto' }}>
        {concept ? (
          <ConceptDisplay concept={concept} onRegenerate={handleGenerateConcept} generating={generating} />
        ) : (
          <div style={{ background: 'linear-gradient(135deg, rgba(61,29,78,0.06) 0%, rgba(29,43,74,0.04) 100%)', border: '1px solid rgba(61,29,78,0.15)', borderRadius: 14, padding: 20, marginBottom: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3D1D4E', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} /> Kala AI
            </div>
            <div style={{ fontSize: 14, color: '#444', lineHeight: 1.55, marginBottom: 14 }}>
              {items.length < 2
                ? <>Subí al menos <strong>2 fotos</strong> y generá un concepto editorial con IA que cruce tu álbum con las 8 colecciones de aromas.</>
                : <>Generá un concepto editorial: patrones visuales, paleta, tendencia emergente, y cruce con las 8 colecciones de aromas.</>}
            </div>
            <button
              onClick={handleGenerateConcept}
              disabled={items.length < 2 || generating}
              style={{
                width: '100%',
                padding: '12px',
                background: items.length < 2 ? '#CCC' : 'linear-gradient(135deg, #3D1D4E 0%, #1D2B4A 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: items.length < 2 || generating ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {generating ? (<><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analizando tu curaduría…</>) : (<><Sparkles size={14} /> Generar concepto con IA</>)}
            </button>
            {aiError && (
              <div style={{ marginTop: 10, padding: 10, background: 'rgba(178,58,58,0.1)', borderRadius: 8, fontSize: 12, color: '#B23A3A' }}>
                <strong>Error:</strong> {aiError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo grid */}
      <div style={{ padding: '10px 16px 20px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#999', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
            Las fotos del álbum
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ padding: '8px 14px', background: '#3D1D4E', color: '#FFF', border: 'none', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            {uploading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={12} />} Subir foto
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', background: '#FFF', borderRadius: 12, border: '1px dashed rgba(15,15,15,0.15)' }}>
            <Upload size={28} color="#BBB" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
              Subí fotos de Instagram, Expo, libros, walks.<br />Cada una puede llevar una nota breve.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#FFF', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                <div style={{ aspectRatio: '1 / 1', background: `url(${item.photo}) center/cover` }} />
                {item.note && (
                  <div style={{ padding: '8px 10px', fontSize: 11, color: '#333', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.35, borderTop: '1px solid rgba(15,15,15,0.06)' }}>
                    {item.note}
                  </div>
                )}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.55)', color: '#FFF', border: 'none', width: 26, height: 26, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note modal when adding photo */}
      {showNoteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 14, padding: 20, maxWidth: 400, width: '100%' }}>
            {pendingPhoto && (
              <div style={{ width: '100%', aspectRatio: '1 / 1', background: `url(${pendingPhoto}) center/cover`, borderRadius: 10, marginBottom: 14 }} />
            )}
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontStyle: 'italic', color: '#3D1D4E', marginBottom: 8 }}>
              ¿Qué te llamó la atención?
            </div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 10, lineHeight: 1.4 }}>
              Una nota breve ayuda a la IA a entender tu mirada. Opcional.
            </div>
            <textarea
              value={noteForNewPhoto}
              onChange={e => setNoteForNewPhoto(e.target.value)}
              placeholder="ej: 'el color de esta cerámica', 'stand Expo pabellón 3'"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(15,15,15,0.2)', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', marginBottom: 12 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={confirmAddItem} style={{ flex: 1, padding: '11px', background: '#3D1D4E', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}>
                Agregar al álbum
              </button>
              <button onClick={() => { setShowNoteModal(false); setPendingPhoto(null); setNoteForNewPhoto(''); }} style={{ padding: '11px 16px', background: 'transparent', color: '#666', border: '1px solid rgba(15,15,15,0.2)', borderRadius: 8, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CONCEPT DISPLAY (resultado de la IA) =====
function ConceptDisplay({ concept, onRegenerate, generating }) {
  return (
    <div style={{ background: 'linear-gradient(165deg, #1a1613 0%, #2A1338 100%)', color: '#F0E6D2', borderRadius: 16, padding: 20, marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B08D57', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={11} /> Concepto generado por Kala AI
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
            {concept.conceptName}
          </h3>
          {concept.conceptTagline && (
            <div style={{ fontSize: 13, color: 'rgba(240,230,210,0.75)', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.4 }}>
              {concept.conceptTagline}
            </div>
          )}
        </div>
        <button onClick={onRegenerate} disabled={generating} style={{ background: 'rgba(255,255,255,0.1)', color: '#F0E6D2', border: '1px solid rgba(240,230,210,0.25)', borderRadius: 100, padding: '5px 10px', fontSize: 10, cursor: generating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {generating ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={10} />} Rehacer
        </button>
      </div>

      {concept.manifesto && (
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 14, lineHeight: 1.55, color: 'rgba(240,230,210,0.9)', marginBottom: 16, paddingLeft: 12, borderLeft: '2px solid #B08D57' }}>
          {concept.manifesto}
        </div>
      )}

      {/* Paleta + Materiales + Formas */}
      {concept.visualPatterns && (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B08D57', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 10 }}>
            Patrones visuales
          </div>
          {concept.visualPatterns.palette?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: 'rgba(240,230,210,0.5)', marginBottom: 5, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Paleta</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {concept.visualPatterns.palette.map((c, i) => (
                  <span key={i} style={{ padding: '3px 9px', background: 'rgba(176,141,87,0.15)', color: '#E8D4A8', borderRadius: 100, fontSize: 11, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{c}</span>
                ))}
              </div>
            </div>
          )}
          {concept.visualPatterns.materials?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: 'rgba(240,230,210,0.5)', marginBottom: 5, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Materiales</div>
              <div style={{ fontSize: 13, color: 'rgba(240,230,210,0.9)' }}>
                {concept.visualPatterns.materials.join(' · ')}
              </div>
            </div>
          )}
          {concept.visualPatterns.forms && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: 'rgba(240,230,210,0.5)', marginBottom: 4, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Formas</div>
              <div style={{ fontSize: 13, color: 'rgba(240,230,210,0.85)', lineHeight: 1.5 }}>{concept.visualPatterns.forms}</div>
            </div>
          )}
          {concept.visualPatterns.textures && (
            <div>
              <div style={{ fontSize: 10, color: 'rgba(240,230,210,0.5)', marginBottom: 4, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Texturas</div>
              <div style={{ fontSize: 13, color: 'rgba(240,230,210,0.85)', lineHeight: 1.5 }}>{concept.visualPatterns.textures}</div>
            </div>
          )}
        </div>
      )}

      {/* Tendencia emergente */}
      {concept.emergingTrend && (
        <div style={{ background: 'rgba(176,141,87,0.12)', borderLeft: '3px solid #B08D57', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B08D57', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 6 }}>
            <TrendingUp size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} /> Tendencia emergente
          </div>
          <div style={{ fontSize: 13, color: 'rgba(240,230,210,0.9)', lineHeight: 1.5 }}>
            {concept.emergingTrend}
          </div>
        </div>
      )}

      {/* Cruce con colecciones de aromas */}
      {concept.aromaticConnection?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B08D57', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 10 }}>
            Cruce con aromas Kala
          </div>
          {concept.aromaticConnection.map((conn, i) => {
            const col = COLLECTIONS.find(c => c.id === conn.collectionId);
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ background: col?.color || '#B08D57', color: '#FFF', padding: '4px 11px', borderRadius: 100, fontSize: 12, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 500 }}>
                    {conn.collectionName}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(240,230,210,0.85)', lineHeight: 1.5 }}>
                  {conn.why}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recomendaciones de sourcing */}
      {concept.sourcingRecommendations?.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 14, marginBottom: concept.warnings ? 14 : 0 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B08D57', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 10 }}>
            Para buscar en Expo / proveedores
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {concept.sourcingRecommendations.map((r, i) => (
              <li key={i} style={{ padding: '6px 0 6px 16px', borderBottom: i < concept.sourcingRecommendations.length - 1 ? '1px solid rgba(240,230,210,0.1)' : 'none', fontSize: 12.5, lineHeight: 1.5, color: 'rgba(240,230,210,0.88)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#B08D57', fontWeight: 700 }}>·</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings si hay */}
      {concept.warnings && (
        <div style={{ background: 'rgba(200,80,60,0.15)', borderLeft: '3px solid #C85040', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E08070', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <AlertCircle size={11} /> Observaciones
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,230,210,0.9)', lineHeight: 1.5 }}>
            {concept.warnings}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== NEW ALBUM MODAL =====
function NewAlbumForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const album = {
      id: 'alb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      description: desc.trim(),
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveAlbum(album);
    onSave(album.id);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: '#FAF6EB', borderRadius: 14, padding: 24, maxWidth: 440, width: '100%' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3D1D4E', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 8 }}>
          Nuevo álbum
        </div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 300, fontStyle: 'italic', color: '#3D1D4E', marginBottom: 18, letterSpacing: '-0.01em' }}>
          ¿Qué querés <em>explorar</em>?
        </h3>

        <label style={{ display: 'block', fontSize: 11, color: '#666', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
          Nombre del álbum
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ej: Cocinas domingueras, Tipografías 2027, Cerámica argentina"
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(15,15,15,0.2)', fontSize: 15, background: '#FFF', marginBottom: 14, boxSizing: 'border-box' }}
          autoFocus
        />

        <label style={{ display: 'block', fontSize: 11, color: '#666', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
          Qué estás buscando <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: '#999' }}>(opcional)</span>
        </label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Una frase para vos y la IA — ej: 'Referencias de cerámica artesanal argentina para el Ritual Kit de Chá'"
          rows={3}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(15,15,15,0.2)', fontSize: 13, fontFamily: 'inherit', background: '#FFF', marginBottom: 18, resize: 'vertical', boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            style={{ flex: 1, padding: '12px', background: !name.trim() ? '#CCC' : 'linear-gradient(135deg, #3D1D4E 0%, #1D2B4A 100%)', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: !name.trim() ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Creando…' : 'Crear álbum'}
          </button>
          <button onClick={onCancel} style={{ padding: '12px 18px', background: 'transparent', color: '#666', border: '1px solid rgba(15,15,15,0.2)', borderRadius: 10, cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== DECO TRENDS VIEW =====
function DecoTrendsView({ onBack }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const t = selected;
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 60 }}>
        {/* Hero */}
        <div style={{ background: t.bg, color: t.text, padding: '18px 16px 44px' }}>
          <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.35)', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: t.text, fontSize: 13, marginBottom: 20 }}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 8, fontFamily: 'ui-monospace, monospace' }}>
            Tendencia Deco 2026–2027
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 46, fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: 10 }}>
            {t.name}
          </h1>
          <div style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'ui-monospace, monospace', fontWeight: 500 }}>
            {t.subtitle}
          </div>
        </div>

        <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
          {/* Summary */}
          <div style={{ marginTop: -16, marginBottom: 20, background: '#FFF', borderRadius: 14, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, lineHeight: 1.55, color: '#222' }}>
              {t.summary}
            </div>
          </div>

          {/* Why matters */}
          <div style={{ marginBottom: 20, padding: 16, background: `${t.color}12`, borderRadius: 12, borderLeft: `3px solid ${t.color}` }}>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: t.color, fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 8 }}>
              Por qué importa
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: '#333' }}>
              {t.whyMatters}
            </div>
          </div>

          {/* Palette */}
          {t.palette?.length > 0 && (
            <div style={{ marginBottom: 20, padding: 16, background: '#FFF', borderRadius: 12, border: '1px solid rgba(15,15,15,0.06)' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 10 }}>
                Paleta
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.palette.map((p, i) => (
                  <span key={i} style={{ padding: '5px 11px', background: `${t.color}15`, color: t.color, borderRadius: 100, fontSize: 12, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Signals */}
          {t.signals?.length > 0 && (
            <div style={{ marginBottom: 20, background: '#FFF', borderRadius: 14, padding: 18, borderLeft: `4px solid ${t.color}` }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: t.color, fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={13} /> Señales visuales
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.signals.map((s, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: i < t.signals.length - 1 ? '1px solid rgba(15,15,15,0.06)' : 'none', fontSize: 13, lineHeight: 1.45, paddingLeft: 20, position: 'relative', color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0, color: t.color, fontWeight: 700 }}>·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* References */}
          {t.references?.length > 0 && (
            <div style={{ marginBottom: 20, padding: 16, background: '#F5F1E8', borderRadius: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 8 }}>
                Referencias
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#333', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                {t.references.join(' · ')}
              </div>
            </div>
          )}

          {/* Kala connections */}
          {t.kalaConnection?.length > 0 && (
            <div style={{ marginBottom: 16, padding: 18, background: 'linear-gradient(135deg, rgba(61,29,78,0.08) 0%, rgba(29,43,74,0.04) 100%)', borderRadius: 14, border: '1px solid rgba(61,29,78,0.15)' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3D1D4E', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 10 }}>
                Qué colecciones Kala activa
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.kalaConnection.map(colId => {
                  const col = COLLECTIONS.find(c => c.id === colId);
                  if (!col) return null;
                  return (
                    <span key={colId} style={{ padding: '7px 12px', background: col.color, color: '#FFF', borderRadius: 100, fontSize: 12, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 500 }}>
                      {col.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 40 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#FAF6EB', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Volver</span>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#3D1D4E' }}>Tendencias Deco</div>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: '20px 16px 12px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10, color: '#3D1D4E' }}>
          Las 5 <em style={{ fontStyle: 'italic' }}>tendencias</em> 2026–2027
        </h2>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.55, marginBottom: 20 }}>
          Basadas en Anthropologie, H&amp;M Home, Damson Madder y los interioristas más seguidos del año. Cada tendencia conecta con 2-3 colecciones Kala.
        </p>
      </div>

      <div style={{ padding: '0 16px 40px', maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DECO_TRENDS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            style={{
              textAlign: 'left',
              background: t.bg,
              color: t.text,
              border: 'none',
              borderRadius: 16,
              padding: '22px 22px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.7, fontFamily: 'ui-monospace, monospace', marginBottom: 4 }}>
              Tendencia 0{i + 1}
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em', lineHeight: 1, marginBottom: 5 }}>
              {t.name}
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, fontFamily: 'ui-monospace, monospace', marginBottom: 12 }}>
              {t.subtitle}
            </div>
            <div style={{ fontSize: 12, opacity: 0.88, lineHeight: 1.45, marginBottom: 12 }}>
              {t.summary.slice(0, 120)}{t.summary.length > 120 ? '…' : ''}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {t.kalaConnection.map(colId => {
                const col = COLLECTIONS.find(c => c.id === colId);
                if (!col) return null;
                return (
                  <span key={colId} style={{ padding: '3px 9px', background: 'rgba(255,255,255,0.45)', color: t.text, borderRadius: 100, fontSize: 10, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 500 }}>
                    {col.name}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 40px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ padding: 16, background: 'rgba(61,29,78,0.05)', borderRadius: 10, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
          <strong>Para la Expo:</strong> si ves un producto que claramente encaja con una de estas tendencias, pregúntate en qué colección Kala activa esa tendencia y ahí tenés la respuesta sobre posicionamiento.
        </div>
      </div>
    </div>
  );
}

// ===== COLLECTIONS GUIDE =====
function CollectionsGuide({ onBack }) {
  const [selected, setSelected] = useState(null);
  const realCollections = COLLECTIONS.filter(c => c.id !== 'unassigned');

  if (selected) {
    const c = selected;
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 60 }}>
        {/* Hero band with collection color */}
        <div style={{ background: c.bg, color: c.text, padding: '18px 16px 40px' }}>
          <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: c.text, fontSize: 13, marginBottom: 20 }}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8, fontFamily: 'ui-monospace, monospace' }}>
            Colección 2027
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 56, fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 0.9, marginBottom: 10 }}>
            {c.name}
          </h1>
          <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'ui-monospace, monospace', fontWeight: 500 }}>
            {c.subtitle}
          </div>
        </div>

        <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
          {/* Manifesto */}
          {c.manifesto && (
            <div style={{ marginTop: -16, marginBottom: 24, background: '#FFF', borderRadius: 14, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: c.color, fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 8 }}>
                Manifiesto
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, lineHeight: 1.5, color: '#222' }}>
                {c.manifesto}
              </div>
            </div>
          )}

          {/* 2027 Trend */}
          {c.trend2027 && (
            <div style={{ marginBottom: 20, background: 'linear-gradient(135deg, rgba(61,29,78,0.06) 0%, rgba(29,43,74,0.04) 100%)', border: `1px solid ${c.color}33`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <TrendingUp size={14} color={c.color} />
                <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.color, fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                  Tendencia 2026–2027
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#333' }}>
                {c.trend2027}
              </div>
            </div>
          )}

          {/* Description (factual) */}
          {c.description && (
            <div style={{ marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.6)', borderRadius: 12, border: '1px solid rgba(15,15,15,0.06)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 8 }}>
                Qué incluye
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#333' }}>
                {c.description}
              </div>
              {c.keywords?.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {c.keywords.map((k, i) => (
                    <span key={i} style={{ padding: '3px 9px', background: `${c.color}18`, color: c.color, borderRadius: 100, fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{k}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search for */}
          {c.searchFor?.length > 0 && (
            <div style={{ marginBottom: 16, background: '#FFF', borderRadius: 14, padding: 18, borderLeft: `4px solid ${c.color}` }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.color, fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={13} /> Qué buscar en la Expo
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {c.searchFor.map((item, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: i < c.searchFor.length - 1 ? '1px solid rgba(15,15,15,0.06)' : 'none', fontSize: 13, lineHeight: 1.45, paddingLeft: 20, position: 'relative', color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0, color: c.color, fontWeight: 700 }}>+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avoid */}
          {c.avoid?.length > 0 && (
            <div style={{ marginBottom: 20, background: '#FFF', borderRadius: 14, padding: 18, borderLeft: '4px solid #B23A3A' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B23A3A', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <X size={13} /> Evitar
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {c.avoid.map((item, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: i < c.avoid.length - 1 ? '1px solid rgba(15,15,15,0.06)' : 'none', fontSize: 13, lineHeight: 1.45, paddingLeft: 20, position: 'relative', color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#B23A3A', fontWeight: 700 }}>×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tensions with */}
          {c.tensionsWith && (
            <div style={{ marginBottom: 16, padding: 14, background: 'rgba(200,138,46,0.08)', borderRadius: 10, borderLeft: '3px solid #C88A2E' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C88A2E', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 6 }}>
                Tensión con otras colecciones
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: '#5a4518' }}>
                {c.tensionsWith}
              </div>
            </div>
          )}

          {/* Lives in — qué casa */}
          {c.livesIn && (
            <div style={{ marginBottom: 16, padding: 18, background: 'linear-gradient(135deg, #F5EEDC 0%, #E8DCC8 100%)', borderRadius: 14, border: `1px solid ${c.color}25` }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.color, fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 10 }}>
                La casa donde vive
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: '#3a312a', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                {c.livesIn}
              </div>
            </div>
          )}

          {/* Deco trends */}
          {c.decoTrends?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 10 }}>
                Tendencias deco que la refuerzan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.decoTrends.map(trendId => {
                  const t = DECO_TRENDS.find(x => x.id === trendId);
                  if (!t) return null;
                  return (
                    <div key={t.id} style={{ padding: '12px 14px', background: t.bg, color: t.text, borderRadius: 10, border: `1px solid ${t.color}30` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 500, fontStyle: 'italic', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 2 }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.75, fontFamily: 'ui-monospace, monospace' }}>
                            {t.subtitle}
                          </div>
                        </div>
                        <TrendingUp size={13} style={{ flexShrink: 0, marginTop: 3, opacity: 0.8 }} />
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.45, opacity: 0.92 }}>
                        {t.summary.slice(0, 140)}{t.summary.length > 140 ? '…' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Example products */}
          {c.exampleProducts && (
            <div style={{ marginBottom: 16, padding: 16, background: '#F5F1E8', borderRadius: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 8 }}>
                Ejemplos de producto
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#333', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                {c.exampleProducts}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Index view — grid of collections
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 40 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#FAF6EB', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Volver</span>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#3D1D4E' }}>Guía de colecciones</div>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: '20px 16px 12px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10, color: '#3D1D4E' }}>
          Las 8 colecciones <em style={{ fontStyle: 'italic' }}>2027</em>
        </h2>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.55, marginBottom: 20 }}>
          Tocá cada colección para ver su manifiesto, la tendencia 2026-2027 que la respalda, qué buscar y qué evitar en proveedores.
        </p>
      </div>

      <div style={{ padding: '0 16px 40px', maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {realCollections.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              textAlign: 'left',
              background: c.bg,
              color: c.text,
              border: 'none',
              borderRadius: 16,
              padding: '22px 22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.7, fontFamily: 'ui-monospace, monospace', marginBottom: 4 }}>
                N.º 0{i + 1}
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em', lineHeight: 1, marginBottom: 5 }}>
                {c.name}
              </div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, fontFamily: 'ui-monospace, monospace', marginBottom: 10 }}>
                {c.subtitle}
              </div>
              <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.45 }}>
                {c.description.slice(0, 90)}{c.description.length > 90 ? '…' : ''}
              </div>
            </div>
            <div style={{ fontSize: 24, opacity: 0.6, flexShrink: 0 }}>→</div>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ padding: 16, background: 'rgba(61,29,78,0.05)', borderRadius: 10, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
          <strong>Tip:</strong> consultá esta guía antes de acercarte a un stand. Te ayuda a decidir rápido si un producto encaja en la arquitectura 2027 antes de pedir samples o cotizar.
        </div>
      </div>
    </div>
  );
}

// ===== DASHBOARD =====
function Dashboard({ products, onBack }) {
  const byCollection = COLLECTIONS.map(c => ({ ...c, products: products.filter(p => p.collection === c.id) })).filter(c => c.products.length > 0);
  const byPriority = PRIORITIES.map(p => ({ ...p, products: products.filter(pr => pr.priority === p.id), totalCost: products.filter(pr => pr.priority === p.id).reduce((s, pr) => s + (parseFloat(pr.unitCost || 0) * parseFloat(pr.minOrder || 1)), 0) }));

  const exportCSV = () => {
    const headers = ['Nombre', 'Categoría', 'Colección', 'Decisión', 'Proveedor', 'Stand', 'WeChat', 'WhatsApp/Email', 'Teléfono', 'Código', 'Costo unit.', 'Moneda', 'MOQ', 'Total mín.', 'Lead time', 'Sugerencia AI', 'Notas'];
    const rows = products.map(p => {
      const col = COLLECTIONS.find(c => c.id === p.collection)?.name || '';
      const prio = PRIORITIES.find(pr => pr.id === p.priority)?.label || '';
      const total = (parseFloat(p.unitCost || 0) * parseFloat(p.minOrder || 1)).toFixed(2);
      const aiSugg = p.aiRecommendation ? `${p.aiRecommendation.collectionName} (${p.aiRecommendation.confidence})` : '';
      return [p.name, p.category, col, prio, p.supplier, p.booth, p.wechatId, p.whatsappEmail, p.phone, p.code, p.unitCost, p.currency, p.minOrder, total, p.leadTime, aiSugg, (p.notes || '').replace(/\n/g, ' ')]
        .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kala-expo-china-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EB', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 60 }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid rgba(15,15,15,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#FAF6EB', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 8, margin: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}>
          <ArrowLeft size={20} /><span style={{ fontSize: 14 }}>Volver</span>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#3D1D4E' }}>Dashboard</div>
        <button onClick={exportCSV} style={{ background: '#3D1D4E', color: '#F4EFE3', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <Download size={14} /> CSV
        </button>
      </header>

      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
          {byPriority.map(p => (
            <div key={p.id} style={{ background: '#FFF', borderRadius: 12, padding: 14, borderLeft: `4px solid ${p.color}` }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', fontFamily: 'ui-monospace, monospace', marginBottom: 6 }}>{p.label}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 300, color: p.color, lineHeight: 1 }}>{p.products.length}</div>
              {p.totalCost > 0 && <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>~US$ {p.totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3D1D4E', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>Por colección</div>

        {byCollection.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Todavía no hay productos cargados</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byCollection.map(c => {
              const totalMust = c.products.filter(p => p.priority === 'must').length;
              const totalCost = c.products.filter(p => p.priority === 'must').reduce((s, p) => s + (parseFloat(p.unitCost || 0) * parseFloat(p.minOrder || 1)), 0);
              return (
                <div key={c.id} style={{ background: c.bg, color: c.text, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontStyle: 'italic', fontWeight: 400, lineHeight: 1 }}>{c.name}</div>
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7, marginTop: 4, fontFamily: 'ui-monospace, monospace' }}>{c.subtitle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, lineHeight: 1 }}>{c.products.length}</div>
                      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>productos</div>
                    </div>
                  </div>
                  {totalMust > 0 && (
                    <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: 8, fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span>★★★ Para comprar: <strong>{totalMust}</strong></span>
                      <span>~US$ {totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, compact }) {
  return (
    <div style={{ marginBottom: compact ? 0 : 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', marginBottom: 6, fontFamily: 'ui-monospace, monospace', fontWeight: 500 };
const inputStyle = { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid rgba(15,15,15,0.15)', background: '#FFF', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
const photoDeleteBtn = { position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#FFF', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const photoUploadBtn = (color) => ({ aspectRatio: '1', border: `2px dashed ${color}`, borderRadius: 14, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color });
const photoUploadLabel = { fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'ui-monospace, monospace' };

const headerBtnSecondary = { background: 'transparent', border: '1px solid rgba(15,15,15,0.2)', borderRadius: 8, padding: '7px 10px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#333', fontFamily: 'ui-monospace, monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 };
const headerBtnPrimary = { background: '#3D1D4E', border: 'none', borderRadius: 8, padding: '7px 10px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F4EFE3', fontFamily: 'ui-monospace, monospace', cursor: 'pointer' };
