const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

const regex = /\{\s*article\.sourceUrl\s*&&\s*\([\s\S]*?\}\s*<\/div>\s*<\/article>/m;

const match = content.match(regex);
if (match) {
  const replacementStr = match[0].replace('</article>', `
        {/* Comments Section */}
        <section className="mt-12 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <MessageCircle size={24} className="text-red-600" />
            {language === 'hi' ? 'टिप्पणियाँ' : 'Comments'} ({comments.length})
          </h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'hi' ? 'आपका नाम' : 'Your Name'}</label>
              <input 
                type="text" 
                required
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'hi' ? 'आपकी टिप्पणी' : 'Your Comment'}</label>
              <textarea 
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={language === 'hi' ? 'इस खबर के बारे में अपनी राय साझा करें...' : 'Share your thoughts on this news...'}
                className="w-full px-4 py-2 border border-slate-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              {isSubmitting ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Posting...') : (language === 'hi' ? 'टिप्पणी करें' : 'Post Comment')}
            </button>
          </form>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.slice().reverse().map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-xs text-slate-500">{format(new Date(c.date), "MMM d, yyyy")}</span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4 italic">
                {language === 'hi' ? 'अभी तक कोई टिप्पणी नहीं। अपनी राय साझा करने वाले पहले व्यक्ति बनें!' : 'No comments yet. Be the first to share your thoughts!'}
              </p>
            )}
          </div>
        </section>
      </article>`);
  fs.writeFileSync('src/pages/Article.tsx', content.replace(regex, replacementStr));
  console.log("Success with Regex");
} else {
  console.log("Failed with Regex");
}
