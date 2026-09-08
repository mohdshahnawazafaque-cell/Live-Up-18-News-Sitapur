const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldStr = `</form>
            </div>
          </div>
                    </div>
          </div>
          {/* Advertisement Manager */}`;

const newStr = `</form>
            </div>
          </div>
          {/* Advertisement Manager */}`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/pages/Admin.tsx', content);
