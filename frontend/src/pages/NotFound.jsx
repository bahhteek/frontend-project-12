import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const {t} = useTranslation();
  return (
    <div>
      <h1>{t("notFound.pageNotFound")}</h1>
      <p>
        <Link to="/">{t("notFound.onMainPage")}</Link>
      </p>
    </div>
  );
}