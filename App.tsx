
import React, { useState, useCallback } from 'react';
import { FormState, Idea } from './types';
import { ACTIVITY_TYPES, FOCUS_AREAS } from './constants';
import { generateIdeas } from './services/geminiService';
import Header from './components/Header';
import IdeaCard from './components/IdeaCard';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    activityType: ACTIVITY_TYPES[0].value,
    focusArea: FOCUS_AREAS[0].value,
    materials: '',
  });
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const result = await generateIdeas(formData);
      setIdeas(result);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-teal-800 mb-6">أخبرنا بما تبحث عنه</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="activityType" className="block text-lg font-semibold text-gray-700 mb-2">نوع النشاط</label>
              <select
                id="activityType"
                name="activityType"
                value={formData.activityType}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                {ACTIVITY_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="focusArea" className="block text-lg font-semibold text-gray-700 mb-2">التركيز على احتياجات الطفل</label>
              <select
                id="focusArea"
                name="focusArea"
                value={formData.focusArea}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                {FOCUS_AREAS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="materials" className="block text-lg font-semibold text-gray-700 mb-2">المواد المتوفرة لديك (اختياري)</label>
              <textarea
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                rows={3}
                placeholder="مثال: صلصال، مكعبات ملونة، كرات صغيرة..."
                className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'لحظات من فضلك...' : '✨ ولّد أفكار إبداعية'}
            </button>
          </form>
        </section>

        <section className="mt-12">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg max-w-3xl mx-auto">{error}</div>}
          {ideas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {ideas.map((idea, index) => (
                <IdeaCard key={index} idea={idea} />
              ))}
            </div>
          )}
           {!isLoading && ideas.length === 0 && !error && (
              <div className="text-center text-gray-500 mt-16">
                <p className="text-xl">الأفكار الإبداعية ستظهر هنا بعد ملء النموذج.</p>
              </div>
            )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
