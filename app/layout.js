
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";



export const metadata = {
  title: "Home | Five Day React Challenge",
  description: "Five React projects in five days, built without a code assistant, timed from the first commit, and checked for accessibility.",
};

const themeScript = `(function () {
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function apply() {
    document.documentElement.setAttribute("data-bs-theme", mq.matches ? "dark" : "light");
  }
  apply();
  mq.addEventListener("change", apply);
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

