import { useEffect, useState } from "react";

export const useSuggestedWords = () => {
  const [suggestedWords, setSuggestedWords] = useState<SuggestedWord[]>([]);

  useEffect(() => {
    const getSuggestedWords = async () => {
      // manually typing this since none of the chrome stuff is typed, so types can't be inferred.
      const { suggestedWords: chromeSuggestedWords } = await chrome.storage.local.get('suggestedWords');
      if (chromeSuggestedWords) {
        setSuggestedWords(chromeSuggestedWords);
      }
    }

    chrome.storage.onChanged.addListener(getSuggestedWords);
    const unsubscribe = () => chrome.storage.onChanged.removeListener(getSuggestedWords);
    return unsubscribe;
  }, []);

  return suggestedWords;
}