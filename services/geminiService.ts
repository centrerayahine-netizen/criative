
import { GoogleGenAI } from "@google/genai";
import { FormState, Idea } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseResponse = (responseText: string): Idea[] => {
  const ideaBlocks = responseText.split('---').filter(block => block.trim() !== '');
  
  return ideaBlocks.map(block => {
    const lines = block.trim().split('\n');
    const idea: Idea = {
      title: '',
      description: '',
      materials: '',
      benefits: ''
    };

    let currentSection: keyof Idea | null = null;

    for (const line of lines) {
      if (line.startsWith('**عنوان جذاب للفكرة**:')) {
        currentSection = 'title';
        idea.title = line.replace('**عنوان جذاب للفكرة**:', '').trim();
      } else if (line.startsWith('**شرح النشاط**:')) {
        currentSection = 'description';
        idea.description = line.replace('**شرح النشاط**:', '').trim();
      } else if (line.startsWith('**المواد المطلوبة**:')) {
        currentSection = 'materials';
        idea.materials = line.replace('**المواد المطلوبة**:', '').trim();
      } else if (line.startsWith('**الفوائد التعليمية والنمائية**:')) {
        currentSection = 'benefits';
        idea.benefits = line.replace('**الفوائد التعليمية والنمائية**:', '').trim();
      } else if (currentSection && line.trim()) {
        idea[currentSection] += '\n' + line.trim();
      }
    }
    return idea;
  }).filter(idea => idea.title); 
};


export const generateIdeas = async (formData: FormState): Promise<Idea[]> => {
  const { activityType, focusArea, materials } = formData;

  const prompt = `
أنت خبير في التربية الخاصة والعلاج الوظيفي متخصص في ابتكار أنشطة إبداعية للأطفال ذوي الاحتياجات الخاصة.
مهمتك هي إنشاء قائمة من 3 أفكار لأنشطة فريدة ومناسبة لمربية أطفال تعمل داخل فصل دراسي.

الرجاء مراعاة السياق التالي:
- نوع النشاط المطلوب: ${activityType}
- التركيز على احتياجات الطفل: ${focusArea}
- المواد المتاحة: ${materials || 'مواد فصل دراسي أساسية (ورق، أقلام، مكعبات، صلصال)'}

لكل فكرة، قدم التفاصيل التالية باللغة العربية وبتنسيق Markdown واضح وصارم:
**عنوان جذاب للفكرة**: (اكتب العنوان هنا)
**شرح النشاط**: (اشرح خطوات التنفيذ هنا)
**المواد المطلوبة**: (اكتب قائمة المواد هنا)
**الفوائد التعليمية والنمائية**: (اشرح الفوائد هنا)

استخدم "---" كفاصل بين كل فكرة وأخرى. ابدأ ردك مباشرة بالفكرة الأولى بدون أي مقدمات أو خاتمة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    const responseText = response.text;
    return parseResponse(responseText);
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw new Error("فشل في توليد الأفكار. الرجاء المحاولة مرة أخرى.");
  }
};
