import * as fs from 'fs';

const sizesRoots = [
  ['perro', 'perrito', 'perrazo', '🐶'],
  ['gato', 'gatito', 'gatazo', '🐱'],
  ['casa', 'casita', 'casaza', '🏠'],
  ['coche', 'cochecito', 'cochazo', '🚗'],
  ['mesa', 'mesita', 'mesaza', '🪑'],
  ['libro', 'librito', 'librazo', '📖'],
  ['zapato', 'zapatito', 'zapatazo', '👞'],
  ['pájaro', 'pajarito', 'pajarazo', '🐦'],
  ['árbol', 'arbolito', 'arbolazo', '🌳'],
  ['vaso', 'vasito', 'vasazo', '🥛'],
  ['plato', 'platito', 'platazo', '🍽️'],
  ['barco', 'barquito', 'barcazo', '⛵'],
  ['niño', 'niñito', 'niñazo', '👦'],
  ['niña', 'niñita', 'niñaza', '👧'],
  ['flor', 'florcita', 'floraza', '🌸'],
  ['nube', 'nubecita', 'nubaza', '☁️'],
  ['sol', 'solecito', 'solazo', '☀️'],
  ['luna', 'lunita', 'lunaza', '🌙'],
  ['estrella', 'estrellita', 'estrellaza', '⭐'],
  ['oso', 'osito', 'osazo', '🐻'],
  ['león', 'leoncito', 'leonazo', '🦁'],
  ['pez', 'pececito', 'pezazo', '🐟'],
  ['globo', 'globito', 'globazo', '🎈'],
  ['caja', 'cajita', 'cajaza', '📦'],
  ['bolsa', 'bolsita', 'bolsaza', '🛍️'],
  ['mochila', 'mochilita', 'mochilaza', '🎒'],
  ['lápiz', 'lapicito', 'lapizazo', '✏️'],
  ['reloj', 'relojito', 'relojazo', '⌚'],
  ['boca', 'boquita', 'bocaza', '👄'],
  ['nariz', 'naricita', 'narizaza', '👃'],
  ['ojo', 'ojito', 'ojazo', '👁️'],
  ['oreja', 'orejita', 'orejaza', '👂'],
  ['dedo', 'dedito', 'dedazo', '☝️'],
  ['mano', 'manita', 'manaza', '🖐️'],
  ['pie', 'piececito', 'piezazo', '🦶'],
  ['brazo', 'bracito', 'brazazo', '💪'],
  ['pierna', 'piernecita', 'piernaza', '🦵'],
  ['beso', 'besito', 'besazo', '💋'],
  ['abrazo', 'abrazito', 'abrazazo', '🫂'],
  ['camisa', 'camisita', 'camisaza', '👕'],
  ['pantalón', 'pantaloncito', 'pantalonazo', '👖'],
  ['sombrero', 'sombrerito', 'sombrerazo', '🎩'],
  ['gorra', 'gorrita', 'gorraza', '🧢'],
  ['cama', 'camita', 'camaza', '🛏️'],
  ['silla', 'sillita', 'sillaza', '🪑'],
  ['puerta', 'puertecita', 'puertaza', '🚪'],
  ['ventana', 'ventanita', 'ventanaza', '🪟'],
  ['manzana', 'manzanita', 'manzanaza', '🍎'],
  ['pera', 'perita', 'peraza', '🍐'],
  ['plátano', 'platanito', 'platanazo', '🍌'],
  ['pala', 'palita', 'palaza', '⛏️']
];

const sizeQuestions: any[] = [];
sizesRoots.forEach(([w, d, a, e]) => {
  sizeQuestions.push({
    rootWord: w,
    questionText: "¿Cómo llamas a un " + w + " muy PEQUEÑO?",
    emoji: e,
    options: [
      { text: d, isCorrect: true },
      { text: a, isCorrect: false },
      { text: w, isCorrect: false }
    ].sort(() => Math.random() - 0.5)
  });
  sizeQuestions.push({
    rootWord: w,
    questionText: "¿Cómo llamas a un " + w + " muy GRANDE?",
    emoji: e,
    options: [
      { text: a, isCorrect: true },
      { text: d, isCorrect: false },
      { text: w, isCorrect: false }
    ].sort(() => Math.random() - 0.5)
  });
});

