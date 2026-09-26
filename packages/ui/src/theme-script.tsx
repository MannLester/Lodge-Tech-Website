const themeScript = `
  try {
    const savedTheme = window.localStorage.getItem("theme");
    document.documentElement.dataset.theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
