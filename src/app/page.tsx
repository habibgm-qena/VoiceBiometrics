import styles from '@/styles/home.module.css'
import VoiceBiometricVerification from '@/components/homepage/homepage'
import VoiceBiometricAuthentication from '@/components/auth/auth'

export default function Home() {
  return (
    <div>
      {/* <VoiceBiometricVerification/> */}
      <VoiceBiometricAuthentication/>
    </div>
  )
}
