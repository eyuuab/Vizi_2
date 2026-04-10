const isImageUrl = (str) => /^(https?:\/\/|data:image\/|\/)/i.test(str.trim());
console.log(isImageUrl("https://placehold.co/800x600/1a1a2e/eaeaea?text=A%20photo%20of%20a%20dog"));
