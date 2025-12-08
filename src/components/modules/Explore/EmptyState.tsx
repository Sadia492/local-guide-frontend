import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasSearch: boolean;
  onReset: () => void;
}

export default function EmptyState({ hasSearch, onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No tours found</h3>
      <p className="text-gray-600 mb-6">
        {hasSearch
          ? "Try adjusting your search or filters to find more results"
          : "No tours available at the moment. Please check back later."}
      </p>
      {hasSearch && (
        <Button
          variant="primary"
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}
