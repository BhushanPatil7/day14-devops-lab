import { config } from '../config'

export function EnvBadge() {
  if (config.envLabel === 'PROD') return null
  return (
    <span className="badge" title={`mode: ${config.mode}`}>
      {config.envLabel} · v{config.appVersion}
    </span>
  )
}
