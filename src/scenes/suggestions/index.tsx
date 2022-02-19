import { useSuggestedWords } from './hooks';

export const Suggestions = () => {
  const suggestedWords = useSuggestedWords();

  return (
    <ul>
      {suggestedWords.map((suggestedWord) => {
        return (
          <li>{suggestedWord.word}</li>
        )
      })}
    </ul>
  )
}