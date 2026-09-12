import React, { useEffect, useState } from "react";
import { getCachedDocs } from "../lib/cache";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TeamMember } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { Phone, User, Briefcase, Info } from "lucide-react";

export default function Team() {
  const { language } = useLanguage();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, "team"), orderBy("createdAt", "asc"));
        const snap = await getCachedDocs(q, 'Team-data');
        const members = (snap || []) as TeamMember[];
        setTeam(members);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 animate-pulse">{language === 'hi' ? 'टीम लोड हो रही है...' : 'Loading Team...'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 border-b-4 border-red-600 pb-4 text-center">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
          {language === 'hi' ? 'हमारी टीम' : 'Our Team'}
        </h1>
        <p className="text-slate-500 mt-2">
          {language === 'hi' ? 'Live UP 18 News के जांबाज़ रिपोर्टर और सदस्य' : 'The dedicated members and reporters of Live UP 18 News'}
        </p>
      </header>

      {!Array.isArray(team) || team.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {language === 'hi' ? 'अभी तक कोई सदस्य नहीं जोड़ा गया है।' : 'No team members added yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(Array.isArray(team) ? team : []).map(member => (
            <div key={member.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
              <div className="aspect-[4/5] w-full overflow-hidden relative bg-slate-100">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase">
                  {member.role}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-1">{member.name}</h3>
                
                <a href={"tel:+91" + (member.mobile || "").replace(/\D/g,'')} className="flex items-center gap-2 text-slate-600 mb-4 hover:text-red-600 transition-colors">
                  <Phone size={16} />
                  <span className="font-semibold text-sm">{member.mobile}</span>
                </a>
                
                <div className="mt-auto">
                  <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed border-t border-slate-100 pt-4">
                    {member.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