const antonymsRoots = [
  ['subir', 'bajar'], ['entrar', 'salir'], ['abrir', 'cerrar'],
  ['alegre', 'triste'], ['arriba', 'abajo'], ['limpio', 'sucio'],
  ['grande', 'pequeño'], ['alto', 'bajo'], ['gordo', 'flaco'],
  ['largo', 'corto'], ['mucho', 'poco'], ['todo', 'nada'],
  ['siempre', 'nunca'], ['antes', 'después'], ['ayer', 'hoy'],
  ['día', 'noche'], ['luz', 'oscuridad'], ['blanco', 'negro'],
  ['bueno', 'malo'], ['bonito', 'feo'], ['rico', 'pobre'],
  ['caro', 'barato'], ['fuerte', 'débil'], ['rápido', 'lento'],
  ['caliente', 'frío'], ['seco', 'mojado'], ['duro', 'blando'],
  ['pesado', 'ligero'], ['lleno', 'vacío'], ['nuevo', 'viejo'],
  ['joven', 'viejo'], ['fácil', 'difícil'], ['verdad', 'mentira'],
  ['amor', 'odio'], ['paz', 'guerra'], ['amigo', 'enemigo'],
  ['reír', 'llorar'], ['encendido', 'apagado'], ['despierto', 'dormido'],
  ['ganar', 'perder'], ['dar', 'quitar'], ['empezar', 'terminar'],
  ['nacer', 'morir'], ['comprar', 'vender'], ['preguntar', 'responder'],
  ['hablar', 'callar'], ['valiente', 'cobarde'], ['ancho', 'estrecho'],
  ['claro', 'oscuro'], ['dulce', 'amargo'], ['feliz', 'infeliz'],
  ['simpático', 'antipático'], ['silencioso', 'ruidoso'], ['divertido', 'aburrido'],
  ['cerca', 'lejos'], ['dentro', 'fuera'], ['delante', 'detrás'],
  ['temprano', 'tarde'], ['limpiar', 'ensuciar'],
  ['poner', 'quitar'], ['unir', 'separar'], ['encotrar', 'perder'],
  ['valiente', 'miedoso'], ['listo', 'torpe'], ['sano', 'enfermo'],
  ['recto', 'torcido'], ['seco', 'húmedo'], ['saludable', 'dañino'],
  ['rápido', 'despacio'], ['fresco', 'pasado'], ['mayor', 'menor'],
  ['valioso', 'inútil'], ['suave', 'áspero'], ['fácil', 'complicado'],
  ['limpio', 'manchado'], ['claro', 'borroso'],
  ['poblado', 'desierto'], ['lleno', 'desocupado'], ['famoso', 'desconocido'],
  ['cómodo', 'incómodo'], ['ordenado', 'desordenado'], ['tranquilo', 'nervioso'],
  ['atento', 'distraído'], ['puntual', 'impuntual'], ['simpático', 'odioso'],
  ['fuerte', 'flojo'], ['calor', 'frío'], ['valiente', 'tímido'],
  ['hermoso', 'horrible'], ['sabio', 'ignorante'], ['húmedo', 'árido'],
  ['silencio', 'ruido'], ['agradable', 'desagradable'], ['fácil', 'arduo'],
  ['rico', 'miserable'], ['amable', 'grosero'], ['generoso', 'egoísta']
];

const antonymsQuestions: any[] = [];
antonymsRoots.forEach(([w1, w2]) => {
  antonymsQuestions.push({
    word: w1,
    questionText: "¿Cuál es el contrario de '" + w1.toUpperCase() + "'?",
    options: [
      { text: w2, isCorrect: true },
      { text: antonymsRoots[Math.floor(Math.random() * antonymsRoots.length)][1], isCorrect: false },
      { text: antonymsRoots[Math.floor(Math.random() * antonymsRoots.length)][0], isCorrect: false }
    ].sort(() => Math.random() - 0.5)
  });
});

