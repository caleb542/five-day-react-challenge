import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  table: ({ node, ...props }) => (
    <div className="table-responsive">
      <table className="table table-sm" {...props} />
    </div>
  ),
};

export default async function Home() {
  const file = path.join(process.cwd(), "app", "content", "case-study.md" )
  const markdown = await fs.readFile(file, "utf8");
  return (
    <div>
     <main className="container py-4">
     <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{markdown}</ReactMarkdown>
     </main>
    </div>
  );
}
