export function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">No results found</h2>
      <p className="text-muted-foreground">Try adjusting your keyword.</p>
    </div>
  )
}
