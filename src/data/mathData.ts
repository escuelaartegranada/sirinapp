// Question type definition
export interface QuestionData {
  emoji?: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
}

export const generateAdditionData = (): QuestionData[] => {
  const data: QuestionData[] = [];
  for (let i = 0; i < 100; i++) {
    // Determine if it's "con llevadas" (with carry) or "sin llevadas" (without carry)
    const withCarry = Math.random() > 0.5;
    
    let a, b;
    if (withCarry) {
      // With carry: ones digits must sum to >= 10
      const aOnes = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const bOnes = Math.floor(Math.random() * (10 - (10 - aOnes))) + (10 - aOnes); // ensures aOnes + bOnes >= 10
      const aTens = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const bTens = Math.floor(Math.random() * 4) + 1; // 1 to 4
      a = aTens * 10 + aOnes;
      b = bTens * 10 + Math.min(9, bOnes);
    } else {
      // Without carry: ones digits must sum to < 10
      const aOnes = Math.floor(Math.random() * 9); // 0 to 8
      const bOnes = Math.floor(Math.random() * (9 - aOnes)); // ensures aOnes + bOnes < 10
      const aTens = Math.floor(Math.random() * 4) + 1; 
      const bTens = Math.floor(Math.random() * 4) + 1;
      a = aTens * 10 + aOnes;
      b = bTens * 10 + bOnes;
    }

    const answer = a + b;
    const isVertical = Math.random() > 0.5;
    
    let questionText = `${a} + ${b} = ?`;
    if (isVertical) {
       questionText = `  ${a}\n+ ${b}`; // CSS will handle pre-wrap in the generic component
    }

    const options = [
      { text: answer.toString(), isCorrect: true },
      { text: (answer + Math.floor(Math.random() * 5) + 1).toString(), isCorrect: false },
      { text: (answer - Math.floor(Math.random() * 5) - 1).toString(), isCorrect: false },
    ].sort(() => Math.random() - 0.5);

    data.push({ emoji: '➕', questionText, options });
  }
  return data;
};

export const generateSubtractionData = (): QuestionData[] => {
  const data: QuestionData[] = [];
  for (let i = 0; i < 100; i++) {
    // "sin llevadas" -> aOnes >= bOnes, aTens >= bTens
    const aTens = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const bTens = Math.floor(Math.random() * aTens) + 1; // 1 to aTens
    const aOnes = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const bOnes = Math.floor(Math.random() * (aOnes + 1)); // 0 to aOnes

    const a = aTens * 10 + aOnes;
    const b = bTens * 10 + bOnes;
    const answer = a - b;

    const isVertical = Math.random() > 0.5;
    let questionText = `${a} - ${b} = ?`;
    if (isVertical) {
       questionText = `  ${a}\n- ${b}`;
    }

    const options = [
      { text: answer.toString(), isCorrect: true },
      { text: (answer + 10).toString(), isCorrect: false },
      { text: Math.max(0, answer - 10).toString(), isCorrect: false },
    ].sort(() => Math.random() - 0.5);

    data.push({ emoji: '➖', questionText, options });
  }
  return data;
};

export const additionData = generateAdditionData();
export const subtractionData = generateSubtractionData();
export const shapesData: QuestionData[] = [];
const shapeOptions = ['Cubo', 'Cilindro', 'Cono', 'Pirámide'];
const shapeObjects = [
  { text: '¿Qué cuerpo geométrico es un dado?', emoji: '🎲', correct: 'Cubo' },
  { text: '¿Qué cuerpo geométrico es una lata de refresco?', emoji: '🥫', correct: 'Cilindro' },
  { text: '¿Qué cuerpo geométrico es un gorro de fiesta?', emoji: '🥳', correct: 'Cono' },
  { text: '¿Qué cuerpo geométrico tiene forma de tienda de campaña?', emoji: '⛺', correct: 'Pirámide' },
  { text: '¿Qué cuerpo geométrico es una caja de regalo?', emoji: '🎁', correct: 'Cubo' },
  { text: '¿Qué cuerpo geométrico es un bote de pintura?', emoji: '🛢️', correct: 'Cilindro' },
  { text: '¿Qué cuerpo geométrico es un cucurucho de helado?', emoji: '🍦', correct: 'Cono' },
  { text: '¿Qué cuerpo geométrico es una de Egipto?', emoji: '🛕', correct: 'Pirámide' },
];

for (let i = 0; i < 100; i++) {
  const qObj = shapeObjects[i % shapeObjects.length];
  shapesData.push({
    questionText: qObj.text,
    emoji: qObj.emoji,
    options: shapeOptions.map(opt => ({ text: opt, isCorrect: opt === qObj.correct })).sort(() => Math.random() - 0.5)
  });
}

export const calendarData: QuestionData[] = [];

