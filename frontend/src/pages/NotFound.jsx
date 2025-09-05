import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <img
        alt="Страница не найдена"
        className="img-fluid h-25"
        src="https://frontend-chat-ru.hexlet.app/assets/404-D_FLHmTM.svg"
      />
      <h1 className="h4 text-muted">{t('notFound.pageNotFound')}</h1>
      <p className="text-muted">
        {t('notFound.youCan')} <Link to="/">{t('notFound.onMainPage')}</Link>
      </p>
    </div>
  )
}
