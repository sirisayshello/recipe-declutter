import { useEffect } from "react";
import JSConfetti from "js-confetti";

export const Confetti = () => {
  useEffect(() => {
    const jsConfetti: JSConfetti = new JSConfetti();

    // Determine emoji and confetti size based on screen width
    const screenWidth = window.innerWidth;
    const emojiSize = screenWidth < 575 ? 70 : 100;
    const confettiNumber = screenWidth < 575 ? 15 : 30;

    jsConfetti.addConfetti({
      emojis: ["🥗", "🍳", "🌮", "🌭", "🍔", "🍝", "🥞"],
      emojiSize: emojiSize,
      confettiNumber: confettiNumber,
    });
  }, []);

  return null;
};