// Helper functions for calendar data generation
const generateCalendarData = (): QuestionData[] => {
  const data: QuestionData[] = [];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const emojis = ['📅', '☀️', '☁️', '🌧️', '⛈️', '❄️'];

  const getOptions = (correct: string, ...wrongs: string[]) => {
    return [
      { text: correct, isCorrect: true },
      { text: wrongs[0], isCorrect: false },
      { text: wrongs[1], isCorrect: false }
    ].sort(() => Math.random() - 0.5);
  };

  // Generation Strategies
  const strategies = [
    // 1. ¿Qué mes va después de...?
    () => {
      const i = Math.floor(Math.random() * 12);
      return {
        questionText: `¿Qué mes va justo después de ${months[i]}?`,
        options: getOptions(months[(i + 1) % 12], months[(i + 2) % 12], months[(i + 11) % 12]),
        emoji: '📅'
      };
    },
    // 2. ¿Qué mes va antes de...?
    () => {
      const i = Math.floor(Math.random() * 12);
      return {
        questionText: `¿Qué mes va antes de ${months[i]}?`,
        options: getOptions(months[(i + 11) % 12], months[(i + 1) % 12], months[(i + 10) % 12]),
        emoji: '📅'
      };
    },
    // 3. ¿Qué día va después de...?
    () => {
      const i = Math.floor(Math.random() * 7);
      return {
        questionText: `¿Qué día de la semana va después de ${days[i]}?`,
        options: getOptions(days[(i + 1) % 7], days[(i + 2) % 7], days[(i + 6) % 7]),
        emoji: '📅'
      };
    },
    // 4. ¿Qué día va antes de...?
    () => {
      const i = Math.floor(Math.random() * 7);
      return {
        questionText: `¿Qué día de la semana va antes de ${days[i]}?`,
        options: getOptions(days[(i + 6) % 7], days[(i + 1) % 7], days[(i + 5) % 7]),
        emoji: '📅'
      };
    },
    // 5. Clima + Día de la semana mañana
    () => {
      const i = Math.floor(Math.random() * 7);
      const isSunny = Math.random() > 0.5;
      const climateEmoji = isSunny ? '☀️' : '☁️';
      const weatherDesc = isSunny ? 'está soleado' : 'está nublado';
      return {
        questionText: `Si hoy es ${days[i]} y ${weatherDesc}, ¿qué día será mañana?`,
        options: getOptions(days[(i + 1) % 7], days[(i + 2) % 7], days[(i + 6) % 7]),
        emoji: climateEmoji
      };
    },
    // 6. Clima + Día de la semana ayer
    () => {
      const i = Math.floor(Math.random() * 7);
      const isRaining = Math.random() > 0.5;
      const climateEmoji = isRaining ? '🌧️' : '❄️';
      const weatherDesc = isRaining ? 'llueve a cántaros' : 'hace mucho frío';
      return {
        questionText: `Si hoy es ${days[i]} y ${weatherDesc}, ¿qué día fue ayer?`,
        options: getOptions(days[(i + 6) % 7], days[(i + 5) % 7], days[(i + 1) % 7]),
        emoji: climateEmoji
      };
    },
    // 7. Primer/último día del mes
    () => {
      const isFirst = Math.random() > 0.5;
      const i = Math.floor(Math.random() * 7);
      return {
        questionText: `Si el ${isFirst ? 'primer' : 'último'} día del mes es ${days[i]}, ¿qué día de la semana será el día siguiente?`,
        options: getOptions(days[(i + 1) % 7], days[(i + 2) % 7], days[(i + 6) % 7]),
        emoji: '📅'
      };
    },
    // 8. Días de un mes determinado
    () => {
      const i = Math.floor(Math.random() * 12);
      const daysInMonth = (m: number) => {
        if (m === 1) return '28 o 29';
        if ([3, 5, 8, 10].includes(m)) return '30';
        return '31';
      };
      const correctDays = daysInMonth(i);
      const wrongs = correctDays === '30' ? ['31', '28'] : correctDays === '31' ? ['30', '28'] : ['30', '31'];
      return {
        questionText: `¿Cuántos días tiene el mes de ${months[i]}?`,
        options: getOptions(correctDays, wrongs[0], wrongs[1]),
        emoji: '📅'
      };
    },
    // 9. Número de orden del mes
    () => {
      const i = Math.floor(Math.random() * 12);
      const answer = (i + 1).toString();
      const wrongs = [((i + 2) % 12 || 12).toString(), ((i + 3) % 12 || 12).toString()];
      return {
        questionText: `¿Qué número de mes es ${months[i]}?`,
        options: getOptions(answer, wrongs[0], wrongs[1]),
        emoji: '📅'
      };
    },
    // 10. Si el día de hoy es Número, ¿qué número fue ayer/mañana?
    () => {
      const today = Math.floor(Math.random() * 26) + 2; // entre 2 y 27
      const isTomorrow = Math.random() > 0.5;
      const target = isTomorrow ? today + 1 : today - 1;
      return {
        questionText: `Si hoy es el día ${today} del mes, ¿qué día ${isTomorrow ? 'será mañana' : 'fue ayer'}?`,
        options: getOptions(target.toString(), (target + 2).toString(), (target - 2).toString()),
        emoji: '📅'
      };
    }
  ];

  for (let i = 0; i < 100; i++) {
    const fn = strategies[i % strategies.length];
    data.push(fn());
  }
  
  // Shuffle all generated questions mildly
  return data.sort(() => Math.random() - 0.5);
};

calendarData.push(...generateCalendarData());

