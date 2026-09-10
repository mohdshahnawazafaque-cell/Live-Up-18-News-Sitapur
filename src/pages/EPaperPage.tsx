import React, { useEffect, useState } from "react";
import { getCachedDocs } from "../lib/cache";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EPaper } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { BookOpen, Download, FileText } from "lucide-react";
import { format } from "date-fns";

export default function EPaperPage() {
  const { language } = useLanguage();
  const [epapers, setEpapers] = useState<EPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEPapers = async () => {
      try {
        const q = query(collection(db, "epapers"), orderBy("date", "desc"));
        const snap = await getCachedDocs(q, 'EPaperPage-data');
        const fetched: EPaper[] = [];
        snap.forEach(doc => {
          fetched.push({ id: doc.id, ...doc.data() } as EPaper);
        });
        setEpapers(fetched);
      } catch (err) {
        console.error("Error fetching epapers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEPapers();
  }, []);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 animate-pulse">{language === 'hi' ? 'ई-पेपर लोड हो रहा है...' : 'Loading E-Paper...'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 border-b-4 border-red-600 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <BookOpen className="text-red-600" size={36} />
            {language === 'hi' ? 'ई-पेपर (E-Paper)' : 'E-Paper'}
          </h1>
          <p className="text-slate-500 mt-2">
            {language === 'hi' ? 'Live UP 18 News का डिजिटल अख़बार पढ़ें और डाउनलोड करें।' : 'Read and download the digital newspaper of Live UP 18 News.'}
          </p>
        </div>
      </header>

      {epapers.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
          <FileText size={64} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">
            {language === 'hi' ? 'अभी तक कोई ई-पेपर अपलोड नहीं किया गया है।' : 'No E-Paper uploaded yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {epapers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden group flex flex-col">
              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                {paper.thumbnailUrl ? (
                  <img src={paper.thumbnailUrl} alt={paper.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText size={48} />
                    <span className="mt-2 text-sm font-bold">PDF</span>
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">
                  {format(new Date(paper.date), 'dd MMM yyyy')}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 mb-4 line-clamp-2">{paper.title}</h3>
                <div className="mt-auto flex gap-2">
                  <a 
                    href={paper.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-900 text-white text-center py-2 rounded font-bold text-sm hover:bg-slate-800 transition-colors"
                  >
                    {language === 'hi' ? 'पढ़ें' : 'Read'}
                  </a>
                  <a 
                    href={paper.pdfUrl} 
                    download
                    className="bg-slate-200 text-slate-700 p-2 rounded hover:bg-slate-300 transition-colors flex items-center justify-center"
                    title="Download PDF"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
