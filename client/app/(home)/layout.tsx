import { NavigationBar } from '@/components/home/NavigationBar'
import { Footer } from '@/components/home/Footer'
import ScrollUp from '@/components/home/ScrollUp'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationBar />
      <ScrollUp />
      <main className="container mx-auto min-h-[calc(100vh-190px)] px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
