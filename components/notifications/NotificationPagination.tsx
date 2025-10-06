"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  isLoading?: boolean;
  showItemsPerPage?: boolean;
  className?: string;
}

export const NotificationPagination = ({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
  showItemsPerPage = true,
  className,
}: NotificationPaginationProps) => {
  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(parseInt(value));
    }
  };

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-background",
        className
      )}
    >
      {/* Items info and per page selector */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {startItem} to {endItem} of {totalCount} notifications
        </span>
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Show:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <Button
                key={`${page}-${index}`}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  page === "..." && "pointer-events-none"
                )}
                onClick={() => handlePageClick(page)}
                disabled={isLoading || page === "..."}
              >
                {page}
              </Button>
            ))}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
