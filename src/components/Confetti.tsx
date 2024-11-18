import { useEffect } from "react";
import JSConfetti from "js-confetti";

export const Confetti = () => {
  useEffect(() => {
    const jsConfetti: JSConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["🥗", "🍳", "🌮", "🌭", "🍔", "🍝 ", "🥞"],
      emojiSize: 100,
      confettiNumber: 30,
    });
  }, []);

  return null;
};
