export const useMeta = (name: "description" | "author", content: string) => {
  const head = document.querySelector("head");

  if (head) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "X-UA-Compatible";
    meta.content = "IE=edge";
    meta.setAttribute("name", name);
    meta.setAttribute("content", content);
    head.appendChild(meta);
  }
};
