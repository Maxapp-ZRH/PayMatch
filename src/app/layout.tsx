/**
 * Root Layout
 *
 * Simple root layout that only handles the redirect to default locale.
 * All internationalization is handled in the [locale] layout.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
