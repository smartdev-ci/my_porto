/**
 * Données du portfolio - À personnaliser avec vos informations
 */
export const portfolioData = {
  personal: {
    name: 'Aristide Ghislain Adouko',
    title: 'Développeur Full Stack Junior',
    email: 'votre.email@example.com',
    phone: '+33 6 00 00 00 00',
    location: 'Paris, France',
    bio: {
      fr: 'Passionné par le développement web et les nouvelles technologies, je crée des expériences numériques interactives et innovantes.',
      en: 'Passionate about web development and new technologies, I create interactive and innovative digital experiences.'
    },
    avatar: '/assets/images/avatar.jpg'
  },
  
  social: {
    github: 'https://github.com/votre-pseudo',
    linkedin: 'https://linkedin.com/in/votre-profil',
    twitter: 'https://twitter.com/votre-pseudo',
    website: 'https://votre-site.com'
  },
  
  skills: [
    {
      category: { fr: 'Frontend', en: 'Frontend' },
      items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS']
    },
    {
      category: { fr: 'Backend', en: 'Backend' },
      items: ['Node.js', 'Express', 'Python', 'Django', 'PHP', 'Laravel']
    },
    {
      category: { fr: 'Base de données', en: 'Database' },
      items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase']
    },
    {
      category: { fr: 'Outils', en: 'Tools' },
      items: ['Git', 'Docker', 'VS Code', 'Figma', 'Linux']
    }
  ],
  
  projects: [
    {
      id: 1,
      title: { fr: 'Portfolio Windows 11', en: 'Windows 11 Portfolio' },
      description: {
        fr: 'Un portfolio interactif imitant l\'interface de Windows 11 avec des fonctionnalités avancées.',
        en: 'An interactive portfolio mimicking the Windows 11 interface with advanced features.'
      },
      technologies: ['JavaScript', 'Tailwind CSS', 'Vite'],
      image: '/assets/images/project-1.jpg',
      link: '#',
      github: '#'
    },
    {
      id: 2,
      title: { fr: 'Application E-commerce', en: 'E-commerce App' },
      description: {
        fr: 'Plateforme de vente en ligne complète avec panier, paiement et administration.',
        en: 'Complete online sales platform with cart, payment and administration.'
      },
      technologies: ['React', 'Node.js', 'MongoDB'],
      image: '/assets/images/project-2.jpg',
      link: '#',
      github: '#'
    },
    {
      id: 3,
      title: { fr: 'Dashboard Analytics', en: 'Analytics Dashboard' },
      description: {
        fr: 'Tableau de bord d\'analyse de données avec visualisations interactives.',
        en: 'Data analytics dashboard with interactive visualizations.'
      },
      technologies: ['Vue.js', 'D3.js', 'Firebase'],
      image: '/assets/images/project-3.jpg',
      link: '#',
      github: '#'
    }
  ],
  
  experience: [
    {
      id: 1,
      title: { fr: 'Développeur Full Stack', en: 'Full Stack Developer' },
      company: 'Entreprise XYZ',
      location: 'Paris, France',
      period: { fr: 'Jan 2024 - Présent', en: 'Jan 2024 - Present' },
      description: {
        fr: 'Développement d\'applications web modernes et maintenance de systèmes existants.',
        en: 'Development of modern web applications and maintenance of existing systems.'
      },
      achievements: [
        { fr: 'Création d\'une application React utilisée par 10k+ utilisateurs', en: 'Created a React app used by 10k+ users' },
        { fr: 'Optimisation des performances de 40%', en: 'Performance optimization by 40%' }
      ]
    },
    {
      id: 2,
      title: { fr: 'Stage Développement Web', en: 'Web Development Internship' },
      company: 'Startup ABC',
      location: 'Lyon, France',
      period: { fr: 'Juin 2023 - Déc 2023', en: 'Jun 2023 - Dec 2023' },
      description: {
        fr: 'Participation au développement de fonctionnalités frontend et backend.',
        en: 'Participated in frontend and backend feature development.'
      },
      achievements: [
        { fr: 'Implémentation de 5 nouvelles fonctionnalités', en: 'Implemented 5 new features' },
        { fr: 'Rédaction de documentation technique', en: 'Wrote technical documentation' }
      ]
    }
  ],
  
  education: [
    {
      id: 1,
      degree: { fr: 'Master Développement Web', en: 'Master in Web Development' },
      school: 'Université de Paris',
      location: 'Paris, France',
      period: { fr: '2022 - 2024', en: '2022 - 2024' },
      description: {
        fr: 'Spécialisation en architectures web modernes et développement full stack.',
        en: 'Specialization in modern web architectures and full stack development.'
      }
    },
    {
      id: 2,
      degree: { fr: 'Licence Informatique', en: 'Bachelor in Computer Science' },
      school: 'Université de Lyon',
      location: 'Lyon, France',
      period: { fr: '2019 - 2022', en: '2019 - 2022' },
      description: {
        fr: 'Fondamentaux de l\'informatique, algorithmes et structures de données.',
        en: 'Computer science fundamentals, algorithms and data structures.'
      }
    }
  ],
  
  certifications: [
    {
      title: { fr: 'Developer Associate AWS', en: 'AWS Developer Associate' },
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialId: 'XXX-XXX-XXX'
    },
    {
      title: { fr: 'Meta Frontend Developer', en: 'Meta Frontend Developer' },
      issuer: 'Coursera',
      date: '2023',
      credentialId: 'XXX-XXX-XXX'
    }
  ]
};
