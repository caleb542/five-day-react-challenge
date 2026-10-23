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
  li: ({ node, className, children, ...props }) => 
    className?.includes("task-list-item") ? (
      <li className={className} {...props}>
      <label>{children}</label></li>
    ) : (
      <li className={className} {...props}>{children}</li>
    ),
    input: ({ node, checked, disabled, ...props }) =>
  props.type === "checkbox" ? (
    <input {...props} defaultChecked={checked} />
  ) : (
    <input {...props} />
  ),
    
};

export default async function Home() {
  const file = path.join(process.cwd(), "app", "content", "case-study.md" )
  const markdown = await fs.readFile(file, "utf8");
  return (
    <div>
     <a href="#main" className="skip-to-main">Skip to main content</a>
     <main id="main" className="container py-4">
     <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{markdown}</ReactMarkdown>
     </main>
     <footer></footer>
    </div>
  );
}
