const fs = require('fs');
let code = fs.readFileSync('src/pages/Article.tsx', 'utf8');

const oldSubmit = `const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(\`/api/news/\${id}/comments\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCommentName, text: newCommentText })
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
        setNewCommentName("");
        setNewCommentText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };`;

const newSubmit = `const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !id) return;
    
    setIsSubmitting(true);
    try {
      const newComment = {
         id: Date.now().toString(),
         name: newCommentName,
         text: newCommentText,
         date: new Date().toISOString()
      };
      const docRef = doc(db, "news", id);
      await updateDoc(docRef, {
         comments: arrayUnion(newComment)
      });
      
      setComments([...comments, newComment]);
      setNewCommentName("");
      setNewCommentText("");
      sessionStorage.clear(); // Clear cache to reflect comment globally if needed
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'टिप्पणी जोड़ने में त्रुटि हुई' : 'Error posting comment');
    } finally {
      setIsSubmitting(false);
    }
  };`;

if (code.includes('fetch(`/api/news/${id}/comments`')) {
    code = code.replace(oldSubmit, newSubmit);
    fs.writeFileSync('src/pages/Article.tsx', code);
    console.log("Fixed comments logic!");
}

