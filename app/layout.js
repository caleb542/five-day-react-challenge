
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";



export const metadata = {
  title: "Home | Five Day React Challenge",
  description: "Five React projects in five days, built without a code assistant, timed from the first commit, and checked for accessibility.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
