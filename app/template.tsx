// Templates are remounted with a fresh key on every navigation, unlike layouts.
// That remount recreates each page's DOM, which restarts the `.reveal-stack`
// entrance animation so the blur-to-clear reveal replays on every route change.
// `display: contents` keeps this wrapper out of the box tree, so the page's
// `<main className="flex-1">` still flexes against the layout container and the
// footer stays pinned.
export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="contents">{children}</div>;
}