const verbsRoots = [
  ['Alba', 'una flor', 'pinta', 'pintó', 'pintará'],
  ['Los niños', 'en el parque', 'juegan', 'jugaron', 'jugarán'],
  ['Raúl', 'un pastel', 'cocina', 'cocinó', 'cocinará'],
  ['Mía', 'vidrio', 'recicla', 'recicló', 'reciclará'],
  ['Nosotros', 'de excursión', 'vamos', 'fuimos', 'iremos'],
  ['Ana', 'una película', 've', 'vio', 'verá'],
  ['El perro', 'un hueso', 'come', 'comió', 'comerá'],
  ['El pájaro', 'en el cielo', 'vuela', 'voló', 'volará'],
  ['El pez', 'en el agua', 'nada', 'nadó', 'nadará'],
  ['El gato', 'en el sofá', 'duerme', 'durmió', 'dormirá'],
  ['El niño', 'un libro', 'lee', 'leyó', 'leerá'],
  ['La niña', 'una canción', 'canta', 'cantó', 'cantará'],
  ['El abuelo', 'por el parque', 'pasea', 'paseó', 'paseará'],
  ['La abuela', 'un cuento', 'cuenta', 'contó', 'contará'],
  ['El coche', 'por la calle', 'conduce', 'condujo', 'conducirá'],
  ['El avión', 'en el cielo', 'vuela', 'voló', 'volará'],
  ['El tren', 'por las vías', 'viaja', 'viajó', 'viajará'],
  ['El barco', 'por el mar', 'navega', 'navegó', 'navegará'],
  ['El sol', 'en el cielo', 'brilla', 'brilló', 'brillará'],
  ['La luna', 'por la noche', 'sale', 'salió', 'saldrá'],
  ['Las estrellas', 'en el cielo', 'iluminan', 'iluminaron', 'iluminarán'],
  ['El viento', 'muy fuerte', 'sopla', 'sopló', 'soplará'],
  ['La lluvia', 'del cielo', 'cae', 'cayó', 'caerá'],
  ['La nieve', 'la montaña', 'cubre', 'cubrió', 'cubrirá'],
  ['El fuego', 'en la chimenea', 'arde', 'ardió', 'arderá'],
  ['El agua', 'en el río', 'fluye', 'fluyó', 'fluirá'],
  ['La planta', 'con el sol', 'crece', 'creció', 'crecerá'],
  ['La flor', 'en primavera', 'florece', 'floreció', 'florecerá'],
  ['El árbol', 'sus hojas', 'pierde', 'perdió', 'perderá'],
  ['El oso', 'en invierno', 'hiberna', 'hibernó', 'hibernará'],
  ['El ratón', 'queso', 'come', 'comió', 'comerá'],
  ['El león', 'en la selva', 'ruge', 'rugió', 'rugirá'],
  ['El elefante', 'con la trompa', 'toca', 'tocó', 'tocará'],
  ['La jirafa', 'hojas altas', 'alcanza', 'alcanzó', 'alcanzará'],
  ['El mono', 'por los árboles', 'salta', 'saltó', 'saltará'],
  ['María', 'la tarea', 'hace', 'hizo', 'hará'],
  ['Pedro', 'un plátano', 'pela', 'peló', 'pelará'],
  ['Los gatos', 'en el tejado', 'maúllan', 'maullaron', 'maullarán'],
  ['El perro', 'a los extraños', 'ladra', 'ladró', 'ladrará']
];

const verbsQuestions: any[] = [];
verbsRoots.forEach(([subject, predicate, pres, past, fut]) => {
  verbsQuestions.push({
    timeIndicator: 'Ayer',
    textParts: ["Ayer " + subject + " ", " " + predicate + "."],
    options: [pres, past, fut].sort(() => Math.random() - 0.5),
    correctAnswer: past
  });
  verbsQuestions.push({
    timeIndicator: 'Hoy',
    textParts: ["Hoy " + subject + " ", " " + predicate + "."],
    options: [pres, past, fut].sort(() => Math.random() - 0.5),
    correctAnswer: pres
  });
  verbsQuestions.push({
    timeIndicator: 'Mañana',
    textParts: ["Mañana " + subject + " ", " " + predicate + "."],
    options: [pres, past, fut].sort(() => Math.random() - 0.5),
    correctAnswer: fut
  });
});

const getUniqueOptions = (options: any[]) => {
  const seen = new Set();
  return options.filter(o => {
    if (seen.has(o.text)) return false;
    seen.add(o.text);
    return true;
  });
};

antonymsQuestions.forEach(q => {
  q.options = getUniqueOptions(q.options);
  while(q.options.length < 3) {
    q.options.push({text: 'otra', isCorrect: false});
  }
});
sizeQuestions.forEach(q => {
  q.options = getUniqueOptions(q.options);
  while(q.options.length < 3) {
    q.options.push({text: 'otra', isCorrect: false});
  }
});

const fileData =  "export const sizeQuestions = " + JSON.stringify(sizeQuestions.slice(0, 100).sort(()=>Math.random()-0.5), null, 2) + ";\n" +
"export const antonymsPairs = " + JSON.stringify(antonymsRoots.slice(0, 50), null, 2) + ";\n" +
"export const antonymsQuestions = " + JSON.stringify(antonymsQuestions.slice(0, 100).sort(()=>Math.random()-0.5), null, 2) + ";\n" +
"export const verbsQuestions = " + JSON.stringify(verbsQuestions.slice(0, 100).sort(()=>Math.random()-0.5), null, 2) + ";\n";

fs.writeFileSync('src/data.ts', fileData);
console.log("Data generation complete!");
