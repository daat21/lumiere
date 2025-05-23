import { ProfileContainerV2 } from '@/components/profile/ProfileContainer'
import ActivityContainer from '@/components/profile/ActivityContainer'

export default async function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <ProfileContainerV2 />
      <ActivityContainer />
    </div>
  )
}
