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
      let startPage = Math.max(1, currentPage - 3)
      let endPage = Math.min(totalPages, startPage + 5)

      if (endPage - startPage < 5 && startPage > 1) {
        startPage = Math.max(1, endPage - 5)
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
    <Pagination className="mt-10">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pageNumbers.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageUrl(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={createPageUrl(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
