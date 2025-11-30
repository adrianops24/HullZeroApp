export interface QuestionInterface {
  questionId: number;
  title: string;
  displayOrder: number;
  maxSelections: number | string;
}

export interface QuestionOptionInterface {
  questionOptionId: number;
  text: string;
  displayOrder: number;
  weight: number;
}

export type QuestionsAndOptions = Pick<QuestionInterface, 'title' | 'displayOrder' | 'maxSelections'> & {
  questions: (Pick<QuestionOptionInterface, 'text' | 'displayOrder' | 'weight'> & { styleId: number })[];
};

const obj: QuestionsAndOptions[] = [
  {
    title: 'Quais os elogios que você ouve com mais frequência dos seus amigos?',
    displayOrder: 1,
    maxSelections: 3,
    questions: [
      { text: 'Informal, espontâneo, alegre, extrovertido e engraçado', displayOrder: 1, weight: 5, styleId: 1 },
      { text: 'Exigente, elegante, reservado, seguro e organizado', displayOrder: 2, weight: 3, styleId: 2 },
      { text: 'Romântico, atencioso, carinhoso, suave e afetuoso', displayOrder: 3, weight: 4, styleId: 3 },
      { text: 'Sensual, corajoso, sedutor, carismático e auto confiante', displayOrder: 4, weight: 2, styleId: 4 },
      { text: 'Inovador, criativo, intenso, arrojado e original', displayOrder: 4, weight: 2, styleId: 5 }
    ]
  },
  {
    title: 'Sample Question',
    displayOrder: 2,
    maxSelections: 2,
    questions: [
      { text: 'Option 1', displayOrder: 1, weight: 5, styleId: 1 },
      { text: 'Option 2', displayOrder: 2, weight: 3, styleId: 2 },
      { text: 'Option 3', displayOrder: 3, weight: 4, styleId: 3 },
      { text: 'Option 4', displayOrder: 4, weight: 2, styleId: 4 }
    ]
  },
  {
    title: 'Sample Question',
    displayOrder: 3,
    maxSelections: 2,
    questions: [
      { text: 'Option 1', displayOrder: 1, weight: 5, styleId: 1 },
      { text: 'Option 2', displayOrder: 2, weight: 3, styleId: 2 },
      { text: 'Option 3', displayOrder: 3, weight: 4, styleId: 3 },
      { text: 'Option 4', displayOrder: 4, weight: 2, styleId: 4 }
    ]
  }
];

export default obj;
