import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Home() {
  const file = path.join(process.cwd(), "app", "content", "case-study.md" )
  const markdown = await fs.readFile(file, "utf8");
  return (
    <div>
     <main className="container py-4">
     <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
     </main>
    </div>
  );
}
