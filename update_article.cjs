const fs = require('fs');

let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

content = content.replace(
  'import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";',
  `import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";\nimport { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, arrayUnion } from "firebase/firestore";\nimport { db } from "../lib/firebase";`
);

const oldEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[id\]\);/;
const newEffect = `useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as NewsArticle;
          setArticle(data);
          setComments((data as any).comments || []);
          
          // Fetch related
          const q = query(collection(db, "news"), where("category", "==", data.category), limit(5));
          const relatedSnap = await getDocs(q);
          const relatedArticles: NewsArticle[] = [];
          relatedSnap.forEach(rDoc => {
            if (rDoc.id !== id) {
              relatedArticles.push({ id: rDoc.id, ...rDoc.data() } as NewsArticle);
            }
          });
          setRelated(relatedArticles);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);`;

content = content.replace(oldEffect, newEffect);

const oldComment = /const handleAddComment = async \(e: React\.FormEvent\) => \{[\s\S]*?setNewCommentText\(""\);\n      \}\n    \} catch \(err\) \{\n      console\.error\("Error adding comment:", err\);\n    \} finally \{\n      setIsSubmitting\(false\);\n    \}\n  \};/;
const newComment = `const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !id) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "news", id);
      const newCommentObj = {
        id: Math.random().toString(36).substring(7),
        name: newCommentName,
        text: newCommentText,
        date: new Date().toISOString()
      };
      await updateDoc(docRef, {
        comments: arrayUnion(newCommentObj)
      });
      setComments([...comments, newCommentObj]);
      setNewCommentName("");
      setNewCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };`;

content = content.replace(oldComment, newComment);

fs.writeFileSync('src/pages/Article.tsx', content);
console.log("Updated Article.tsx");
