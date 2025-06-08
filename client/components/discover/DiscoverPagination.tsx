'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DiscoverPaginationProps {
  currentPage?: number
  totalPages?: number
}

export function DiscoverPagination({
  currentPage = 1,
  totalPages = 10,
}: DiscoverPaginationProps) {
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `?${params.toString()}`
  }

  const renderPageNumbers = () => {
    const pageNumbers = []

    if (isMobile) {
      if (currentPage > 1) {
        pageNumbers.push(currentPage - 1)
      }

      pageNumbers.push(currentPage)

      if (currentPage < totalPages) {
        pageNumbers.push(currentPage + 1)
      }
    } else {
      let startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + 4)

      if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  const pageNumbers = renderPageNumbers()
  const showStartEllipsis = isMobile
    ? currentPage > 2
    : pageNumbers.length > 0 && pageNumbers[0] > 1
  const showEndEllipsis = isMobile
    ? currentPage < totalPages - 1 && totalPages > 3
    : pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-4 sm:px-6 lg:px-8">
      <Pagination className="mt-4 sm:mt-6 md:mt-8">
        <PaginationContent className="flex-wrap gap-1 sm:gap-2">
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious 
                href={createPageUrl(currentPage - 1)}
                className="h-8 w-8 sm:h-9 sm:w-9"
                aria-label="Previous page"
              />
            </PaginationItem>
          )}

          {showStartEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink 
                  href={createPageUrl(1)}
                  className="h-8 w-8 sm:h-9 sm:w-9 text-sm sm:text-base"
                  aria-label="Go to first page"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis className="h-8 w-8 sm:h-9 sm:w-9" />
              </PaginationItem>
            </>
          )}

          {pageNumbers.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageUrl(page)}
                isActive={page === currentPage}
                className="h-8 w-8 sm:h-9 sm:w-9 text-sm sm:text-base"
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEndEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis className="h-8 w-8 sm:h-9 sm:w-9" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  href={createPageUrl(totalPages)}
                  className="h-8 w-8 sm:h-9 sm:w-9 text-sm sm:text-base"
                  aria-label="Go to last page"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext 
                href={createPageUrl(currentPage + 1)}
                className="h-8 w-8 sm:h-9 sm:w-9"
                aria-label="Next page"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
