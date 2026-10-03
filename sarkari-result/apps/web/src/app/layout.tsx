import type { Metadata } from 'next';
import { Inter, Arimo, Merriweather } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const arimo = Arimo({ subsets: ['latin'], variable: '--font-arimo' });
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: {
    default: 'Sarkari Result - Public Jobs & Recruitment Portal',
    template: '%s | Sarkari Result',
  },
  description:
    'Official Sarkari Result public jobs and recruitment portal for latest jobs, UPSSSC PET, UP Family ID, CBSE 12th results, UGC NET, RRB Group D, MPPSC, Haryana Police, BPSSC Bihar, Sarkari ITI results, teaching jobs, exam results, admit cards, answer keys, and syllabus.',
  keywords: [
    // Batch 1 - zero difficulty
    'sarkari result',
    'family id',
    'family id up',
    'upsssc pet',
    'sarkari iti results',
    'iti sarkari results',
    'sarkari result bihar board 12',
    'pet exam date 2026',
    'emrs sarkari result',
    'ssc gd sarkari result',
    'ro aro result',
    'rrb sarkari result',
    'rte up registration 2026-27',
    'ugc net sarkari result',
    'rrb junior engineer sarkari result',
    // Batch 2 - zero difficulty, high volume
    'sarkari sangam com',
    'bpssc',
    'sahara refund',
    'rrb group d exam date 2025',
    'upsssc syllabus',
    'ptet 2026',
    'cisce result 2026',
    'up family id',
    'aoc recruitment',
    'mp guest faculty',
    'riico recruitment 2026',
    'haryana police vacancy 2026',
    'sarkari result ccc',
    'home guard sarkari result',
    'kgbv vacancy',
    'railway group d sarkari result',
    'nda sarkari result',
    'ssc chsl sarkari result',
    'upsssc pet application form 2026',
    'tgt syllabus',
    'uppsc ro aro',
    // Low difficulty (< 15) with high volume
    'cbse results class 12',
    'cbse results 12',
    'mppsc',
    'neet result 2026',
    'jeecup',
    'csbc',
    'se census gov in',
    'admission 11th',
    'jac 10th result 2026',
    'rojgar result',
    'uppsc',
    'rrb group d',
    'bpsc',
    'esb',
    // Medium difficulty (15-50) with massive volume (> 800k)
    'indian army join',
    'up scholarship',
    'sarkari exam',
    'sarkari exams',
    'upsssc',
    'central teacher eligibility test',
    'ugc-net',
    'upmsp',
    'sarkari jobs',
    'up board result 2026',
    'naukri sarkari naukri',
    'sarkari result app',
    'sarkari result apps',
    'sarkari',
    'sarkari resume',
    'sarkari results future',
    'sarkari result future',
    'dsssb',
    'ssc gd',
    'g d ssc',
    'rssb',
    // Moderate volume (500k-800k), KD <= 50
    'examination sarkari result info',
    'exams sarkari result info',
    'exam sarkari result info',
    'central industrial security force',
    'group d railway recruitment',
    'group d rrb',
    'lucknow university',
    'railway recruitment board group d',
    'rrb d group',
    'rrb railway group d',
  ],
  openGraph: {
    title: 'Sarkari Result - Public Jobs & Recruitment Portal',
    description:
      'Official Sarkari Result public jobs and recruitment portal for latest jobs, UPSSSC PET, UP Family ID, CBSE 12th results, UGC NET, RRB Group D, MPPSC, Haryana Police, BPSSC Bihar, Sarkari ITI results, teaching jobs, exam results, admit cards, answer keys, and syllabus.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${arimo.variable} ${merriweather.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="font-sans bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
