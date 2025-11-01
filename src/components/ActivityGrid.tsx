import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export interface ActivityCardData {
  title: string
  description: string
  icon: React.ReactElement
  color: string
  onClick: () => void
  disabled?: boolean
}

interface ActivityGridProps {
  activities: ActivityCardData[]
  subtitle?: string
}

export function ActivityGrid({ activities, subtitle }: ActivityGridProps) {
  return (
    <>
      {subtitle && (
        <div className="mb-8 text-center">
          <p className="text-2xl text-muted-foreground">
            {subtitle}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: activity.disabled ? 1 : 1.03, y: activity.disabled ? 0 : -4 }}
            whileTap={{ scale: activity.disabled ? 1 : 0.98 }}
          >
            <Card
              className={`h-56 flex flex-col items-center justify-center gap-4 p-6 transition-shadow hover:shadow-2xl ${
                activity.disabled ? 'opacity-60' : 'cursor-pointer'
              }`}
              style={{ backgroundColor: activity.color }}
              onClick={activity.disabled ? undefined : activity.onClick}
            >
              <div className="text-white">
                {activity.icon}
              </div>
              <h3 className="text-2xl font-bold text-white text-center">
                {activity.title}
              </h3>
              <p className="text-white/90 text-center text-lg">
                {activity.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  )
}
