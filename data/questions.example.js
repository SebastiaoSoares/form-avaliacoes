// duplique o questions.example.js e renomeie para questions.js, editando as perguntas e opções de resposta conforme necessário.

const escala_emojis = [
    { value: "Excelente", label: "Excelente", icon: "🤩" },
    { value: "Bom", label: "Bom", icon: "🙂" },
    { value: "Regular", label: "Regular", icon: "😐" },
    { value: "Ruim", label: "Ruim", icon: "😠" },
    { value: "Péssimo", label: "Péssimo", icon: "😡" }
]; // o uso de emojis é opcional, mas pode tornar a avaliação mais visual e intuitiva

const escala_textual = [
    { value: "Cliente antigo", label: "Cliente antigo" },
    { value: "Cliente novo", label: "Cliente novo" },
];

const perguntas = [
  {
    pergunta: "Você é cliente antigo ou novo?",
    escala: escala_textual
  },
  {
    pergunta: "Como você avalia a qualidade do atendimento?",
    escala: escala_emojis
  },
  {
    pergunta: "A estrutura do local atendeu às suas expectativas?",
    escala: escala_emojis
  },
  {
    pergunta: "Você recomendaria nossos serviços para outras pessoas?",
    escala: escala_emojis
  }
];
