import { ProfileContainerV2 } from '@/components/profile/ProfileContainer'
import ActivityContainer from '@/components/profile/ActivityContainer'

interface ProfilePageProps {
  searchParams?: Promise<{ sort_by?: string }>
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <ProfileContainerV2 />
      <ActivityContainer searchParams={searchParams} />
    </div>
  )
}
