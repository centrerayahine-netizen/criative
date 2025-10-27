
import React from 'react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
}

const InfoSection: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="mt-4">
    <h3 className="flex items-center text-lg font-semibold text-teal-700">
      {icon}
      <span className="ms-2">{title}</span>
    </h3>
    <p className="mt-1 text-gray-600 whitespace-pre-wrap">{content}</p>
  </div>
);


const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-500 transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-bold text-gray-800">{idea.title}</h2>
      
      <InfoSection 
        icon={<LightbulbIcon />}
        title="شرح النشاط"
        content={idea.description}
      />
      
      <InfoSection 
        icon={<ClipboardListIcon />}
        title="المواد المطلوبة"
        content={idea.materials}
      />

      <InfoSection 
        icon={<StarIcon />}
        title="الفوائد التعليمية والنمائية"
        content={idea.benefits}
      />
    </div>
  );
};

export default IdeaCard;
