export type Review = {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  rating: number;
  text: string;
  date: string;
};

export const reviews: Review[] = [
  { id: 1, author: "Ahmed Sam", initials: "AS", avatarColor: "bg-teal-600", rating: 5, text: "Docteur très compétente, très à l'écoute, diagnostic rapide bronchite sévère chez ma fille, oxygène directement sur place. Elle prescrit juste ce qu'il faut. Je vous la recommande les yeux fermés.", date: "il y a 7 mois" },
  { id: 2, author: "Mohamed Lhbib AGUENAOU", initials: "MA", avatarColor: "bg-amber-600", rating: 5, text: "Très bonne pédiatre. Merci beaucoup dr.", date: "il y a 5 mois" },
  { id: 3, author: "Brahim Bouhouch", initials: "BB", avatarColor: "bg-primary-600", rating: 5, text: "Je recommande à 100% c'est une personne très sympathique et très professionnelle, très agréable et à l'écoute qui prend le temps d'expliquer et de rassurer les parents et l'enfant.", date: "il y a 10 mois" },
  { id: 4, author: "MB. PRODUCTION", initials: "MB", avatarColor: "bg-orange-500", rating: 5, text: "Je lui donnerai plus de 5 étoiles si je pouvais. Dr GUINANE AICHA est d'une extrême gentillesse et bienveillance, surtout pas matérialiste. Elle est toujours disponible et joignable.", date: "il y a un an" },
  { id: 5, author: "Anouar El boukili", initials: "AE", avatarColor: "bg-teal-500", rating: 5, text: "Une des meilleures médecins. Dès notre première consultation, j'ai été impressionné par son professionnalisme et sa bienveillance. Elle a su mettre mon enfant à l'aise.", date: "il y a un an" },
  { id: 6, author: "laila FOUAD", initials: "LF", avatarColor: "bg-amber-500", rating: 5, text: "Dre Guinane est une pédiatre très compétente. Elle fait preuve d'un grand professionnalisme et d'une patience remarquable, même dans les situations imprévues.", date: "il y a un an" },
  { id: 7, author: "Halima KEDDAR", initials: "HK", avatarColor: "bg-primary-500", rating: 5, text: "Une pédiatre exceptionnelle, dotée d'une grande expertise et de traitements efficaces. Son approche avec les enfants est douce et professionnelle. Je la recommande vivement. ❤️", date: "il y a un an" },
  { id: 8, author: "Inès NEJJAR", initials: "IN", avatarColor: "bg-teal-600", rating: 4, text: "Médecin humaine à l'écoute, très satisfaite de la consultation pour mon petit. Elle ne prescrit pas trop de médicaments. J'aimerais juste que l'accueil s'améliore.", date: "il y a un an" },
  { id: 9, author: "Zayad Mariam", initials: "ZM", avatarColor: "bg-orange-600", rating: 5, text: "Je vous la recommande sans hésiter, une pédiatre douce à l'écoute, humaine, professionnelle, toujours souriante. Ma petite fille vous adore. Merci Dr Guinane, tbark allah 3lik.", date: "il y a un an" },
  { id: 10, author: "assia moutaaziz", initials: "AM", avatarColor: "bg-amber-600", rating: 5, text: "Médecin très compétente, humaine et attentive qui accorde le temps qu'il faut pour chaque patient. Je la recommande vivement.", date: "il y a un an" },
  { id: 11, author: "imane shimou", initials: "IS", avatarColor: "bg-primary-600", rating: 5, text: "Dr Aicha une pédiatre attentionnée, compétente, elle a de l'intérêt pour le malade. Sincèrement elle est la meilleure, je la recommande vivement.", date: "il y a un an" },
];
