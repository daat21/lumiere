import { getCurrentUser } from '@/lib/server/user/getCurrentUser'

export default async function Test() {
  const user = await getCurrentUser()
  return <div>{JSON.stringify(user)}</div>
}
