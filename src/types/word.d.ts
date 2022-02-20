type SuggestedWord = LetterWithEval[];

type LetterWithEval = {
  letter: string;
  evaluation: 'present' | 'absent' | 'unknown';
};