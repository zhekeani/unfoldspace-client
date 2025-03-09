"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type GeneralPaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  itemsCount: number;
};

const GeneralPagination = ({
  currentPage,
  hasNextPage,
  itemsCount,
}: GeneralPaginationProps) => {
  const itemsPerPage = 5;

  const showPrevDots = itemsPerPage * currentPage > 15;
  const showNextDots = itemsCount - itemsPerPage * currentPage > 5;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
            aria-disabled={currentPage === 1}
            className={cn(
              "font-light",
              currentPage === 1
                ? "pointer-events-none text-sub-text"
                : "text-main-text"
            )}
          />
        </PaginationItem>

        {showPrevDots && (
          <PaginationItem>
            <PaginationEllipsis className="stroke-main-text fill-main-text " />
          </PaginationItem>
        )}

        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              className="font-light text-main-text hover:bg-complement-light-gray"
              href={`?page=${currentPage - 1}`}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            className="font-light text-main-text hover:bg-complement-light-gray"
            href={`?page=${currentPage}`}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {hasNextPage && (
          <PaginationItem>
            <PaginationLink
              className="font-light text-main-text hover:bg-complement-light-gray"
              href={`?page=${currentPage + 1}`}
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {showNextDots && (
          <PaginationItem>
            <PaginationEllipsis className="stroke-main-text" />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={hasNextPage ? `?page=${currentPage + 1}` : "#"}
            aria-disabled={!hasNextPage}
            className={cn(
              "font-light",
              !hasNextPage
                ? "pointer-events-none text-sub-text"
                : "text-main-text"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GeneralPagination;
