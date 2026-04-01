import { lazy, Suspense } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface CategoryIconPreviewProps {
  name: string;
  className?: string;
}

const CategoryIconPreview = ({ name, className }: CategoryIconPreviewProps) => {
  const kebabName = name as keyof typeof dynamicIconImports;

  if (!dynamicIconImports[kebabName]) {
    // Fallback for unknown icon names
    return <div className={`${className} bg-muted rounded`} />;
  }

  const LucideIcon = lazy(dynamicIconImports[kebabName]);

  return (
    <Suspense fallback={<div className={`${className} bg-muted rounded animate-pulse`} />}>
      <LucideIcon className={className} />
    </Suspense>
  );
};

export default CategoryIconPreview;
