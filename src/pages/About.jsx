import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AboutScrapbook from '../components/about/AboutScrapbook'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="pb-6">
      <div className="flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label="Back" className="p-2 -ml-2 rounded-full glass">
          <ArrowLeft size={18} className="text-br-ink dark:text-white" />
        </button>
        <h1 className="font-display text-2xl font-extrabold text-br-ink dark:text-white">About</h1>
      </div>
      <div className="px-3">
        <AboutScrapbook />
      </div>
    </div>
  )
}
